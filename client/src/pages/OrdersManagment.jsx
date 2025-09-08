import React, { useEffect, useState } from 'react'
import { getAllOrders, updateOrderStatus, filterOrders } from '../api/order'

export default function OrdersManagement() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [updatingStatus, setUpdatingStatus] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      let response
      if (statusFilter === 'all') {
        response = await getAllOrders()
      } else {
        response = await filterOrders(statusFilter)
      }
      setOrders(response.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingStatus(orderId)
    try {
      await updateOrderStatus(orderId, newStatus)
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ))
      alert('Order status updated successfully!')
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'Delivered':
        return 'bg-accent-100 text-accent-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return '⏳'
      case 'Confirmed':
        return '✅'
      case 'Delivered':
        return '🚚'
      default:
        return '📦'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'Pending':
        return 'Confirmed'
      case 'Confirmed':
        return 'Delivered'
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600 mt-2">Manage and track all customer orders</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-ethiopian p-6 text-center">
          <div className="text-3xl font-bold text-primary-500 mb-2">{orders.length}</div>
          <p className="text-gray-600">Total Orders</p>
        </div>
        <div className="bg-white rounded-xl shadow-ethiopian p-6 text-center">
          <div className="text-3xl font-bold text-yellow-500 mb-2">
            {orders.filter(o => o.status === 'Pending').length}
          </div>
          <p className="text-gray-600">Pending</p>
        </div>
        <div className="bg-white rounded-xl shadow-ethiopian p-6 text-center">
          <div className="text-3xl font-bold text-blue-500 mb-2">
            {orders.filter(o => o.status === 'Confirmed').length}
          </div>
          <p className="text-gray-600">Confirmed</p>
        </div>
        <div className="bg-white rounded-xl shadow-ethiopian p-6 text-center">
          <div className="text-3xl font-bold text-accent-500 mb-2">
            {orders.filter(o => o.status === 'Delivered').length}
          </div>
          <p className="text-gray-600">Delivered</p>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow-ethiopian overflow-hidden">
              {/* Order Header */}
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Order #{order._id.slice(-8)}</h3>
                    <p className="text-gray-600 text-sm">Placed on {formatDate(order.createdAt)}</p>
                    <p className="text-gray-600 text-sm">Customer: {order.user?.name || order.user?.email || 'Unknown'}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)} {order.status}
                    </span>
                    <span className="text-xl font-bold text-primary-500">
                      {order.totalPrice} ETB
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <h4 className="font-medium text-gray-900 mb-4">Order Items:</h4>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={item.food?.image || '/api/placeholder/60/60'}
                        alt={item.food?.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{item.food?.name}</h5>
                        <p className="text-sm text-gray-600">{item.food?.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">Qty: {item.qty}</p>
                        <p className="text-sm text-gray-600">{item.food?.price} ETB each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Actions */}
              <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-600">
                  <p>Total Items: {order.items.reduce((sum, item) => sum + item.qty, 0)}</p>
                  <p>Order Total: <span className="font-semibold text-primary-500">{order.totalPrice} ETB</span></p>
                </div>
                
                <div className="flex gap-2">
                  {getNextStatus(order.status) && (
                    <button
                      onClick={() => handleStatusUpdate(order._id, getNextStatus(order.status))}
                      disabled={updatingStatus === order._id}
                      className="bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      {updatingStatus === order._id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <span>📝</span>
                          Mark as {getNextStatus(order.status)}
                        </>
                      )}
                    </button>
                  )}
                  
                  {order.status === 'Delivered' && (
                    <span className="bg-accent-100 text-accent-800 px-3 py-2 rounded-lg text-sm font-medium">
                      ✅ Completed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">No orders match your current filter</p>
          </div>
        )}
      </div>
    </div>
  )
}
