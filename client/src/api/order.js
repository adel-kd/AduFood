// src/api/order.js
import api from './axios.js';

export const placeOrder = (data) => {
  console.log('Placing order with data:', data);
  return api.post('/orders', data);
};

export const getMyOrders = () => {
  console.log('Fetching user orders');
  return api.get('/orders/myorders');
};

export const getAllOrders = () => {
  console.log('Fetching all orders');
  return api.get('/orders/all');
};

export const updateOrderStatus = (id, status) => {
  console.log('Updating order status:', id, status);
  return api.put(`/orders/${id}/status`, { status });
};

export const filterOrders = (status) => {
  console.log('Filtering orders by status:', status);
  return api.get(`/orders/status/${status}`);
};

export const getOrderAnalytics = () => {
  console.log('Fetching order analytics');
  return api.get('/orders/analytics/data');
};

export const deleteOrder = (id) => {
  console.log('Deleting order:', id);
  return api.delete(`/orders/${id}`);
};