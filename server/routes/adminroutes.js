// routes/adminRoutes.js
import express from 'express';
import { getAnalytics } from '../controllers/admincontroller.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';


const router = express.Router();
router.get('/analytics', protect, admin, getAnalytics);
export default router;
