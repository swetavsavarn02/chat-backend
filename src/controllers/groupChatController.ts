import { Request, Response } from 'express';
import groupChatService from '../services/groupChatService';
import messageService from '../services/messageService';

class GroupChatController {

  // POST /group/create
  async createGroup(req: Request, res: Response): Promise<void> {
    try {
      const { name, createdBy, members } = req.body;

      const group = await groupChatService.createGroup(name, createdBy, members);
      res.status(201).json({
        success: true,
        data: {
          groupId: group.id,
          name: group.name,
          members: group.members,
          createdBy: group.createdBy
        }
      });
    } catch (err) {
      console.error('Error creating group:', err);
      res.status(500).json({ success: false, error: 'Failed to create group' });
    }
  }

  // GET /group/:groupId
  async getGroup(req: Request, res: Response): Promise<void> {
    try {
      const { groupId } = req.params;

      const group = await groupChatService.getGroupById(groupId);
      if (!group) {
        res.status(404).json({ success: false, error: 'Group not found' });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          groupId: group.id,
          name: group.name,
          members: group.members,
          createdBy: group.createdBy,
          createdAt: group.createdAt
        }
      });
    } catch (err) {
      console.error('Error fetching group:', err);
      res.status(500).json({ success: false, error: 'Failed to get group' });
    }
  }

  // POST /group/:groupId/member/add
  async addMember(req: Request, res: Response): Promise<void> {
    try {
      const { groupId } = req.params;
      const { userId, memberId } = req.body;

      // Check if requester is in the group
      const isMember = await groupChatService.isUserInGroup(groupId, userId);
      if (!isMember) {
        res.status(403).json({ success: false, error: 'You are not a member of this group' });
        return;
      }

      const group = await groupChatService.addMember(groupId, memberId);
      if (!group) {
        res.status(404).json({ success: false, error: 'Group not found' });
        return;
      }

      res.status(200).json({
        success: true,
        data: { members: group.members }
      });
    } catch (err) {
      console.error('Error adding member:', err);
      res.status(500).json({ success: false, error: 'Failed to add member' });
    }
  }

  // POST /group/:groupId/member/remove
  async removeMember(req: Request, res: Response): Promise<void> {
    try {
      const { groupId } = req.params;
      const { userId, memberId } = req.body;

      const group = await groupChatService.getGroupById(groupId);
      if (!group) {
        res.status(404).json({ success: false, error: 'Group not found' });
        return;
      }

      // Only creator can remove members
      if (group.createdBy !== userId) {
        res.status(403).json({ success: false, error: 'Only group creator can remove members' });
        return;
      }

      const updatedGroup = await groupChatService.removeMember(groupId, memberId);
      res.status(200).json({
        success: true,
        data: { members: updatedGroup?.members }
      });
    } catch (err: any) {
      console.error('Error removing member:', err);
      if (err.message === 'Cannot remove group creator') {
        res.status(400).json({ success: false, error: err.message });
        return;
      }
      res.status(500).json({ success: false, error: 'Failed to remove member' });
    }
  }

  // POST /group/:groupId/message/send
  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { groupId } = req.params;
      const { senderId, text } = req.body;

      // Verify sender is in group
      const isMember = await groupChatService.isUserInGroup(groupId, senderId);
      if (!isMember) {
        res.status(403).json({ success: false, error: 'User is not a member of this group' });
        return;
      }

      const message = await messageService.sendMessage(groupId, senderId, text);
      res.status(201).json({ success: true, data: message });
    } catch (err) {
      console.error('Error sending message:', err);
      res.status(500).json({ success: false, error: 'Failed to send message' });
    }
  }

  // GET /group/:groupId/messages
  async getMessages(req: Request, res: Response): Promise<void> {
    try {
      const { groupId } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;

      const group = await groupChatService.getGroupById(groupId);
      if (!group) {
        res.status(404).json({ success: false, error: 'Group not found' });
        return;
      }

      const messages = await messageService.getMessages(groupId, limit);
      res.status(200).json({ success: true, data: messages });
    } catch (err) {
      console.error('Error fetching messages:', err);
      res.status(500).json({ success: false, error: 'Failed to get messages' });
    }
  }

  // GET /user/:userId/groups
  async getUserGroups(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      const groups = await groupChatService.getUserGroups(userId);

      const formattedGroups = groups.map(group => ({
        groupId: group.id,
        name: group.name,
        members: group.members,
        createdBy: group.createdBy,
        createdAt: group.createdAt
      }));

      res.status(200).json({ success: true, data: formattedGroups });
    } catch (err) {
      console.error('Error fetching user groups:', err);
      res.status(500).json({ success: false, error: 'Failed to get user groups' });
    }
  }
}

export default new GroupChatController();
