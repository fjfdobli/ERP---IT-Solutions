import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Input, Select, Tag, 
  Tooltip, message, Typography, DatePicker, Drawer,
  Descriptions, Avatar, Divider, Steps, Form, Badge
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ExportOutlined,
  EyeOutlined,
  EditOutlined,
  SendOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  UserOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  PrinterOutlined,
  TruckOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

const mockOrders = [
  {
    id: 'ECO-2024-00015',
    date: '2024-01-15T10:00:00',
    customer: { name: 'John Smith', email: 'john@email.com' },
    items: 3,
    total: 1299.00,
    status: 'pending',
    paymentStatus: 'unpaid',
    shippingMethod: 'Standard',
    trackingNumber: null,
  },
  {
    id: 'ECO-2024-00014',
    date: '2024-01-14T14:30:00',
    customer: { name: 'Jane Doe', email: 'jane@email.com' },
    items: 2,
    total: 899.00,
    status: 'processing',
    paymentStatus: 'paid',
    shippingMethod: 'Express',
    trackingNumber: 'TRK123456789',
  },
];

const orderStatuses = [
  { value: 'pending', label: 'Pending', color: 'default' },
  { value: 'processing', label: 'Processing', color: 'blue' },
  { value: 'shipped', label: 'Shipped', color: 'cyan' },
  { value: 'delivered', label: 'Delivered', color: 'success' },
  { value: 'cancelled', label: 'Cancelled', color: 'error' },
];

const OnlineOrders = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const processingOrders = orders.filter(o => o.status === 'processing').length;
  const totalValue = orders.reduce((sum, o) => sum + o.total, 0);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchText || 
      order.id.toLowerCase().includes(searchText.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !filterStatus || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status) => {
    return orderStatuses.find(s => s.value === status) || orderStatuses[0];
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      width: 140,
      render: (id) => <Text strong style={{ color: '#1890ff' }}>{id}</Text>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 110,
      render: (date) => dayjs(date).format('MMM D, YYYY'),
    },
    {
      title: 'Customer',
      key: 'customer',
      width: 180,
      render: (_, record) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <div>
            <div>{record.customer.name}</div>
            <Text type="secondary" style={{ fontSize: 11 }}>{record.customer.email}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Items',
      key: 'items',
      width: 80,
      align: 'center',
      render: (_, record) => <Badge count={record.items} showZero color="#1890ff" />,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: 120,
      align: 'right',
      render: (total) => <Text strong>${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button 
              type="text" 
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedOrder(record);
                setDetailDrawerVisible(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Online Orders"
        subtitle={`${filteredOrders.length} orders`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'E-Commerce', path: '/ecommerce' },
          { title: 'Online Orders', path: '/ecommerce/orders' },
        ]}
        actions={[
          <Button key="export" icon={<ExportOutlined />}>Export</Button>,
        ]}
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Orders"
            value={totalOrders}
            icon={<ShoppingCartOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Pending"
            value={pendingOrders}
            icon={<CalendarOutlined style={{ fontSize: 24, color: '#faad14' }} />}
            color="#faad14"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Processing"
            value={processingOrders}
            icon={<TruckOutlined style={{ fontSize: 24, color: '#722ed1' }} />}
            color="#722ed1"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Value"
            value={`$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            icon={<DollarOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
            color="#52c41a"
          />
        </Col>
      </Row>

      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Space wrap>
            <Search
              placeholder="Search orders..."
              allowClear
              style={{ width: 220 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              placeholder="Status"
              allowClear
              style={{ width: 130 }}
              value={filterStatus}
              onChange={setFilterStatus}
              options={orderStatuses.map(s => ({ label: s.label, value: s.value }))}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1000 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} orders`,
          }}
        />
      </Card>

      <Drawer
        title="Order Details"
        placement="right"
        width={700}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        extra={
          selectedOrder && (
            <Space>
              <Button icon={<PrinterOutlined />}>Print</Button>
            </Space>
          )
        }
      >
        {selectedOrder && (
          <>
            <div style={{ marginBottom: 24 }}>
              <Space>
                <Text strong style={{ fontSize: 20 }}>{selectedOrder.id}</Text>
                <Tag color={getStatusConfig(selectedOrder.status).color}>
                  {getStatusConfig(selectedOrder.status).label}
                </Tag>
              </Space>
            </div>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Customer">{selectedOrder.customer.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedOrder.customer.email}</Descriptions.Item>
              <Descriptions.Item label="Total">${selectedOrder.total.toFixed(2)}</Descriptions.Item>
              <Descriptions.Item label="Status">{getStatusConfig(selectedOrder.status).label}</Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default OnlineOrders;

