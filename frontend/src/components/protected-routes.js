import React from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const auth = typeof window !== 'undefined' && localStorage.getItem('isAuthenticated') === 'true'
  if (auth) return children
  return React.createElement(Navigate, { to: '/login' })
}
