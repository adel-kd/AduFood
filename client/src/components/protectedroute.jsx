import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../contexts/authcontext'

export default function ProtectedRoute({ children, adminRequired }) {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-3">Checking authentication...</span>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (adminRequired && !user.isAdmin) return <Navigate to="/" replace />

  return children
}
