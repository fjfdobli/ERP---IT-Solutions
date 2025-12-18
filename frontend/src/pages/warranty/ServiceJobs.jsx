import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, DatePicker } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EyeOutlined, ToolOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;

const mockServiceJobs = [
  { id: 'SJ-2024-00015', claim: 'WC-2024-00015', product: 'iPhone 15 Pro Max', customer: 'John Doe', assignedTo: 'Tech 1', scheduledDate: '2024-01-20', completedDate: null, status: 'scheduled' },
];

const serviceStatuses = [
  { value: 'scheduled', label: 'Scheduled', color: 'blue' },
  { value: 'in_progress', label: 'In Progress', color: 'processing' },
  { value: 'completed', label: 'Completed', color: 'success' },
  { value: 'cancelled', label: 'Cancelled', color: 'error' },
];

const ServiceJobs = () => {
  const [serviceJobs] = useState(mockServiceJobs);
  const getStatusConfig = (status) => serviceStatuses.find(s => s.value === status) || serviceStatuses[0];
  const columns = [
    { title: 'Job ID', dataIndex: 'id', key: 'id', width: 140, render: (id) => <Text strong style={{ color: '#1890ff' }}>{id}</Text> },
    { title: 'Claim', dataIndex: 'claim', key: 'claim', width: 140 },
    { title: 'Product', dataIndex: 'product', key: 'product', width: 200 },
    { title: 'Customer', dataIndex: 'customer', key: 'customer', width: 150 },
    { title: 'Assigned To', dataIndex: 'assignedTo', key: 'assignedTo', width: 150 },
    { title: 'Scheduled Date', dataIndex: 'scheduledDate', key: 'scheduledDate', width: 130, render: (date) => dayjs(date).format('MMM D, YYYY') },
    { title: 'Completed Date', dataIndex: 'completedDate', key: 'completedDate', width: 130, render: (date) => date ? dayjs(date).format('MMM D, YYYY') : '—' },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 120, render: (status) => { const config = getStatusConfig(status); return <Tag color={config.color}>{config.label}</Tag>; } },
    { title: 'Actions', key: 'actions', width: 100, render: () => <Button type="text" icon={<EyeOutlined />} /> },
  ];
  return (
    <div>
      <PageHeader title="Service Jobs" subtitle={`${serviceJobs.length} jobs`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Warranty & Service', path: '/warranty' }, { title: 'Service Jobs', path: '/warranty/service' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />}>New Job</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <DatePicker placeholder="Select Date" />
            <Search placeholder="Search..." allowClear style={{ width: 300 }} />
          </Space>
        </div>
        <Table columns={columns} dataSource={serviceJobs} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default ServiceJobs;

