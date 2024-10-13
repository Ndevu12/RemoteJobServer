import { Router } from 'express';
import AccountController from '../controllers/accountController';
import multer from '../middleware/Uploader'

const router = Router();

// Get user information
router.get('/:userId', AccountController.getUserInfo);

// Update user information
router.put('/:userId', multer.single('profileImage'), AccountController.updateUser);

// Delete user
router.delete('/:userId', AccountController.deleteUser);

export default router;

// import { isAuth } from '../middleware/isAuth'

// const router = Router();

// const accountControllers = new Account();

// router.get('/', isAuth, accountControllers.getAccountInfo);

// export default router;