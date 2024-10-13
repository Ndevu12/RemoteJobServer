import Joi from 'joi';

export const experienceSchema = Joi.object({
  jobTitle: Joi.string().required(),
  company: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  userId: Joi.string().required(),
  description: Joi.string().optional(),
});
