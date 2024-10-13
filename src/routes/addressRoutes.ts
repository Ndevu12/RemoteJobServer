import { Router } from 'express';
import AddressController from '../controllers/addressController';
import { isAuth } from '../middleware/isAuth'; // Import the isAuth middleware

const router = Router();

// Create a new address
router.post('/', isAuth, AddressController.createAddress);

// Get an address by ID
router.get('/:addressId', AddressController.getAddressById);

// Update an address
router.put('/:addressId', isAuth, AddressController.updateAddress);

// Delete an address
router.delete('/:addressId', isAuth, AddressController.deleteAddress);

export default router;