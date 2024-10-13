import Company from '../models/Company';
import Job, { IJob } from '../models/Job';
import logger from '../utils/logger';

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
}

export default new JobService();