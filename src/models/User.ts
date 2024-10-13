import mongoose, { Schema, Document } from 'mongoose';
import Address, { IAddress } from './Address';
import Company, { ICompany } from './Company';
import AppliedJob, { IAppliedJob } from './AppliedJob';
import Education, { IEducation } from './Education';
import Experience, { IExperience } from './Experience';
import Skill, { ISkill } from './Skill';

export interface IUser extends Document {
  profileImage?: string;
  name: string;
  email: string;
  occupation: string;
  phone?: string;
  address?: IAddress[];
  company?: ICompany[];
  password: string;
  role: string;
  appliedJobs?: IAppliedJob[];
  education?: IEducation[];
  experience?: IExperience[];
  skills?: ISkill[];
}

const UserSchema: Schema = new Schema({
  profileImage: { type: String, default: '' },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  occupation: { type: String, required: true },
  phone: { type: String, default: '' },
  address: [{ type: Schema.Types.ObjectId, ref: 'Address', default: [] }],
  company: [{ type: Schema.Types.ObjectId, ref: 'Company', default: [] }],
  password: { type: String, required: true },
  role: { type: String, required: true },
  appliedJobs: [{ type: Schema.Types.ObjectId, ref: 'AppliedJob', default: [] }],
  education: [{ type: Schema.Types.ObjectId, ref: 'Education', default: [] }],
  experience: [{ type: Schema.Types.ObjectId, ref: 'Experience', default: [] }],
  skills: [{ type: Schema.Types.ObjectId, ref: 'Skill', default: [] }],
});

// Middleware to auto-populate sub-models
UserSchema.pre(/^find/, function (next) {
  const doc = this as mongoose.Query<any, any>;
  doc.populate('address')
    .populate('company')
    .populate('appliedJobs')
    .populate('education')
    .populate('experience')
    .populate('skills');
  next();
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;