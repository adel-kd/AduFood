import express from 'express';
import {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderAnalytics,   // ✅ make sure this is imported
  filterOrdersByStatus,
  deleteOrder
} from '../controllers/ordercontroller.js';
import { protect} from '../middleware/authMiddleware.js';
import {  admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.post('/', protect, placeOrder);
router.get('/myorders', protect, getUserOrders);
router.get('/all', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

router.delete('/:id', protect, deleteOrder); 


router.get('/analytics/data', protect, admin, getOrderAnalytics);

router.get('/status/:status', protect, admin, filterOrdersByStatus);

export default router;

 
