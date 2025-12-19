import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Button } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import HeaderNavigation from './header-navigation'
import SidebarNavigation from './sidebar-navigation'

export default function MainLayout() {
  const [siderCollapsed, setSiderCollapsed] = useState(false)

  return React.createElement(
    'div',
    { style: { fontFamily: 'system-ui, sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column' } },
    React.createElement(HeaderNavigation),
    React.createElement('div', { style: { display: 'flex', flex: 1, position: 'relative' } },
      React.createElement(SidebarNavigation, { collapsed: siderCollapsed, onCollapse: (val) => setSiderCollapsed(val) }),
      React.createElement('main', { style: { padding: 20, flex: 1 } },
        React.createElement(Outlet)
      ),
      
    )
  )
}
