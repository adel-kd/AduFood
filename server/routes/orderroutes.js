// routes/orderRoutes.js

import express from 'express';
import {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderAnalytics,
  filterOrdersByStatus,
} from '../controllers/ordercontroller.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// User places an order
router.post('/', protect, placeOrder);

// Get logged-in user's orders
router.get('/myorders', protect, getUserOrders);

// Admin: Get all orders
router.get('/', protect, admin, getAllOrders);

// Admin: Filter orders by status
router.get('/status/:status', protect, admin, filterOrdersByStatus); // e.g., /api/orders/status/Delivered

// Admin: Update order status (e.g., mark as Delivered)
router.put('/:id/status', protect, admin, updateOrderStatus);

// Admin: Get analytics (total revenue, top foods, etc.)
router.get('/analytics/data', protect, admin, getOrderAnalytics);

export default router;
