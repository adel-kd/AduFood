import { v4 as uuidv4 } from "uuid";
import Order from "../models/order.js";
import Transaction from "../models/Transaction.js";
import Cart from "../models/cart.js";
import {
  initializePayment,
  verifyPayment,
} from "../service/chapaService.js";

/**
 * VERIFY + UPDATE ORDER
 */
const verifyAndUpdateOrder = async (txRef) => {
  const { status: chapaStatus, data: chapaData } =
    await verifyPayment(txRef);

  const order = await Order.findOne({ txRef });

  if (!order) {
    throw new Error(`No order found for txRef: ${txRef}`);
  }

  if (chapaStatus === "success") {
    order.status = "Confirmed";

    // clear cart
    await Cart.findOneAndUpdate(
      { user: order.user },
      { $set: { items: [] } }
    );

    order.promoCode = null;
  } else if (chapaStatus === "failed") {
    order.status = "Cancelled";
  }

  if (chapaStatus !== "pending") {
    await order.save();
  }

  await Transaction.findOneAndUpdate(
    { chapaReference: txRef },
    {
      status: chapaStatus,
      chapaVerifiedRef:
        chapaData?.reference || chapaData?.id || null,
    }
  );

  return { order, chapaStatus };
};

/**
 * INIT PAYMENT
 */
export const initializePaymentHandler = async (req, res) => {
  try {
    const { items, phone, promoCode, discountAmount, deliveryFee } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    const total = items.reduce((sum, item) => {
      return sum + (Number(item.price) || 0) * (Number(item.qty) || 1);
    }, 0);

    const finalEmail = req.user?.email || "guest@adufood.com";
    const userName = req.user?.name || "Customer User";

    const firstName = userName.split(" ")[0] || "Customer";
    const lastName = userName.split(" ").slice(1).join(" ") || "User";

    const txRef = `ADU-${uuidv4()}`;

    // 🔥 FIXED: correct schema mapping
    const formattedItems = items.map((item) => ({
      food: item.food?._id || item.food,
      qty: item.qty || item.quantity || 1,
      price: item.price || 0,
    }));

    const order = await Order.create({
      user: req.user._id,
      items: formattedItems,
      totalPrice: total,
      deliveryFee: deliveryFee || 0,
      discountAmount: discountAmount || 0,
      promoCode: promoCode || null,
      status: "Pending",
      txRef,
    });

    await Transaction.create({
      orderId: order._id,
      userId: req.user._id,
      amount: total,
      currency: "ETB",
      email: finalEmail,
      phone: phone || null,
      chapaReference: txRef,
      status: "pending",
    });

    const backendUrl =
      process.env.BACKEND_URL || "http://localhost:5000";

    const frontendUrl =
      process.env.FRONTEND_URL || "http://localhost:5173";

    const chapaPayload = {
      amount: total.toString(),
      currency: "ETB",
      email: finalEmail,
      first_name: firstName,
      last_name: lastName,
      tx_ref: txRef,

      callback_url: `${backendUrl}/api/payment/callback?tx_ref=${txRef}`,
      return_url: `${frontendUrl}/orders?tx_ref=${txRef}`,

      customization: {
        title: "AduFood",
        description: "Food Order Payment",
      },

      meta: {
        order_id: order._id.toString(),
        user_id: req.user._id.toString(),
      },
    };

    const { checkoutUrl } = await initializePayment(chapaPayload);

    return res.status(201).json({
      message: "Payment initialized",
      checkoutUrl,
      txRef,
    });
  } catch (err) {
    console.error("🔥 INIT ERROR:", err.response?.data || err.message);

    return res.status(500).json({
      message: "Failed to initialize payment",
      error: err.response?.data || err.message,
    });
  }
};

/**
 * CALLBACK
 */
export const chapaCallbackHandler = async (req, res) => {
  try {
    const { tx_ref } = req.query;

    const { chapaStatus, order } =
      await verifyAndUpdateOrder(tx_ref);

    return res.json({
      message: "Callback processed",
      status: chapaStatus,
      orderId: order._id,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Callback failed",
      error: err.message,
    });
  }
};

/**
 * WEBHOOK
 */
export const chapaWebhookHandler = async (req, res) => {
  try {
    const txRef =
      req.body?.tx_ref || req.body?.data?.tx_ref;

    if (!txRef) throw new Error("Missing tx_ref");

    await verifyAndUpdateOrder(txRef);

    return res.json({ message: "Webhook processed" });
  } catch (err) {
    return res.status(200).json({
      message: "Webhook received (failed processing)",
    });
  }
};

/**
 * MANUAL VERIFY
 */
export const manualVerifyHandler = async (req, res) => {
  try {
    const { txRef } = req.params;

    const { chapaStatus, order } =
      await verifyAndUpdateOrder(txRef);

    return res.json({
      message: chapaStatus,
      orderId: order._id,
      orderStatus: order.status,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Verification failed",
      error: err.message,
    });
  }
};