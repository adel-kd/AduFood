// routes/cartRoutes.js
import express from 'express';
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} from '../controllers/cartcontroller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes protected
router.get('/', protect, getCart); // GET /api/cart
router.post('/', protect, addToCart); // POST /api/cart
router.delete('/:foodId', protect, removeFromCart); // DELETE /api/cart/:foodId
router.delete('/', protect, clearCart); // DELETE /api/cart

export default router;
