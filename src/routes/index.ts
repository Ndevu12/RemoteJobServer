import jobRoutes from './jobRoutes';
import accountRoutes from './accountRoutes';
import { Router } from 'express';
import path from 'path';
import authRoutes from './authRoutes';
import addressRoutes from './addressRoutes';
import educationRoutes from './educationRoutes';
import skillRoutes from './skillRoutes';
import experienceRoutes from './experienceRoutes';
import companyRoutes from './companyRoutes';
import appliedJobRoutes from './appliedJobRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/account', accountRoutes);
router.use('/address', addressRoutes);
router.use('/education', educationRoutes);
router.use('/skills', skillRoutes);
router.use('/experiences', experienceRoutes);
router.use(companyRoutes);
router.use(appliedJobRoutes);
router.use(jobRoutes);

export default router;