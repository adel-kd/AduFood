// api/review.js
import api from './axios.js'

export const getReviews = (foodId) => api.get(`/reviews/${foodId}`)
export const addReview = (data) => api.post('/reviews', data)
export const updateReview = (reviewId, data) => api.put(`/reviews/${reviewId}`, data)
export const deleteReview = (reviewId) => api.delete(`/reviews/${reviewId}`)