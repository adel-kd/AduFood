import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    chapaReference: {
      type: String,
      required: true,
      unique: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "ETB",
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },

    items: [
      {
        food: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
        qty: Number,
        price: Number,
      },
    ],

    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User.addresses",
    },

    promoCode: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

transactionSchema.index({ userId: 1 });

export default mongoose.model("Transaction", transactionSchema);
