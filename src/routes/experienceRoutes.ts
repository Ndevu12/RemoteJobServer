import { Router } from 'express';
import ExperienceController from '../controllers/experienceController';
import { isAuth } from '../middleware/isAuth';

const router = Router();

router.post('/', isAuth, ExperienceController.createExperience);
router.get('/:experienceId', ExperienceController.getExperienceById);
router.put('/:experienceId', isAuth, ExperienceController.updateExperience);
router.delete('/:experienceId', isAuth, ExperienceController.deleteExperience);

export default router;