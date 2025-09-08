import React, { createContext, useState, useEffect, useContext } from 'react'
import { getCart, addToCart, removeFromCart, clearCart } from '../api/cart.js'
import { AuthContext } from './authcontext.jsx'

export const CartContext = createContext()

export function CartProvider({ children }) {
  const { user } = useContext(AuthContext)
  const [cartItems, setCartItems] = useState([])

  useEffect(() => {
    if (user) {
      fetchCart()
    } else {
      setCartItems([])
    }
  }, [user])

  const fetchCart = async () => {
    try {
      const response = await getCart()
      setCartItems(response.data.items || [])
    } catch (error) {
      console.error('Error fetching cart:', error)
    }
  }

  const addItemToCart = (food, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === food._id)
      if (existingItem) {
        return prevItems.map(item =>
          item._id === food._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        return [...prevItems, { ...food, quantity }]
      }
    })
  }

  const removeItem = (foodId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== foodId))
  }

  const updateQuantity = (foodId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(foodId)
      return
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === foodId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const clearCartItems = () => {
    setCartItems([])
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <CartContext.Provider value={{
      cartItems,
      addItemToCart,
      removeItem,
      updateQuantity,
      clearCartItems,
      getTotalPrice,
      getTotalItems,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  )
}
