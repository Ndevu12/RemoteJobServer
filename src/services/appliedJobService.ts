import AppliedJob, { IAppliedJob } from '../models/AppliedJob';
import User from '../models/User';
import logger from '../utils/logger';

class AppliedJobService {
  // Create a new applied job entry
  async createAppliedJob(input: IAppliedJob, userId: string) {
    try {
      const newAppliedJob = new AppliedJob({ ...input, userId });
      await newAppliedJob.save();

      // Add the applied job ID to the user's list of applied jobs
      await User.findByIdAndUpdate(userId, { $push: { appliedJobs: newAppliedJob._id } });

      return { status: 201, message: 'Applied job created successfully', appliedJob: newAppliedJob };
    } catch (error: any) {
      logger.error('Error creating applied job: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }

  // Get an applied job entry by ID
  async getAppliedJobById(appliedJobId: string) {
    try {
      const appliedJob = await AppliedJob.findById(appliedJobId).populate('userId');
      if (!appliedJob) {
        return { status: 404, message: 'Applied job not found' };
      }
      return { status: 200, appliedJob };
    } catch (error: any) {
      logger.error('Error getting applied job: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }

  // Update an applied job entry
  async updateAppliedJob(appliedJobId: string, input: Partial<IAppliedJob>) {
    try {
      const appliedJob = await AppliedJob.findByIdAndUpdate(appliedJobId, input, { new: true }).populate('userId');
      if (!appliedJob) {
        return { status: 404, message: 'Applied job not found' };
      }
      return { status: 200, message: 'Applied job updated successfully', appliedJob };
    } catch (error: any) {
      logger.error('Error updating applied job: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }

  // Delete an applied job entry
  async deleteAppliedJob(appliedJobId: string) {
    try {
      const appliedJob = await AppliedJob.findByIdAndDelete(appliedJobId).populate('userId');
      if (!appliedJob) {
        return { status: 404, message: 'Applied job not found' };
      }
      return { status: 200, message: 'Applied job deleted successfully' };
    } catch (error: any) {
      logger.error('Error deleting applied job: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }
}

export default new AppliedJobService();