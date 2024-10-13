import Skill, { ISkill } from '../models/Skill';
import User from '../models/User';
import logger from '../utils/logger';

class SkillService {
  // Create a new skill
  async createSkill(input: ISkill, userId: string) {
    try {
      const newSkill = new Skill({ ...input, userId });
      await newSkill.save();

      // Add the skill ID to the user's list of skills
      await User.findByIdAndUpdate(userId, { $push: { skills: newSkill._id } });

      return { status: 201, message: 'Skill created successfully', skill: newSkill };
    } catch (error: any) {
      logger.error('Error creating skill: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }

  // Get a skill by ID
  async getSkillById(skillId: string) {
    try {
      const skill = await Skill.findById(skillId).populate('userId');
      if (!skill) {
        return { status: 404, message: 'Skill not found' };
      }
      return { status: 200, skill };
    } catch (error: any) {
      logger.error('Error getting skill: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }

  // Update a skill
  async updateSkill(skillId: string, input: Partial<ISkill>) {
    try {
      const skill = await Skill.findByIdAndUpdate(skillId, input, { new: true }).populate('userId');
      if (!skill) {
        return { status: 404, message: 'Skill not found' };
      }
      return { status: 200, message: 'Skill updated successfully', skill };
    } catch (error: any) {
      logger.error('Error updating skill: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }

  // Delete a skill
  async deleteSkill(skillId: string) {
    try {
      const skill = await Skill.findByIdAndDelete(skillId).populate('userId');
      if (!skill) {
        return { status: 404, message: 'Skill not found' };
      }
      return { status: 200, message: 'Skill deleted successfully' };
    } catch (error: any) {
      logger.error('Error deleting skill: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }
}

export default new SkillService();