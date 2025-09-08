import Order from '../models/order.js';
import Food from '../models/Food.js';

export const getAnalytics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, revenue: { $sum: '$totalPrice' } } }
    ]);
    const topFoods = await Food.find().sort({ rating: -1 }).limit(5);

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.revenue || 0,
      topFoods
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching analytics' });
  }
};
