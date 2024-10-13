import Company, { ICompany } from '../models/Company';
import User from '../models/User';
import logger from '../utils/logger';

class CompanyService {
  // Create a new company entry
  async createCompany(input: ICompany, userId: string) {
    try {
      const newCompany = new Company({ ...input, userId });
      await newCompany.save();

      // Add the company ID to the user's list of companies
      await User.findByIdAndUpdate(userId, { $push: { company: newCompany._id } });

      return { status: 201, message: 'Company created successfully', company: newCompany };
    } catch (error: any) {
      logger.error('Error creating company: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }

  // Get a company entry by ID
  async getCompanyById(companyId: string) {
    try {
      const company = await Company.findById(companyId).populate('userId');
      if (!company) {
        return { status: 404, message: 'Company not found' };
      }
      return { status: 200, company };
    } catch (error: any) {
      logger.error('Error getting company: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }

  // Update a company entry
  async updateCompany(companyId: string, input: Partial<ICompany>) {
    try {
      const company = await Company.findByIdAndUpdate(companyId, input, { new: true }).populate('userId');
      if (!company) {
        return { status: 404, message: 'Company not found' };
      }
      return { status: 200, message: 'Company updated successfully', company };
    } catch (error: any) {
      logger.error('Error updating company: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }

  // Delete a company entry
  async deleteCompany(companyId: string) {
    try {
      const company = await Company.findByIdAndDelete(companyId).populate('userId');
      if (!company) {
        return { status: 404, message: 'Company not found' };
      }
      return { status: 200, message: 'Company deleted successfully' };
    } catch (error: any) {
      logger.error('Error deleting company: %o', error);
      return { status: 500, message: 'Server error. Try again later.', error: error.message };
    }
  }
}

export default new CompanyService();