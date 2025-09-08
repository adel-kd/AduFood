import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
    rating: { type: Number, required: true },
    comment: { type: String },
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);
export default Review;
