import { Router } from "express";
import { Job } from '../controllers/job'
import { isUserAuth } from '../middleware/isAuth'

const router = Router();
const jobControllers = new Job();

router.get('/', jobControllers.getJobs);
router.get('/:id', jobControllers.getJob);
router.put('/:id', jobControllers.putJob);
router.delete('/:id', jobControllers.deleteJob);
router.post('/apply/:id', isUserAuth, jobControllers.postApplyJob);

export default router;