import { Request, Response } from 'express';
import chatService from '../services/chatService';

class UserController {
  
  // GET /user/:userId/chats
  async getUserChats(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const chats = await chatService.getUserChats(userId);

      const formattedChats = chats.map((chat) => ({
        chatId: chat.id,
        members: [chat.userAId, chat.userBId],
        createdAt: chat.createdAt
      }));

      res.status(200).json({ success: true, data: formattedChats });
    } catch (err) {
      console.error('Error fetching user chats:', err);
      res.status(500).json({ success: false, error: 'Failed to get user chats' });
    }
  }
}

export default new UserController();
