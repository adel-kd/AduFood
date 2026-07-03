import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true }
);

// ✅ Compound unique index — one review per user per food item
reviewSchema.index({ food: 1, user: 1 }, { unique: true });
// ✅ Index on food alone for fast rating recalculation aggregation
reviewSchema.index({ food: 1 });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
