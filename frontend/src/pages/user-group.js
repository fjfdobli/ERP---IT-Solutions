import React from 'react'
import { Card, Table, Button } from 'antd'

const columns = [
	{ title: 'Group', dataIndex: 'group', key: 'group' },
	{ title: 'Permissions', dataIndex: 'perms', key: 'perms' },
	{ title: 'Members', dataIndex: 'members', key: 'members' }
]

const data = [
	{ key: '1', group: 'Administrators', perms: 'All', members: 3 },
	{ key: '2', group: 'Sales', perms: 'Sales, Read', members: 7 }
]

export default function UserGroup() {
	return React.createElement('div', { style: { padding: 20 } },
		React.createElement('h2', null, 'User Groups'),
		React.createElement(Card, { style: { marginTop: 12 } },
			React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: 12 } },
				React.createElement('div', null, React.createElement('p', null, 'Manage user groups and permissions.')),
				React.createElement(Button, { type: 'primary' }, 'New Group')
			),
			React.createElement(Table, { columns: columns, dataSource: data, pagination: { pageSize: 5 } })
		)
	)
}
