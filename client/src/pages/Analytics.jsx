import React, { useEffect, useState } from 'react'
import { getOrderAnalytics } from '../api/order'
import { listFoods } from '../api/food'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

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
      
      const analyticsRes = await getOrderAnalytics()
      setAnalytics(analyticsRes.data)

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
        <span key={i} className={`text-sm ${i <= rating ? 'text-[#dd804f]' : 'text-gray-300'}`}>
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
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4" style={{ borderColor: '#dd804f', borderBottomColor: 'transparent' }}></div>
          <p className="mt-4 text-lg" style={{ color: '#dd804f' }}>Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: '#dd804f' }}>Analytics Dashboard</h1>
        <p className="mt-2" style={{ color: '#fff' }}>Comprehensive insights into your ADU Food</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-white rounded-xl shadow p-6 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium" style={{ color: '#dd804f' }}>Total Revenue</p>
            <p className="text-3xl font-bold" style={{ color: '#dd804f' }}>{analytics?.totalRevenue || 0} ETB</p>
            <p className="text-sm mt-1" style={{ color: '#222' }}>All time</p>
          </div>
          <div className="w-12 h-12" style={{ backgroundColor: '#dd804f22', borderRadius: '0.5rem' }}  >
            <span className="text-2xl flex items-center justify-center h-full" style={{ color: '#dd804f' }}>💰</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white rounded-xl shadow p-6 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium" style={{ color: '#dd804f' }}>Total Orders</p>
            <p className="text-3xl font-bold" style={{ color: '#222' }}>{analytics?.totalOrders || 0}</p>
            <p className="text-sm mt-1" style={{ color: '#222' }}>All time</p>
          </div>
          <div className="w-12 h-12" style={{ backgroundColor: '#dd804f22', borderRadius: '0.5rem' }}>
            <span className="text-2xl flex items-center justify-center h-full" style={{ color: '#222' }}>📦</span>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-white rounded-xl shadow p-6 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium" style={{ color: '#dd804f' }}>Average Order Value</p>
            <p className="text-3xl font-bold" style={{ color: '#222' }}>{analytics?.averageOrderValue || 0} ETB</p>
            <p className="text-sm mt-1" style={{ color: '#222' }}>Per order</p>
          </div>
          <div className="w-12 h-12" style={{ backgroundColor: '#dd804f22', borderRadius: '0.5rem' }}>
            <span className="text-2xl flex items-center justify-center h-full" style={{ color: '#222' }}>📊</span>
          </div>
        </div>

        {/* Total Foods */}
        <div className="bg-white rounded-xl shadow p-6 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium" style={{ color: '#dd804f' }}>Total Foods</p>
            <p className="text-3xl font-bold" style={{ color: '#222' }}>{analytics?.totalFoods || 0}</p>
            <p className="text-sm mt-1" style={{ color: '#222' }}>In menu</p>
          </div>
          <div className="w-12 h-12" style={{ backgroundColor: '#dd804f22', borderRadius: '0.5rem' }}>
            <span className="text-2xl flex items-center justify-center h-full" style={{ color: '#222' }}>🍽️</span>
          </div>
        </div>
      </div>

      {/* Order Status + Top Foods Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Order Status Breakdown */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-6" style={{ color: '#222' }}>Order Status Breakdown</h2>
          <div className="space-y-4">
            <StatusRow
              emoji="⏳"
              label={<span style={{ color: '#dd804f' }}>Pending</span>}
              subLabel={<span style={{ color: '#a05a2c' }}>Awaiting confirmation</span>}
              value={
                <span className="font-bold text-lg" style={{ color: '#dd804f' }}>
                  {analytics?.pendingOrders || 0}
                </span>
              }
              bg="bg-[#fff7ed]"
              text="text-[#dd804f]"
            />
            <StatusRow
              emoji="✅"
              label={<span style={{ color: '#22a06b' }}>Confirmed</span>}
              subLabel={<span style={{ color: '#1b6b47' }}>Ready for delivery</span>}
              value={
                <span className="font-bold text-lg" style={{ color: '#22a06b' }}>
                  {analytics?.confirmedOrders || 0}
                </span>
              }
              bg="bg-[#f3f4f6]"
              text="text-[#22a06b]"
            />
            <StatusRow
              emoji="🚚"
              label={<span style={{ color: '#3b82f6' }}>Delivered</span>}
              subLabel={<span style={{ color: '#1e40af' }}>Successfully completed</span>}
              value={
                <span className="font-bold text-lg" style={{ color: '#3b82f6' }}>
                  {analytics?.deliveredOrders || 0}
                </span>
              }
              bg="bg-[#e5e7eb]"
              text="text-[#3b82f6]"
            />
          </div>
        </div>

  {/* Top Foods Orders Chart */}
<div className="bg-white rounded-xl shadow-lg p-6 flex flex-col border" style={{ borderColor: '#dd804f22' }}>
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-xl font-semibold" style={{ color: '#222' }}>Top 3 Foods Orders</h2>
    <div className="flex items-center gap-2">
      <span className="text-sm" style={{ color: '#dd804f' }}>🔥 Most Popular</span>
    </div>
  </div>
  
  <div className="flex-1 min-h-[250px]">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart 
        data={(analytics?.topFoods || []).slice(0, 3)}
        margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
      >
        <defs>
          <linearGradient id="foodGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dd804f" stopOpacity={0.9}/>
            <stop offset="100%" stopColor="#dd804f" stopOpacity={0.6}/>
          </linearGradient>
        </defs>
        
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12, fill: '#222' }}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis 
          tick={{ fontSize: 12, fill: '#222' }} 
          allowDecimals={false}
          width={35}
        />
        <Tooltip
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '1px solid #dd804f', 
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
          labelStyle={{ 
            color: '#222', 
            fontWeight: 'bold',
            marginBottom: '8px'
          }}
          itemStyle={{ 
            color: '#222',
            padding: '4px 0'
          }}
          formatter={(value) => [`${value} orders`, '']}
          cursor={{ fill: '#dd804f11' }}
        />
        <Bar 
          dataKey="totalOrdered" 
          fill="url(#foodGradient)"
          radius={[4, 4, 0, 0]}
          barSize={40}
          animationDuration={1500}
        />
        
        {/* Add custom labels on top of bars */}
        {(analytics?.topFoods || []).slice(0, 3).map((entry, index) => (
          <text
            key={`label-${index}`}
            x={index * (100 / 3) + (100 / 3 / 2)} // Center of the bar
            y={250} // Position below the chart
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fill: '#222', fontSize: '12px' }}
          >
            {entry.name}
          </text>
        ))}
      </BarChart>
    </ResponsiveContainer>
  </div>
  
  {/* Additional stats summary */}
  <div className="mt-4 pt-4 border-t" style={{ borderColor: '#dd804f22' }}>
    <div className="grid grid-cols-3 gap-4">
      {(analytics?.topFoods || []).slice(0, 3).map((food, index) => (
        <div key={index} className="text-center">
          <div className="flex items-center justify-center mb-1">
            <span className="text-lg font-bold mr-1" style={{ color: '#dd804f' }}>
              #{index + 1}
            </span>
          </div>
          <p className="text-sm font-medium truncate" style={{ color: '#222' }}>
            {food.name}
          </p>
          <p className="text-xs" style={{ color: '#666' }}>
            {food.totalOrdered} orders
          </p>
        </div>
      ))}
    </div>
  </div>
  
  {/* View all foods link */}
  <div className="mt-4 text-center">
    <button 
      className="text-sm hover:underline transition-all"
      style={{ color: '#dd804f' }}
      onClick={() => {/* Add navigation to full analytics */}}
    >
      View Full Analytics →
    </button>
  </div>
