// routes/reviewRoutes.js
import express from 'express';
import { 
  createReview, 
  updateReview, 
  deleteReview, 
  getFoodReviews 
} from '../controllers/reviewcontroller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createReview);
router.put('/:reviewId', protect, updateReview);
router.delete('/:reviewId', protect, deleteReview);
router.get('/:foodId', getFoodReviews);

export default router;