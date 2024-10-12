import mongoose, { Schema, Document } from 'mongoose';

interface IAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface ICompany {
  name: string;
  website: string;
  logo: string;
  logoBackground: string;
}

interface IAppliedJob {
  jobId: string;
  position: string;
  company: string;
  appliedAt: Date;
}

interface IUser extends Document {
  profileImage?: string;
  name: string;
  email: string;
  occupation: string;
  phone?: string;
  address?: IAddress;
  company?: ICompany;
  password: string;
  role: string; // Add role to the user interface
  appliedJobs?: IAppliedJob[];
}

const AddressSchema: Schema = new Schema({
  street: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  zip: { type: String, default: '' },
  country: { type: String, default: '' },
});

const CompanySchema: Schema = new Schema({
  name: { type: String, default: '' },
  website: { type: String, default: '' },
  logo: { type: String, default: '' },
  logoBackground: { type: String, default: '' },
});

const AppliedJobSchema: Schema = new Schema({
  jobId: { type: String, default: '' },
  position: { type: String, default: '' },
  company: { type: String, default: '' },
  appliedAt: { type: Date, default: null },
});

const UserSchema: Schema = new Schema({
  profileImage: { type: String, default: '' },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  occupation: { type: String, required: true },
  phone: { type: String, default: '' },
  address: { type: AddressSchema, default: {} },
  company: { type: CompanySchema, default: {} },
  password: { type: String, required: true },
  role: { type: String, required: true }, 
  appliedJobs: { type: [AppliedJobSchema], default: [] },
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;