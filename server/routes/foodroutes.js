import express from 'express';
import {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  createFoodReview,
  updateReview,
  deleteReview,
  getTopFoods,
  getCategories 
} from '../controllers/foodcontroller.js';
import { protect} from '../middleware/authMiddleware.js';

import {  admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getFoods)
  .post(protect, admin, createFood);

router.route('/categories')
  .get(getCategories);

router.route('/top')
  .get(getTopFoods);

router.route('/:id')
  .get(getFoodById)
  .put(protect, admin, updateFood)
  .delete(protect, admin, deleteFood);

router.route('/:id/reviews')
  .post(protect, createFoodReview);

router.route('/:id/reviews/:reviewId')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

export default router;