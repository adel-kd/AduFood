import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getFood, createReview } from '../api/food'
import { addToCart } from '../api/cart'
import { addFavorite, removeFavorite } from '../api/favorite'
import { AuthContext } from '../contexts/authcontext'
import { CartContext } from '../contexts/cartcontext'

export default function FoodDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const { addItemToCart } = useContext(CartContext)
  
  const [food, setFood] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' })
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    fetchFood()
  }, [id])

  const fetchFood = async () => {
    try {
      setLoading(true)
      const res = await getFood(id)
      setFood(res.data)
    } catch (error) {
      console.error('Error fetching food:', error)
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please login to add items to cart')
      return
    }
    
    setIsAddingToCart(true)
    try {
      await addToCart({ foodId: food._id, quantity: 1 })
      addItemToCart(food, 1)
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add to cart')
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleFavorite = async () => {
    if (!user) {
      alert('Please login to add favorites')
      return
    }

    try {
      if (isFavorite) {
        await removeFavorite(food._id)
        setIsFavorite(false)
      } else {
        await addFavorite(food._id)
        setIsFavorite(true)
      }
    } catch (error) {
      console.error('Error updating favorite:', error)
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('Please login to write a review')
      return
    }

    try {
      await createReview(id, reviewForm)
      setReviewForm({ rating: 0, comment: '' })
      setShowReviewForm(false)
      fetchFood() // Refresh food data to show new review
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Failed to submit review')
    }
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400">★</span>
      )
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400">☆</span>
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-600">★</span>
      )
    }

    return stars
  }

  const getDefaultImage = (category) => {
    const images = {
      burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop&auto=format',
      pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop&auto=format',
      ethiopian: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop&auto=format',
      drinks: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&h=400&fit=crop&auto=format',
      dessert: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=400&fit=crop&auto=format'
    }
    return images[category] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&auto=format'
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-300 text-lg">Loading food details...</p>
        </div>
      </div>
    )
  }

  if (!food) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-2xl font-semibold text-gray-100 mb-2">Food not found</h3>
          <p className="text-gray-400">The food item you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <span>←</span>
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="relative">
            {imageError ? (
              <div className="w-full h-96 bg-gray-700 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🍽️</div>
                  <p className="text-gray-400">Image not available</p>
                </div>
              </div>
            ) : (
              <img
                src={food.image || getDefaultImage(food.category)}
                alt={food.name}
                className="w-full h-96 object-cover rounded-xl"
                onError={() => setImageError(true)}
              />
            )}
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {food.category || 'Food'}
              </span>
            </div>

            {/* Favorite Button */}
            <button
              onClick={handleFavorite}
              className="absolute top-4 right-4 p-3 bg-gray-800/90 rounded-full hover:bg-gray-700/90 transition-colors"
            >
              <span className={`text-xl ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}>
                {isFavorite ? '❤️' : '🤍'}
              </span>
            </button>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-display font-bold text-white mb-4">{food.name}</h1>
            <p className="text-gray-300 text-lg leading-relaxed">{food.description}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex">
                {renderStars(food.rating || 0)}
              </div>
              <span className="text-gray-400">
                {food.rating || 0} ({food.numReviews || 0} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-4xl font-bold text-primary-400">{food.price}</span>
            <span className="text-gray-400 text-lg">ETB</span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white py-4 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
          >
            {isAddingToCart ? (
              <>
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding to Cart...
              </>
            ) : (
              <>
                <span>🛒</span>
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-white">Reviews & Ratings</h2>
          {user && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Write a Review
            </button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="bg-gray-800 rounded-xl shadow-adu p-6 mb-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Write a Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className={`text-2xl ${star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Comment</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-700 text-white placeholder-gray-400"
                  placeholder="Share your experience..."
                  rows="4"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Submit Review
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {food.reviews && food.reviews.length > 0 ? (
            food.reviews.map((review) => (
              <div key={review._id} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {review.user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-white">{review.user?.name || 'Anonymous'}</p>
                      <div className="flex">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </div>
                  <span className="text-gray-400 text-sm">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-300">{review.comment}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">⭐</div>
              <p className="text-gray-400">No reviews yet. Be the first to review this food!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
