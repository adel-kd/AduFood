// src/pages/Cart.jsx
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/authcontext'
import { CartContext } from '../contexts/cartcontext'
import { removeFromCart } from '../api/cart'

export default function Cart() {
  const { user } = useContext(AuthContext)
  const { cartItems, removeItem, updateQuantity, fetchCart, getTotalPrice } = useContext(CartContext)
  const [loading, setLoading] = useState(false)
  const [proceeding, setProceeding] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    if (user) loadCart()
    // eslint-disable-next-line
  }, [user])

  const loadCart = async () => {
    try {
      setLoading(true)
      await fetchCart()
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

  // Instead of placing the order here, just go to payment page with cart info
  const handleProceedToPayment = () => {
    if (cartItems.length === 0) return
    setProceeding(true)
    // Pass cart items and total price to payment page
    navigate('/payment', {
      state: {
        cartItems: cartItems,
        amount: getTotalPrice(),
        userEmail: user?.email,
        userPhone: user?.phone || ''
      }
    })
    setProceeding(false)
  }

  const totalPrice = getTotalPrice()

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto text-center py-16">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#dd804f', borderBottomColor: 'transparent' }}></div>
        <p className="mt-4 text-lg
        style={{ color: '#dd804f' }}
        ">Loading cart...</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
      <h1 className="text-2xl font-bold mb-6" style={{ color: '#dd804f' }}>Shopping Cart</h1>
        <p className="text-base" style={{ color: '#555' }}>Review your items before checkout</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-2xl font-semibold mb-2" style={{ color: '#222' }}>Your cart is empty</h3>
          <p className="mb-6" style={{ color: '#555' }}>Add some delicious food to get started!</p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: '#dd804f',
              color: '#fff'
            }}
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div key={item._id} className="bg-white rounded-xl p-6 border border-gray-200 shadow">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop&auto=format'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-100"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1" style={{ color: '#222' }}>{item.name}</h3>
                    {item.description && <p className="text-sm mb-2" style={{ color: '#555' }}>{item.description}</p>}
                    <p className="font-semibold" style={{ color: '#dd804f' }}>{item.price} ETB</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                      style={{
                        backgroundColor: '#dd804f',
                        color: '#fff'
                      }}
                    >-</button>
                    <span className="font-medium w-8 text-center" style={{ color: '#222' }}>{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                      style={{
                        backgroundColor: '#dd804f',
                        color: '#fff'
                      }}
                    >+</button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="p-2"
                    style={{
                      color: '#dd804f'
                    }}
                    title="Remove"
                  >🗑️</button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow sticky top-4">
              <h2 className="text-xl font-semibold mb-4" style={{ color: '#222' }}>Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between" style={{ color: '#222' }}>
                  <span>Subtotal</span>
                  <span>{totalPrice} ETB</span>
                </div>
                <div className="flex justify-between" style={{ color: '#222' }}>
                  <span>Delivery</span>
                  <span style={{ color: '#dd804f', fontWeight: 500 }}>Free</span>
                </div>
                <div className="flex justify-between" style={{ color: '#222' }}>
                  <span>Tax</span>
                  <span>0 ETB</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between font-semibold text-lg" style={{ color: '#222' }}>
                    <span>Total</span>
                    <span>{totalPrice} ETB</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleProceedToPayment}
                disabled={proceeding || cartItems.length === 0}
                className="w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                style={{
                  backgroundColor: proceeding || cartItems.length === 0 ? '#e6a77e' : '#dd804f',
                  color: '#fff',
                  opacity: proceeding || cartItems.length === 0 ? 0.7 : 1,
                  cursor: proceeding || cartItems.length === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                {proceeding ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Proceeding...
                  </>
                ) : (
                  'Proceed to Checkout'
                )}
              </button>

              <Link
                to="/"
                className="block w-full mt-3 text-center font-medium transition-colors"
                style={{
                  color: '#dd804f'
                }}
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