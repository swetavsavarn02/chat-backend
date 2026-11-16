import { DataTypes, Model, Op } from 'sequelize';
import sequelize from '../config/db';

interface ChatAttributes {
  id: string;
  userAId: string;
  userBId: string;
}

class Chat extends Model<ChatAttributes> implements ChatAttributes {
  public id!: string;
  public userAId!: string;
  public userBId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Find existing chat between two users
  static async findBetweenUsers(userAId: string, userBId: string): Promise<Chat | null> {
    return Chat.findOne({
      where: {
        [Op.or]: [
          { userAId: userAId, userBId: userBId },
          { userAId: userBId, userBId: userAId }
        ]
      }
    });
  }

  // Check if user is participant in chat
  static async isUserParticipant(chatId: string, userId: string): Promise<boolean> {
    const chat = await Chat.findOne({
      where: {
        id: chatId,
        [Op.or]: [
          { userAId: userId },
          { userBId: userId }
        ]
      }
    });
    return chat !== null;
  }
}

Chat.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userAId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_a_id',
    },
    userBId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'user_b_id',
    },
  },
  {
    sequelize,
    tableName: 'chats',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['user_a_id'] },
      { fields: ['user_b_id'] },
    ],
  }
);

export default Chat;
