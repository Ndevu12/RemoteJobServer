import mongoose, { Schema, Document } from 'mongoose';

export interface IAppliedJob extends Document {
  jobId: string;
  position: string;
  company: string;
  userId: string;
  appliedAt: Date;
}

const AppliedJobSchema: Schema = new Schema({
  jobId: { type: String, default: '' },
  position: { type: String, default: '' },
  company: { type: String, default: '' },
  userId: { type: String, required: true },
  appliedAt: { type: Date, default: null },
});

const AppliedJob = mongoose.model<IAppliedJob>('AppliedJob', AppliedJobSchema);

export default AppliedJob;