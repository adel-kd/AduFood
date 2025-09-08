import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/authcontext'
import { CartContext } from '../contexts/cartcontext'
import { addFavorite, removeFavorite } from '../api/favorite'
import { addToCart } from '../api/cart'

export default function FoodCard({ food }) {
  const { user } = useContext(AuthContext)
  const { addItemToCart } = useContext(CartContext)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [imageError, setImageError] = useState(false)

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

  // Default food images based on category
  const getDefaultImage = (category) => {
    const images = {
      burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&auto=format',
      pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop&auto=format',
      ethiopian: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop&auto=format',
      drinks: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop&auto=format',
      dessert: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop&auto=format'
    }
    return images[category] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop&auto=format'
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div className="bg-gray-800 rounded-xl shadow-adu overflow-hidden hover:shadow-adu-lg transition-all duration-300 group border border-gray-700">
      <div className="relative">
        <Link to={`/food/${food._id}`}>
          {imageError ? (
            <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">🍽️</div>
                <p className="text-gray-400 text-sm">Image not available</p>
              </div>
            </div>
          ) : (
            <img 
              src={food.image || getDefaultImage(food.category)} 
              alt={food.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={handleImageError}
            />
          )}
        </Link>
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            {food.category || 'Food'}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 p-2 bg-gray-800/90 rounded-full hover:bg-gray-700/90 transition-colors"
        >
          <span className={`text-lg ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}>
            {isFavorite ? '❤️' : '🤍'}
          </span>
        </button>
      </div>

      <div className="p-4">
        <Link to={`/food/${food._id}`}>
          <h3 className="font-display font-semibold text-lg text-white mb-2 group-hover:text-primary-400 transition-colors">
            {food.name}
          </h3>
        </Link>
        
        <p className="text-gray-300 text-sm mb-3 line-clamp-2">
          {food.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex">
            {renderStars(food.rating || 0)}
          </div>
          <span className="text-sm text-gray-400">
            ({food.numReviews || 0} reviews)
          </span>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-bold text-primary-400">
              {food.price}
            </span>
            <span className="text-sm text-gray-400">ETB</span>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isAddingToCart ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding...
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
    </div>
  )
}
