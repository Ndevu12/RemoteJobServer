import { Router } from 'express';
import UserController from '../controllers/userController';
import multer from '../middleware/Uploader';

const router = Router();

// Authentication routes
router.post('/auth/register', UserController.registerUser);
router.post('/auth/login', UserController.loginUser);

// Account routes
router.get('/account/:userId', UserController.getUserInfo);
router.put('/account/update/:userId', multer.single('profileImage'), UserController.updateUser);
router.delete('/account/delete/:userId', UserController.deleteUser);

// Get user by email route
router.get('/account/email/:email', UserController.getUserByEmail);

export default router;