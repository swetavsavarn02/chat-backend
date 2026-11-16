import { Router } from 'express';
import chatController from '../controllers/chatController';
import { validate } from '../middleware/validate';
import {
    createChatSchema,
    sendMessageSchema,
    markReadSchema,
    lastSeenSchema,
    getMessagesSchema,
    chatIdParamSchema,
    messageIdParamSchema
} from '../validators/chatValidators';

const router = Router();

// Create or get existing chat
router.post(
    '/create',
    validate(createChatSchema, 'body'),
    (req, res) => chatController.createOrGetChat(req, res)
);

// Send message in a chat
router.post(
    '/:chatId/message/send',
    validate(chatIdParamSchema, 'params'),
    validate(sendMessageSchema, 'body'),
    (req, res) => chatController.sendMessage(req, res)
);

// Get messages from chat
router.get(
    '/:chatId/messages',
    validate(chatIdParamSchema, 'params'),
    validate(getMessagesSchema, 'query'),
    (req, res) => chatController.getMessages(req, res)
);

// Mark message as read
router.post(
    '/:chatId/message/:messageId/read',
    validate(messageIdParamSchema, 'params'),
    validate(markReadSchema, 'body'),
    (req, res) => chatController.markMessageRead(req, res)
);

// Update last seen message
router.post(
    '/:chatId/lastseen',
    validate(chatIdParamSchema, 'params'),
    validate(lastSeenSchema, 'body'),
    (req, res) => chatController.updateLastSeen(req, res)
);

export default router;
