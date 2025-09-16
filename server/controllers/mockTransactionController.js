import Order from '../models/order.js';

export const createMockTransaction = async (req, res) => {
  try {
    const { amount, email, first_name, last_name, phone_number, payment_method, cartItems } = req.body;

    if (!amount || !email || !first_name || !last_name || !phone_number || !payment_method || !cartItems) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // simulate payment delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // ✅ Create order ONLY AFTER payment
    const order = new Order({
      user: req.user._id,
      items: cartItems.map(item => ({ food: item.food, qty: item.qty })),
      totalPrice: amount,
      status: 'Paid' // immediately paid
    });
    await order.save();

    res.json({
      success: true,
      message: 'Payment processed successfully',
      orderId: order._id
    });

  } catch (err) {
    console.error('Mock transaction error:', err);
    res.status(500).json({ message: 'Payment processing failed', error: err.message });
  }
};
