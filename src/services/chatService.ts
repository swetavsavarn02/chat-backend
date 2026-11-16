import { Op } from 'sequelize';
import { Chat } from '../models';

class ChatService {

  async createOrGetChat(userAId: string, userBId: string): Promise<Chat> {
    // Check if chat already exists
    const existingChat = await Chat.findBetweenUsers(userAId, userBId);

    if (existingChat) {
      return existingChat;
    }

    // Create new chat
    const chat = await Chat.create({
      userAId,
      userBId
    } as any);

    return chat;
  }

  async getChatById(chatId: string): Promise<Chat | null> {
    return Chat.findByPk(chatId);
  }

  async getUserChats(userId: string): Promise<Chat[]> {
    return Chat.findAll({
      where: {
        [Op.or]: [
          { userAId: userId },
          { userBId: userId }
        ]
      },
      order: [['createdAt', 'DESC']]
    });
  }

  async isUserInChat(chatId: string, userId: string): Promise<boolean> {
    return Chat.isUserParticipant(chatId, userId);
  }
}

export default new ChatService();
