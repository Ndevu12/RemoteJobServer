import { Router } from 'express';
import JobController from '../controllers/jobController';
import { isAuth } from '../middleware/isAuth';

const router = Router();

// Route to get all jobs
router.get('/jobs', JobController.getAllJobs);
router.post('/jobs', isAuth, JobController.createJob);
router.get('/jobs/:jobId', JobController.getJobById);
router.put('/jobs/:jobId', isAuth, JobController.updateJob);
router.delete('/jobs/:jobId', isAuth, JobController.deleteJob);

export default router;