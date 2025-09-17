import express from 'express';
import {
  getUserAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '../controllers/addressController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getUserAddresses)
  .post(protect, addAddress);

router.route('/:id')
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);

router.route('/:id/default')
  .patch(protect, setDefaultAddress);

export default router;