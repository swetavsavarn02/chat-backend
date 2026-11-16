import { db } from '../config/firebase';
import { Message, LastSeen } from '../types';
import { v4 as uuidv4 } from 'uuid';

class MessageService {
  private messagesCol = 'messages';
  private lastSeenCol = 'lastSeen';

  async sendMessage(chatId: string, senderId: string, text: string): Promise<Message> {
    const messageId = uuidv4();
    const timestamp = new Date();

    const message: Message = {
      id: messageId,
      chatId,
      senderId,
      text,
      timestamp,
      readBy: [senderId] // sender has read their own message
    };

    await db
      .collection(this.messagesCol)
      .doc(chatId)
      .collection('items')
      .doc(messageId)
      .set({
        ...message,
        timestamp
      });

    return message;
  }

  async getMessages(chatId: string, limit: number = 50): Promise<Message[]> {
    const snapshot = await db
      .collection(this.messagesCol)
      .doc(chatId)
      .collection('items')
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    const messages: Message[] = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();
      messages.push({
        id: data.id,
        chatId: data.chatId,
        senderId: data.senderId,
        text: data.text,
        timestamp: data.timestamp.toDate(),
        readBy: data.readBy || []
      });
    }

    // Return oldest first
    return messages.reverse();
  }

  async markMessageRead(chatId: string, messageId: string, userId: string): Promise<void> {
    const messageRef = db
      .collection(this.messagesCol)
      .doc(chatId)
      .collection('items')
      .doc(messageId);

    const doc = await messageRef.get();
    if (!doc.exists) {
      throw new Error('Message not found');
    }

    const data = doc.data();
    const readBy: string[] = data?.readBy || [];

    if (!readBy.includes(userId)) {
      readBy.push(userId);
      await messageRef.update({ readBy });
    }
  }

  async updateLastSeen(chatId: string, userId: string, messageId: string): Promise<void> {
    const docId = `${chatId}_${userId}`;

    const lastSeen: LastSeen = {
      userId,
      chatId,
      messageId,
      updatedAt: new Date()
    };

    await db.collection(this.lastSeenCol).doc(docId).set(lastSeen);
  }

  async getLastSeen(chatId: string, userId: string): Promise<LastSeen | null> {
    const docId = `${chatId}_${userId}`;
    const doc = await db.collection(this.lastSeenCol).doc(docId).get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data();
    return {
      userId: data?.userId,
      chatId: data?.chatId,
      messageId: data?.messageId,
      updatedAt: data?.updatedAt.toDate()
    };
  }

  async getMessageById(chatId: string, messageId: string): Promise<Message | null> {
    const doc = await db
      .collection(this.messagesCol)
      .doc(chatId)
      .collection('items')
      .doc(messageId)
      .get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data();
    return {
      id: data?.id,
      chatId: data?.chatId,
      senderId: data?.senderId,
      text: data?.text,
      timestamp: data?.timestamp.toDate(),
      readBy: data?.readBy || []
    };
  }
}

export default new MessageService();
