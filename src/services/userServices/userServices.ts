import User from '../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cloudinary from '../../utils/claudinary';
import { Request } from 'express';

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

interface UpdateUserInput {
  name?: string;
  email?: string;
  occupation?: string;
  password?: string;
  role?: string;
  phone?: string;
  profileImage?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  company?: {
    name?: string;
    website?: string;
    logo?: string;
    logoBackground?: string;
  };
}

class UserServices {
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
        address: {
          street: '',
          city: '',
          state: '',
          zip: '',
          country: '',
        },
        company: {
          name: '',
          website: '',
          logo: '',
          logoBackground: '',
        },
        appliedJobs: [],
      });

      // Save the user to the database
      await newUser.save();

      return { status: 201, message: 'User registered successfully' };
    } catch (error: any) {
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
        expiresIn: '1h',
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
      return { status: 500, message: 'error. Try again later.', error: error.message };
    }
  }

  // Find user by ID
  async findById(userId: string) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return { status: 404, message: 'User not found' };
      }
      return { status: 200, user };
    } catch (error: any) {
      return { status: 500, message: 'error. Try again later.', error: error.message };
    }
  }

  // Find user by email
  async findByEmail(email: string) {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  // Find user by phone number
  async findByPhoneNumber(phone: string) {
    try {
      const user = await User.findOne({ phone });
      return user;
    } catch (error: any) {
      throw new Error(error.message);
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
      return { status: 500, message: 'error. Try again later.', error: error.message };
    }
  }

  async updateUser(userId: string, input: UpdateUserInput, req: Request) {
    try {
      const user = await this.findById(userId);
  
      if (user.status !== 200) {
        return user;
      }
  
      if (user.user) {
        if (input.email && input.email !== user.user.email) {
          const existingUserByEmail = await this.findByEmail(input.email);
          if (existingUserByEmail) {
            return { status: 400, message: 'User with this email already exists' };
          }
        }
  
        if (input.phone && input.phone !== user.user.phone) {
          const existingUserByPhone = await this.findByPhoneNumber(input.phone);
          if (existingUserByPhone) {
            return { status: 400, message: 'User with this phone number already exists' };
          }
        }
  
        if (input.password) {
          input.password = await bcrypt.hash(input.password, 10);
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
        user.user.address = {
          street: input.address?.street || user.user.address?.street || '',
          city: input.address?.city || user.user.address?.city || '',
          state: input.address?.state || user.user.address?.state || '',
          zip: input.address?.zip || user.user.address?.zip || '',
          country: input.address?.country || user.user.address?.country || '',
        };
        user.user.company = {
          name: input.company?.name || user.user.company?.name || '',
          website: input.company?.website || user.user.company?.website || '',
          logo: input.company?.logo || user.user.company?.logo || '',
          logoBackground: input.company?.logoBackground || user.user.company?.logoBackground || '',
        };
        user.user.password = input.password || user.user.password;
        user.user.role = input.role || user.user.role;
        user.user.profileImage = input.profileImage || user.user.profileImage;
  
        await user.user.save();
  
        return { status: 200, message: 'User updated successfully', user: user.user };
      } else {
        return { status: 404, message: 'User not found' };
      }
    } catch (error: any) {
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
      return { status: 500, message: 'error. Try again later.', error: error.message };
    }
  }
}

export default new UserServices();