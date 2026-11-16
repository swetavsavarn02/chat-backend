import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

type ValidationSource = 'body' | 'query' | 'params';

export const validate = (schema: Joi.ObjectSchema, source: ValidationSource = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const dataToValidate = req[source];
    
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      res.status(400).json({
        success: false,
        error: errorMessages.length === 1 ? errorMessages[0] : errorMessages
      });
      return;
    }

    // Replace with validated and sanitized values
    req[source] = value;
    next();
  };
};
