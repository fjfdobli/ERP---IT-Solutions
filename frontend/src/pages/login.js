import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    // const [email, setEmail] = useState('')
	// const [password, setPassword] = useState('')
	const [email, setEmail] = useState('admin@lapsolution.com')
	const [password, setPassword] = useState('worldwide')
	const navigate = useNavigate()

	function handleSubmit(e) {
		e.preventDefault()
		if (!email || !password) {
			alert('Please enter both email and password')
			return
		}
		if (email === 'admin@lapsolution.com' && password === 'worldwide') {
			localStorage.setItem('isAuthenticated', 'true')
			localStorage.setItem('username', email)
			navigate('/dashboard')
			return
		}
		alert('Invalid credentials')
        // navigate('/dashboard')
	}

	return React.createElement(
		'div',
		{ style: { fontFamily: 'system-ui, sans-serif', padding: 24, maxWidth: 420 } },
		React.createElement('h2', null, 'Login'),
		React.createElement('form', { onSubmit: handleSubmit },
			React.createElement('div', { style: { marginBottom: 12 } },
				React.createElement('label', { htmlFor: 'email', style: { display: 'block', marginBottom: 6 } }, 'Email'),
				React.createElement('input', {
					id: 'email',
					type: 'email',
					value: email,
					onChange: (ev) => setEmail(ev.target.value),
					style: { width: '100%', padding: '8px 10px', boxSizing: 'border-box' }
				})
			),
			React.createElement('div', { style: { marginBottom: 12 } },
				React.createElement('label', { htmlFor: 'password', style: { display: 'block', marginBottom: 6 } }, 'Password'),
				React.createElement('input', {
					id: 'password',
					type: 'password',
					value: password,
					onChange: (ev) => setPassword(ev.target.value),
					style: { width: '100%', padding: '8px 10px', boxSizing: 'border-box' }
				})
			),
			React.createElement('div', null,
				React.createElement('div', { style: { marginBottom: 8 } },
					React.createElement('a', { href: '#/forgot-password' }, 'Forgot password?')
				),
				React.createElement('button', { type: 'submit', style: { padding: '8px 16px' } }, 'Sign in')
			)
	)
	)
}
