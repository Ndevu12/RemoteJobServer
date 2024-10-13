import { Request, Response } from 'express';
import AppliedJobService from '../services/appliedJobService';
import logger from '../utils/logger';
import { appliedJobSchema } from '../helpers/validator/AppliedJobValidation';

class AppliedJobController {
  // Create a new applied job entry
  async createAppliedJob(req: Request, res: Response) {
    try {
      if (!req.user) {
        logger.error(`User not authenticated, req.user: ${req.user}`, { label: 'AppliedJobController' });
        return res.status(400).json({ message: 'User not authenticated' });
      }

      // Validate the input
      const { error } = appliedJobSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: 'Invalid input', error: error.details });
      }

      const userId = req.user.id; // Use req.userId from the middleware
      const result = await AppliedJobService.createAppliedJob(req.body, userId);
      return res.status(result.status).json({ message: result.message, appliedJob: result.appliedJob });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Get an applied job entry by ID
  async getAppliedJobById(req: Request, res: Response) {
    try {
      const { appliedJobId } = req.params;
      const result = await AppliedJobService.getAppliedJobById(appliedJobId);
      return res.status(result.status).json({ message: result.message, appliedJob: result.appliedJob });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Update an applied job entry
  async updateAppliedJob(req: Request, res: Response) {
    try {
      // Validate the input
      const { error } = appliedJobSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: 'Invalid input', error: error.details });
      }

      const { appliedJobId } = req.params;
      const result = await AppliedJobService.updateAppliedJob(appliedJobId, req.body);
      return res.status(result.status).json({ message: result.message, appliedJob: result.appliedJob });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Delete an applied job entry
  async deleteAppliedJob(req: Request, res: Response) {
    try {
      const { appliedJobId } = req.params;
      const result = await AppliedJobService.deleteAppliedJob(appliedJobId);
      return res.status(result.status).json({ message: result.message });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

export default new AppliedJobController();