import mongoose, { Schema, Document } from 'mongoose';

interface ICompany {
  name: string;
  website: string;
  logo: string;
  logoBackground: string;
}

interface IRequirement {
  content: string;
  items: string[];
}

interface IAppliedJob {
  userId: string;
  appliedAt: Date;
  status: string;
}

interface IJob extends Document {
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
}

const CompanySchema: Schema = new Schema({
  name: { type: String, required: true },
  website: { type: String, required: true },
  logo: { type: String, required: true },
  logoBackground: { type: String, required: true },
});

const RequirementSchema: Schema = new Schema({
  content: { type: String, required: true },
  items: { type: [String], required: true },
});

const AppliedJobSchema: Schema = new Schema({
  userId: { type: String, required: true },
  appliedAt: { type: Date, required: true },
  status: { type: String, required: true },
});

const JobSchema: Schema = new Schema({
  company: { type: CompanySchema, required: true },
  postedAt: { type: Date, required: true },
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
  appliedJobs: { type: [AppliedJobSchema], required: true },
});

const Job = mongoose.model<IJob>('Job', JobSchema);

export default Job;