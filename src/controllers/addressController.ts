import { Request, Response } from 'express';
import AddressService from '../services/addressService';
import logger from '../utils/logger';

class AddressController {
  // Create a new address
  async createAddress(req: Request, res: Response) {
    try {
      if (!req.user) {
        logger.error(`User not authenticated, req.user: ${req.user}`, { label: 'AddressController' });
        return res.status(400).json({ message: 'User not authenticated' });
      }
      const userId = req.user.id; // Assuming user ID is available in req.user
      logger.debug('User ID: %s', userId);
      const result = await AddressService.createAddress(req.body, userId);
      return res.status(result.status).json({ message: result.message, address: result.address });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Get an address by ID
  async getAddressById(req: Request, res: Response) {
    try {
      const { addressId } = req.params;
      const result = await AddressService.getAddressById(addressId);
      return res.status(result.status).json({ message: result.message, address: result.address });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Update an address
  async updateAddress(req: Request, res: Response) {
    try {
      const { addressId } = req.params;
      if (!addressId) {
        return res.status(400).json({ message: 'Address ID is required' });
      }
      
      const result = await AddressService.updateAddress(addressId, req.body);
      return res.status(result.status).json({ message: result.message, address: result.address });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Delete an address
  async deleteAddress(req: Request, res: Response) {
    try {
      const { addressId } = req.params;
      const result = await AddressService.deleteAddress(addressId);
      return res.status(result.status).json({ message: result.message });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

export default new AddressController();