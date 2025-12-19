import React from 'react'
import { Card, Table, Button } from 'antd'

const columns = [
	{ title: 'Order ID', dataIndex: 'id', key: 'id' },
	{ title: 'Customer', dataIndex: 'customer', key: 'customer' },
	{ title: 'Amount', dataIndex: 'amount', key: 'amount' },
	{ title: 'Status', dataIndex: 'status', key: 'status' }
]

const data = [
	{ key: '1', id: 'S-1001', customer: 'Acme Corp', amount: '$1,200', status: 'Completed' },
	{ key: '2', id: 'S-1002', customer: 'Beta LLC', amount: '$450', status: 'Pending' }
]

export default function Sales() {
	return React.createElement('div', { style: { padding: 20 } },
		React.createElement('h2', null, 'Sales'),
		React.createElement(Card, { style: { marginTop: 12 } },
			React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 12 } },
				React.createElement('div', null, React.createElement('p', null, 'Manage sales orders and invoices.')),
				React.createElement(Button, { type: 'primary' }, 'New Sale')
			),
			React.createElement(Table, { columns: columns, dataSource: data, pagination: { pageSize: 5 } })
		)
	)
}
