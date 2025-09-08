import api from './axios.js'

export const getReviews = (foodId) => api.get(`/reviews/${foodId}`)
export const addReview = (data) => api.post('/reviews', data)
