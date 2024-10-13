import { addressSchema } from '../helpers/validator/AddressValidationSchemas';
import Address, { IAddress } from '../models/Address';
import User from '../models/User';
import logger from '../utils/logger';
import Joi from 'joi';

class AddressService {
  // Create a new address
  async createAddress(input: IAddress, userId: string) {
    try {
      if (!input || Object.keys(input).length === 0) {
        logger.error('Invalid education data');
        return { status: 400, message: 'Invalid education data' };
      }
      if (!userId) {
        logger.error('User ID is required');
        return { status: 400, message: 'User ID is required' };
      }
      const newAddress = new Address({ ...input, user: userId });
      await newAddress.save();

      // Add the company ID to the user's list of companies
      await User.findByIdAndUpdate(userId, { $push: { address: newAddress._id } });

      return { status: 201, message: 'Address created successfully', address: newAddress };
    } catch (error: any) {
      logger.error('Error creating address: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }

  // Get an address by ID
  async getAddressById(addressId: string) {
    try {
      const address = await Address.findById(addressId).populate('user');
      if (!address) {
        return { status: 404, message: 'Address not found' };
      }
      return { status: 200, address };
    } catch (error: any) {
      logger.error('Error getting address: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }

  // Update an address
  async updateAddress(addressId: string, input: Partial<IAddress>) {
    try {
      // Validate the input
      const { error } = addressSchema.validate(input);
      if (error) {
        return { status: 400, message: 'Invalid input', error: error.details };
      }

      const address = await Address.findByIdAndUpdate(addressId, input, { new: true }).populate('user');
      if (!address) {
        return { status: 404, message: 'Address not found' };
      }
      return { status: 200, message: 'Address updated successfully', address };
    } catch (error: any) {
      logger.error('Error updating address: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }

  // Delete an address
  async deleteAddress(addressId: string) {
    try {
      const address = await Address.findByIdAndDelete(addressId).populate('user');
      if (!address) {
        return { status: 404, message: 'Address not found' };
      }
      return { status: 200, message: 'Address deleted successfully' };
    } catch (error: any) {
      logger.error('Error deleting address: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }
}

export default new AddressService();