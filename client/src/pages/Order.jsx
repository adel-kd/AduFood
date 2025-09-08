import { Link } from "react-router-dom"
import React, { useEffect, useState } from 'react'
import { getMyOrders } from '../api/order'
import { AuthContext } from '../contexts/authcontext'
import { useContext } from 'react'

export default function Orders() {
  const { user } = useContext(AuthContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await getMyOrders()
      setOrders(response.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading your orders...</p>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">No orders yet</h2>
          <p className="text-gray-600 mb-8">Start ordering delicious food to see your order history here!</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <span>🍽️</span>
            Browse Menu
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Your Orders</h1>
          <p className="text-gray-600 mt-2">{orders.length} orders placed</p>
        </div>
        <div className="flex items-center gap-2 text-primary-500">
          <span className="text-2xl">📦</span>
          <span className="font-medium">Order History</span>
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-xl shadow-ethiopian overflow-hidden">
            {/* Order Header */}
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Order #{order._id.slice(-8)}</h3>
                  <p className="text-gray-600 text-sm">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
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

            {/* Order Footer */}
            <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-sm text-gray-600">
                <p>Total Items: {order.items.reduce((sum, item) => sum + item.qty, 0)}</p>
                <p>Order Total: <span className="font-semibold text-primary-500">{order.totalPrice} ETB</span></p>
              </div>
              
              {order.status === 'Delivered' && (
                <button className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Reorder
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
