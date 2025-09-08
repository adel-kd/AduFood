import api from './axios.js'

export const register = (data) => api.post('/users/register', data)
export const login = (data) => api.post('/users/login', data)
