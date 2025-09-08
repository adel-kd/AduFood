import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllOrders, getOrderAnalytics } from '../api/order'
import { listFoods } from '../api/food'

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [topFoods, setTopFoods] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch analytics
      const analyticsRes = await getOrderAnalytics()
      setAnalytics(analyticsRes.data)
      
      // Fetch recent orders
      const ordersRes = await getAllOrders()
      setRecentOrders(ordersRes.data.slice(0, 5))
      
      // Fetch top foods
      const foodsRes = await listFoods()
      setTopFoods(foodsRes.data.foods.slice(0, 5))
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'Confirmed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'Delivered':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-300 text-lg">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Welcome to Adu Food administration panel</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-white">{analytics?.totalOrders || 0}</p>
            </div>
            <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold text-white">{analytics?.totalRevenue || 0} ETB</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Foods</p>
              <p className="text-2xl font-bold text-white">{topFoods.length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🍽️</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Orders</p>
              <p className="text-2xl font-bold text-white">{recentOrders.filter(order => order.status === 'Pending').length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-300">Order ID</th>
                <th className="text-left py-3 px-4 text-gray-300">Customer</th>
                <th className="text-left py-3 px-4 text-gray-300">Total</th>
                <th className="text-left py-3 px-4 text-gray-300">Status</th>
                <th className="text-left py-3 px-4 text-gray-300">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order._id} className="border-b border-gray-700/50">
                  <td className="py-3 px-4 text-gray-300">#{order._id.slice(-6)}</td>
                  <td className="py-3 px-4 text-gray-300">{order.user?.name || 'Guest'}</td>
                  <td className="py-3 px-4 text-gray-300">{order.totalPrice} ETB</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-300">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/foods"
            className="flex items-center gap-3 p-4 bg-primary-500/10 hover:bg-primary-500/20 rounded-lg transition-colors border border-primary-500/20"
          >
            <span className="text-2xl">🍽️</span>
            <div>
              <p className="font-medium text-white">Manage Foods</p>
              <p className="text-sm text-gray-400">Add, edit, or delete food items</p>
            </div>
          </Link>

          <Link
            to="/admin/orders"
            className="flex items-center gap-3 p-4 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg transition-colors border border-blue-500/20"
          >
            <span className="text-2xl">📦</span>
            <div>
              <p className="font-medium text-white">Manage Orders</p>
              <p className="text-sm text-gray-400">View and update order status</p>
            </div>
          </Link>

          <Link
            to="/admin/analytics"
            className="flex items-center gap-3 p-4 bg-green-500/10 hover:bg-green-500/20 rounded-lg transition-colors border border-green-500/20"
          >
            <span className="text-2xl">📊</span>
            <div>
              <p className="font-medium text-white">Analytics</p>
              <p className="text-sm text-gray-400">View detailed reports</p>
            </div>
          </Link>

          <Link
            to="/admin/food/new"
            className="flex items-center gap-3 p-4 bg-yellow-500/10 hover:bg-yellow-500/20 rounded-lg transition-colors border border-yellow-500/20"
          >
            <span className="text-2xl">➕</span>
            <div>
              <p className="font-medium text-white">Add New Food</p>
              <p className="text-sm text-gray-400">Create a new food item</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
