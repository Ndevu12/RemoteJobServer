import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  website: string;
  logo: string;
  userId: string;
  logoBackground: string;
}

const CompanySchema: Schema = new Schema({
  name: { type: String, default: '' },
  website: { type: String, default: '' },
  logo: { type: String, default: '' },
  userId: { type: String, required: true },
  logoBackground: { type: String, default: '' },
});

const Company = mongoose.model<ICompany>('Company', CompanySchema);

export default Company;