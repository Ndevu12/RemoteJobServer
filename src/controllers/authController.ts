import { Request, Response } from 'express';
import AuthService from '../services/authService';

class AuthController {
  // Register a new user
  async register(req: Request, res: Response) {
    try {
      const result = await AuthService.register(req.body);
      return res.status(result.status).json({ message: result.message, userId: result.userId });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Login a user
  async login(req: Request, res: Response) {
    try {
      const result = await AuthService.login(req.body);
      return res.status(result.status).json({ message: result.message, user: result.user, token: result.token });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Update user email
  async updateUserEmail(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { newEmail } = req.body;

      if (!newEmail || !userId){
        return res.status(400).json({message: 'New email or user id is required.'});
      }
      const result = await AuthService.updateUserEmail(userId, newEmail);
      if (result.user) {
        result.user.password = '';
      }
      
      return res.status(result.status).json({ message: result.message, user: result.user });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Update user password
  async updateUserPassword(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { currentPassword, newPassword } = req.body;
      const result = await AuthService.updateUserPassword(userId, currentPassword, newPassword);
      return res.status(result.status).json({ message: result.message });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

export default new AuthController();