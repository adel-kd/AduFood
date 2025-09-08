import api from './axios.js'

export const listFoods = (params) => api.get('/foods', { params })
export const getFood = (id) => api.get(`/foods/${id}`)
export const createFood = (data) => api.post('/foods', data)
export const updateFood = (id, data) => api.put(`/foods/${id}`, data)
export const deleteFood = (id) => api.delete(`/foods/${id}`)
export const createReview = (id, data) => api.post(`/foods/${id}/reviews`, data)
export const getTopFoods = () => api.get('/foods/top')
