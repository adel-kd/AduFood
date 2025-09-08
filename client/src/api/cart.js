import api from './axios.js'

export const getCart = () => api.get('/cart')
export const addToCart = (data) => api.post('/cart', data)
export const removeFromCart = (foodId) => api.delete(`/cart/${foodId}`)
export const clearCart = () => api.delete('/cart')
