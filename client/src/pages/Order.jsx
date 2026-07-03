import React, { useEffect, useState } from "react";
import { getMyOrders, deleteOrder } from "../api/order.js";
import { verifyChapaPayment } from "../api/transaction.js";
import { clearCart } from "../api/cart.js";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ─────────────────────────────────────────────
  // STATUS UI HELPERS
  // ─────────────────────────────────────────────
  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return "🔄";
      case "Confirmed":
        return "✅";
      case "Delivered":
        return "🚚";
      case "Cancelled":
        return "❌";
      default:
        return "📦";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-amber-500 font-semibold";
      case "Confirmed":
        return "text-emerald-500 font-semibold";
      case "Delivered":
        return "text-cyan-500 font-semibold";
      case "Cancelled":
        return "text-red-500 font-semibold";
      default:
        return "text-gray-500 font-semibold";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ─────────────────────────────────────────────
  // FETCH ORDERS
  // ─────────────────────────────────────────────
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await getMyOrders();
      const ordersData = response.data || [];

      const safeOrders = ordersData.map((order) => ({
        ...order,
        items: Array.isArray(order.items) ? order.items : [],
        createdAt:
          order.createdAt || new Date().toISOString(),
        totalPrice: order.totalPrice || 0,
        status: order.status || "Pending",
      }));

      safeOrders.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setOrders(safeOrders);
    } catch (err) {
      console.error("Fetch orders error:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────
  // PAYMENT RETURN HANDLER (CHAPA)
  // ─────────────────────────────────────────────
  useEffect(() => {
    const handlePaymentReturn = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const txRef = params.get("tx_ref");

        if (txRef) {
          // 1. verify payment
          await verifyChapaPayment(txRef);

          // 2. clear cart (backup safety)
          await clearCart();

          // 3. clean URL
          window.history.replaceState({}, "", "/orders");
        }

        // 4. load orders
        await fetchOrders();
      } catch (err) {
        console.error("Payment verification error:", err);

        // still load orders even if verification fails
        await fetchOrders();
      }
    };

    handlePaymentReturn();
  }, []);

  // ─────────────────────────────────────────────
  // DELETE ORDER
  // ─────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.message || err.message));
    }
  };

  // ─────────────────────────────────────────────
  // LOADING UI
  // ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="p-4 max-w-3xl mx-auto min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          <p className="mt-4 text-amber-500 text-lg">Loading orders...</p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────────
  return (
    <div className="p-4 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-amber-600 text-center">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-amber-50 rounded-lg">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold">No orders yet</h3>
          <p className="text-amber-600">
            Your order history will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-xl shadow bg-white border border-amber-100"
            >
              {/* HEADER */}
              <div className="p-5 border-b bg-amber-50 flex justify-between">
                <div>
                  <h3 className="font-semibold">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <span className={getStatusColor(order.status)}>
                  {getStatusIcon(order.status)} {order.status}
                </span>
              </div>

              {/* ITEMS */}
              <div className="p-5 space-y-2">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between bg-amber-50 p-2 rounded"
                  >
                    <span>
                      {item.food?.name || "Item"} × {item.qty || 1}
                    </span>
                    <span>{item.price || 0} ETB</span>
                  </div>
                ))}
              </div>

              {/* FOOTER */}
              <div className="p-5 border-t flex justify-between items-center">
                <p className="font-bold">
                  Total: {order.totalPrice} ETB
                </p>

                {order.status === "Delivered" && (
                  <button
                    onClick={() => handleDelete(order._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Order;