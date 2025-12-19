import React from 'react'
import { Layout, Menu, Button } from 'antd'
import { DashboardOutlined, MenuFoldOutlined, MenuUnfoldOutlined, ShoppingCartOutlined, InboxOutlined, FileTextOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'

const { Sider } = Layout
export default function SidebarNavigation({ collapsed = false, onCollapse = null }) {
    const navigate = useNavigate()
    const location = useLocation()

    let activeKey = location.pathname.split('/')[1] || 'dashboard'

    const items = [
        { 
            key: 'dashboard', 
            icon: React.createElement(DashboardOutlined), 
            label: 'Dashboard' 
        }
    ]
    
    items.push(
        { key: 'sales', icon: React.createElement(ShoppingCartOutlined), label: 'Sales' },
        { key: 'inventory', icon: React.createElement(InboxOutlined), label: 'Inventory' },
        { key: 'purchase-order', icon: React.createElement(FileTextOutlined), label: 'Purchase Order' }
    )

    return React.createElement(Sider, {
        collapsible: true,
        collapsed: collapsed,
        onCollapse: onCollapse,
        trigger: null, 
        breakpoint: 'lg',
        collapsedWidth: 80,
        width: 200,
        style: { 
            background: '#fff', 
            borderRight: '1px solid #f0f0f0', 
            height: '100vh',
            position: 'sticky',
            top: 0
        },
    },
        React.createElement('div', { 
            style: { 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%' 
            } 
        },
            React.createElement('div', { 
                style: { 
                    padding: '16px', 
                    display: 'flex', 
                    justifyContent: collapsed ? 'center' : 'flex-end' 
                } 
            },
                React.createElement(Button, {
                    onClick: () => { if (typeof onCollapse === 'function') onCollapse(!collapsed) },
                    type: 'text',
                    icon: React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined),
                    style: { fontSize: '16px' }
                })
            ),
            React.createElement(Menu, { 
                mode: 'inline', 
                selectedKeys: [activeKey], 
                onClick: ({ key }) => navigate('/' + key), 
                items: items, 
                style: { borderRight: 0, flex: 1 } 
            })
        )
    )
}
