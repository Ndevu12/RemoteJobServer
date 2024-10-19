import { Router } from 'express';
import JobController from '../controllers/jobController';
import { isAuth } from '../middleware/isAuth';
import multer from '../middleware/Uploader'

const router = Router();

// Route to get all jobs
router.get('/jobs', JobController.getAllJobs);
router.post('/jobs', isAuth, JobController.createJob);
router.get('/jobs/:jobId', JobController.getJobById);
router.put('/jobs/:jobId', isAuth, JobController.updateJob);
router.delete('/jobs/:jobId', isAuth, JobController.deleteJob);

// Apply routes
router.post('/jobs/:jobId/apply/existing', isAuth , JobController.applyWithExistingCV);
router.post('/jobs/:jobId/apply/new', isAuth, multer.single('cv'), JobController.applyWithNewCV);

export default router;