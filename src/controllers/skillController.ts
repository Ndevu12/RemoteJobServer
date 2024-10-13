import { Request, Response } from 'express';
import SkillService from '../services/skillService';
import logger from '../utils/logger';
import { skillSchema } from '../helpers/validator/SkillsValidation';

class SkillController {
  // Create a new skill
  async createSkill(req: Request, res: Response) {
    try {
      if (!req.user) {
        logger.error(`User not authenticated, req.user: ${req.user}`, { label: 'SkillController' });
        return res.status(400).json({ message: 'User not authenticated' });
      }

      const userId = req.user.id;  // Use req.userId from the middleware
      // Validate the input
      const { error } = skillSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: 'Invalid input', error: error.message });
      }

      const result = await SkillService.createSkill(req.body, userId);
      return res.status(result.status).json({ message: result.message, skill: result.skill });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Get a skill by ID
  async getSkillById(req: Request, res: Response) {
    try {
      const { skillId } = req.params;
      const result = await SkillService.getSkillById(skillId);
      return res.status(result.status).json({ message: result.message, skill: result.skill });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Update a skill
  async updateSkill(req: Request, res: Response) {
    try {
      // Validate the input
      const { error } = skillSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: 'Invalid input', error: error.details });
      }

      const { skillId } = req.params;
      const result = await SkillService.updateSkill(skillId, req.body);
      return res.status(result.status).json({ message: result.message, skill: result.skill });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Delete a skill
  async deleteSkill(req: Request, res: Response) {
    try {
      const { skillId } = req.params;
      const result = await SkillService.deleteSkill(skillId);
      return res.status(result.status).json({ message: result.message });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

export default new SkillController();