import jobRoutes from './jobRoutes';
import authRoutes from './userRoute';
import accountRoutes from './accountRoutes';
import express, { Router } from 'express';
import path from 'path';

const router = Router();

// router.use('/images', express.static(path.join(__dirname, '..', 'images')));
// router.use('/jobs', jobRoutes)
// router.use('/account', accountRoutes)
router.use('/user', authRoutes)


export default router;