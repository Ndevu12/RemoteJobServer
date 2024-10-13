import User from '../models/User';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';

interface RegisterUserInput {
  name: string;
  email: string;
  occupation: string;
  password: string;
  role?: string;
  phone?: string;
}

interface LoginUserInput {
  email: string;
  password: string;
}

class AuthService {
  // Register a new user
  async register(input: RegisterUserInput) {
    try {
      const { name, email, occupation, password, role: inputRole, phone } = input;

      // Check if a user with the same email already exists
      const existingUserByEmail = await this.findByEmail(email);
      if (existingUserByEmail) {
        return { status: 400, message: 'User with this email already exists' };
      }

      // Check if a user with the same phone number already exists
      if (phone) {
        const existingUserByPhone = await this.findByPhoneNumber(phone);
        if (existingUserByPhone) {
          return { status: 400, message: 'User with this phone number already exists' };
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const role = inputRole || 'user';

      const newUser = new User({
        name,
        email,
        occupation,
        password: hashedPassword,
        role,
        profileImage: '',
        phone: phone || '',
      });

      // Save the user to the database
      await newUser.save();

      return { status: 201, message: 'User registered successfully', userId: newUser.id };
    } catch (error: any) {
      logger.error('Error registering user: %o', error);
      return { status: 500, message: 'Network error. Try again later.', error: error.message };
    }
  }

  // Login a user
  async login(input: LoginUserInput) {
    try {
      const { email, password } = input;

      // Find the user by email
      const user = await this.findByEmail(email);
      if (!user) {
        return { status: 400, message: 'Invalid email or password' };
      }

      // Check if the password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return { status: 400, message: 'Invalid email or password' };
      }

      // Generate a JWT token
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET!, {
        expiresIn: '48h',
      });

      return {
        status: 200,
        message: 'User logged in successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          occupation: user.occupation,
          profileImage: user.profileImage,
          phone: user.phone,
          address: user.address,
          company: user.company,
          appliedJobs: user.appliedJobs,
          role: user.role,
        },
        token,
      };
    } catch (error: any) {
      logger.error('Error logging in user: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }

  // Find user by email
  async findByEmail(email: string) {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error: any) {
      logger.error('Error finding user by email: %o', error);
      throw new Error(error.message);
    }
  }

  // Find user by phone number
  async findByPhoneNumber(phone: string) {
    try {
      const user = await User.findOne({ phone });
      return user;
    } catch (error: any) {
      logger.error('Error finding user by phone number: %o', error);
      throw new Error(error.message);
    }
  }

  // Update user email
  async updateUserEmail(userId: string, newEmail: string) {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return { status: 400, message: 'Invalid user ID' };
      }
      const user = await User.findById(userId);
      if (!user) {
        return { status: 404, message: 'User not found' };
      }

      const existingUserByEmail = await User.findOne({ email: newEmail });
      if (existingUserByEmail) {
        return { status: 400, message: 'User with this email already exists' };
      }

      user.email = newEmail;
      await user.save();

      return { status: 200, message: 'Email updated successfully', user };
    } catch (error: any) {
      logger.error('Error updating email: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }

  // Update user password
  async updateUserPassword(userId: string, currentPassword: string, newPassword: string) {
    try {
      // Validate userId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return { status: 400, message: 'Invalid user ID' };
      }
  
      const user = await User.findById(userId);
      if (!user) {
        return { status: 404, message: 'User not found' };
      }
  
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return { status: 400, message: 'Current password is incorrect' };
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
  
      return { status: 200, message: 'Password updated successfully' };
    } catch (error: any) {
      logger.error('Error updating password: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }
}

export default new AuthService();