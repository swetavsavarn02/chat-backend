import { GroupChat } from '../models';

class GroupChatService {

  async createGroup(name: string, createdBy: string, members: string[]): Promise<GroupChat> {
    // Make sure creator is in members list
    const allMembers = members.includes(createdBy) ? members : [createdBy, ...members];

    const group = await GroupChat.create({
      name,
      createdBy,
      members: allMembers
    } as any);

    return group;
  }

  async getGroupById(groupId: string): Promise<GroupChat | null> {
    return GroupChat.findByPk(groupId);
  }

  async getUserGroups(userId: string): Promise<GroupChat[]> {
    const groups = await GroupChat.findAll();
    // Filter groups where user is a member
    return groups.filter(group => group.members.includes(userId));
  }

  async isUserInGroup(groupId: string, userId: string): Promise<boolean> {
    return GroupChat.isUserMember(groupId, userId);
  }

  async addMember(groupId: string, memberId: string): Promise<GroupChat | null> {
    const group = await GroupChat.findByPk(groupId);
    if (!group) return null;

    if (!group.members.includes(memberId)) {
      const updatedMembers = [...group.members, memberId];
      await group.update({ members: updatedMembers });
    }

    return group;
  }

  async removeMember(groupId: string, memberId: string): Promise<GroupChat | null> {
    const group = await GroupChat.findByPk(groupId);
    if (!group) return null;

    // Can't remove the creator
    if (group.createdBy === memberId) {
      throw new Error('Cannot remove group creator');
    }

    const updatedMembers = group.members.filter(id => id !== memberId);
    await group.update({ members: updatedMembers });

    return group;
  }

  async updateGroupName(groupId: string, name: string): Promise<GroupChat | null> {
    const group = await GroupChat.findByPk(groupId);
    if (!group) return null;

    await group.update({ name });
    return group;
  }

  async deleteGroup(groupId: string): Promise<boolean> {
    const deleted = await GroupChat.destroy({ where: { id: groupId } });
    return deleted > 0;
  }
}

export default new GroupChatService();
