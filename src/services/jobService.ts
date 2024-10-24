import { Request } from 'express';
import AppliedJob from '../models/AppliedJob';
import Company from '../models/Company';
import Job, { IJob } from '../models/Job';
import User from '../models/User';
import logger from '../utils/logger';
import cloudinary from '../utils/claudinary';
import AccountService from './accountService';

class JobService {
  // Create a new job entry
  async createJob(input: IJob, userId: string) {
    try {
      if (!userId) {
        logger.error('Invalid user ID');
        return { status: 401, message: 'Unauthorized' };
      }
      // Create the company with the userId
      const companyData = { ...input.company, userId };
      const newCompany = new Company(companyData);
      await newCompany.save();

      // Create the job with the company ID
      const newJob = new Job({ ...input, company: newCompany._id, userId });
      await newJob.save();

      return { status: 201, message: 'Job created successfully', job: newJob };
    } catch (error: any) {
      logger.error('Error creating job: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }

  // Get a job entry by ID
  async getJobById(jobId: string) {
    try {
      const job = await Job.findById(jobId)
        .populate('company')
        .populate('appliedJobs')
        .populate({
          path: 'userId',
          select: 'id name profileImage occupation', // Include only specific fields
          options: { lean: true }
        });
      if (!job) {
        return { status: 404, message: 'Job not found' };
      }
      return { status: 200, job };
    } catch (error: any) {
      logger.error('Error getting job: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }

  // Get all job entries
  async getAllJobs() {
    try {
      const jobs = await Job.find()
        .populate('company')
        .populate('appliedJobs')
        .populate({
          path: 'userId',
          select: 'id name profileImage occupation', // Include only specific fields
          options: { lean: true }
        });
      return { status: 200, jobs };
    } catch (error: any) {
      logger.error('Error getting jobs: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }

  // Update a job entry
  async updateJob(jobId: string, input: Partial<IJob>) {
    try {
      const job = await Job.findByIdAndUpdate(jobId, input, { new: true })
        .populate('company')
        .populate('appliedJobs')
        .populate({
          path: 'userId',
          select: 'id name profileImage occupation' // Include only specific fields
        });
      if (!job) {
        return { status: 404, message: 'Job not found' };
      }
      return { status: 200, message: 'Job updated successfully', job };
    } catch (error: any) {
      logger.error('Error updating job: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }

  // Delete a job entry
  async deleteJob(jobId: string) {
    try {
      const job = await Job.findByIdAndDelete(jobId)
        .populate('company')
        .populate('appliedJobs')
        .populate({
          path: 'userId',
          select: 'id name profileImage occupation' // Include only specific fields
        });
      if (!job) {
        return { status: 404, message: 'Job not found' };
      }
      return { status: 200, message: 'Job deleted successfully' };
    } catch (error: any) {
      logger.error('Error deleting job: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }

  // Apply for a job with an existing CV
  async applyWithExistingCV(jobId: string, userId: string) {
    try {
      const job = await Job.findById(jobId);
      if (!job) {
        return { status: 404, message: 'Job not found' };
      }

      const user = await User.findById(userId);
      if (!user || !user.cv) {
        logger.error('Your CV not found');
        return { status: 400, message: 'Your CV not found' };
      }

      const appliedJob = new AppliedJob({
        jobId,
        position: job.position,
        company: job.company.toString(),
        userId,
        appliedAt: new Date(),
        cv: user.cv,
      });

      await appliedJob.save();
      if (user.appliedJobs) {
        user.appliedJobs.push(appliedJob._id as any);
      } else {
        user.appliedJobs = [appliedJob._id as any];
      }
      await user.save();

      return { status: 200, message: 'Applied successfully' };
    } catch (error: any) {
      logger.error('Error applying for job: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }

  // Apply for a job with a new CV
  async applyWithNewCV(jobId: string, userId: string, req: Request) {
    try {
      const job = await Job.findById(jobId);
      if (!job) {
        return { status: 404, message: 'Job not found' };
      }

      const { user } = await AccountService.findById(userId);
  
      if (!user) {
        return { status: 404, message: 'User not found' };
      }
  
      let cv = '';

        // Handl`e profile image update
        if (req.file) {
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'cv',
          });
          cv = result.secure_url;
        }

        user.cv = cv || user.cv;
  
        await user.save();


      const appliedJob = new AppliedJob({
        jobId,
        position: job.position,
        company: job.company.toString(),
        userId,
        appliedAt: new Date(),
        cv,
      });

      await appliedJob.save();

      if (user.appliedJobs) {
        user.appliedJobs.push(appliedJob._id as any);
      } else {
        user.appliedJobs = [appliedJob._id as any];
      }
      await user.save();

      return { status: 200, message: 'Applied successfully' };
    
    } catch (error: any) {
      logger.error('Error applying for job: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }
}

export default new JobService();