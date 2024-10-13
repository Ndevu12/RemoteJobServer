import Joi from 'joi';

export const skillSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  proficiency: Joi.string().valid('Beginner', 'Intermediate', 'Advanced').required(),
});