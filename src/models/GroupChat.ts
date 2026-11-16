import { DataTypes, Model, Op } from 'sequelize';
import sequelize from '../config/db';

interface GroupChatAttributes {
  id: string;
  name: string;
  createdBy: string;
  members: string[]; // array of user IDs
}

class GroupChat extends Model<GroupChatAttributes> implements GroupChatAttributes {
  public id!: string;
  public name!: string;
  public createdBy!: string;
  public members!: string[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Check if user is member of group
  static async isUserMember(groupId: string, userId: string): Promise<boolean> {
    const group = await GroupChat.findByPk(groupId);
    if (!group) return false;
    return group.members.includes(userId);
  }
}

GroupChat.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'created_by',
    },
    members: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: false,
      defaultValue: [],
    },
  },
  {
    sequelize,
    tableName: 'group_chats',
    timestamps: true,
    underscored: true,
  }
);

export default GroupChat;
