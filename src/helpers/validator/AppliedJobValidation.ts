import Joi from 'joi';

export const appliedJobSchema = Joi.object({
  jobId: Joi.string().required(),
  position: Joi.string().required(),
  company: Joi.string().required(),
  appliedAt: Joi.date().required(),
});
