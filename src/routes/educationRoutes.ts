import { Router } from 'express';
import EducationController from '../controllers/educationController';
import { isAuth } from '../middleware/isAuth';

const router = Router();

router.post('/', isAuth, EducationController.createEducation);
router.get('/:educationId', EducationController.getEducationById);
router.put('/:educationId', isAuth, EducationController.updateEducation);
router.delete('/:educationId', isAuth, EducationController.deleteEducation);

export default router;
