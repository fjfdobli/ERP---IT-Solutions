import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, DatePicker } from 'antd';
import { SearchOutlined, ExportOutlined, EyeOutlined, SendOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;

const mockShipments = [
  { id: 'SHIP-2024-00015', trackingNumber: 'TRK123456789', order: 'SO-2024-00045', carrier: 'FedEx', status: 'in_transit', shippedDate: '2024-01-15', estimatedDelivery: '2024-01-20' },
];

const Shipments = () => {
  const [shipments] = useState(mockShipments);
  const columns = [
    { title: 'Shipment ID', dataIndex: 'id', key: 'id', width: 140, render: (id) => <Text strong style={{ color: '#1890ff' }}>{id}</Text> },
    { title: 'Tracking Number', dataIndex: 'trackingNumber', key: 'trackingNumber', width: 180 },
    { title: 'Order', dataIndex: 'order', key: 'order', width: 140 },
    { title: 'Carrier', dataIndex: 'carrier', key: 'carrier', width: 120 },
    { title: 'Shipped Date', dataIndex: 'shippedDate', key: 'shippedDate', width: 120, render: (date) => dayjs(date).format('MMM D, YYYY') },
    { title: 'Estimated Delivery', dataIndex: 'estimatedDelivery', key: 'estimatedDelivery', width: 150, render: (date) => dayjs(date).format('MMM D, YYYY') },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 120, render: (status) => <Tag color={status === 'in_transit' ? 'processing' : status === 'delivered' ? 'success' : 'default'}>{status}</Tag> },
    { title: 'Actions', key: 'actions', width: 100, render: () => <Button type="text" icon={<EyeOutlined />} /> },
  ];
  return (
    <div>
      <PageHeader title="Shipment Tracking" subtitle={`${shipments.length} shipments`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Logistics', path: '/logistics' }, { title: 'Shipment Tracking', path: '/logistics/shipments' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <DatePicker placeholder="Select Date" />
            <Search placeholder="Search by tracking number..." allowClear style={{ width: 300 }} />
          </Space>
        </div>
        <Table columns={columns} dataSource={shipments} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default Shipments;

