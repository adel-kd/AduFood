import mongoose from 'mongoose';

// Define a sub-schema for reviews
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    image: String,

    category: {
      type: String,
      default: 'Uncategorized',
    },

    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Indexes — prevents full collection scans
// Text index on name for keyword search; category for filter queries
foodSchema.index({ name: 'text' });
foodSchema.index({ category: 1 });
foodSchema.index({ rating: -1 }); // for top-rated sort

const Food = mongoose.model('Food', foodSchema);
export default Food;
