import mongoose, { Schema, Document } from 'mongoose';

export interface IExperience extends Document {
  jobTitle: string;
  company: string;
  startDate: Date;
  endDate: Date;
  userId: string;
  description?: string;
}

const ExperienceSchema: Schema = new Schema({
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  userId: { type: String, required: true },
  description: { type: String, default: '' },
});

const Experience = mongoose.model<IExperience>('Experience', ExperienceSchema);

export default Experience;