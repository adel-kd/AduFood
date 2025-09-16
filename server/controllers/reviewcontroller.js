import Review from '../models/review.js';
import Food from '../models/Food.js';

export const createReview = async (req, res) => {
  try {
    const { foodId, rating, comment } = req.body;
    const userId = req.user._id;

    // Check if user already has a review for this food
    const existingReview = await Review.findOne({ food: foodId, user: userId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this food' });
    }

    const review = new Review({ food: foodId, user: userId, rating, comment });
    await review.save();

    await updateFoodRating(foodId);

    res.status(201).json({ message: 'Review added', review });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    const review = await Review.findOne({ _id: reviewId, user: userId });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    await updateFoodRating(review.food);

    res.status(200).json({ message: 'Review updated', review });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findOne({ _id: reviewId, user: userId });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const foodId = review.food;
    await Review.findByIdAndDelete(reviewId);

    await updateFoodRating(foodId);

    res.status(200).json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getFoodReviews = async (req, res) => {
  try {
    const { foodId } = req.params;
    
    const reviews = await Review.find({ food: foodId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function to update food rating
const updateFoodRating = async (foodId) => {
  const reviews = await Review.find({ food: foodId });
  
  if (reviews.length === 0) {
    await Food.findByIdAndUpdate(foodId, {
      rating: 0,
      numReviews: 0
    });
    return;
  }

  const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
  
  await Food.findByIdAndUpdate(foodId, {
    rating: avgRating,
    numReviews: reviews.length
  });
};