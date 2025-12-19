import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout, Avatar, Dropdown, Badge, Button, Space } from 'antd'
import { BellOutlined, SettingOutlined, UserOutlined, LogoutOutlined, TeamOutlined } from '@ant-design/icons'

const { Header } = Layout

export default function HeaderNavigation() {
	const navigate = useNavigate()
	const username = (typeof window !== 'undefined' && localStorage.getItem('username')) || 'admin@lapsolution.com'
	const [now, setNow] = useState(new Date())
	const [is24, setIs24] = useState(false)

	useEffect(() => {
		const t = setInterval(() => setNow(new Date()), 1000)
		return () => clearInterval(t)
	}, [])

	function handleLogout() {
		localStorage.removeItem('isAuthenticated')
		localStorage.removeItem('username')
		navigate('/login')
	}

	function goProfile() {
		navigate('/profile-settings')
	}

	function goUserGroup() {
		navigate('/user-group')
	}

	function goSystemSettings() {
		navigate('/system-settings')
	}

	const profileMenu = {
		items: [
			{ key: 'profile', icon: React.createElement(UserOutlined), label: 'Profile Settings' },
			{ key: 'user-group', icon: React.createElement(TeamOutlined), label: 'User Groups' }
		],
		onClick: ({ key }) => {
			if (key === 'profile') goProfile()
			if (key === 'user-group') goUserGroup()
		}
	}

	const settingsMenu = {
		items: [
			{ key: 'system', icon: React.createElement(SettingOutlined), label: 'System Settings' },
			{ type: 'divider' },
			{ key: 'logout', icon: React.createElement(LogoutOutlined), label: 'Logout', danger: true }
		],
		onClick: ({ key }) => {
			if (key === 'system') goSystemSettings()
			if (key === 'logout') handleLogout()
		}
	}

	const notifications = [
		{ id: 1, text: 'Welcome to LAPS IT ERP' },
		{ id: 2, text: 'System maintenance scheduled' }
	]

	const notifMenu = {
		items: notifications.map(n => ({ key: String(n.id), label: n.text })),
		onClick: () => {}
	}

	const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: !is24 })
	const dateStr = now.toLocaleDateString()

	return React.createElement(Header, { style: { padding: '8px 16px', background: '#0b5fff', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
		React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 12 } },
			React.createElement('img', { src: '/images/laps-logo.ico', alt: 'logo', style: { width: 28, height: 28, borderRadius: 4 } }),
			React.createElement('div', { style: { color: '#fff', fontWeight: 700, fontSize: 16 } }, 'LAPS IT Solutions Inc. | Enterprise Resource Planning')
		),
		React.createElement(Space, { align: 'center' },
			React.createElement(Button, { type: 'text', onClick: () => setIs24(!is24), style: { color: '#fff' }, title: '' },
				React.createElement('div', { style: { textAlign: 'right' } },
					React.createElement('div', null, timeStr),
					React.createElement('div', { style: { fontSize: 11, opacity: 0.9 } }, dateStr)
				)
			),
			React.createElement(Dropdown, { menu: notifMenu, placement: 'bottomRight', trigger: ['click'] },
				React.createElement(Badge, { count: notifications.length }, React.createElement(Button, { type: 'text', icon: React.createElement(BellOutlined), style: { color: '#fff', fontSize: 18 } }))
			),
			React.createElement(Dropdown, { menu: profileMenu, placement: 'bottomRight', trigger: ['click'] },
				React.createElement(Avatar, { style: { backgroundColor: '#fff', color: '#0b5fff', cursor: 'pointer' } }, username.charAt(0).toUpperCase())
			),
			React.createElement(Dropdown, { menu: settingsMenu, placement: 'bottomRight', trigger: ['click'] },
				React.createElement(Button, { type: 'text', icon: React.createElement(SettingOutlined), style: { color: '#fff', fontSize: 18 } })
			)
		)
	)
}
