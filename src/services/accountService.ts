import User from '../models/User';
import cloudinary from '../utils/claudinary';
import { Request } from 'express';
import logger from '../utils/logger';
import Address, { IAddress } from '../models/Address';
import { log } from 'console';

interface UpdateUserInput {
  name?: string;
  email?: string;
  occupation?: string;
  phone?: string;
  profileImage?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

class AccountService {
  // Find user by ID
  async findById(userId: string) {
    try {
      const user = await User.findById(userId).populate('address');
      if (!user) {
        return { status: 404, message: 'User not found' };
      }
      console.log({user});
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

  // Update user information  // Update user information
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

        logger.debug('============== Input =================: %o', input);

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

        if (input.address) {

          // Validate address fields
          const { street, city, state, zipCode, country } = input.address;
          if (!street || !city || !state || !zipCode || !country) {
            logger.info('All address fields are required\n');
            console.log('All address fields are required\n', { city, state, zipCode, country });
            return { status: 400, message: 'All address fields are required' };
          }

          let address = await Address.findOne({ user: userId });

          if (!address) {
            address = new Address({
              user: userId,
              street,
              city,
              state,
              zipCode,
              country,
            });

            await address.save();
          } else {
            address.street = street;
            address.city = city;
            address.state = state;
            address.zipCode = zipCode;
            address.country = country;

            await address.save();
          }

          // Ensure the address is populated in the user document
          user.user.address = [address._id] as unknown as IAddress[];
        }

        // Update user properties
        user.user.name = input.name || user.user.name;
        user.user.email = input.email || user.user.email;
        user.user.occupation = input.occupation || user.user.occupation;
        user.user.phone = input.phone || user.user.phone;
        user.user.profileImage = input.profileImage || user.user.profileImage;

        await user.user.save();

        // Populate the address field
        await user.user.populate('address');

        return { status: 200, message: 'User updated successfully', user: user.user };
      } else {
        return { status: 404, message: 'User not found' };
      }
    } catch (error: any) {
      logger.error('Error updating user: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }

  async upLoadCV(userId: string, req: Request) {
    try {
      const user = await this.findById(userId);
  
      if (user.status !== 200) {
        return user;
      }
  
      let cv = '';

      if (user.user) {  
        // Handle profile image update
        if (req.file) {
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'cv',
          });
          cv = result.secure_url;
        }

        user.user.cv = cv || user.user.cv;
  
        await user.user.save();
  
        return { status: 200, message: 'User cv uploaded successfully', user: user.user };
      } else {
        return { status: 404, message: 'User not found' };
      }
    } catch (error: any) {
      logger.error('Error uploading usser cv: %o', error);
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