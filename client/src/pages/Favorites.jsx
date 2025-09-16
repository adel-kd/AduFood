import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getFavorites, removeFavorite } from '../api/favorite'
import { AuthContext } from '../contexts/authcontext'
import { useContext } from 'react'

export default function Favorites() {
  const { user } = useContext(AuthContext)
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchFavorites()
    }
  }, [user])

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      const response = await getFavorites()
      setFavorites(response.data)
    } catch (error) {
      console.error('Error fetching favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = async (foodId) => {
    try {
      await removeFavorite(foodId)
      setFavorites(favorites.filter(fav => fav._id !== foodId))
    } catch (error) {
      console.error('Error removing favorite:', error)
      alert('Failed to remove from favorites')
    }
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-ethiopian-gold">★</span>
      )
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-ethiopian-gold">☆</span>
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">★</span>
      )
    }

    return stars
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading your favorites...</p>
        </div>
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">❤️</div>
          <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">No favorites yet</h2>
          <p className="text-gray-600 mb-8">Start adding your favorite foods to see them here!</p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <span>🍽️</span>
            Browse Menu
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
        <h1 className="text-2xl font-bold mb-6" style={{ color: '#dd804f' }}>My Favorites</h1>
          <p className="text-gray-600 mt-2">{favorites.length} favorite items</p>
        </div>
        <div className="flex items-center gap-2 text-primary-500">
          <span className="text-2xl">❤️</span>
          <span className="font-medium">Loved by you</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map((food) => (
          <div key={food._id} className="bg-white rounded-xl shadow-ethiopian overflow-hidden hover:shadow-ethiopian-lg transition-all duration-300 group">
            <div className="relative">
              <Link to={`/food/${food._id}`}>
                <img 
                  src={food.image || '/api/placeholder/300/200'} 
                  alt={food.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              
              {/* Category Badge */}
              <div className="absolute top-3 left-3">
                <span className="bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {food.category || 'Food'}
                </span>
              </div>

              {/* Remove from Favorites Button */}
              <button
                onClick={() => handleRemoveFavorite(food._id)}
                className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
              >
                <span className="text-lg text-primary-500">❤️</span>
              </button>
            </div>

            <div className="p-4">
              <Link to={`/food/${food._id}`}>
                <h3 className="font-display font-semibold text-lg text-gray-900 mb-2 group-hover:text-primary-500 transition-colors">
                  {food.name}
                </h3>
              </Link>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {food.description}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {renderStars(food.rating || 0)}
                </div>
                <span className="text-sm text-gray-600">
                  ({food.numReviews || 0} reviews)
                </span>
              </div>

              {/* Price and Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold text-gray-600">
                    {food.price}
                  </span>
                  <span className="text-sm text-gray-600">ETB</span>
                </div>
                
                <Link
                  to={`/food/${food._id}`}
                  className="bg-primary-500 hover:bg-primary-600 text-black px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <span>👁️</span>
                  Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
