import { IUser } from './src/models/User'; // Adjust the path as necessary

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser;
    userId?: string;
  }
}