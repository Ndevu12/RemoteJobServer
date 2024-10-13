import mongoose, { Schema, Document } from 'mongoose';
import CompanySchema, { ICompany } from './Company';
import AppliedJobSchema, { IAppliedJob } from './AppliedJob';
import { IUser } from './User'; // Import the IUser interface
import { required } from 'joi';

interface IRequirement {
  content: string;
  items: string[];
}

const RequirementSchema: Schema = new Schema({
  content: { type: String, required: true },
  items: { type: [String], required: true },
});

export interface IJob extends Document {
  company: ICompany;
  postedAt: Date;
  contract: string;
  position: string;
  location: string;
  description: string;
  requirements: IRequirement;
  qualifications: IRequirement;
  responsibilities: IRequirement;
  skills: IRequirement;
  benefits: IRequirement;
  role: IRequirement;
  status: string;
  appliedJobs: IAppliedJob[];
  userId: IUser['_id']; // Add userId field
}

const JobSchema: Schema = new Schema({
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  postedAt: { type: Date, default: Date.now, required: true },
  contract: { type: String, required: true },
  position: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: RequirementSchema, required: true },
  qualifications: { type: RequirementSchema, required: true },
  responsibilities: { type: RequirementSchema, required: true },
  skills: { type: RequirementSchema, required: true },
  benefits: { type: RequirementSchema, required: true },
  role: { type: RequirementSchema, required: true },
  status: { type: String, required: true },
  appliedJobs: [{ type: Schema.Types.ObjectId, ref: 'AppliedJob', default: [] }],
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Add userId field
});

const Job = mongoose.model<IJob>('Job', JobSchema);

export default Job;
