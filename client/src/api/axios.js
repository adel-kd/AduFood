import axios from 'axios'
import { getToken } from '../utils/auth.js'

// Use environment variable for baseURL if available, fallback to localhost for dev
const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000/api' // fallback for local dev

const instance = axios.create({
  baseURL,
  withCredentials: true, // important for sending cookies (auth/session)
})

// Attach token if available
instance.interceptors.request.use(
  config => {
    const token = getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  error => Promise.reject(error)
)

// Optional: Log errors for debugging connection issues
instance.interceptors.response.use(
  response => response,
  error => {
    // Log error details to help debug connection issues
    if (error.response) {
      // Server responded with a status outside 2xx
      console.error('API error:', error.response.status, error.response.data)
    } else if (error.request) {
      // No response received
      console.error('No response from API:', error.request)
    } else {
      // Something else happened
      console.error('Axios error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default instance
