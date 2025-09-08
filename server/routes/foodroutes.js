// routes/foodRoutes.js

import express from "express";
import {
  getFoods,
  getFoodById,          // ✅ New
  createFood,
  updateFood,
  deleteFood,
  createFoodReview,      // ✅ New
  getTopFoods            // ✅ New
} from "../controllers/foodcontroller.js";

import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// @route   GET /api/foods
// @desc    Get all foods (with filtering/pagination)
router.get("/", getFoods);

// @route   GET /api/foods/top
// @desc    Get top rated foods
router.get("/top", getTopFoods); // ✅ New route (MUST be before /:id)

// @route   GET /api/foods/:id
// @desc    Get food by ID
router.get("/:id", getFoodById); // ✅ New

// @route   POST /api/foods/:id/reviews
// @desc    Add review to food
router.post("/:id/reviews", protect, createFoodReview); // ✅ New

// Only admins can create/update/delete foods
router.post("/", protect, admin, createFood);
router.put("/:id", protect, admin, updateFood);
router.delete("/:id", protect, admin, deleteFood);

export default router;
