import Review from '../models/review.js';
import Food from '../models/Food.js';

export const createReview = async (req, res) => {
  try {
    const { foodId, rating, comment } = req.body;
    const userId = req.user._id;

    // Check duplicate is now enforced at DB level by unique index {food, user}
    // but we still return a friendly error on duplicate key error
    const review = new Review({ food: foodId, user: userId, rating, comment });
    await review.save();

    await updateFoodRating(foodId);

    res.status(201).json({ message: 'Review added', review });
  } catch (error) {
    // MongoDB duplicate key error code
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this food' });
    }
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
      .sort({ createdAt: -1 })
      .lean(); // ✅ read-only list — lean() for speed

    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ FIX: Single aggregation instead of Review.find() + JS reduce
//    Before: fetched ALL review documents into memory, then reduced in JS
//    After:  DB computes count + avg in one aggregation pipeline step
const updateFoodRating = async (foodId) => {
  const agg = await Review.aggregate([
    { $match: { food: foodId } },
    {
      $group: {
        _id: '$food',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);

  if (agg.length === 0) {
    await Food.findByIdAndUpdate(foodId, { rating: 0, numReviews: 0 });
  } else {
    await Food.findByIdAndUpdate(foodId, {
      rating: agg[0].avgRating,
      numReviews: agg[0].count
    });
  }
};