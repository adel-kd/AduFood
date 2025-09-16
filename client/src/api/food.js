import api from './axios.js'

// Foods
export const listFoods = (params) => api.get('/foods', { params })
export const getFood = (id) => api.get(`/foods/${id}`)
export const createFood = (data) => api.post('/foods', data)
export const updateFood = (id, data) => api.put(`/foods/${id}`, data)
export const deleteFood = (id) => api.delete(`/foods/${id}`)
export const getTopFoods = () => api.get('/foods/top')

// Categories
export const listCategories = () => api.get('/categories')
// Reviews
export const createReview = (id, data) => api.post(`/foods/${id}/reviews`, data)
export const updateReview = (foodId, reviewId, data) =>
  api.put(`/foods/${foodId}/reviews/${reviewId}`, data)
export const deleteReview = (foodId, reviewId) =>
  api.delete(`/foods/${foodId}/reviews/${reviewId}`)
