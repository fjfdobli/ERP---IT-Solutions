import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, DatePicker } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EyeOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;

const mockClaims = [
  { id: 'WC-2024-00015', registration: 'WR-2024-00015', product: 'iPhone 15 Pro Max', customer: 'John Doe', claimDate: '2024-01-15', issue: 'Screen cracked', status: 'pending', estimatedCost: 200 },
];

const claimStatuses = [
  { value: 'pending', label: 'Pending', color: 'default' },
  { value: 'approved', label: 'Approved', color: 'success' },
  { value: 'rejected', label: 'Rejected', color: 'error' },
  { value: 'completed', label: 'Completed', color: 'cyan' },
];

const WarrantyClaims = () => {
  const [claims] = useState(mockClaims);
  const getStatusConfig = (status) => claimStatuses.find(s => s.value === status) || claimStatuses[0];
  const columns = [
    { title: 'Claim ID', dataIndex: 'id', key: 'id', width: 140, render: (id) => <Text strong style={{ color: '#1890ff' }}>{id}</Text> },
    { title: 'Registration', dataIndex: 'registration', key: 'registration', width: 150 },
    { title: 'Product', dataIndex: 'product', key: 'product', width: 200 },
    { title: 'Customer', dataIndex: 'customer', key: 'customer', width: 150 },
    { title: 'Claim Date', dataIndex: 'claimDate', key: 'claimDate', width: 120, render: (date) => dayjs(date).format('MMM D, YYYY') },
    { title: 'Issue', dataIndex: 'issue', key: 'issue', width: 200 },
    { title: 'Estimated Cost', dataIndex: 'estimatedCost', key: 'estimatedCost', width: 130, align: 'right', render: (c) => `$${c.toLocaleString()}` },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 120, render: (status) => { const config = getStatusConfig(status); return <Tag color={config.color}>{config.label}</Tag>; } },
    { title: 'Actions', key: 'actions', width: 100, render: () => <Button type="text" icon={<EyeOutlined />} /> },
  ];
  return (
    <div>
      <PageHeader title="Warranty Claims" subtitle={`${claims.length} claims`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Warranty & Service', path: '/warranty' }, { title: 'Claims', path: '/warranty/claims' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />}>New Claim</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <DatePicker placeholder="Select Date" />
            <Search placeholder="Search..." allowClear style={{ width: 300 }} />
          </Space>
        </div>
        <Table columns={columns} dataSource={claims} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default WarrantyClaims;

