import { v4 as uuidv4 } from "uuid";
import Order from "../models/order.js";
import Transaction from "../models/Transaction.js";
import {
  initializePayment,
  verifyPayment,
} from "../service/chapaService.js";

/**
 * ─────────────────────────────────────────────
 * Helper: verify + update order
 * ─────────────────────────────────────────────
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
 * ─────────────────────────────────────────────
 * Initialize Payment
 * ─────────────────────────────────────────────
 */
export const initializePaymentHandler = async (req, res) => {
  try {
    const { items, phone } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    // total calculation (server-side trust)
    const calculatedTotalPrice = items.reduce((sum, item) => {
      return sum + (Number(item.price) || 0) * (Number(item.qty) || 1);
    }, 0);

    if (calculatedTotalPrice <= 0) {
      return res.status(400).json({ message: "Invalid payment amount" });
    }

    // user info
    const finalEmail = req.user?.email || "guest@adufood.com";
    const userName = req.user?.name || "Customer User";

    const finalFirstName = userName.split(" ")[0] || "Customer";
    const finalLastName =
      userName.split(" ").slice(1).join(" ") || "User";

    const txRef = `ADU-${uuidv4()}`;

    const formattedItems = items.map((item) => ({
      food: item.food,
      qty: item.qty || 1,
      price: item.price || 0,
    }));

    // Create Order
    const order = await Order.create({
      user: req.user._id,
      items: formattedItems,
      totalPrice: calculatedTotalPrice,
      deliveryFee: req.body.deliveryFee || 0,
      discountAmount: req.body.discountAmount || 0,
      promoCode: req.body.promoCode || null,
      status: "Pending",
      txRef,
    });

    // Create Transaction
    await Transaction.create({
      orderId: order._id,
      userId: req.user._id,
      amount: calculatedTotalPrice,
      currency: "ETB",
      email: finalEmail,
      phone: phone || null,
      chapaReference: txRef,
      status: "pending",
    });

    const backendUrl =
      process.env.BACKEND_URL || "http://localhost:5000";

    const frontendUrl =
      process.env.FRONTEND_URL || "http://localhost:3000";

    // FULL PAYLOAD BUILT HERE (single source of truth)
    const chapaPayload = {
      amount: String(calculatedTotalPrice),
      currency: "ETB",
      email: finalEmail,
      first_name: finalFirstName,
      last_name: finalLastName,
      tx_ref: txRef,
      callback_url: `${backendUrl}/api/payment/callback?tx_ref=${txRef}`,
      return_url: `${frontendUrl}/payment/result?tx_ref=${txRef}`,

      customization: {
        title: "AduFood".slice(0, 16),
        description: "Checkout",
      },

      meta: {
        order_id: order._id.toString(),
        user_id: req.user._id.toString(),
      },
    };

    // Call service
    const { checkoutUrl } = await initializePayment(chapaPayload);

    res.status(201).json({
      message: "Payment initialized",
      checkoutUrl,
      orderId: order._id,
      txRef,
    });
  } catch (err) {
    console.error("Payment init error:", err.response?.data || err.message);

    res.status(500).json({
      message: "Failed to initialize payment",
      error: err.response?.data || err.message,
    });
  }
};

/**
 * ─────────────────────────────────────────────
 * Callback
 * ─────────────────────────────────────────────
 */
export const chapaCallbackHandler = async (req, res) => {
  try {
    const { tx_ref } = req.query;

    const { chapaStatus, order } =
      await verifyAndUpdateOrder(tx_ref);

    res.status(200).json({
      message: "Callback processed",
      orderId: order._id,
      status: chapaStatus,
    });
  } catch (err) {
    console.error("Chapa callback error:", err.message);

    res.status(500).json({
      message: "Callback processing failed",
      error: err.message,
    });
  }
};

/**
 * ─────────────────────────────────────────────
 * Webhook
 * ─────────────────────────────────────────────
 */
export const chapaWebhookHandler = async (req, res) => {
  try {
    const txRef =
      req.body?.tx_ref || req.body?.data?.tx_ref;

    await verifyAndUpdateOrder(txRef);

    res.status(200).json({
      message: "Webhook processed",
    });
  } catch (err) {
    console.error("Webhook error:", err.message);

    res.status(200).json({
      message: "Webhook received (failed processing)",
    });
  }
};

/**
 * ─────────────────────────────────────────────
 * Manual verify
 * ─────────────────────────────────────────────
 */
export const manualVerifyHandler = async (req, res) => {
  try {
    const { txRef } = req.params;

    const { chapaStatus, order } =
      await verifyAndUpdateOrder(txRef);

    res.json({
      message:
        chapaStatus === "success"
          ? "Payment verified successfully"
          : `Payment status: ${chapaStatus}`,
      orderId: order._id,
      orderStatus: order.status,
      chapaStatus,
    });
  } catch (err) {
    res.status(500).json({
      message: "Verification failed",
      error: err.message,
    });
  }
};