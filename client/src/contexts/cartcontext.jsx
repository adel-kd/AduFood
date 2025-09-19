// contexts/cartcontext.jsx
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
      const rawItems = response.data.items || []

      const normalized = rawItems
        .filter(item => item.food)
        .map(item => ({
          _id: item.food._id,
          name: item.food.name,
          description: item.food.description,
          image: item.food.image,
          price: Number(item.food.price) || 0,
          quantity: item.quantity || 1
        }))

      setCartItems(normalized)
    } catch (error) {
      console.error('Error fetching cart:', error)
    }
  }

  // NEW FUNCTION: Get quantity for a specific food item in orders
  const getOrderItemQuantity = (orderItem) => {
    // First try the most common field names
    if (orderItem.qty !== undefined && orderItem.qty !== null) return orderItem.qty;
    if (orderItem.quantity !== undefined && orderItem.quantity !== null) return orderItem.quantity;
    
    // If we have the food object with quantity (from cart context)
    if (orderItem.food && orderItem.food.quantity) return orderItem.food.quantity;
    
    // Fallback: check if we have this item in current cart for reference
    const cartItem = cartItems.find(item => item._id === orderItem.food?._id);
    if (cartItem) return cartItem.quantity;
    
    // Final fallback
    return 1;
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
        return [
          ...prevItems,
          {
            _id: food._id,
            name: food.name,
            description: food.description,
            image: food.image,
            price: Number(food.price) || 0,
            quantity
          }
        ]
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
    return cartItems.reduce((total, item) => {
      const price = Number(item.price) || 0
      const qty = Number(item.quantity) || 0
      return total + price * qty
    }, 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0)
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
      fetchCart,
      getOrderItemQuantity 
    }}>
      {children}
    </CartContext.Provider>
  )
}