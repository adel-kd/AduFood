// server/models/Order.js
import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  items: [
    {
      food: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Food' },
      qty: { type: Number, required: true, default: 1 },
      price: { type: Number, required: true }
    },
  ],
  totalPrice: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  promoCode: { type: String },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  // ✅ Chapa transaction reference — set when payment is initialized
  txRef: {
    type: String,
  },
}, {
  timestamps: true,
});

// ✅ Indexes — prevents full collection scans on the most common queries
orderSchema.index({ user: 1, createdAt: -1 });  // getUserOrders
orderSchema.index({ status: 1, createdAt: -1 }); // filterOrdersByStatus + admin list
orderSchema.index({ txRef: 1 }, { sparse: true }); // Chapa callback lookup

const Order = mongoose.model('Order', orderSchema);

export default Order;