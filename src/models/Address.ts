import mongoose, { Schema, Document } from 'mongoose';

export interface IAddress extends Document {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const AddressSchema: Schema = new Schema({
  street: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  zip: { type: String, default: '' },
  country: { type: String, default: '' },
});

const Address = mongoose.model<IAddress>('Address', AddressSchema);

export default Address;