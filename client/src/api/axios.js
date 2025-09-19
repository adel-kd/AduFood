import axios from 'axios'
import { getToken } from '../utils/auth.js'

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://adufood.onrender.com/api'  

const instance = axios.create({
  baseURL,
  withCredentials: false, 
})

instance.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) config.headers.Authorization = `Bearer ${token}` 
    return config
  },
  error => Promise.reject(error)
)

instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('API error:', error.response.status, error.response.data)
    } else if (error.request) {
      console.error('No response from API:', error.request)
    } else {
      console.error('Axios error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default instance
