import React, { useEffect, useState } from 'react'
import { getOrderAnalytics } from '../api/order'
import { listFoods } from '../api/food'

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null)
  const [topFoods, setTopFoods] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      
      // Fetch order analytics
      const analyticsRes = await getOrderAnalytics()
      setAnalytics(analyticsRes.data)
      
      // Fetch top foods
      const foodsRes = await listFoods()
      setTopFoods(foodsRes.data.foods.slice(0, 10))
      
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-sm ${i <= rating ? 'text-ethiopian-gold' : 'text-gray-300'}`}>
          ★
        </span>
      )
    }
    return stars
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">Comprehensive insights into your food delivery business</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-ethiopian p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-primary-500">
                {analytics?.totalRevenue || 0} ETB
              </p>
              <p className="text-sm text-gray-500 mt-1">All time</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-ethiopian p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold text-secondary-500">
                {analytics?.totalOrders || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">All time</p>
            </div>
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-ethiopian p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Order Value</p>
              <p className="text-3xl font-bold text-accent-500">
                {analytics?.averageOrderValue || 0} ETB
              </p>
              <p className="text-sm text-gray-500 mt-1">Per order</p>
            </div>
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-ethiopian p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Foods</p>
              <p className="text-3xl font-bold text-yellow-500">
                {analytics?.totalFoods || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">In menu</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🍽️</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-ethiopian p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Status Breakdown</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⏳</span>
                <div>
                  <p className="font-medium text-gray-900">Pending</p>
                  <p className="text-sm text-gray-600">Awaiting confirmation</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-yellow-600">
                {analytics?.pendingOrders || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="font-medium text-gray-900">Confirmed</p>
                  <p className="text-sm text-gray-600">Ready for delivery</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-blue-600">
                {analytics?.confirmedOrders || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-accent-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚚</span>
                <div>
                  <p className="font-medium text-gray-900">Delivered</p>
                  <p className="text-sm text-gray-600">Successfully completed</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-accent-600">
                {analytics?.deliveredOrders || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Revenue Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-ethiopian p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Revenue Overview</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <p className="text-gray-600">Revenue chart would go here</p>
              <p className="text-sm text-gray-500">Integration with chart library needed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Foods */}
      <div className="bg-white rounded-xl shadow-ethiopian p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Performing Foods</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Rank</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Food</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Price</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Rating</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Reviews</th>
              </tr>
            </thead>
            <tbody>
              {topFoods.length > 0 ? (
                topFoods.map((food, index) => (
                  <tr key={food._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-500 font-semibold text-sm">{index + 1}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={food.image || '/api/placeholder/40/40'}
                          alt={food.name}
                          className="w-10 h-10 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{food.name}</p>
                          <p className="text-sm text-gray-600 line-clamp-1">{food.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
                        {food.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-primary-500">{food.price} ETB</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {renderStars(Math.floor(food.rating || 0))}
                        </div>
                        <span className="text-sm font-medium">{food.rating || 0}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">{food.numReviews || 0}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center">
                    <div className="text-4xl mb-2">🍽️</div>
                    <p className="text-gray-500">No foods available</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-ethiopian p-6 text-center">
          <div className="text-3xl font-bold text-primary-500 mb-2">
            {analytics?.completionRate || 0}%
          </div>
          <p className="text-gray-600">Order Completion Rate</p>
        </div>
        <div className="bg-white rounded-xl shadow-ethiopian p-6 text-center">
          <div className="text-3xl font-bold text-secondary-500 mb-2">
            {analytics?.averageRating || 0}
          </div>
          <p className="text-gray-600">Average Food Rating</p>
        </div>
        <div className="bg-white rounded-xl shadow-ethiopian p-6 text-center">
          <div className="text-3xl font-bold text-accent-500 mb-2">
            {analytics?.totalReviews || 0}
          </div>
          <p className="text-gray-600">Total Reviews</p>
        </div>
      </div>
    </div>
  )
}
