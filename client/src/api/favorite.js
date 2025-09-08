import api from './axios.js'

export const getFavorites = () => api.get('/favorite')
export const addFavorite = (foodId) => api.post(`/favorite/${foodId}`)
export const removeFavorite = (foodId) => api.delete(`/favorite/${foodId}`)
