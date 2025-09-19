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
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#dd804f', borderBottomColor: 'transparent' }}></div>
          <p className="mt-4 text-lg" style={{ color: '#dd804f' }}>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-2" style={{ color: '#dd804f' }}>Admin Dashboard</h1>
        <p style={{ color: '#fff' }}>Welcome to Adu Food administration panel</p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl p-6 border" style={{ background: '#fff', borderColor: '#dd804f' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: '#222' }}>Total Orders</p>
              <p className="text-2xl font-bold" style={{ color: '#dd804f' }}>{analytics?.totalOrders || 0}</p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: '#dd804f22' }}>
              <span className="text-2xl" style={{ color: '#dd804f' }}>📦</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl p-6 border" style={{ background: '#fff', borderColor: '#dd804f' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: '#222' }}>Total Revenue</p>
              <p className="text-2xl font-bold" style={{ color: '#dd804f' }}>{analytics?.totalRevenue || 0} ETB</p>
            </div>
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: '#dd804f22' }}>
              <span className="text-2xl" style={{ color: '#dd804f' }}>💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border p-6 mb-8" style={{ background: '#fff', borderColor: '#dd804f' }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: '#dd804f' }}>Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/foods"
            className="flex items-center gap-3 p-4 rounded-lg transition-colors border"
            style={{
              background: '#dd804f10',
              borderColor: '#dd804f',
              color: '#222'
            }}
          >
            <span className="text-2xl" style={{ color: '#dd804f' }}>🍽️</span>
            <div>
              <p className="font-medium" style={{ color: '#222' }}>Manage Foods</p>
              <p className="text-sm" style={{ color: '#888' }}>Add, edit, or delete food items</p>
            </div>
          </Link>

          <Link
            to="/admin/orders"
            className="flex items-center gap-3 p-4 rounded-lg transition-colors border"
            style={{
              background: '#dd804f10',
              borderColor: '#dd804f',
              color: '#222'
            }}
          >
            <span className="text-2xl" style={{ color: '#dd804f' }}>📦</span>
            <div>
              <p className="font-medium" style={{ color: '#222' }}>Manage Orders</p>
              <p className="text-sm" style={{ color: '#888' }}>View and update order status</p>
            </div>
          </Link>

          <Link
            to="/admin/analytics"
            className="flex items-center gap-3 p-4 rounded-lg transition-colors border"
            style={{
              background: '#dd804f10',
              borderColor: '#dd804f',
              color: '#222'
            }}
          >
            <span className="text-2xl" style={{ color: '#dd804f' }}>📊</span>
            <div>
              <p className="font-medium" style={{ color: '#222' }}>Analytics</p>
              <p className="text-sm" style={{ color: '#888' }}>View detailed reports</p>
            </div>
          </Link>

          <Link
            to="/admin/food/new"
            className="flex items-center gap-3 p-4 rounded-lg transition-colors border"
            style={{
              background: '#dd804f10',
              borderColor: '#dd804f',
              color: '#222'
            }}
          >
            <span className="text-2xl" style={{ color: '#dd804f' }}>➕</span>
            <div>
              <p className="font-medium" style={{ color: '#222' }}>Add New Food</p>
              <p className="text-sm" style={{ color: '#888' }}>Create a new food item</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
