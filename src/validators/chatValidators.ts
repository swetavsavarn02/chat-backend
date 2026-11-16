import Joi from 'joi';

export const createChatSchema = Joi.object({
  userAId: Joi.string().uuid().required().messages({
    'string.guid': 'userAId must be a valid UUID',
    'any.required': 'userAId is required'
  }),
  userBId: Joi.string().uuid().required().messages({
    'string.guid': 'userBId must be a valid UUID',
    'any.required': 'userBId is required'
  })
}).custom((value, helpers) => {
  if (value.userAId === value.userBId) {
    return helpers.error('any.invalid');
  }
  return value;
}).messages({
  'any.invalid': 'Cannot create chat with yourself'
});

export const sendMessageSchema = Joi.object({
  senderId: Joi.string().uuid().required().messages({
    'string.guid': 'senderId must be a valid UUID',
    'any.required': 'senderId is required'
  }),
  text: Joi.string().min(1).max(5000).required().messages({
    'string.min': 'Message cannot be empty',
    'string.max': 'Message too long (max 5000 chars)',
    'any.required': 'text is required'
  })
});

export const markReadSchema = Joi.object({
  userId: Joi.string().uuid().required().messages({
    'string.guid': 'userId must be a valid UUID',
    'any.required': 'userId is required'
  })
});

export const lastSeenSchema = Joi.object({
  userId: Joi.string().uuid().required().messages({
    'string.guid': 'userId must be a valid UUID',
    'any.required': 'userId is required'
  }),
  messageId: Joi.string().uuid().required().messages({
    'string.guid': 'messageId must be a valid UUID',
    'any.required': 'messageId is required'
  })
});

export const getMessagesSchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(50)
});

export const chatIdParamSchema = Joi.object({
  chatId: Joi.string().uuid().required()
});

export const messageIdParamSchema = Joi.object({
  chatId: Joi.string().uuid().required(),
  messageId: Joi.string().uuid().required()
});

export const userIdParamSchema = Joi.object({
  userId: Joi.string().uuid().required()
});
