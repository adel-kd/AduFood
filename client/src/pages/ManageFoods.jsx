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
        <span key={i} style={{ color: i <= rating ? '#dd804f' : '#222', fontSize: '1rem' }}>
          ★
        </span>
      )
    }
    return stars
  }

  // Helper for food "status" color (for visual consistency)
  const getCategoryColor = (category) => {
    if (!category) return 'bg-gray-100 text-black font-bold'
    return 'bg-yellow-500/20 text-yellow-400 font-bold'
  }

  // Helper for food "icon"
  const getFoodIcon = () => '🍽️'

  // Helper for formatting price
  const formatPrice = (price) => `${price} ETB`

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-6" style={{ color: '#dd804f' }}>Manage Foods</h1>
          <p className="mt-2" style={{ color: '#fff' }}>Add, edit, or delete food items in your menu</p>
        </div>
        <Link
          to="/admin/food/new"
          className="mt-4 sm:mt-0 px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
          style={{
            background: '#dd804f',
            color: '#fff',
            fontWeight: 600
          }}
        >
          <span>➕</span>
          Add New Food
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="rounded-xl shadow-adu p-6 mb-8 border" style={{ background: '#181818', borderColor: '#222' }}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search foods..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-4 pl-12 border-2 rounded-xl focus:outline-none focus:border-[#dd804f] text-lg"
              style={{
                borderColor: '#222',
                background: '#111',
                color: '#fff',
                fontWeight: 500
              }}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl" style={{ color: '#dd804f' }}>🔎</span>
          </div>
          <div className="relative w-full sm:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-4 pl-10 border-2 rounded-xl focus:outline-none focus:border-[#dd804f] text-lg appearance-none"
              style={{
                borderColor: '#222',
                background: '#111',
                color: '#fff',
                fontWeight: 500
              }}
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category._id || category}>
                  {category.name || category}
                </option>
              ))}
            </select>
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl" style={{ color: '#dd804f' }}></span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-10 mb-10">
        <div className="rounded-xl shadow-ethiopian p-6 text-center" style={{ background: '#181818' }}>
          <div className="text-3xl font-bold mb-2" style={{ color: '#fff' }}>{foods.length}</div>
          <p style={{ color: '#fff' }}>Total Foods</p>
        </div>
        <div className="rounded-xl shadow-ethiopian p-6 text-center" style={{ background: '#181818' }}>
          <div className="text-3xl font-bold mb-2" style={{ color: '#fff' }}>
            {foods.reduce((sum, food) => sum + (food.numReviews || 0), 0)}
          </div>
          <p style={{ color: '#fff' }}>Total Reviews</p>
        </div>
        <div className="rounded-xl shadow-ethiopian p-6 text-center" style={{ background: '#181818' }}>
          <div className="text-3xl font-bold mb-2" style={{ color: '#fff' }}>
            {foods.length > 0 ? (foods.reduce((sum, food) => sum + (food.rating || 0), 0) / foods.length).toFixed(1) : 0}
          </div>
          <p style={{ color: '#fff' }}>Average Rating</p>
        </div>
        <div className="rounded-xl shadow-ethiopian p-6 text-center" style={{ background: '#181818' }}>
          <div className="text-3xl font-bold mb-2" style={{ color: '#fff' }}>
            {foods.reduce((sum, food) => sum + (food.price || 0), 0).toFixed(2)} ETB
          </div>
          <p style={{ color: '#fff' }}>Total Value</p>
        </div>
      </div>

      {/* Foods List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#dd804f' }}></div>
            <p className="mt-4 text-lg" style={{ color: '#dd804f' }}>Loading foods...</p>
          </div>
        ) : foods.length > 0 ? (
          foods.map((food) => (
            <div key={food._id} className="rounded-xl shadow-ethiopian overflow-hidden" style={{ background: '#222' }}>
              {/* Food Header */}
              <div className="p-6 border-b-0" style={{ background: '#181818' }}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: '#fff' }}>
                      {getFoodIcon()} {food.name}
                    </h3>
                    <p className="text-sm" style={{ color: '#888' }}>{food.description}</p>
                    <p className="text-sm" style={{ color: '#fff' }}>
                      Category: <span style={{ color: '#fff', fontWeight: 600 }}>{food.category?.name || food.category || 'Uncategorized'}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(food.category)}`}
                      style={{
                        background: '#dd804f22',
                        color: '#dd804f',
                        fontWeight: 600
                      }}
                    >
                      {food.category?.name || food.category || 'Uncategorized'}
                    </span>
                    <span className="text-xl font-bold" style={{ color: '#dd804f' }}>
                      {formatPrice(food.price)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Food Details */}
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={food.image || '/api/placeholder/60/60'}
                      alt={food.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      style={{ border: 'none', background: '#fff' }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="flex">{renderStars(Math.floor(food.rating || 0))}</div>
                        <span className="text-sm font-medium" style={{ color: '#fff' }}>{food.rating || 0}</span>
                      </div>
                      <span className="text-sm" style={{ color: '#fff' }}>{food.numReviews || 0} reviews</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/admin/food/${food._id}`}
                      className="font-medium text-sm"
                      style={{ color: '#dd804f' }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(food._id, food.name)}
                      className="font-medium text-sm"
                      style={{ color: '#fff', background: '#dd804f', borderRadius: 6, padding: '2px 10px', fontWeight: 600 }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16" style={{ color: '#dd804f' }}>
            <div className="text-4xl mb-2">🍽️</div>
            No foods found
          </div>
        )}
      </div>
    </div>
  )
}