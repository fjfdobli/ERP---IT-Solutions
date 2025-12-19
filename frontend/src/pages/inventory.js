import React from 'react'
import { Card, Table, Button } from 'antd'

const columns = [
	{ title: 'SKU', dataIndex: 'sku', key: 'sku' },
	{ title: 'Name', dataIndex: 'name', key: 'name' },
	{ title: 'Qty', dataIndex: 'qty', key: 'qty' },
	{ title: 'Location', dataIndex: 'location', key: 'location' }
]

const data = [
	{ key: '1', sku: 'P-001', name: 'Widget A', qty: 120, location: 'A1' },
	{ key: '2', sku: 'P-002', name: 'Widget B', qty: 34, location: 'B3' }
]

export default function Inventory() {
	return React.createElement('div', { style: { padding: 20 } },
		React.createElement('h2', null, 'Inventory'),
		React.createElement(Card, { style: { marginTop: 12 } },
			React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 12 } },
				React.createElement('div', null, React.createElement('p', null, 'View and manage stock levels.')),
				React.createElement(Button, { type: 'primary' }, 'Add Stock')
			),
			React.createElement(Table, { columns: columns, dataSource: data, pagination: { pageSize: 5 } })
		)
	)
}
