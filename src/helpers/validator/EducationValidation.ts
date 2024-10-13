import Joi from 'joi';

export const educationSchema = Joi.object({
  degree: Joi.string().required(),
  institution: Joi.string().required(),
  fieldOfStudy: Joi.string().required(),
  school: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  description: Joi.string().optional(),
});