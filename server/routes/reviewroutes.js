// routes/reviewRoutes.js

import express from 'express';
import { createReview } from '../controllers/reviewcontroller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/', protect, createReview);
export default router;
