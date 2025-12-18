import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, DatePicker } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EyeOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;

const mockTickets = [
  { id: 'TKT-2024-00015', subject: 'Unable to process payment', category: 'Technical', priority: 'high', status: 'open', createdDate: '2024-01-15', assignedTo: 'Support Agent 1' },
];

const ticketStatuses = [
  { value: 'open', label: 'Open', color: 'blue' },
  { value: 'in_progress', label: 'In Progress', color: 'processing' },
  { value: 'resolved', label: 'Resolved', color: 'success' },
  { value: 'closed', label: 'Closed', color: 'default' },
];

const SupportTickets = () => {
  const [tickets] = useState(mockTickets);
  const getStatusConfig = (status) => ticketStatuses.find(s => s.value === status) || ticketStatuses[0];
  const columns = [
    { title: 'Ticket ID', dataIndex: 'id', key: 'id', width: 140, render: (id) => <Text strong style={{ color: '#1890ff' }}>{id}</Text> },
    { title: 'Subject', dataIndex: 'subject', key: 'subject', width: 250 },
    { title: 'Category', dataIndex: 'category', key: 'category', width: 120 },
    { title: 'Priority', dataIndex: 'priority', key: 'priority', width: 100, render: (priority) => <Tag color={priority === 'high' ? 'error' : priority === 'medium' ? 'warning' : 'default'}>{priority}</Tag> },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 120, render: (status) => { const config = getStatusConfig(status); return <Tag color={config.color}>{config.label}</Tag>; } },
    { title: 'Created Date', dataIndex: 'createdDate', key: 'createdDate', width: 130, render: (date) => dayjs(date).format('MMM D, YYYY') },
    { title: 'Assigned To', dataIndex: 'assignedTo', key: 'assignedTo', width: 180 },
    { title: 'Actions', key: 'actions', width: 100, render: () => <Button type="text" icon={<EyeOutlined />} /> },
  ];
  return (
    <div>
      <PageHeader title="Support Tickets" subtitle={`${tickets.length} tickets`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Help & Support', path: '/help' }, { title: 'Support Tickets', path: '/help/tickets' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />}>New Ticket</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <DatePicker placeholder="Select Date" />
            <Search placeholder="Search tickets..." allowClear style={{ width: 300 }} />
          </Space>
        </div>
        <Table columns={columns} dataSource={tickets} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default SupportTickets;

