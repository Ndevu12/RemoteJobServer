import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const url = process.env.MONGO_URI;
    if (!url) {
      console.debug('No Mongo URI provided');
      throw new Error('Mongo URI is not provided');
    }
    const conn = await mongoose.connect(url);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error while connecting to DB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;