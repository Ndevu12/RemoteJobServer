import jobRoutes from './jobRoutes';
import accountRoutes from './accountRoutes';
import express, { Router } from 'express';
import path from 'path';
import authRoutes from './authRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/account', accountRoutes);



export default router;