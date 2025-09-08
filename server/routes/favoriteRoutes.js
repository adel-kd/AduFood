// routes/favoriteRoutes.js
import express from 'express';
import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from '../controllers/favoritecontroller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:foodId', protect, addFavorite);
router.delete('/:foodId', protect, removeFavorite);
router.get('/', protect, getFavorites);

export default router;
