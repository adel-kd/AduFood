// src/pages/OrdersManagement.jsx
import React, { useEffect, useState } from 'react'
import { getAllOrders, updateOrderStatus, filterOrders } from '../api/order'

export default function OrdersManagement() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [updatingStatus, setUpdatingStatus] = useState(null)

  useEffect(() => {
    fetchOrders()
    // eslint-disable-next-line
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
      alert('Order status updated successfully!')
    } catch (error) {
      alert('Failed to update order status: ' + (error.response?.data?.message || error.message))
    } finally {
      setUpdatingStatus(null)
    }
  }

  // Only use orange for focus and button, red for delete/cancelled
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-gray-200 text-black font-bold'
      case 'Confirmed':
        return 'bg-black text-white font-bold'
      case 'Delivered':
        return 'bg-gray-200 text-black font-bold'
      case 'Cancelled':
        return 'bg-red-100 text-[#e3342f] font-bold'
      default:
        return 'bg-gray-100 text-black font-bold'
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#dd804f' }}></div>
          <p className="mt-4 text-lg" style={{ color: '#dd804f' }}>Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-6" style={{ color: '#dd804f' }}> Manage Order </h1>
          <p className="mt-2" style={{ color: '#fff' }}>Manage and track all customer orders</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-3 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dd804f]"
            style={{
              color: '#fff',
              background: '#181818'
            }}
          >
            <option value="all" style={{ color: '#fff' }}>All Orders</option>
            <option value="Pending" style={{ color: '#fff' }}>Pending</option>
            <option value="Confirmed" style={{ color: '#fff' }}>Confirmed</option>
            <option value="Delivered" style={{ color: '#fff' }}>Delivered</option>
            <option value="Cancelled" style={{ color: '#fff' }}>Cancelled</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-10 mb-10">
        <div className="rounded-xl shadow-ethiopian p-6 text-center" style={{ background: '#181818' }}>
          <div className="text-3xl font-bold mb-2" style={{ color: '#fff' }}>{orders.length}</div>
          <p style={{ color: '#fff' }}>Total Orders</p>
        </div>
        <div className="rounded-xl shadow-ethiopian p-6 text-center" style={{ background: '#181818' }}>
          <div className="text-3xl font-bold mb-2" style={{ color: '#fff' }}>
            {orders.filter(o => o.status === 'Pending').length}
          </div>
          <p style={{ color: '#fff' }}>Pending</p>
        </div>
        <div className="rounded-xl shadow-ethiopian p-6 text-center" style={{ background: '#181818' }}>
          <div className="text-3xl font-bold mb-2" style={{ color: '#fff' }}>
            {orders.filter(o => o.status === 'Confirmed').length}
          </div>
          <p style={{ color: '#fff' }}>Confirmed</p>
        </div>
        <div className="rounded-xl shadow-ethiopian p-6 text-center" style={{ background: '#181818' }}>
          <div className="text-3xl font-bold mb-2" style={{ color: '#fff' }}>
            {orders.filter(o => o.status === 'Delivered').length}
          </div>
          <p style={{ color: '#fff' }}>Delivered</p>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="rounded-xl shadow-ethiopian overflow-hidden" style={{ background: '#222' }}>
              {/* Order Header */}
              <div className="p-6 border-b-0" style={{ background: '#181818' }}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: '#fff' }}>Order #{order._id.slice(-8)}</h3>
                    <p className="text-sm" style={{ color: '#888' }}>Placed on {formatDate(order.createdAt)}</p>
                    <p className="text-sm" style={{ color: '#fff' }}>Customer: <span style={{ color: '#fff', fontWeight: 600 }}>{order.user?.name || order.user?.email || 'Unknown'}</span></p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                      style={
                        order.status === 'Confirmed'
                          ? { background: '#000', color: '#fff' }
                          : order.status === 'Delivered'
                          ? { background: '#eee', color: '#222' }
                          : order.status === 'Pending'
                          ? { background: '#eee', color: '#222' }
                          : order.status === 'Cancelled'
                          ? { background: '#e3342f22', color: '#e3342f' }
                          : { background: '#fff', color: '#222' }
                      }
                    >
                      {getStatusIcon(order.status)} {order.status}
                    </span>
                    <span className="text-xl font-bold" style={{ color: '#dd804f' }}>
                      {order.totalPrice} ETB
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <h4 className="font-medium mb-4" style={{ color: '#fff' }}>Order Items:</h4>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg" style={{ background: '#181818' }}>
                      <img
                        src={item.food?.image || '/api/placeholder/60/60'}
                        alt={item.food?.name}
                        className="w-12 h-12 object-cover rounded-lg"
                        style={{ border: 'none', background: '#fff' }}
                      />
                      <div className="flex-1">
                        <h5 className="font-medium" style={{ color: '#fff' }}>{item.food?.name}</h5>
                        <p className="text-sm" style={{ color: '#888' }}>{item.food?.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium" style={{ color: '#fff' }}>Qty: <span style={{ color: '#fff' }}>{item.qty}</span></p>
                        <p className="text-sm" style={{ color: '#888' }}>{item.price || item.food?.price} ETB each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Actions */}
              <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" style={{ background: '#181818' }}>
                <div className="text-sm" style={{ color: '#fff' }}>
                  <p>Total Items: <span style={{ color: '#fff', fontWeight: 600 }}>{order.items.reduce((sum, item) => sum + (item.qty || 1), 0)}</span></p>
                  <p>Order Total: <span className="font-semibold" style={{ color: '#dd804f' }}>{order.totalPrice} ETB</span></p>
                </div>
                
                <div className="flex gap-2">
                  {getNextStatus(order.status) && (
                    <button
                      onClick={() => handleStatusUpdate(order._id, getNextStatus(order.status))}
                      disabled={updatingStatus === order._id}
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      style={{
                        background: updatingStatus === order._id ? '#dd804f99' : '#dd804f',
                        color: '#fff',
                        opacity: updatingStatus === order._id ? 0.7 : 1,
                        cursor: updatingStatus === order._id ? 'not-allowed' : 'pointer',
                        fontWeight: 600
                      }}
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
                    <span className="px-3 py-2 rounded-lg text-sm font-medium" style={{ background: '#eee', color: '#222', fontWeight: 600 }}>
                      ✅ Completed
                    </span>
                  )}

                  {order.status === 'Cancelled' && (
                    <span className="px-3 py-2 rounded-lg text-sm font-medium" style={{ background: '#e3342f22', color: '#e3342f', fontWeight: 600 }}>
                      ❌ Cancelled
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-semibold mb-2" style={{ color: '#dd804f' }}>No orders found</h3>
            <p style={{ color: '#fff' }}>No orders match your current filter</p>
          </div>
        )}
      </div>
    </div>
  )
}