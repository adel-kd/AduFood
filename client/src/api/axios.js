import axios from 'axios'
import { getToken } from '../utils/auth.js'

const instance = axios.create({
  baseURL: 'https://adufoods-1.onrender.com/api',
})

instance.interceptors.request.use(config => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default instance
