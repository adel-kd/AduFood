// src/pages/Order.jsx
import React, { useEffect, useState } from 'react';
import { getMyOrders, deleteOrder } from '../api/order.js';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return '🔄';
      case 'Confirmed': return '✅';
      case 'Delivered': return '🚚';
      case 'Cancelled': return '❌';
      default: return '';
    }
  };

  // Status color (text only, no background)
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-amber-500 font-semibold';
      case 'Confirmed': return 'text-emerald-500 font-semibold';
      case 'Delivered': return 'text-cyan-500 font-semibold';
      case 'Cancelled': return 'text-red-500 font-semibold';
      default: return 'text-gray-500 font-semibold';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getMyOrders();
      const ordersData = response.data || [];
      const safeOrders = ordersData.map(order => ({
        ...order,
        items: Array.isArray(order.items) ? order.items : [],
        createdAt: order.createdAt || order.created_at || new Date().toISOString(),
        totalPrice: order.totalPrice || order.total_price || 0,
        status: order.status || 'Pending'
      }));
      safeOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(safeOrders);
    } catch (err) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
      setOrders(prev => prev.filter(o => o._id !== id));
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

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

  return (
    <div className="p-4 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-amber-600 text-center">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-16 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 shadow-md border border-amber-100">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold mb-2 text-amber-800">No orders yet</h3>
          <p className="text-amber-600">Your order history will appear here</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-white to-amber-50 border border-amber-100 transition-all hover:shadow-xl">
              {/* Order Header */}
              <div className="p-5 border-b border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-amber-900">
                      Order #{order._id ? order._id.slice(-8).toUpperCase() : 'N/A'}
                    </h3>
                    <p className="text-sm text-amber-700">
                      {order.createdAt ? formatDate(order.createdAt) : 'Unknown date'}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)} bg-opacity-10 inline-flex items-center gap-1`}>
                    {getStatusIcon(order.status)} {order.status}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-5">
                <h4 className="font-medium mb-3 text-amber-800">Order Items:</h4>
                <div className="space-y-3">
                  {order.items.map((item, index) => {
                    const quantity = item.qty || 1;
                    const itemName = item.food?.name || 'Unknown Item';
                    const itemPrice = item.price || item.food?.price || 0;
                    
                    return (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-amber-50 border border-amber-100">
                        <div className="flex-1">
                          <span className="font-medium text-amber-900">
                            {itemName}
                          </span>
                          {itemPrice > 0 && (
                            <span className="text-sm ml-2 text-amber-600">
                              ({itemPrice} ETB each)
                            </span>
                          )}
                        </div>
                        <span className="font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded-full">
                          × {quantity}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Total and Actions */}
              <div className="px-5 py-4 border-t border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="text-sm">
                    <p className="text-amber-700">Total Items: <span className="font-semibold text-amber-800">{order.items.reduce((sum, item) => sum + (item.qty || 1), 0)}</span></p>
                    <p className="font-bold text-lg text-amber-700">
                      Total: {order.totalPrice || 0} ETB
                    </p>
                  </div>
                  
                  {order.status === 'Delivered' && (
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this order?')) {
                          handleDelete(order._id);
                        }
                      }}
                      className="text-red-500 hover:text-red-700 px-3 py-1 rounded-full text-sm font-semibold transition-colors bg-red-50 hover:bg-red-100 border border-red-200"
                    >
                      Delete Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Order;