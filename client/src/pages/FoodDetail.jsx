// FoodDetail.jsx
import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { getFood } from '../api/food'
import { addToCart as addToCartApi } from '../api/cart'
import { addFavorite, removeFavorite } from '../api/favorite'
import { addReview, updateReview, deleteReview, getReviews } from '../api/review'
import { AuthContext } from '../contexts/authcontext'
import { CartContext } from '../contexts/cartcontext'

export default function FoodDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const { addItemToCart } = useContext(CartContext)

  const [food, setFood] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({ 
    rating: 0, 
    comment: '', 
    showName: true 
  })
  const [editingReviewId, setEditingReviewId] = useState(null)

  useEffect(() => {
    fetchFood()
    fetchReviews()
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

  const fetchReviews = async () => {
    try {
      const res = await getReviews(id)
      setReviews(res.data.reviews || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
      setReviews([])
    }
  }

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please login to add items to cart')
      return
    }
    setIsAddingToCart(true)
    try {
      await addToCartApi({ foodId: food._id, quantity: 1 })
      addItemToCart(food, 1)
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add to cart')
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleFavorite = () => {
    if (!user) {
      alert('Please login to add favorites')
      return
    }
    setIsFavorite(!isFavorite)
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('Please login to write a review')
      return
    }
    if (!reviewForm.rating || !reviewForm.comment) {
      alert('Please provide rating and comment')
      return
    }

    try {
      if (editingReviewId) {
        // Update existing review
        await updateReview(editingReviewId, { 
          rating: reviewForm.rating, 
          comment: reviewForm.comment,
          showName: reviewForm.showName
        })
      } else {
        // Create new review
        await addReview({ 
          foodId: id, 
          rating: reviewForm.rating, 
          comment: reviewForm.comment,
          showName: reviewForm.showName
        })
      }
      
      setReviewForm({ rating: 0, comment: '', showName: true })
      setShowReviewForm(false)
      setEditingReviewId(null)
      fetchFood() 
      fetchReviews() 
    } catch (error) {
      console.error('Error submitting review:', error)
      alert(error.response?.data?.message || 'Failed to submit review')
    }
  }

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete your review?')) return
    try {
      await deleteReview(reviewId)
      setShowReviewForm(false)
      setReviewForm({ rating: 0, comment: '', showName: true })
      setEditingReviewId(null)
      fetchFood() 
      fetchReviews() 
    } catch (error) {
      console.error('Error deleting review:', error)
      alert('Failed to delete review')
    }
  }

  const handleEditReview = (review) => {
    setReviewForm({ 
      rating: review.rating, 
      comment: review.comment,
      showName: review.showName !== undefined ? review.showName : true
    })
    setEditingReviewId(review._id)
    setShowReviewForm(true)
  }

  const handleCancelReview = () => {
    setReviewForm({ rating: 0, comment: '', showName: true })
    setEditingReviewId(null)
    setShowReviewForm(false)
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} style={{ color: '#dd804f' }}>★</span>)
    }

    const emptyStars = 5 - fullStars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">★</span>)
    }
    return stars
  }

  const handleImageError = (e) => {
    e.target.src = '/image-not-found.png'
    e.target.onerror = null 
    e.target.className = 'w-full h-96 object-contain rounded-xl bg-gray-100 p-8'
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-16">
          <div 
            className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-t-transparent"
            style={{ borderColor: '#dd804f' }}
          ></div>
          <p className="mt-4 text-lg text-gray-600">Loading food details...</p>
        </div>
      </div>
    )
  }

  if (!food) {
    return (
      <div className="max-w-7xl mx-auto text-center py-16 bg-white rounded-xl">
        <div className="text-6xl mb-4">🍽️</div>
        <h3 className="text-2xl font-semibold mb-2" style={{ color: '#dd804f' }}>Food not found</h3>
        <p className="text-gray-600">The food item you're looking for doesn't exist.</p>
      </div>
    )
  }

  const userReview = reviews.find(r => r.user?._id === user?._id)

  return (
    <div className="max-w-7xl mx-auto px-4 bg-white min-h-screen py-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 transition-colors hover:opacity-80"
        style={{ color: '#dd804f' }}
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden">
            <img
              src={food.image}
              alt={food.name}
              className="w-full h-96 object-cover rounded-xl"
              onError={handleImageError}
            />
            <div className="absolute top-4 left-4">
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ background: '#dd804f', color: '#fff' }}
              >
                {food.category || 'Food'}
              </span>
            </div>

            <button
              onClick={handleFavorite}
              className="absolute top-4 right-4 p-3 rounded-full transition-colors bg-black/20 backdrop-blur-sm hover:bg-black/30"
              style={{ border: '2px solid #dd804f' }}
            >
              <span className="text-xl text-white">
                {isFavorite ? '❤️' : '🤍'}
              </span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">{food.name}</h1>
          <p className="text-lg leading-relaxed text-gray-700">{food.description}</p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex">{renderStars(food.rating || 0)}</div>
              <span className="text-gray-600">{food.rating?.toFixed(1) || 0} ({food.numReviews || 0} reviews)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-4xl font-bold" style={{ color: '#dd804f' }}>{food.price}</span>
            <span className="text-lg text-gray-600">ETB</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="w-full py-4 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg text-white"
            style={{ 
              background: isAddingToCart ? '#b96a3e' : '#dd804f',
              hover: { background: '#c9723c' }
            }}
          >
            {isAddingToCart ? (
              <>
                <div 
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"
                ></div>
                Adding to Cart...
              </>
            ) : (
              <>🛒 Add to Cart</>
            )}
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-900">Reviews & Ratings</h2>

          {user && !userReview && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-4 py-2 rounded-lg font-medium text-white transition-colors hover:opacity-90"
              style={{ background: '#dd804f' }}
            >
              Write a Review
            </button>
          )}

          {user && userReview && !showReviewForm && (
            <div className="flex gap-2">
              <button
                onClick={() => handleEditReview(userReview)}
                className="px-4 py-2 rounded-lg font-medium text-white transition-colors hover:opacity-90"
                style={{ background: '#dd804f' }}
              >
                Edit Review
              </button>
              <button
                onClick={() => handleDeleteReview(userReview._id)}
                className="px-4 py-2 rounded-lg font-medium text-white transition-colors hover:opacity-90"
                style={{ background: '#666' }}
              >
                Delete Review
              </button>
            </div>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div 
            className="rounded-xl p-6 mb-6 border"
            style={{ background: '#fef7f3', borderColor: '#dd804f' }}
          >
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              {editingReviewId ? 'Edit Your Review' : 'Write a Review'}
            </h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Rating</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className="text-2xl transition-transform hover:scale-110"
                      style={{ color: star <= reviewForm.rating ? '#dd804f' : '#d1d5db' }}
                    >★</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Comment</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 bg-white text-gray-900"
                  style={{ borderColor: '#dd804f', focusRingColor: '#dd804f' }}
                  placeholder="Share your experience..."
                  rows="4"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showName"
                  checked={reviewForm.showName}
                  onChange={(e) => setReviewForm({ ...reviewForm, showName: e.target.checked })}
                  className="rounded border-gray-300"
                  style={{ accentColor: '#dd804f' }}
                />
                <label htmlFor="showName" className="text-sm text-gray-700">
                  Show my name with this review
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg font-medium text-white transition-colors hover:opacity-90"
                  style={{ background: '#dd804f' }}
                >
                  {editingReviewId ? 'Update Review' : 'Submit Review'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelReview}
                  className="px-6 py-2 rounded-lg font-medium text-white transition-colors hover:opacity-90"
                  style={{ background: '#666' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map(review => (
              <div
                key={review._id}
                className="rounded-xl p-6 border relative"
                style={{ background: '#fef7f3', borderColor: '#dd804f' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: '#dd804f' }}
                    >
                      <span className="font-medium text-white">
                        {review.showName ? (review.user?.name?.charAt(0) || 'U') : 'A'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {review.showName ? (review.user?.name || 'User') : 'Anonymous'}
                      </p>
                      <div className="flex">{renderStars(review.rating)}</div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))
          ) : (
            <div 
              className="text-center py-8 rounded-xl border"
              style={{ background: '#fef7f3', borderColor: '#dd804f' }}
            >
              <div className="text-4xl mb-4">⭐</div>
              <p className="text-gray-600">No reviews yet. Be the first to review this food!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}