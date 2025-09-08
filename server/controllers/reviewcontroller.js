import Review from '../models/review.js';
import Food from '../models/Food.js';

export const createReview = async (req, res) => {
  const { foodId, rating, comment } = req.body;
  const userId = req.user._id;

  const review = new Review({ food: foodId, user: userId, rating, comment });
  await review.save();

  const reviews = await Review.find({ food: foodId });
  const avgRating =
    reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

  await Food.findByIdAndUpdate(foodId, {
    rating: avgRating,
    numReviews: reviews.length
  });

  res.status(201).json({ message: 'Review added' });
};
