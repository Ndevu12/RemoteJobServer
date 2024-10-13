import { Request, Response } from 'express';
import ExperienceService from '../services/experienceService';
import logger from '../utils/logger';
import { experienceSchema } from '../helpers/validator/experianceValidation';

class ExperienceController {
  // Create a new experience entry
  async createExperience(req: Request, res: Response) {
    try {
      if (!req.user) {
        logger.error(`User not authenticated, req.user: ${req.user}`, { label: 'ExperienceController' });
        return res.status(400).json({ message: 'User not authenticated' });
      }

      // Validate the input
      const { error } = experienceSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: 'Invalid input', error: error.details });
      }

      const userId = req.user.id; // Use req.userId from the middleware
      const result = await ExperienceService.createExperience(req.body, userId);
      return res.status(result.status).json({ message: result.message, experience: result.experience });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Get an experience entry by ID
  async getExperienceById(req: Request, res: Response) {
    try {
      const { experienceId } = req.params;
      const result = await ExperienceService.getExperienceById(experienceId);
      return res.status(result.status).json({ message: result.message, experience: result.experience });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Update an experience entry
  async updateExperience(req: Request, res: Response) {
    try {
      // Validate the input
      const { error } = experienceSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: 'Invalid input', error: error.details });
      }

      const { experienceId } = req.params;
      const result = await ExperienceService.updateExperience(experienceId, req.body);
      return res.status(result.status).json({ message: result.message, experience: result.experience });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Delete an experience entry
  async deleteExperience(req: Request, res: Response) {
    try {
      const { experienceId } = req.params;
      const result = await ExperienceService.deleteExperience(experienceId);
      return res.status(result.status).json({ message: result.message });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

export default new ExperienceController();