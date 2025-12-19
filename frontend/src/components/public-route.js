import React from 'react'
import { Navigate } from 'react-router-dom'

export default function PublicRoute({ children }) {
  const auth = typeof window !== 'undefined' && localStorage.getItem('isAuthenticated') === 'true'
  if (auth) return React.createElement(Navigate, { to: '/dashboard' })
  return children
}
