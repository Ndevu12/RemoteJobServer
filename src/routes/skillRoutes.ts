import { Router } from 'express';
import SkillController from '../controllers/skillController';
import { isAuth } from '../middleware/isAuth';

const router = Router();

router.post('/', isAuth, SkillController.createSkill);
router.get('/:skillId', SkillController.getSkillById);
router.put('/:skillId', isAuth, SkillController.updateSkill);
router.delete('/:skillId', isAuth, SkillController.deleteSkill);

export default router;
