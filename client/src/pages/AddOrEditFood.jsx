import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getFood, createFood, updateFood } from '../api/food'
import mongoose from 'mongoose'



const renderStars = (rating) => {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  for (let i = 0; i < fullStars; i++) {
    stars.push(<span key={i} className="text-yellow-400">★</span>)
  }

  if (hasHalfStar) {
    stars.push(<span key="half" className="text-yellow-400">☆</span>)
  }

  const emptyStars = 5 - Math.ceil(rating)
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<span key={`empty-${i}`} className="text-gray-600">★</span>)
  }

  return stars
}

export default function AddOrEditFood() {
  const { id } = useParams()
  const navigate = useNavigate()

  const isEdit = id && mongoose.Types.ObjectId.isValid(id)

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: ''
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [imageError, setImageError] = useState(false)

  const previewCardRef = useRef(null)
  const rotateAmplitude = 12
  const scaleOnHover = 1.05

  const handlePreviewMouseMove = (e) => {
    const card = previewCardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rotateY = ((x / rect.width) - 0.5) * 2 * rotateAmplitude
    const rotateX = -((y / rect.height) - 0.5) * 2 * rotateAmplitude
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scaleOnHover})`
  }
  const handlePreviewMouseLeave = () => {
    const card = previewCardRef.current
    if (card) card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)'
  }

  useEffect(() => {
    if (isEdit) fetchFood()
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
        price: parseFloat(form.price),
        image: form.image || 'https://via.placeholder.com/400x300?text=No+Image'
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
      alert('Failed to save food. Make sure all required fields are valid.')
    } finally {
      setLoading(false)
    }
  }

  const handleImageError = () => setImageError(true)

  if (fetching) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#dd804f', borderBottomColor: 'transparent' }}></div>
          <p className="mt-4 text-lg" style={{ color: '#222' }}>Loading food details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold" style={{ color: '#dd804f' }}>
          {isEdit ? 'Edit Food Item' : 'Add New Food Item'}
        </h1>
        <p className="mt-2" style={{ color: '#fff' }}>
          {isEdit
            ? 'Update the food item details'
            : 'Create a new food item for your menu'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Form Box */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-6" style={{ color: '#222' }}>Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2" style={{ color: '#222' }}>Food Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter food name"
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: '#e5e7eb',
                  color: '#222',
                  backgroundColor: '#fff'
                }}
                onFocus={e => e.target.style.borderColor = '#dd804f'}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2" style={{ color: '#222' }}>Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the food item"
                rows="4"
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: '#e5e7eb',
                  color: '#222',
                  backgroundColor: '#fff'
                }}
                onFocus={e => e.target.style.borderColor = '#dd804f'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#222' }}>Price (ETB) *</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: '#e5e7eb',
                  color: '#222',
                  backgroundColor: '#fff'
                }}
                onFocus={e => e.target.style.borderColor = '#dd804f'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#222' }}>Category *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: '#e5e7eb',
                  color: '#222',
                  backgroundColor: '#fff'
                }}
                onFocus={e => e.target.style.borderColor = '#dd804f'}
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
              <label className="block text-sm font-medium mb-2" style={{ color: '#222' }}>Image URL</label>
              <input
                type="url"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: '#e5e7eb',
                  color: '#222',
                  backgroundColor: '#fff'
                }}
                onFocus={e => e.target.style.borderColor = '#dd804f'}
              />
              <p className="text-sm mt-1" style={{ color: '#888' }}>Optional: Add an image URL for the food item</p>
            </div>
          </div>
        </div>

        {form.name && (
          <div className="bg-transparent rounded-xl shadow-none p-0">
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#fff' }}>Preview</h2>
            <div className="max-w-sm">
              <div
              
                className="bg-gray-800 rounded-xl shadow-adu overflow-hidden transition-transform duration-300 group border border-gray-700 cursor-pointer relative"
                style={{ minHeight: 0 }}
              >
                <div className="relative">
                  {imageError || !form.image ? (
                    <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🍽️</div>
                        <p className="text-gray-400 text-sm">Image not available</p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={form.image}
                      alt={form.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={handleImageError}
                    />
                  )}

                  <div className="absolute top-3 left-3">
                    <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {form.category || 'Food'}
                    </span>
                  </div>
               
                </div>

                <div className="p-4">
                  <h3 className="font-display font-semibold text-lg text-white mb-2 group-hover:text-primary-400 transition-colors">
                    {form.name}
                  </h3>
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                    {form.description}
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {renderStars(0)}
                    </div>
                    <span className="text-sm text-gray-400">
                      (0 reviews)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-2xl font-bold text-primary-400">
                        {form.price || 0}
                      </span>
                      <span className="text-sm text-gray-400">ETB</span>
                    </div>
                    <button
                      className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                      type="button"
                      tabIndex={-1}
                      disabled
                      style={{ opacity: 0.7, cursor: 'not-allowed' }}
                    >
                      <span>🛒</span>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/foods')}
            className="px-6 py-3 border rounded-lg transition-colors"
            style={{
              borderColor: '#dd804f',
              color: '#222',
              backgroundColor: '#fff'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
            style={{
              backgroundColor: loading ? '#e6a77e' : '#dd804f',
              color: '#fff',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
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
