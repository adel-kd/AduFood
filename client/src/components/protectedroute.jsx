import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../contexts/authcontext'

export default function ProtectedRoute({ children, adminRequired }) {
  const { user } = useContext(AuthContext)
  if (!user) return <Navigate to="/login" />
  if (adminRequired && !user.isAdmin) return <Navigate to="/" />
  return children
}
