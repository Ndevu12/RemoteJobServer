import { Router } from 'express';
import AccountController from '../controllers/accountController';
import multer from '../middleware/Uploader'
import { isAdminAuth, isAuth } from '../middleware/isAuth';

const router = Router();

// Get user information
router.get('/:userId', AccountController.getUserInfo);

// Update user information
router.put('/', isAuth, multer.single('profileImage'), AccountController.updateUser);

// Delete user
router.delete('/:userId', isAdminAuth, AccountController.deleteUser);

export default router;
