import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ForgotPassword() {
	const [email, setEmail] = useState('')
	const navigate = useNavigate()

	function handleSubmit(e) {
		e.preventDefault()
		if (!email) {
			alert('Please enter your email address')
			return
		}
		alert('If that email exists we sent a reset link (mock)')
		navigate('/login')
	}

	return React.createElement(
		'div',
		{ style: { fontFamily: 'system-ui, sans-serif', padding: 24, maxWidth: 480 } },
		React.createElement('h2', null, 'Forgot Password'),
		React.createElement('p', null, 'Enter your email and we will send password reset instructions.'),
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
			React.createElement('div', null,
				React.createElement('button', { type: 'submit', style: { padding: '8px 16px' } }, 'Send reset email')
			)
		)
	)
}
