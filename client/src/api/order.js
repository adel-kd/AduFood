import api from './axios.js'

export const placeOrder = (data) => api.post('/orders', data)
export const getMyOrders = () => api.get('/orders/myorders')
export const getAllOrders = () => api.get('/orders')
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status })
export const filterOrders = (status) => api.get(`/orders/status/${status}`)
export const getOrderAnalytics = () => api.get('/orders/analytics/data')
