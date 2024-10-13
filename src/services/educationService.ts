import Education, { IEducation } from '../models/Education';
import User from '../models/User';
import logger from '../utils/logger';

class EducationService {
  // Create a new education entry
  // Create a new education entry
  async createEducation(input: IEducation, userId: string) {
    try {
      // Check if input is null, undefined, or empty
      if (!input || Object.keys(input).length === 0) {
        logger.error('Invalid education data');
        return { status: 400, message: 'Invalid education data' };
      }

      const newEducation = new Education({ ...input, userId });
      await newEducation.save();

      // Add the education ID to the user's list of educations
      await User.findByIdAndUpdate(userId, { $push: { education: newEducation._id } });

      return { status: 201, message: 'Education created successfully', education: newEducation };
    } catch (error: any) {
      logger.error('Error creating education: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }

  // Get an education entry by ID
  async getEducationById(educationId: string) {
    try {
      const education = await Education.findById(educationId).populate('userId');
      if (!education) {
        return { status: 404, message: 'Education not found' };
      }
      return { status: 200, education };
    } catch (error: any) {
      logger.error('Error getting education: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }

  // Update an education entry
  async updateEducation(educationId: string, input: Partial<IEducation>) {
    try {
      const education = await Education.findByIdAndUpdate(educationId, input, { new: true }).populate('userId');
      if (!education) {
        return { status: 404, message: 'Education not found' };
      }
      return { status: 200, message: 'Education updated successfully', education };
    } catch (error: any) {
      logger.error('Error updating education: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }

  // Delete an education entry
  async deleteEducation(educationId: string) {
    try {
      const education = await Education.findByIdAndDelete(educationId).populate('userId');
      if (!education) {
        return { status: 404, message: 'Education not found' };
      }
      return { status: 200, message: 'Education deleted successfully' };
    } catch (error: any) {
      logger.error('Error deleting education: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }
}

export default new EducationService();