import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  userId: string;
  description?: string;
  proficiency: string; // e.g., Beginner, Intermediate, Advanced
}

const SkillSchema: Schema = new Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true },
  description: { type: String, default: '' }, // e.g., Knowledge of React, Proficient in Node.js, etc.
  proficiency: { type: String, required: true }, // e.g., Beginner, Intermediate, Advanced
});

const Skill = mongoose.model<ISkill>('Skill', SkillSchema);

export default Skill;