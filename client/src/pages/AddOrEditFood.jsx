import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getFood, createFood, updateFood } from '../api/food'

export default function AddOrEditFood() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: ''
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  useEffect(() => {
    if (isEdit) {
      fetchFood()
    }
  }, [id])

  const fetchFood = async () => {
    try {
      setFetching(true)
      const response = await getFood(id)
      const food = response.data
      setForm({
        name: food.name || '',
        description: food.description || '',
        price: food.price || '',
        category: food.category || '',
        image: food.image || ''
      })
    } catch (error) {
      console.error('Error fetching food:', error)
      alert('Failed to fetch food details')
    } finally {
      setFetching(false)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const foodData = {
        ...form,
        price: parseFloat(form.price)
      }
      
      if (isEdit) {
        await updateFood(id, foodData)
        alert('Food updated successfully!')
      } else {
        await createFood(foodData)
        alert('Food created successfully!')
      }
      
      navigate('/admin/foods')
    } catch (error) {
      console.error('Error saving food:', error)
      alert('Failed to save food')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading food details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900">
          {isEdit ? 'Edit Food Item' : 'Add New Food Item'}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEdit ? 'Update the food item details' : 'Create a new food item for your menu'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl shadow-ethiopian p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Food Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter food name"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the food item"
                rows="4"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (ETB) *</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                <option value="burger">🍔 Burger</option>
                <option value="pizza">🍕 Pizza</option>
                <option value="ethiopian">🇪🇹 Ethiopian</option>
                <option value="drinks">🥤 Drinks</option>
                <option value="dessert">🍰 Dessert</option>
                <option value="appetizer">🥗 Appetizer</option>
                <option value="main-course">🍽️ Main Course</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <input
                type="url"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">Optional: Add an image URL for the food item</p>
            </div>
          </div>
        </div>

        {/* Preview */}
        {form.name && (
          <div className="bg-white rounded-xl shadow-ethiopian p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Preview</h2>
            <div className="max-w-sm">
              <div className="bg-white rounded-xl shadow-ethiopian overflow-hidden">
                <div className="relative">
                  {form.image ? (
                    <img 
                      src={form.image} 
                      alt={form.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-4xl">🍽️</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {form.category || 'Food'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-display font-semibold text-lg text-gray-900 mb-2">{form.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{form.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-2xl font-bold text-primary-500">{form.price || 0}</span>
                      <span className="text-sm text-gray-500">ETB</span>
                    </div>
                    <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/foods')}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {isEdit ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <span>{isEdit ? '✏️' : '➕'}</span>
                {isEdit ? 'Update Food' : 'Create Food'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
