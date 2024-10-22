import { Request, Response } from 'express';
import JobService from '../services/jobService';
import logger from '../utils/logger';
import { jobSchema } from '../helpers/validator/JobValidator';
import mongoose from 'mongoose';

class JobController {
  // Create a new job entry
  async createJob(req: Request, res: Response) {
    try {
      if (!req.user) {
        logger.error(`User not authenticated, req.user: ${req.user}`, { label: 'JobController' });
        return res.status(400).json({ message: 'User not authenticated' });
      }

      const { error } = jobSchema.validate(req.body);
      if (error) {
        logger.info('Invalid input: %o', error.details[0].message);
        logger.info('input: ', req.body);
        return res.status(400).json({ message: 'Invalid input', error: error.details[0].message });
      }

      const userId = req.user.id; // Use req.userId from the middleware
      const result = await JobService.createJob(req.body, userId);
      return res.status(result.status).json({ message: result.message, job: result.job });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Get a job entry by ID
  async getJobById(req: Request, res: Response) {
    try {
      const { jobId } = req.params;
      if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
        logger.info('Invalid Job ID: %s', jobId);
        return res.status(400).json({ message: 'Invalid Job ID' });
      }
      const result = await JobService.getJobById(jobId);
      return res.status(result.status).json({ message: result.message, job: result.job });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

    // Get all job entries
    async getAllJobs(req: Request, res: Response) {
        try {
          const result = await JobService.getAllJobs();
          return res.status(result.status).json({ message: result.message, jobs: result.jobs });
        } catch (error: any) {
          return res.status(500).json({ message: 'Server error', error: error.message });
        }
      }

  // Update a job entry
  async updateJob(req: Request, res: Response) {
    try {
        const { jobId } = req.params;
        if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
            logger.info('Invalid Job ID: %s', jobId);
          return res.status(400).json({ message: 'Invalid Job ID' });
        }
      const result = await JobService.updateJob(jobId, req.body);
      return res.status(result.status).json({ message: result.message, job: result.job });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Delete a job entry
  async deleteJob(req: Request, res: Response) {
    try {
        const { jobId } = req.params;
        if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
            logger.info('Invalid Job ID: %s', jobId);
          return res.status(400).json({ message: 'Invalid Job ID' });
        }
      const result = await JobService.deleteJob(jobId);
      return res.status(result.status).json({ message: result.message });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

    // Apply for a job with an existing CV
    async applyWithExistingCV(req: Request, res: Response) {
        try {
            const { jobId } = req.params;
            if (!req.user) {
                logger.info('User not authenticated');
              return res.status(400).json({ message: 'Invalid Job ID' });
            }
          const userId = req.user.id; // Use req.userId from the middleware
          if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
            logger.info('Invalid Job ID: %s', jobId);
            return res.status(400).json({ message: 'Invalid Job ID' });
          }
          const result = await JobService.applyWithExistingCV(jobId, userId);
          return res.status(result.status).json({ message: result.message });
        } catch (error: any) {
          return res.status(500).json({ message: 'Server error', error: error.message });
        }
      }
    
      // Apply for a job with a new CV
      async applyWithNewCV(req: Request, res: Response) {
        try {
        const { jobId } = req.params;
        if (!req.user) {
            logger.info('User not authenticated');
        return res.status(400).json({ message: 'Invalid Job ID' });
      }
          const userId = req.user.id;
          if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
            logger.info('Invalid Job ID: %s', jobId);
            return res.status(400).json({ message: 'Invalid Job ID' });
          }
          const result = await JobService.applyWithNewCV(jobId, userId, req);
          return res.status(result?.status).json({ message: result.message });
        } catch (error: any) {
          return res.status(500).json({ message: 'Server error', error: error.message });
        }
      }
}

export default new JobController();