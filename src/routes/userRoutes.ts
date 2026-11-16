import { Router } from 'express';
import userController from '../controllers/userController';
import groupChatController from '../controllers/groupChatController';
import { validate } from '../middleware/validate';
import { userIdParamSchema } from '../validators/chatValidators';

const router = Router();

// Get all chats for a user
router.get(
  '/:userId/chats',
  validate(userIdParamSchema, 'params'),
  (req, res) => userController.getUserChats(req, res)
);

// Get all groups for a user
router.get(
  '/:userId/groups',
  validate(userIdParamSchema, 'params'),
  (req, res) => groupChatController.getUserGroups(req, res)
);

export default router;
