import Order from "../models/order.js";
import Food from "../models/Food.js";

/**
 * ─────────────────────────────
 * CREATE ORDER
 * ─────────────────────────────
 */
export const placeOrder = async (req, res) => {
  const userId = req.user._id;
  const { items, totalPrice } = req.body;

  try {
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const formattedItems = items.map((item) => {
      const foodId = item.food?._id || item.food || item._id;

      if (!foodId) {
        throw new Error("Invalid item format: missing food ID");
      }

      return {
        food: foodId,
        qty: item.qty || 1,
        price: item.price || 0,
      };
    });

    const order = new Order({
      user: userId,
      items: formattedItems,
      totalPrice: totalPrice || 0,
      status: "Pending",
    });

    await order.save();

    await order.populate("items.food", "name description price image");

    res.status(201).json(order);
  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({
      message: "Server error placing order: " + error.message,
    });
  }
};

/**
 * ─────────────────────────────
 * USER ORDERS
 * ─────────────────────────────
 */
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.food", "name description price image")
      .sort({ createdAt: -1 })
      .lean();

    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Server error fetching orders" });
  }
};

/**
 * ─────────────────────────────
 * ALL ORDERS (ADMIN)
 * ─────────────────────────────
 */
export const getAllOrders = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({})
        .populate("items.food", "name description price image")
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Order.countDocuments(),
    ]);

    res.json({
      orders,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ message: "Server error fetching all orders" });
  }
};

/**
 * ─────────────────────────────
 * UPDATE STATUS (ADMIN)
 * ─────────────────────────────
 */
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const validStatuses = [
      "Pending",
      "Confirmed",
      "Delivered",
      "Cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
      .populate("items.food", "name description price image")
      .populate("user", "name email")
      .lean();

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      message: "Server error updating order: " + error.message,
    });
  }
};

/**
 * ─────────────────────────────
 * FILTER BY STATUS
 * ─────────────────────────────
 */
export const filterOrdersByStatus = async (req, res) => {
  const { status } = req.params;

  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ status })
        .populate("items.food", "name description price image")
        .populate("user", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Order.countDocuments({ status }),
    ]);

    res.json({
      orders,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error("Error filtering orders:", error);
    res.status(500).json({
      message: "Server error filtering orders",
    });
  }
};

/**
 * ─────────────────────────────
 * DELETE ORDER
 * ─────────────────────────────
 */
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!["Delivered", "Pending", "Cancelled"].includes(order.status)) {
      return res.status(400).json({
        message:
          "Only Delivered, Pending, or Cancelled orders can be deleted",
      });
    }

    await order.deleteOne();

    res.json({ message: "Order deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error deleting order",
    });
  }
};

/**
 * ─────────────────────────────
 * ANALYTICS (UNCHANGED BUT SAFE)
 * ─────────────────────────────
 */
export const getOrderAnalytics = async (req, res) => {
  try {
    const [totalOrders, foodsCount] = await Promise.all([
      Order.countDocuments(),
      Food.countDocuments(),
    ]);

    const revenueAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    const statusAgg = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const getCount = (s) =>
      statusAgg.find((x) => x._id === s)?.count || 0;

    const deliveredOrders = getCount("Delivered");

    const completionRate = totalOrders
      ? ((deliveredOrders / totalOrders) * 100).toFixed(1)
      : 0;

    const averageOrderValue = totalOrders
      ? (totalRevenue / totalOrders).toFixed(2)
      : 0;

    const topFoodsAgg = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.food",
          totalOrdered: { $sum: "$items.qty" },
        },
      },
      { $sort: { totalOrdered: -1 } },
      { $limit: 5 },
    ]);

    const topFoodsDocs = await Food.find(
      { _id: { $in: topFoodsAgg.map((f) => f._id) } },
      "name price image category rating numReviews"
    ).lean();

    const topFoods = topFoodsDocs.map((f) => {
      const match = topFoodsAgg.find(
        (m) => m._id.toString() === f._id.toString()
      );
      return { ...f, totalOrdered: match?.totalOrdered || 0 };
    });

    res.json({
      totalOrders,
      totalRevenue,
      averageOrderValue: Number(averageOrderValue),
      totalFoods: foodsCount,
      completionRate: Number(completionRate),
      pendingOrders: getCount("Pending"),
      confirmedOrders: getCount("Confirmed"),
      deliveredOrders: getCount("Delivered"),
      cancelledOrders: getCount("Cancelled"),
      topFoods,
      topFood: topFoods[0] || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error generating analytics",
    });
  }
};