</div>
      </div>

      {/* Top Performing Foods Table */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-6" style={{ color: '#222' }}>Top Performing Foods</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: '#dd804f33' }}>
                <th className="text-left py-3 px-4 font-medium" style={{ color: '#222' }}>Rank</th>
                <th className="text-left py-3 px-4 font-medium" style={{ color: '#222' }}>Food</th>
                <th className="text-left py-3 px-4 font-medium" style={{ color: '#222' }}>Category</th>
                <th className="text-left py-3 px-4 font-medium" style={{ color: '#222' }}>Price</th>
                <th className="text-left py-3 px-4 font-medium" style={{ color: '#222' }}>Rating</th>
                <th className="text-left py-3 px-4 font-medium" style={{ color: '#222' }}>Reviews</th>
              </tr>
            </thead>
            <tbody>
              {topFoods.length > 0 ? topFoods.map((food, index) => (
                <tr key={food._id} className="border-b hover:bg-[#f7f7f7]" style={{ borderColor: '#dd804f11' }}>
                  <td className="py-4 px-4">
                    <div className="w-8 h-8" style={{ backgroundColor: '#dd804f22', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="font-semibold text-sm" style={{ color: '#dd804f' }}>{index + 1}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 flex items-center gap-3">
                    <img src={food.image || '/api/placeholder/40/40'} alt={food.name} className="w-10 h-10 object-cover rounded-lg" />
                    <div>
                      <p className="font-medium" style={{ color: '#222' }}>{food.name}</p>
                      <p className="text-sm line-clamp-1" style={{ color: '#222', opacity: 0.7 }}>{food.description}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#dd804f22', color: '#dd804f' }}>
                      {food.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-semibold" style={{ color: '#dd804f' }}>{food.price} ETB</td>
                  <td className="py-4 px-4 flex items-center gap-1">
                    {renderStars(Math.floor(food.rating || 0))}
                    <span className="text-sm font-medium" style={{ color: '#222' }}>{food.rating || 0}</span>
                  </td>
                  <td className="py-4 px-4" style={{ color: '#222' }}>{food.numReviews || 0}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center" style={{ color: '#dd804f' }}>🍽️ No foods available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InsightCard label="Order Completion Rate" value={`${analytics?.completionRate || 0}%`} color="#dd804f" />
        <InsightCard label="Average Food Rating" value={analytics?.averageRating || 0} color="#222" />
        <InsightCard label="Total Reviews" value={analytics?.totalReviews || 0} color="#222" />
      </div>
    </div>
  )
}

// Helper components
const StatusRow = ({ emoji, label, subLabel, value, bg, text }) => (
  <div className={`flex items-center justify-between p-4 ${bg} rounded-lg`}>
    <div className="flex items-center gap-3">
      <span className="text-2xl">{emoji}</span>
      <div>
        <p className="font-medium" style={{ color: '#222' }}>{label}</p>
        <p className="text-sm" style={{ color: '#222', opacity: 0.7 }}>{subLabel}</p>
      </div>
    </div>
    <span className="text-2xl font-bold" style={{ color: text.replace('text-', '') }}>{value}</span>
  </div>
)

const InsightCard = ({ label, value, color }) => (
  <div className="bg-white rounded-xl shadow p-6 text-center">
    <div className="text-3xl font-bold mb-2" style={{ color }}>{value}</div>
    <p style={{ color: '#222', opacity: 0.7 }}>{label}</p>
  </div>
)
