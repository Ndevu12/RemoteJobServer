import { Request, Response } from 'express';
import CompanyService from '../services/companyService';
import logger from '../utils/logger';
import { companySchema } from '../helpers/validator/companyValidation';

class CompanyController {
  // Create a new company entry
  async createCompany(req: Request, res: Response) {
    try {
      if (!req.user) {
        logger.error(`User not authenticated, req.user: ${req.user}`, { label: 'CompanyController' });
        return res.status(400).json({ message: 'User not authenticated' });
      }

      // Validate the input
      const { error } = companySchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: 'Invalid input', error: error.details });
      }

      const userId = req.user.id; // Use req.userId from the middleware
      const result = await CompanyService.createCompany(req.body, userId);
      return res.status(result.status).json({ message: result.message, company: result.company });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Get a company entry by ID
  async getCompanyById(req: Request, res: Response) {
    try {
      const { companyId } = req.params;
      const result = await CompanyService.getCompanyById(companyId);
      return res.status(result.status).json({ message: result.message, company: result.company });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Update a company entry
  async updateCompany(req: Request, res: Response) {
    try {
      // Validate the input
      const { error } = companySchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: 'Invalid input', error: error.details });
      }

      const { companyId } = req.params;
      const result = await CompanyService.updateCompany(companyId, req.body);
      return res.status(result.status).json({ message: result.message, company: result.company });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }

  // Delete a company entry
  async deleteCompany(req: Request, res: Response) {
    try {
      const { companyId } = req.params;
      const result = await CompanyService.deleteCompany(companyId);
      return res.status(result.status).json({ message: result.message });
    } catch (error: any) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
}

export default new CompanyController();