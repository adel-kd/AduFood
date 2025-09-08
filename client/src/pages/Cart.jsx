import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/authcontext'
import { CartContext } from '../contexts/cartcontext'
import { getCart, removeFromCart, clearCart } from '../api/cart'
import { placeOrder } from '../api/order'

export default function Cart() {
  const { user } = useContext(AuthContext)
  const { cartItems, removeItem, clearCartItems, updateQuantity } = useContext(CartContext)
  const [loading, setLoading] = useState(false)
  const [placingOrder, setPlacingOrder] = useState(false)

  useEffect(() => {
    if (user) {
      fetchCart()
    }
  }, [user])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const response = await getCart()
      // Update cart context with fetched data
      // This would need to be implemented in CartContext
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveItem = async (foodId) => {
    try {
      await removeFromCart(foodId)
      removeItem(foodId)
    } catch (error) {
      console.error('Error removing item:', error)
      alert('Failed to remove item')
    }
  }

  const handleUpdateQuantity = async (foodId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(foodId)
      return
    }
    
    try {
      updateQuantity(foodId, newQuantity)
    } catch (error) {
      console.error('Error updating quantity:', error)
      alert('Failed to update quantity')
    }
  }

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return
    
    setPlacingOrder(true)
    try {
      await placeOrder({ items: cartItems })
      clearCartItems()
      alert('Order placed successfully!')
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Failed to place order')
    } finally {
      setPlacingOrder(false)
    }
  }

  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-gray-300 text-lg">Loading cart...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white mb-2">Shopping Cart</h1>
        <p className="text-gray-400">Review your items before checkout</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-2xl font-semibold text-gray-100 mb-2">Your cart is empty</h3>
          <p className="text-gray-400 mb-6">Add some delicious food to get started!</p>
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center gap-4">
                  <img 
                    src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop&auto=format'} 
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{item.name}</h3>
                    <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                    <p className="text-primary-400 font-semibold">{item.price} ETB</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                      className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      -
                    </button>
                    <span className="text-white font-medium w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                      className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="text-red-400 hover:text-red-300 p-2"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 sticky top-4">
              <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>{totalPrice} ETB</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Delivery</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax</span>
                  <span>0 ETB</span>
                </div>
                <div className="border-t border-gray-700 pt-3">
                  <div className="flex justify-between text-white font-semibold text-lg">
                    <span>Total</span>
                    <span>{totalPrice} ETB</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder || cartItems.length === 0}
                className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                {placingOrder ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Placing Order...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>

              <Link 
                to="/" 
                className="block w-full mt-3 text-center text-primary-400 hover:text-primary-300 font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
