import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, Calendar } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, CalendarOutlined, PhoneOutlined, MailOutlined, MessageOutlined, EyeOutlined } from '@ant-design/icons';
import { PageHeader, StatCard } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockActivities = [
  { id: 1, type: 'Call', subject: 'Follow-up call', relatedTo: 'John Smith', date: '2024-01-15', status: 'completed', assignedTo: 'Sales Rep 1' },
  { id: 2, type: 'Email', subject: 'Proposal sent', relatedTo: 'Jane Doe', date: '2024-01-14', status: 'completed', assignedTo: 'Sales Rep 2' },
  { id: 3, type: 'Meeting', subject: 'Product demo', relatedTo: 'Tech Corp', date: '2024-01-16', status: 'scheduled', assignedTo: 'Sales Rep 1' },
];

const activityTypes = {
  call: { icon: <PhoneOutlined />, color: 'blue' },
  email: { icon: <MailOutlined />, color: 'green' },
  meeting: { icon: <CalendarOutlined />, color: 'orange' },
  task: { icon: <MessageOutlined />, color: 'purple' },
};

const Activities = () => {
  const [activities] = useState(mockActivities);
  const columns = [
    { title: 'Type', dataIndex: 'type', key: 'type', width: 100, render: (type) => {
      const config = activityTypes[type.toLowerCase()];
      return <Tag color={config?.color} icon={config?.icon}>{type}</Tag>;
    } },
    { title: 'Subject', dataIndex: 'subject', key: 'subject', width: 200 },
    { title: 'Related To', dataIndex: 'relatedTo', key: 'relatedTo', width: 150 },
    { title: 'Date', dataIndex: 'date', key: 'date', width: 120 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status) => <Tag color={status === 'completed' ? 'success' : 'processing'}>{status}</Tag> },
    { title: 'Assigned To', dataIndex: 'assignedTo', key: 'assignedTo', width: 150 },
    { title: 'Actions', key: 'actions', width: 100, render: () => <Button type="text" icon={<EyeOutlined />} /> },
  ];
  return (
    <div>
      <PageHeader title="Activities" breadcrumb={[{ title: 'Home', path: '/' }, { title: 'CRM', path: '/crm' }, { title: 'Activities', path: '/crm/activities' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />}>New Activity</Button>]} />
      <Card><Table columns={columns} dataSource={activities} rowKey="id" pagination={{ pageSize: 10 }} /></Card>
    </div>
  );
};

export default Activities;

