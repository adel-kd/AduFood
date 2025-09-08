import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  items: [
    {
      food: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Food' },
      qty: { type: Number, required: true, default: 1 },
    },
  ],
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Delivered'],
    default: 'Pending',
  },
}, {
  timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
