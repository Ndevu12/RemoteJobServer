import { Router } from 'express';
import AuthController from '../controllers/authController';

const router = Router();

// Register a new user
router.post('/register', AuthController.register);

// Login a user
router.post('/login', AuthController.login);

// Update user email
router.put('/update-email/:userId', AuthController.updateUserEmail);

// Update user password
router.put('/update-password/:userId', AuthController.updateUserPassword);

export default router;