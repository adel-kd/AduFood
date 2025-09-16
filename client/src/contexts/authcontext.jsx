import React, { createContext, useState, useEffect } from 'react'
import { login, register } from '../api/auth.js'
import { setToken, getToken, clearToken } from '../utils/auth.js'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // NEW

  useEffect(() => {
    const token = getToken()
    if (token) {
      const userData = localStorage.getItem('user')
      if (userData) {
        setUser(JSON.parse(userData))
      }
    }
    setLoading(false) // Done checking
  }, [])

  const loginUser = async (data) => {
    const res = await login(data)
    const userData = {
      ...res.data,
      isAdmin: res.data.isAdmin || false
    }
    setToken(res.data.token)
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const registerUser = async (data) => {
    const res = await register(data)
    const userData = {
      ...res.data,
      isAdmin: res.data.isAdmin || false
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
    <AuthContext.Provider value={{ user, loading, loginUser, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
