import Joi from 'joi';

// Define the Joi schema for job validation
export const jobSchema = Joi.object({
  company: Joi.object({
    name: Joi.string().required(),
    website: Joi.string().uri().required(),
    logo: Joi.string().uri().required(),
    logoBackground: Joi.string().optional(),
  }).required(),
  contract: Joi.string().required(),
  position: Joi.string().required(),
  location: Joi.string().required(),
  description: Joi.string().required(),
  requirements: Joi.object({
    content: Joi.string().required(),
    items: Joi.array().items(Joi.string()).required(),
  }).required(),
  qualifications: Joi.object({
    content: Joi.string().required(),
    items: Joi.array().items(Joi.string()).required(),
  }).required(),
  responsibilities: Joi.object({
    content: Joi.string().required(),
    items: Joi.array().items(Joi.string()).required(),
  }).required(),
  skills: Joi.object({
    content: Joi.string().required(),
    items: Joi.array().items(Joi.string()).required(),
  }).required(),
  benefits: Joi.object({
    content: Joi.string().required(),
    items: Joi.array().items(Joi.string()).required(),
  }).required(),
  role: Joi.object({
    content: Joi.string().required(),
    items: Joi.array().items(Joi.string()).required(),
  }).required(),
  status: Joi.string().required(),
  appliedJobs: Joi.array().items(Joi.object({
    userId: Joi.string().required(),
    appliedAt: Joi.date().required(),
    status: Joi.string().required(),
  })).optional(),
});
