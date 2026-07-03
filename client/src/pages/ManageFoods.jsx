import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listFoods, deleteFood, listCategories } from '../api/food'

export default function ManageFoods() {
  const [foods, setFoods] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  // Fetch foods
  const fetchFoods = async () => {
    try {
      setLoading(true)
      const params = { keyword: search }
      if (selectedCategory) {
        params.category = selectedCategory
      }
      const res = await listFoods(params)
      setFoods(res.data.foods)
    } catch (error) {
      console.error('Error fetching foods:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await listCategories()
      setCategories(res.data.categories || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      // If categories endpoint fails, extract from foods
      try {
        const foodsRes = await listFoods({})
        const uniqueCategories = [...new Set(foodsRes.data.foods
          .map(food => food.category)
          .filter(category => category && category.trim() !== '')
        )];
        setCategories(uniqueCategories);
      } catch (fallbackError) {
        console.error('Error fetching foods for categories:', fallbackError)
      }
    }
  }

  useEffect(() => {
    fetchCategories()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    fetchFoods()
    // eslint-disable-next-line
  }, [search, selectedCategory])

  const handleDelete = async (foodId, foodName) => {
    if (window.confirm(`Are you sure you want to delete "${foodName}"?`)) {
      try {
        await deleteFood(foodId)
        setFoods(foods.filter(food => food._id !== foodId))
        alert('Food deleted successfully!')
      } catch (error) {
        console.error('Error deleting food:', error)
        alert('Failed to delete food')
      }
    }
  }

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-lg ${i <= rating ? 'text-amber-400' : 'text-gray-600'}`}>
          ★
        </span>
      )
    }
    return stars
  }

  // Helper for food "status" color
  const getCategoryColor = (category) => {
    if (!category) return 'bg-gray-600 text-white'
    const colors = [
      'bg-amber-500/20 text-amber-400',
      'bg-emerald-500/20 text-emerald-400',
      'bg-rose-500/20 text-rose-400',
      'bg-blue-500/20 text-blue-400',
      'bg-purple-500/20 text-purple-400'
    ]
    return colors[category.length % colors.length]
  }

  // Helper for food "icon" based on category
  const getFoodIcon = (category) => {
    if (!category) return '🍽️'
    const icons = {
      'traditional': '🍛',
      'breakfast': '🥞',
      'lunch': '🍲',
      'dinner': '🍴',
      'drink': '🥤',
      'dessert': '🍰'
    }
    return icons[category.toLowerCase()] || '🍽️'
  }

  // Helper for formatting price
  const formatPrice = (price) => `${price} ETB`

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#dd804f] mb-2">Manage Foods</h1>
            <p className="text-gray-600">Add, edit, or delete food items in your menu</p>
          </div>
          <Link
            to="/admin/food/new"
            className="mt-4 sm:mt-0 px-6 py-3 bg-[#dd804f] hover:bg-[#c9723c] text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 shadow-sm"
          >
            <span className="text-lg">➕</span>
            Add New Food
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-[#dd804f] text-lg">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Search foods by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#dd804f] focus:border-transparent text-gray-900 placeholder-gray-400 transition-colors"
              />
            </div>
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-[#dd804f] text-lg">📋</span>
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#dd804f] focus:border-transparent text-gray-900 appearance-none transition-colors"
              >
                <option value="">All Categories</option>
                {categories.map((category, index) => (
                  <option key={index} value={category._id || category}>
                    {category.name || category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { title: 'Total Foods', value: foods.length, icon: '🍽️', color: 'amber' },
            { 
              title: 'Total Reviews', 
              value: foods.reduce((sum, food) => sum + (food.numReviews || 0), 0), 
              icon: '⭐', 
              color: 'blue' 
            },
            { 
              title: 'Average Rating', 
              value: foods.length > 0 ? (foods.reduce((sum, food) => sum + (food.rating || 0), 0) / foods.length).toFixed(1) : 0, 
              icon: '🌟', 
              color: 'green' 
            },
            { 
              title: 'Total Value', 
              value: foods.reduce((sum, food) => sum + (food.price || 0), 0).toFixed(0), 
              icon: '💰', 
              color: 'purple' 
            }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <span className="text-3xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Foods List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#dd804f]"></div>
              <p className="mt-4 text-lg text-[#dd804f]">Loading foods...</p>
            </div>
          ) : foods.length > 0 ? (
            foods.map((food) => (
              <div key={food._id} className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                {/* Food Header */}
                <div className="p-6 bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getFoodIcon(food.category?.name || food.category)}</span>
                        <h3 className="text-xl font-semibold text-gray-900">{food.name}</h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{food.description}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(food.category)}`}>
                        {food.category?.name || food.category || 'Uncategorized'}
                      </span>
                      <span className="text-xl font-bold text-[#dd804f]">
                        {formatPrice(food.price)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Food Details */}
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <img
                        src={food.image || '/api/placeholder/80/80'}
                        alt={food.name}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex">{renderStars(Math.floor(food.rating || 0))}</div>
                          <span className="text-sm font-medium text-gray-900">{food.rating || 0}/5</span>
                        </div>
                        <span className="text-sm text-gray-500">{food.numReviews || 0} reviews</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/admin/food/${food._id}`}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(food._id, food.name)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-[#dd804f] mb-2">No foods found</h3>
              <p className="text-gray-500">Try adjusting your search or add a new food item</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}