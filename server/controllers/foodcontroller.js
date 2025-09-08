import Food from '../models/Food.js';
import asyncHandler from 'express-async-handler';

// @desc    Get all foods with optional keyword, category & pagination
// @route   GET /api/foods
// @access  Public
export const getFoods = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: 'i' } }
    : {};

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
  const food = await Food.findById(req.params.id);
  if (food) {
    res.json(food);
  } else {
    res.status(404).json({ message: 'Food not found' });
  }
});

// @desc    Create new food
// @route   POST /api/foods
// @access  Admin
export const createFood = asyncHandler(async (req, res) => {
  const { name, price, description, image, category } = req.body;

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
  const { name, price, description, image, category } = req.body;

  const food = await Food.findById(req.params.id);

  if (food) {
    food.name = name || food.name;
    food.price = price || food.price;
    food.description = description || food.description;
    food.image = image || food.image;
    food.category = category || food.category;

    const updatedFood = await food.save();
    res.json(updatedFood);
  } else {
    res.status(404).json({ message: 'Food not found' });
  }
});

// @desc    Delete food
// @route   DELETE /api/foods/:id
// @access  Admin
export const deleteFood = asyncHandler(async (req, res) => {
  const food = await Food.findById(req.params.id);

  if (food) {
    await food.remove();
    res.json({ message: 'Food removed' });
  } else {
    res.status(404).json({ message: 'Food not found' });
  }
});

// @desc    Create a new review
// @route   POST /api/foods/:id/reviews
// @access  Private
export const createFoodReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const food = await Food.findById(req.params.id);

  if (food) {
    const alreadyReviewed = food.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400).json({ message: 'Food already reviewed' });
      return;
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
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404).json({ message: 'Food not found' });
  }
});

// @desc    Get top rated foods
// @route   GET /api/foods/top
// @access  Public
export const getTopFoods = asyncHandler(async (req, res) => {
  const foods = await Food.find({}).sort({ rating: -1 }).limit(5);
  res.json(foods);
});
