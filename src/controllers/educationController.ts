import { Request, Response } from 'express';
import EducationService from '../services/educationService';
import logger from '../utils/logger';
import { educationSchema } from '../helpers/validator/EducationValidation';

class EducationController {
  // Create a new education entry
  async createEducation(req: Request, res: Response) {
    try {
      if (!req.user) {
        logger.error(`User not authenticated, req.user: ${req.user}`, { label: 'EducationController' });
        return res.status(400).json({ message: 'User not authenticated' });
      }

      // Validate the input
      const { error } = educationSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: 'Invalid input', error: error.message });
      }

      const userId = req.user.id;  // Use req.userId from the middleware
      const result = await EducationService.createEducation(req.body, userId);
      return res.status(result.status).json({ message: result.message, education: result.education });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Get an education entry by ID
  async getEducationById(req: Request, res: Response) {
    try {
      const { educationId } = req.params;
      const result = await EducationService.getEducationById(educationId);
      return res.status(result.status).json({ message: result.message, education: result.education });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Update an education entry
  async updateEducation(req: Request, res: Response) {
    try {
      // Validate the input
      const { error } = educationSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: 'Invalid input', error: error.details });
      }

      const { educationId } = req.params;
      const result = await EducationService.updateEducation(educationId, req.body);
      return res.status(result.status).json({ message: result.message, education: result.education });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Delete an education entry
  async deleteEducation(req: Request, res: Response) {
    try {
      const { educationId } = req.params;
      const result = await EducationService.deleteEducation(educationId);
      return res.status(result.status).json({ message: result.message });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

export default new EducationController();