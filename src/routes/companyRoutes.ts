import { Router } from 'express';
import CompanyController from '../controllers/companyController';
import { isAuth } from '../middleware/isAuth';

const router = Router();

router.post('/companies', isAuth, CompanyController.createCompany);
router.get('/companies/:companyId', CompanyController.getCompanyById);
router.put('/companies/:companyId', isAuth, CompanyController.updateCompany);
router.delete('/companies/:companyId', isAuth, CompanyController.deleteCompany);

export default router;
