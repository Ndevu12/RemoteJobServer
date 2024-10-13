import mongoose, { Schema, Document } from 'mongoose';

export interface IEducation extends Document {
  degree: string;
  institution: string;
  startDate: Date;
  endDate: Date;
  userId: string;
  description?: string;
}

const EducationSchema: Schema = new Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  userId: { type: String, required: true },
  description: { type: String, default: '' },
});

const Education = mongoose.model<IEducation>('Education', EducationSchema);

export default Education;