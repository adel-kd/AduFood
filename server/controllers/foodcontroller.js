import Food from '../models/Food.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Food.distinct('category');
  res.json({ categories });
});

// @desc    Get all foods with optional keyword, category & pagination
// @route   GET /api/foods
// @access  Public
export const getFoods = asyncHandler(async (req, res) => {
  const pageSize = 100;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {};

  // This should be an empty object when no category is specified
  const category = req.query.category
    ? { category: req.query.category }
    : {};

  const filter = { ...keyword, ...category };

  const count = await Food.countDocuments(filter);
  const foods = await Food.find(filter)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ foods, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get single food by ID
// @route   GET /api/foods/:id
// @access  Public
export const getFoodById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid food ID');
  }

  const food = await Food.findById(id);
  if (food) {
    res.json(food);
  } else {
    res.status(404);
    throw new Error('Food not found');
  }
});

// @desc    Create new food
// @route   POST /api/foods
// @access  Admin
export const createFood = asyncHandler(async (req, res) => {
  const { name, price, description, image, category } = req.body;

  if (!name || !price || !description || !category) {
    res.status(400);
    throw new Error('Name, price, description, and category are required');
  }

  const food = new Food({
    name,
    price,
    description,
    image,
    category,
  });

  const createdFood = await food.save();
  res.status(201).json(createdFood);
});

// @desc    Update food
// @route   PUT /api/foods/:id
// @access  Admin
export const updateFood = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid food ID');
  }

  const food = await Food.findById(id);
  if (!food) {
    res.status(404);
    throw new Error('Food not found');
  }

  const { name, price, description, image, category } = req.body;

  food.name = name || food.name;
  food.price = price || food.price;
  food.description = description || food.description;
  food.image = image || food.image;
  food.category = category || food.category;

  const updatedFood = await food.save();
  res.json(updatedFood);
});

// @desc    Delete food
// @route   DELETE /api/foods/:id
// @access  Admin
export const deleteFood = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid food ID');
  }

  const food = await Food.findById(id);
  if (!food) {
    res.status(404);
    throw new Error('Food not found');
  }

  await Food.findByIdAndDelete(id);
  res.json({ message: 'Food removed successfully' });
});

// @desc    Create a new review
// @route   POST /api/foods/:id/reviews
// @access  Private
export const createFoodReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid food ID');
  }
  if (!rating || !comment) {
    res.status(400);
    throw new Error('Rating and comment are required');
  }

  const food = await Food.findById(id);
  if (!food) {
    res.status(404);
    throw new Error('Food not found');
  }

  const alreadyReviewed = food.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Food already reviewed');
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  food.reviews.push(review);
  food.numReviews = food.reviews.length;
  food.rating =
    food.reviews.reduce((acc, item) => item.rating + acc, 0) /
    food.reviews.length;

  await food.save();
  res.status(201).json({ message: 'Review added', review });
});

// @desc    Update own review
// @route   PUT /api/foods/:id/reviews/:reviewId
// @access  Private
export const updateReview = asyncHandler(async (req, res) => {
  const { id, reviewId } = req.params;
  const { rating, comment } = req.body;

  const food = await Food.findById(id);
  if (!food) {
    res.status(404);
    throw new Error('Food not found');
  }

  const review = food.reviews.find(
    (r) => r._id.toString() === reviewId && r.user.toString() === req.user._id.toString()
  );

  if (!review) {
    res.status(404);
    throw new Error('Review not found or unauthorized');
  }

  review.rating = rating || review.rating;
  review.comment = comment || review.comment;

  food.rating =
    food.reviews.reduce((acc, item) => item.rating + acc, 0) /
    food.reviews.length;

  await food.save();
  res.json({ message: 'Review updated', review });
});

// @desc    Delete own review
// @route   DELETE /api/foods/:id/reviews/:reviewId
// @access  Private
export const deleteReview = asyncHandler(async (req, res) => {
  const { id, reviewId } = req.params;

  const food = await Food.findById(id);
  if (!food) {
    res.status(404);
    throw new Error('Food not found');
  }

  const reviewIndex = food.reviews.findIndex(
    (r) => r._id.toString() === reviewId && r.user.toString() === req.user._id.toString()
  );

  if (reviewIndex === -1) {
    res.status(404);
    throw new Error('Review not found or unauthorized');
  }

  food.reviews.splice(reviewIndex, 1);
  food.numReviews = food.reviews.length;
  food.rating =
    food.reviews.length > 0
      ? food.reviews.reduce((acc, item) => item.rating + acc, 0) / food.reviews.length
      : 0;

  await food.save();
  res.json({ message: 'Review deleted' });
});

// @desc    Get top rated foods
// @route   GET /api/foods/top
// @access  Public
export const getTopFoods = asyncHandler(async (req, res) => {
  const foods = await Food.find({}).sort({ rating: -1 }).limit(5);
  res.json({ foods });
});