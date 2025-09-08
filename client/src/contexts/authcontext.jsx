import React, { createContext, useState, useEffect } from 'react'
import { login, register } from '../api/auth.js'
import { setToken, getToken, clearToken } from '../utils/auth.js'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = getToken()
    if (token) {
      // For now, we'll just check if token exists
      // In a real app, you'd fetch user profile from backend
      const userData = localStorage.getItem('user')
      if (userData) {
        setUser(JSON.parse(userData))
      }
    }
  }, [])

  const loginUser = async (data) => {
    const res = await login(data)
    // Use the isAdmin value from the backend response
    const userData = {
      ...res.data,
      isAdmin: res.data.isAdmin || false // Use backend value or default to false
    }
    setToken(res.data.token)
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const registerUser = async (data) => {
    const res = await register(data)
    // Use the isAdmin value from the backend response
    const userData = {
      ...res.data,
      isAdmin: res.data.isAdmin || false // Use backend value or default to false
    }
    setToken(res.data.token)
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    clearToken()
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, loginUser, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
