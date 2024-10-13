import Joi from 'joi';

export const addressSchema = Joi.object({
  street: Joi.string().min(1).max(255).optional(),
  city: Joi.string().min(1).max(255).optional(),
  state: Joi.string().min(1).max(255).optional(),
  zipCode: Joi.string().min(1).max(20).optional(),
  country: Joi.string().min(1).max(255).optional(),
});
