import { Request, Response } from 'express';
import chatService from '../services/chatService';
import messageService from '../services/messageService';

class ChatController {

  // POST /chat/create
  async createOrGetChat(req: Request, res: Response): Promise<void> {
    try {
      const { userAId, userBId } = req.body;

      const chat = await chatService.createOrGetChat(userAId, userBId);
      res.status(200).json({
        success: true,
        data: { chatId: chat.id }
      });
    } catch (err) {
      console.error('Error creating chat:', err);
      res.status(500).json({ success: false, error: 'Failed to create chat' });
    }
  }

  // POST /chat/:chatId/message/send
  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { chatId } = req.params;
      const { senderId, text } = req.body;

      // Verify chat exists
      const chat = await chatService.getChatById(chatId);
      if (!chat) {
        res.status(404).json({ success: false, error: 'Chat not found' });
        return;
      }

      // Verify sender is part of chat
      const isParticipant = await chatService.isUserInChat(chatId, senderId);
      if (!isParticipant) {
        res.status(403).json({ success: false, error: 'User is not part of this chat' });
        return;
      }

      const message = await messageService.sendMessage(chatId, senderId, text);
      res.status(201).json({ success: true, data: message });
    } catch (err) {
      console.error('Error sending message:', err);
      res.status(500).json({ success: false, error: 'Failed to send message' });
    }
  }

  // GET /chat/:chatId/messages
  async getMessages(req: Request, res: Response): Promise<void> {
    try {
      const { chatId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;

      const chat = await chatService.getChatById(chatId);
      if (!chat) {
        res.status(404).json({ success: false, error: 'Chat not found' });
        return;
      }

      const messages = await messageService.getMessages(chatId, limit);
      res.status(200).json({ success: true, data: messages });
    } catch (err) {
      console.error('Error fetching messages:', err);
      res.status(500).json({ success: false, error: 'Failed to get messages' });
    }
  }

  // POST /chat/:chatId/message/:messageId/read
  async markMessageRead(req: Request, res: Response): Promise<void> {
    try {
      const { chatId, messageId } = req.params;
      const { userId } = req.body;

      // Verify user is part of chat
      const isParticipant = await chatService.isUserInChat(chatId, userId);
      if (!isParticipant) {
        res.status(403).json({ success: false, error: 'User is not part of this chat' });
        return;
      }

      await messageService.markMessageRead(chatId, messageId, userId);
      res.status(200).json({ success: true, data: { marked: true } });
    } catch (err: any) {
      console.error('Error marking message read:', err);
      if (err.message === 'Message not found') {
        res.status(404).json({ success: false, error: 'Message not found' });
        return;
      }
      res.status(500).json({ success: false, error: 'Failed to mark message as read' });
    }
  }

  // POST /chat/:chatId/lastseen
  async updateLastSeen(req: Request, res: Response): Promise<void> {
    try {
      const { chatId } = req.params;
      const { userId, messageId } = req.body;

      // Verify user is part of chat
      const isParticipant = await chatService.isUserInChat(chatId, userId);
      if (!isParticipant) {
        res.status(403).json({ success: false, error: 'User is not part of this chat' });
        return;
      }

      // Verify message exists
      const message = await messageService.getMessageById(chatId, messageId);
      if (!message) {
        res.status(404).json({ success: false, error: 'Message not found' });
        return;
      }

      await messageService.updateLastSeen(chatId, userId, messageId);
      res.status(200).json({ success: true, data: { updated: true } });
    } catch (err) {
      console.error('Error updating last seen:', err);
      res.status(500).json({ success: false, error: 'Failed to update last seen' });
    }
  }

  // PUT /chat/:chatId/message/:messageId/edit
  async editMessage(req: Request, res: Response): Promise<void> {
    try {
      const { chatId, messageId } = req.params;
      const { userId, text } = req.body;

      // Verify user is part of chat
      const isParticipant = await chatService.isUserInChat(chatId, userId);
      if (!isParticipant) {
        res.status(403).json({ success: false, error: 'User is not part of this chat' });
        return;
      }

      const message = await messageService.editMessage(chatId, messageId, userId, text);
      res.status(200).json({ success: true, data: message });
    } catch (err: any) {
      console.error('Error editing message:', err);
      if (err.message === 'Message not found') {
        res.status(404).json({ success: false, error: 'Message not found' });
        return;
      }
      if (err.message === 'Not authorized to edit this message') {
        res.status(403).json({ success: false, error: err.message });
        return;
      }
      res.status(500).json({ success: false, error: 'Failed to edit message' });
    }
  }

  // DELETE /chat/:chatId/message/:messageId
  async deleteMessage(req: Request, res: Response): Promise<void> {
    try {
      const { chatId, messageId } = req.params;
      const { userId } = req.body;

      // Verify user is part of chat
      const isParticipant = await chatService.isUserInChat(chatId, userId);
      if (!isParticipant) {
        res.status(403).json({ success: false, error: 'User is not part of this chat' });
        return;
      }

      await messageService.deleteMessage(chatId, messageId, userId);
      res.status(200).json({ success: true, data: { deleted: true } });
    } catch (err: any) {
      console.error('Error deleting message:', err);
      if (err.message === 'Message not found') {
        res.status(404).json({ success: false, error: 'Message not found' });
        return;
      }
      if (err.message === 'Not authorized to delete this message') {
        res.status(403).json({ success: false, error: err.message });
        return;
      }
      res.status(500).json({ success: false, error: 'Failed to delete message' });
    }
  }
}

export default new ChatController();
