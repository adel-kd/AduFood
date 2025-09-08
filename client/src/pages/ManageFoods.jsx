import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listFoods, deleteFood } from '../api/food'

export default function ManageFoods() {
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  useEffect(() => {
    fetchFoods()
  }, [])

  const fetchFoods = async () => {
    try {
      setLoading(true)
      const response = await listFoods({ search, category: category === 'all' ? undefined : category })
      setFoods(response.data.foods)
    } catch (error) {
      console.error('Error fetching foods:', error)
    } finally {
      setLoading(false)
    }
  }

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
          <p className="mt-4 text-gray-600 text-lg">Loading foods...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Manage Foods</h1>
          <p className="text-gray-600 mt-2">Add, edit, or delete food items in your menu</p>
        </div>
        <Link
          to="/admin/food/new"
          className="mt-4 sm:mt-0 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
        >
          <span>➕</span>
          Add New Food
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-ethiopian p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search foods..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">��</span>
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 min-w-[150px]"
          >
            <option value="all">All Categories</option>
            <option value="burger">Burger</option>
            <option value="pizza">Pizza</option>
            <option value="ethiopian">Ethiopian</option>
            <option value="drinks">Drinks</option>
            <option value="dessert">Dessert</option>
          </select>
          <button
            onClick={fetchFoods}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Foods Table */}
      <div className="bg-white rounded-xl shadow-ethiopian overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Food</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Category</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Price</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Rating</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Reviews</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {foods.length > 0 ? (
                foods.map((food) => (
                  <tr key={food._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={food.image || '/api/placeholder/50/50'}
                          alt={food.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{food.name}</p>
                          <p className="text-sm text-gray-600 line-clamp-1">{food.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs font-medium">
                        {food.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-primary-500">{food.price} ETB</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <div className="flex">
                          {renderStars(Math.floor(food.rating || 0))}
                        </div>
                        <span className="text-sm font-medium">{food.rating || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{food.numReviews || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/food/${food._id}`}
                          className="text-primary-500 hover:text-primary-600 font-medium text-sm"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(food._id, food.name)}
                          className="text-red-500 hover:text-red-600 font-medium text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-4xl mb-2">🍽️</div>
                    <p className="text-gray-500">No foods found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-ethiopian p-6 text-center">
          <div className="text-3xl font-bold text-primary-500 mb-2">{foods.length}</div>
          <p className="text-gray-600">Total Foods</p>
        </div>
        <div className="bg-white rounded-xl shadow-ethiopian p-6 text-center">
          <div className="text-3xl font-bold text-secondary-500 mb-2">
            {foods.reduce((sum, food) => sum + (food.numReviews || 0), 0)}
          </div>
          <p className="text-gray-600">Total Reviews</p>
        </div>
        <div className="bg-white rounded-xl shadow-ethiopian p-6 text-center">
          <div className="text-3xl font-bold text-accent-500 mb-2">
            {foods.length > 0 ? (foods.reduce((sum, food) => sum + (food.rating || 0), 0) / foods.length).toFixed(1) : 0}
          </div>
          <p className="text-gray-600">Average Rating</p>
        </div>
      </div>
    </div>
  )
}
