import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, DatePicker } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EyeOutlined, TruckOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;
const { RangePicker } = DatePicker;

const mockDeliveries = [
  { id: 'DEL-2024-00015', order: 'SO-2024-00045', customer: 'John Doe', address: '123 Main St', scheduledDate: '2024-01-20', status: 'scheduled', driver: 'Driver 1' },
];

const deliveryStatuses = [
  { value: 'scheduled', label: 'Scheduled', color: 'blue' },
  { value: 'in_transit', label: 'In Transit', color: 'processing' },
  { value: 'delivered', label: 'Delivered', color: 'success' },
  { value: 'failed', label: 'Failed', color: 'error' },
];

const Deliveries = () => {
  const [deliveries] = useState(mockDeliveries);
  const getStatusConfig = (status) => deliveryStatuses.find(s => s.value === status) || deliveryStatuses[0];
  const columns = [
    { title: 'Delivery ID', dataIndex: 'id', key: 'id', width: 140, render: (id) => <Text strong style={{ color: '#1890ff' }}>{id}</Text> },
    { title: 'Order', dataIndex: 'order', key: 'order', width: 140 },
    { title: 'Customer', dataIndex: 'customer', key: 'customer', width: 150 },
    { title: 'Address', dataIndex: 'address', key: 'address', width: 200 },
    { title: 'Scheduled Date', dataIndex: 'scheduledDate', key: 'scheduledDate', width: 130, render: (date) => dayjs(date).format('MMM D, YYYY') },
    { title: 'Driver', dataIndex: 'driver', key: 'driver', width: 150 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 120, render: (status) => { const config = getStatusConfig(status); return <Tag color={config.color}>{config.label}</Tag>; } },
    { title: 'Actions', key: 'actions', width: 100, render: () => <Button type="text" icon={<EyeOutlined />} /> },
  ];
  return (
    <div>
      <PageHeader title="Deliveries" subtitle={`${deliveries.length} deliveries`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Logistics', path: '/logistics' }, { title: 'Deliveries', path: '/logistics/deliveries' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />}>New Delivery</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <RangePicker />
            <Search placeholder="Search..." allowClear style={{ width: 300 }} />
          </Space>
        </div>
        <Table columns={columns} dataSource={deliveries} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default Deliveries;

