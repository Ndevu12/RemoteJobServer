import Experience, { IExperience } from '../models/Experience';
import User from '../models/User';
import logger from '../utils/logger';

class ExperienceService {
  // Create a new experience entry
  async createExperience(input: IExperience, userId: string) {
    try {
      const newExperience = new Experience({ ...input, userId });
      await newExperience.save();

      // Add the experience ID to the user's list of experiences
      await User.findByIdAndUpdate(userId, { $push: { experience: newExperience._id } });

      return { status: 201, message: 'Experience created successfully', experience: newExperience };
    } catch (error: any) {
      logger.error('Error creating experience: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }

  // Get an experience entry by ID
  async getExperienceById(experienceId: string) {
    try {
      const experience = await Experience.findById(experienceId).populate('userId');
      if (!experience) {
        return { status: 404, message: 'Experience not found' };
      }
      return { status: 200, experience };
    } catch (error: any) {
      logger.error('Error getting experience: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }

  // Update an experience entry
  async updateExperience(experienceId: string, input: Partial<IExperience>) {
    try {
      const experience = await Experience.findByIdAndUpdate(experienceId, input, { new: true }).populate('userId');
      if (!experience) {
        return { status: 404, message: 'Experience not found' };
      }
      return { status: 200, message: 'Experience updated successfully', experience };
    } catch (error: any) {
      logger.error('Error updating experience: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }

  // Delete an experience entry
  async deleteExperience(experienceId: string) {
    try {
      const experience = await Experience.findByIdAndDelete(experienceId).populate('userId');
      if (!experience) {
        return { status: 404, message: 'Experience not found' };
      }
      return { status: 200, message: 'Experience deleted successfully' };
    } catch (error: any) {
      logger.error('Error deleting experience: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }
}

export default new ExperienceService();