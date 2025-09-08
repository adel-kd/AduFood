import Order from '../models/order.js';

export const placeOrder = async (req, res) => {
  const userId = req.user._id;
  const { items, totalPrice } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    const order = new Order({
      user: userId,
      items,
      totalPrice,
      status: 'Pending',
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error placing order' });
  }
};

export const getUserOrders = async (req, res) => {
  const userId = req.user._id;

  try {
    const orders = await Order.find({ user: userId }).populate('items.food');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching orders' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('items.food').populate('user', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching all orders' });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating order' });
  }
};


export const getOrderAnalytics = async (req, res) => {
  try {
    // 1. Total Orders Count
    const totalOrders = await Order.countDocuments();

    // 2. Total Revenue
    const totalRevenueResult = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
    ]);
    const totalRevenue = totalRevenueResult[0]?.totalRevenue || 0;

    // 3. Orders by Status (Pending, Delivered, Cancelled, etc.)
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // 4. Top 5 Most Ordered Foods
    const topFoodsResult = await Order.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.food", totalOrdered: { $sum: "$items.quantity" } } },
      { $sort: { totalOrdered: -1 } },
      { $limit: 5 }
    ]);

    // Populate food details for top foods
    const topFoods = await Food.find({
      _id: { $in: topFoodsResult.map(f => f._id) }
    });

    // Merge quantity count into food info
    const topFoodsWithCount = topFoods.map(food => {
      const match = topFoodsResult.find(f => f._id.toString() === food._id.toString());
      return {
        food,
        totalOrdered: match?.totalOrdered || 0
      };
    });

    res.json({
      totalOrders,
      totalRevenue,
      ordersByStatus,
      topFoods: topFoodsWithCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error generating analytics' });
  }
};


export const filterOrdersByStatus = async (req, res) => {
  const { status } = req.params;

  try {
    const orders = await Order.find({ status })
      .populate('items.food')
      .populate('user', 'name email');

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error filtering orders' });
  }
};
