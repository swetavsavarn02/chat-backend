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
    messageIdParamSchema,
    editMessageSchema,
    deleteMessageSchema
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

// Edit message
router.put(
    '/:chatId/message/:messageId/edit',
    validate(messageIdParamSchema, 'params'),
    validate(editMessageSchema, 'body'),
    (req, res) => chatController.editMessage(req, res)
);

// Delete message
router.delete(
    '/:chatId/message/:messageId',
    validate(messageIdParamSchema, 'params'),
    validate(deleteMessageSchema, 'body'),
    (req, res) => chatController.deleteMessage(req, res)
);

export default router;
