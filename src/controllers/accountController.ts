import { Request, Response } from 'express';
import AccountService from '../services/accountService';
import logger from '../utils/logger';

class AccountController {
  // Get user information
  async getUserInfo(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const result = await AccountService.getUserInfo(userId);
      return res.status(result.status).json({ message: 'Account info. retrieved successfully', account: result.user });
    } catch (error: any) {
      return res.status(500).json({ message: 'Network Error', error: error.message });
    }
  }

  // Update user information
  async updateUser(req: Request, res: Response) {
    try {
      if (!req.user) {
        logger.error('User not authenticated', { label: 'AccountController' });
        return res.status(400).json({ message: 'User not authenticated' });
      }
      const userId = req.user.id;
      const result = await AccountService.updateUser(userId, req.body, req);
      return res.status(result.status).json({ message: result.message, account: result.user });
    } catch (error: any) {
      return res.status(500).json({ message: 'Network Error', error: error.message });
    }
  }

  async upLoadCV (req: Request, res: Response){
    try {
      if (!req.user) {
        logger.error('User not authenticated', { label: 'AccountController' });
        return res.status(401).json({ message: 'User not authenticated' });
      }
      const userId = req.user.id;
      const result = await AccountService.upLoadCV(userId, req);
      return res.status(result.status).json({ message: result.message, account: result.user });
    } catch (error: any){
      return res.status(500).json({ message: 'Network Error', error: error.message });
    }
  }
  // Delete user
  async deleteUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const result = await AccountService.deleteUser(userId);
      return res.status(result.status).json({ message: result.message });
    } catch (error: any) {
      return res.status(500).json({ message: 'Network Error', error: error.message });
    }
  }
}

export default new AccountController();