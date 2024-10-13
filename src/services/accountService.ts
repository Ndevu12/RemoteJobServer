import User from '../models/User';
import cloudinary from '../utils/claudinary';
import { Request } from 'express';
import logger from '../utils/logger';

interface UpdateUserInput {
  name?: string;
  email?: string;
  occupation?: string;
  phone?: string;
  profileImage?: string;
}

class AccountService {
  // Find user by ID
  async findById(userId: string) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { status: 404, message: 'User not found' };
      }
      return { status: 200, user };
    } catch (error: any) {
      logger.error('Error finding user by ID: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }

  // Get user information
  async getUserInfo(userId: string) {
    try {
      const user = await this.findById(userId);
      if (user.status !== 200) {
        return user;
      }
      return { status: 200, user: user.user };
    } catch (error: any) {
      logger.error('Error getting user information: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }

  // Update user information
  async updateUser(userId: string, input: UpdateUserInput, req: Request) {
    try {
      const user = await this.findById(userId);
  
      if (user.status !== 200) {
        return user;
      }
  
      if (user.user) {
        if (input.email && input.email !== user.user.email) {
          const existingUserByEmail = await User.findOne({ email: input.email });
          if (existingUserByEmail) {
            return { status: 400, message: 'User with this email already exists' };
          }
        }
  
        if (input.phone && input.phone !== user.user.phone) {
          const existingUserByPhone = await User.findOne({ phone: input.phone });
          if (existingUserByPhone) {
            return { status: 400, message: 'User with this phone number already exists' };
          }
        }
  
        // Handle profile image update
        if (req.file) {
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'profile_images',
          });
          input.profileImage = result.secure_url;
        }
  
        // Update user properties
        user.user.name = input.name || user.user.name;
        user.user.email = input.email || user.user.email;
        user.user.occupation = input.occupation || user.user.occupation;
        user.user.phone = input.phone || user.user.phone;
        user.user.profileImage = input.profileImage || user.user.profileImage;
  
        await user.user.save();
  
        return { status: 200, message: 'User updated successfully', user: user.user };
      } else {
        return { status: 404, message: 'User not found' };
      }
    } catch (error: any) {
      logger.error('Error updating user: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }

  // Delete user
  async deleteUser(userId: string) {
    try {
      const user = await this.findById(userId);
      if (user.status !== 200) {
        return user;
      }
      if (user.user) {
        await user.user.deleteOne();
      } else {
        return { status: 404, message: 'User not found' };
      }
      return { status: 200, message: 'User deleted successfully' };
    } catch (error: any) {
      logger.error('Error deleting user: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }
}

export default new AccountService();