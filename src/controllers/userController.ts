import { Request, Response } from 'express';
import UserServices from '../services/userServices/userServices';
import multer from '../middleware/Uploader';

class UserController {
  // Register a new user
  async registerUser(req: Request, res: Response) {
    try {
      const result = await UserServices.register(req.body);
      return res.status(result.status).json({ message: result.message || 'Success'});
    } catch (error: any) {
      return res.status(500).json({ message: 'Network error. Try again later.', error: error.message });
    }
  }

  // Login a user
  async loginUser(req: Request, res: Response) {
    try {
      const result = await UserServices.login(req.body);
      return res.status(result.status).json({ message: result.message, user: result.user, token: result.token });
    } catch (error: any) {
      return res.status(500).json({ message: 'Network error. Try again later.', error: error.message });
    }
  }

  // Get user information
  async getUserInfo(req: Request, res: Response) {
    try {
      const result = await UserServices.getUserInfo(req.params.userId);
      return res.status(result.status).json({ message: result, user: result.user });
    } catch (error: any) {
      return res.status(500).json({ message: 'Network error. Try again later.', error: error.message });
    }
  }

    // Get user by email
    async getUserByEmail(req: Request, res: Response) {
      try {
        const result = await UserServices.findByEmail(req.params.email);
        if (!result) {
          return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ user: result });
      } catch (error: any) {
        return res.status(500).json({ message: 'Server error', error: error.message });
      }
    }

  // Update user information
  async updateUser(req: Request, res: Response) {
    try {
      const result = await UserServices.updateUser(req.params.userId, req.body, req);
      return res.status(result.status).json({ message: result.message, user: result.user });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Delete user
  async deleteUser(req: Request, res: Response) {
    try {
      const result = await UserServices.deleteUser(req.params.userId);
      return res.status(result.status).json({ message: result.message });
    } catch (error: any) {
      return res.status(500).json({ message: 'Network error. Try again later.', error: error.message });
    }
  }
}

export default new UserController();