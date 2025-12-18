import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, ApiOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockApps = [
  { id: 1, name: 'Shopify', type: 'E-Commerce', status: 'connected', connectedDate: '2024-01-10' },
  { id: 2, name: 'QuickBooks', type: 'Accounting', status: 'disconnected', connectedDate: null },
];

const ConnectedApps = () => {
  const [apps] = useState(mockApps);
  const columns = [
    { title: 'App Name', dataIndex: 'name', key: 'name', width: 200 },
    { title: 'Type', dataIndex: 'type', key: 'type', width: 150 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 120, render: (status) => <Tag color={status === 'connected' ? 'success' : 'default'} icon={status === 'connected' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>{status}</Tag> },
    { title: 'Connected Date', dataIndex: 'connectedDate', key: 'connectedDate', width: 150, render: (date) => date || '—' },
    { title: 'Actions', key: 'actions', width: 150, render: (_, record) => (
      <Space>
        {record.status === 'connected' ? <Button type="text" danger>Disconnect</Button> : <Button type="primary">Connect</Button>}
      </Space>
    ) },
  ];
  return (
    <div>
      <PageHeader title="Connected Apps" subtitle={`${apps.length} apps`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Integrations', path: '/integrations' }, { title: 'Connected Apps', path: '/integrations/apps' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />}>Add App</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search placeholder="Search apps..." allowClear style={{ width: 300 }} />
        </div>
        <Table columns={columns} dataSource={apps} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default ConnectedApps;

