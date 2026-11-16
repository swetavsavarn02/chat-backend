import { Router } from 'express';
import groupChatController from '../controllers/groupChatController';
import { validate } from '../middleware/validate';
import {
  createGroupSchema,
  addMemberSchema,
  removeMemberSchema,
  groupIdParamSchema,
  sendMessageSchema,
  getMessagesSchema
} from '../validators/chatValidators';

const router = Router();

// Create a new group
router.post(
  '/create',
  validate(createGroupSchema, 'body'),
  (req, res) => groupChatController.createGroup(req, res)
);

// Get group details
router.get(
  '/:groupId',
  validate(groupIdParamSchema, 'params'),
  (req, res) => groupChatController.getGroup(req, res)
);

// Add member to group
router.post(
  '/:groupId/member/add',
  validate(groupIdParamSchema, 'params'),
  validate(addMemberSchema, 'body'),
  (req, res) => groupChatController.addMember(req, res)
);

// Remove member from group
router.post(
  '/:groupId/member/remove',
  validate(groupIdParamSchema, 'params'),
  validate(removeMemberSchema, 'body'),
  (req, res) => groupChatController.removeMember(req, res)
);

// Send message in group
router.post(
  '/:groupId/message/send',
  validate(groupIdParamSchema, 'params'),
  validate(sendMessageSchema, 'body'),
  (req, res) => groupChatController.sendMessage(req, res)
);

// Get group messages
router.get(
  '/:groupId/messages',
  validate(groupIdParamSchema, 'params'),
  validate(getMessagesSchema, 'query'),
  (req, res) => groupChatController.getMessages(req, res)
);

export default router;
