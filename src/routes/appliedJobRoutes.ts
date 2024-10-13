import { Router } from 'express';
import AppliedJobController from '../controllers/appliedJobController';
import { isAuth } from '../middleware/isAuth';

const router = Router();

router.post('/applied-jobs', isAuth, AppliedJobController.createAppliedJob);
router.get('/applied-jobs/:appliedJobId', isAuth, AppliedJobController.getAppliedJobById);
router.put('/applied-jobs/:appliedJobId', isAuth, AppliedJobController.updateAppliedJob);
router.delete('/applied-jobs/:appliedJobId', isAuth, AppliedJobController.deleteAppliedJob);

export default router;