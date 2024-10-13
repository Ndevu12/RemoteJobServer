import Joi from 'joi';

export const companySchema = Joi.object({
  name: Joi.string().required(),
  website: Joi.string().uri().required(),
  logo: Joi.string().uri().optional(),
  logoBackground: Joi.string().optional(),
});