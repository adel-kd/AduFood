import React, { useEffect, useState } from "react";
import {
  getAllOrders,
  updateOrderStatus,
  filterOrders,
} from "../api/order";

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      let response;

      if (statusFilter === "all") {
        response = await getAllOrders();
      } else {
        response = await filterOrders(statusFilter);
      }

      // ✅ FIX: backend returns { orders, page, pages, total }
      setOrders(response.data.orders || []);
    } catch (error) {
      alert(
        "Failed to fetch orders: " +
        (error.response?.data?.message || error.message)
      );
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);

    try {
      const res = await updateOrderStatus(orderId, newStatus);

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? res.data : order
        )
      );
    } catch (error) {
      alert(
        "Failed to update order status: " +
        (error.response?.data?.message || error.message)
      );
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "Confirmed":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "Delivered":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Cancelled":
        return "bg-rose-500/20 text-rose-400 border-rose-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return "⏳";
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

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";

    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case "Pending":
        return "Confirmed";
      case "Confirmed":
        return "Delivered";
      default:
        return null;
    }
  };

  const getActionButtonText = (currentStatus) => {
    switch (currentStatus) {
      case "Pending":
        return "Confirm Order";
      case "Confirmed":
        return "Mark as Delivered";
      default:
        return null;
    }
  };

  // ✅ SAFE FILTERING
  const filteredOrders = (orders || []).filter((order) => {
    const id = order?._id?.toLowerCase() || "";
    const userName = order?.user?.name?.toLowerCase() || "";
    const userEmail = order?.user?.email?.toLowerCase() || "";

    return (
      id.includes(searchTerm.toLowerCase()) ||
      userName.includes(searchTerm.toLowerCase()) ||
      userEmail.includes(searchTerm.toLowerCase())
    );
  });

  const orderStats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "Pending").length,
    confirmed: orders.filter((o) => o.status === "Confirmed").length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
    cancelled: orders.filter((o) => o.status === "Cancelled").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-[#dd804f]"></div>
          <p className="mt-4 text-lg text-[#dd804f]">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#dd804f] mb-2">
              Order Management
            </h1>
            <p className="text-gray-600">
              Manage and track all customer orders
            </p>
          </div>

          <div className="flex gap-4 mt-4 lg:mt-0">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border px-4 py-2 rounded-lg"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border px-4 py-2 rounded-lg"
            >
              <option value="all">All Orders</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {Object.entries(orderStats).map(([key, value]) => (
            <div
              key={key}
              className="bg-white border rounded-xl p-4 shadow-sm"
            >
              <p className="text-gray-500 capitalize">{key}</p>
              <p className="text-2xl font-bold text-[#dd804f]">{value}</p>
            </div>
          ))}
        </div>

        {/* Orders */}
        <div className="space-y-5">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-2xl overflow-hidden border shadow-sm"
              >
                {/* Header */}
                <div className="p-6 bg-gray-50 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>

                    <p className="text-sm text-gray-700 mt-1">
                      {order.user?.name || "Unknown"} (
                      {order.user?.email || "No email"})
                    </p>
                  </div>

                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)} {order.status}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="p-6 space-y-3">
                  {(order.items || []).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 border rounded-lg p-3"
                    >
                      <img
                        src={
                          item.food?.image ||
                          "https://via.placeholder.com/60"
                        }
                        alt={item.food?.name || "Food"}
                        className="w-14 h-14 rounded-lg object-cover"
                      />

                      <div className="flex-1">
                        <h4 className="font-medium">
                          {item.food?.name || "Unknown Food"}
                        </h4>

                        <p className="text-sm text-gray-500">
                          {item.food?.description || ""}
                        </p>
                      </div>

                      <div className="text-right">
                        <p>Qty: {item.qty}</p>
                        <p>{item.price} ETB</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 flex justify-between items-center">
                  <div>
                    <p>
                      Total Items:{" "}
                      {(order.items || []).reduce(
                        (sum, item) => sum + (item.qty || 1),
                        0
                      )}
                    </p>

                    <p className="font-bold text-[#dd804f]">
                      {order.totalPrice} ETB
                    </p>
                  </div>

                  {getNextStatus(order.status) && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(
                          order._id,
                          getNextStatus(order.status)
                        )
                      }
                      disabled={updatingStatus === order._id}
                      className="px-4 py-2 bg-[#dd804f] text-white rounded-lg"
                    >
                      {updatingStatus === order._id
                        ? "Updating..."
                        : getActionButtonText(order.status)}
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 border rounded-xl">
              <h3 className="text-xl font-semibold text-[#dd804f]">
                No orders found
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}