// server/controllers/orderController.js
import Order from '../models/order.js';
import Food from '../models/Food.js';

export const placeOrder = async (req, res) => {
  const userId = req.user._id;
  const { items, totalPrice } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    const formattedItems = items.map(item => {
      if (!item.food) {
        throw new Error('Invalid item format: missing food ID');
      }
      return {
        food: item.food,
        qty: item.qty || 1,
        price: item.price || 0
      };
    });

    const order = new Order({
      user: userId,
      items: formattedItems,
      totalPrice,
      status: 'Pending',
    });

    const createdOrder = await order.save();
    
    const populatedOrder = await Order.findById(createdOrder._id)
      .populate('items.food', 'name description price image');
      
    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error('Order placement error:', error);
    res.status(500).json({ message: 'Server error placing order: ' + error.message });
  }
};

export const getUserOrders = async (req, res) => {
  const userId = req.user._id;

  try {
    const orders = await Order.find({ user: userId })
      .populate({
        path: 'items.food',
        select: 'name description price image'
      })
      .sort({ createdAt: -1 });

    console.log('Fetched user orders:', orders.map(order => ({
      id: order._id,
      items: order.items.map(item => ({
        food: item.food?.name,
        qty: item.qty,
        price: item.price
      }))
    })));

    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('items.food', 'name description price image')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Server error fetching all orders' });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log('Update status request:', { id, status });

  try {
    const validStatuses = ['Pending', 'Confirmed', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(id);
    if (!order) {
      console.log('Order not found:', id);
      return res.status(404).json({ message: 'Order not found' });
    }

    console.log('Updating order from', order.status, 'to', status);

    order.status = status;
    const updatedOrder = await order.save();

    const populatedOrder = await Order.findById(updatedOrder._id)
      .populate('items.food', 'name description price image')
      .populate('user', 'name email');

    res.json(populatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error updating order: ' + error.message });
  }
};

export const getOrderAnalytics = async (req, res) => {
  try {
    const [totalOrders, foodsCount] = await Promise.all([
      Order.countDocuments(),
      Food.countDocuments()
    ])

    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ])
    const totalRevenue = revenueAgg[0]?.total || 0

    const statusAgg = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ])
    const pendingOrders = statusAgg.find(s => s._id === 'Pending')?.count || 0
    const confirmedOrders = statusAgg.find(s => s._id === 'Confirmed')?.count || 0
    const deliveredOrders = statusAgg.find(s => s._id === 'Delivered')?.count || 0
    const cancelledOrders = statusAgg.find(s => s._id === 'Cancelled')?.count || 0

    const completionRate = totalOrders
      ? ((deliveredOrders / totalOrders) * 100).toFixed(1)
      : 0

    const averageOrderValue = totalOrders
      ? (totalRevenue / totalOrders).toFixed(2)
      : 0

    const reviewAgg = await Food.aggregate([
      { $unwind: { path: '$reviews', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: { $cond: [{ $ifNull: ['$reviews', false] }, 1, 0] } },
          avgRating: { $avg: '$rating' }
        }
      }
    ])
    const totalReviews = reviewAgg[0]?.totalReviews || 0
    const averageRating = (reviewAgg[0]?.avgRating || 0).toFixed(1)

    const topFoodsAgg = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.food', totalOrdered: { $sum: '$items.qty' } } },
      { $sort: { totalOrdered: -1 } },
      { $limit: 5 }
    ])
    const topFoodsDocs = await Food.find({
      _id: { $in: topFoodsAgg.map(f => f._id) }
    })

    const topFoods = topFoodsDocs.map(f => {
      const match = topFoodsAgg.find(m => m._id.toString() === f._id.toString())
      return { ...f.toObject(), totalOrdered: match?.totalOrdered || 0 }
    })

    res.json({
      totalOrders,
      totalRevenue,
      averageOrderValue: Number(averageOrderValue),
      totalFoods: foodsCount,
      pendingOrders,
      confirmedOrders,
      deliveredOrders,
      cancelledOrders,
      completionRate: Number(completionRate),
      totalReviews,
      averageRating: Number(averageRating),
      topFoods,
      topFood: topFoods[0] || null
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error generating analytics' })
  }
}

export const filterOrdersByStatus = async (req, res) => {
  const { status } = req.params;

  try {
    const orders = await Order.find({ status })
      .populate('items.food', 'name description price image')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Error filtering orders:', error);
    res.status(500).json({ message: 'Server error filtering orders' });
  }
};


export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    // ✅ Allow deletion for Delivered, Pending, or Cancelled orders
    if (order.status !== "Delivered" && order.status !== "Pending" && order.status !== "Cancelled") {
      return res.status(400).json({ message: "Only Delivered orders can be deleted" });
    }

    await order.deleteOne();
    res.json({ message: "Order deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error deleting order" });
  }
};