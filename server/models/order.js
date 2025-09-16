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
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

export default Order;