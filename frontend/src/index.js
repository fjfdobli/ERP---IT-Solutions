import React from 'react'
import 'antd/dist/reset.css'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/login'
import Register from './pages/register'
import Dashboard from './pages/dashboard'
import ForgotPassword from './pages/forgot-password'
import PublicRoute from './components/public-route'
import ProfileSettings from './pages/profile-settings'
import ChangeEmail from './pages/change-email'
import SystemSettings from './pages/system-settings'
import MainLayout from './components/main-layout'
import ProtectedRoute from './components/protected-routes'
import Sales from './pages/sales'
import Inventory from './pages/inventory'
import PurchaseOrder from './pages/purchase-order'
import UserGroup from './pages/user-group'

function App() {
  return (
    React.createElement(HashRouter, null,
      React.createElement(Routes, null,
        React.createElement(Route, { path: '/', element: React.createElement(Navigate, { to: '/login', replace: true }) }),
        React.createElement(Route, { path: '/login', element: React.createElement(PublicRoute, null, React.createElement(Login)) }),
        React.createElement(Route, { path: '/register', element: React.createElement(PublicRoute, null, React.createElement(Register)) }),
        React.createElement(Route, { path: '/forgot-password', element: React.createElement(PublicRoute, null, React.createElement(ForgotPassword)) }),
        React.createElement(Route, { path: '/', element: React.createElement(ProtectedRoute, null, React.createElement(MainLayout)), children: [
          React.createElement(Route, { path: 'dashboard', element: React.createElement(Dashboard) }),
          React.createElement(Route, { path: 'sales', element: React.createElement(Sales) }),
          React.createElement(Route, { path: 'inventory', element: React.createElement(Inventory) }),
          React.createElement(Route, { path: 'purchase-order', element: React.createElement(PurchaseOrder) }),
          React.createElement(Route, { path: 'user-group', element: React.createElement(UserGroup) }),
          React.createElement(Route, { path: 'profile-settings', element: React.createElement(ProfileSettings) }),
          React.createElement(Route, { path: 'change-email', element: React.createElement(ChangeEmail) }),
          React.createElement(Route, { path: 'system-settings', element: React.createElement(SystemSettings) })
        ] })
      )
    )
  )
}

const rootEl = document.getElementById('root')
const root = createRoot(rootEl)
root.render(React.createElement(App))
