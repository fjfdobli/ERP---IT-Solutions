import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, DatePicker } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EyeOutlined, BuildOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;

const mockWorkOrders = [
  { id: 'WO-2024-00015', product: 'Product A', quantity: 100, startDate: '2024-01-20', endDate: '2024-01-25', status: 'scheduled', assignedTo: 'Production Team 1' },
];

const workOrderStatuses = [
  { value: 'scheduled', label: 'Scheduled', color: 'blue' },
  { value: 'in_progress', label: 'In Progress', color: 'processing' },
  { value: 'completed', label: 'Completed', color: 'success' },
  { value: 'cancelled', label: 'Cancelled', color: 'error' },
];

const WorkOrders = () => {
  const [workOrders] = useState(mockWorkOrders);
  const getStatusConfig = (status) => workOrderStatuses.find(s => s.value === status) || workOrderStatuses[0];
  const columns = [
    { title: 'Work Order ID', dataIndex: 'id', key: 'id', width: 150, render: (id) => <Text strong style={{ color: '#1890ff' }}>{id}</Text> },
    { title: 'Product', dataIndex: 'product', key: 'product', width: 200 },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', width: 100, align: 'center' },
    { title: 'Start Date', dataIndex: 'startDate', key: 'startDate', width: 120, render: (date) => dayjs(date).format('MMM D, YYYY') },
    { title: 'End Date', dataIndex: 'endDate', key: 'endDate', width: 120, render: (date) => dayjs(date).format('MMM D, YYYY') },
    { title: 'Assigned To', dataIndex: 'assignedTo', key: 'assignedTo', width: 180 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 120, render: (status) => { const config = getStatusConfig(status); return <Tag color={config.color}>{config.label}</Tag>; } },
    { title: 'Actions', key: 'actions', width: 100, render: () => <Button type="text" icon={<EyeOutlined />} /> },
  ];
  return (
    <div>
      <PageHeader title="Work Orders" subtitle={`${workOrders.length} work orders`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Manufacturing', path: '/manufacturing' }, { title: 'Work Orders', path: '/manufacturing/work-orders' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />}>New Work Order</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <DatePicker placeholder="Select Date" />
            <Search placeholder="Search..." allowClear style={{ width: 300 }} />
          </Space>
        </div>
        <Table columns={columns} dataSource={workOrders} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default WorkOrders;

