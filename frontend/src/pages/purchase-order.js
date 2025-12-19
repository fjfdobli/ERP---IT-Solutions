import React from 'react'
import { Card, Table, Button } from 'antd'

const columns = [
	{ title: 'PO #', dataIndex: 'po', key: 'po' },
	{ title: 'Vendor', dataIndex: 'vendor', key: 'vendor' },
	{ title: 'Total', dataIndex: 'total', key: 'total' },
	{ title: 'Status', dataIndex: 'status', key: 'status' }
]

const data = [
	{ key: '1', po: 'PO-2001', vendor: 'SupplyCo', total: '$2,300', status: 'Open' },
	{ key: '2', po: 'PO-2002', vendor: 'GlobalParts', total: '$750', status: 'Received' }
]

export default function PurchaseOrder() {
	return React.createElement('div', { style: { padding: 20 } },
		React.createElement('h2', null, 'Purchase Orders'),
		React.createElement(Card, { style: { marginTop: 12 } },
			React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 12 } },
				React.createElement('div', null, React.createElement('p', null, 'Create and track purchase orders.')),
				React.createElement(Button, { type: 'primary' }, 'New Purchase Order')
			),
			React.createElement(Table, { columns: columns, dataSource: data, pagination: { pageSize: 5 } })
		)
	)
}
