import React, { useEffect, useState } from 'react'
import { getAllOrders, updateOrderStatus, filterOrders } from '../api/order'

export default function OrdersManagement() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [updatingStatus, setUpdatingStatus] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

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
      alert('Failed to fetch orders: ' + (error.response?.data?.message || error.message))
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
    } catch (error) {
      alert('Failed to update order status: ' + (error.response?.data?.message || error.message))
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      case 'Confirmed':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
      case 'Delivered':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'Cancelled':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
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
      case 'Cancelled':
        return '❌'
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

  const getActionButtonText = (currentStatus) => {
    switch (currentStatus) {
      case 'Pending':
        return 'Confirm Order'
      case 'Confirmed':
        return 'Mark as Delivered'
      default:
        return null
    }
  }

  // Filter orders by search term
  const filteredOrders = orders.filter(order => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate order statistics
  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    confirmed: orders.filter(o => o.status === 'Confirmed').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    cancelled: orders.filter(o => o.status === 'Cancelled').length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500"></div>
          <p className="mt-4 text-lg text-amber-500">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-3xl font-bold text-amber-500 mb-2">Order Management</h1>
            <p className="text-gray-300">Manage and track all customer orders</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-amber-500">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white placeholder-gray-400"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-white"
            >
              <option value="all">All Orders</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
          {[
            { title: 'Total Orders', value: orderStats.total, icon: '📦', color: 'gray' },
            { title: 'Pending', value: orderStats.pending, icon: '⏳', color: 'amber' },
            { title: 'Confirmed', value: orderStats.confirmed, icon: '✅', color: 'emerald' },
            { title: 'Delivered', value: orderStats.delivered, icon: '🚚', color: 'blue' },
            { title: 'Cancelled', value: orderStats.cancelled, icon: '❌', color: 'rose' }
          ].map((stat, index) => (
            <div key={index} className="bg-gray-800/40 backdrop-blur-md rounded-2xl p-5 border border-gray-700 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-5">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order._id} className="bg-gray-800/40 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-700 shadow-lg hover:shadow-xl transition-all">
                {/* Order Header */}
                <div className="p-6 bg-gray-900/50">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">📦</span>
                        <h3 className="text-xl font-semibold text-white">Order #{order._id.slice(-8).toUpperCase()}</h3>
                      </div>
                      <p className="text-gray-400 text-sm">Placed on {formatDate(order.createdAt)}</p>
                      <p className="text-gray-300 mt-1">
                        Customer: <span className="font-medium">{order.user?.name || order.user?.email || 'Unknown'}</span>
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)} {order.status}
                      </span>
                      <span className="text-xl font-bold text-amber-500">
                        {order.totalPrice} ETB
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h4 className="font-medium text-white mb-4">Order Items:</h4>
                  <div className="grid gap-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-gray-900/50 rounded-lg">
                        <img
                          src={item.food?.image || '/api/placeholder/60/60'}
                          alt={item.food?.name}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-700"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-white">{item.food?.name}</h5>
                          <p className="text-sm text-gray-400 line-clamp-1">{item.food?.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-white">Qty: {item.qty}</p>
                          <p className="text-sm text-gray-400">{item.price || item.food?.price} ETB each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="px-6 py-4 bg-gray-900/50 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="text-sm">
                    <p className="text-gray-300">Total Items: <span className="font-semibold text-white">{order.items.reduce((sum, item) => sum + (item.qty || 1), 0)}</span></p>
                    <p className="text-gray-300">Order Total: <span className="font-semibold text-amber-500">{order.totalPrice} ETB</span></p>
                  </div>
                  
                  <div className="flex gap-2">
                    {getNextStatus(order.status) && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, getNextStatus(order.status))}
                        disabled={updatingStatus === order._id}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updatingStatus === order._id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Updating...
                          </>
                        ) : (
                          <>
                            <span>📝</span>
                            {getActionButtonText(order.status)}
                          </>
                        )}
                      </button>
                    )}
                    
                    {order.status === 'Delivered' && (
                      <span className="px-4 py-2 bg-emerald-500/20 text-emerald-400 font-medium rounded-lg border border-emerald-500/30">
                        ✅ Order Completed
                      </span>
                    )}

                    {order.status === 'Cancelled' && (
                      <span className="px-4 py-2 bg-rose-500/20 text-rose-400 font-medium rounded-lg border border-rose-500/30">
                        ❌ Order Cancelled
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-gray-800/40 rounded-2xl border border-gray-700">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-amber-500 mb-2">No orders found</h3>
              <p className="text-gray-400">No orders match your current filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}