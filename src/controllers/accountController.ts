import { Request, Response } from 'express';
import AccountService from '../services/accountService';

class AccountController {
  // Get user information
  async getUserInfo(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const result = await AccountService.getUserInfo(userId);
      return res.status(result.status).json({ message: result, user: result.user });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Update user information
  async updateUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const result = await AccountService.updateUser(userId, req.body, req);
      return res.status(result.status).json({ message: result.message, user: result.user });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Delete user
  async deleteUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const result = await AccountService.deleteUser(userId);
      return res.status(result.status).json({ message: result.message });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

export default new AccountController();