import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Input, Select, Tag, 
  Tooltip, Badge, message, Typography, DatePicker, Drawer,
  Descriptions, Avatar, Divider, Steps, Form, InputNumber, Timeline
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ExportOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PrinterOutlined,
  CheckOutlined,
  CloseOutlined,
  SendOutlined,
  ShoppingOutlined,
  DollarOutlined,
  UserOutlined,
  ShopOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  FileTextOutlined,
  InboxOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer, ConfirmModal } from '../../components/Common';
import dayjs from 'dayjs';

const { Search, TextArea } = Input;
const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

// Mock purchase orders
const mockOrders = [
  {
    id: 'PO-2024-00125',
    date: '2024-01-15T09:00:00',
    supplier: { id: 'SUP001', name: 'Apple Philippines', contact: 'Juan dela Cruz', email: 'orders@apple.ph', phone: '+63 2 8888 0001' },
    branch: 'Main Branch',
    createdBy: 'Purchasing Manager',
    items: [
      { name: 'iPhone 15 Pro Max 256GB', sku: 'APL-IP15PM-256', qty: 50, unitCost: 899.00, total: 44950.00 },
      { name: 'AirPods Pro 2nd Generation', sku: 'APL-APP2', qty: 100, unitCost: 155.00, total: 15500.00 },
      { name: 'MacBook Pro 14" M3 Pro', sku: 'APL-MBP14-M3P', qty: 20, unitCost: 1650.00, total: 33000.00 },
    ],
    subtotal: 93450.00,
    tax: 11214.00,
    shipping: 500.00,
    total: 105164.00,
    status: 'pending',
    priority: 'high',
    expectedDelivery: '2024-01-25',
    paymentTerms: 'Net 30',
    notes: 'Urgent order for Q1 stock replenishment',
  },
  {
    id: 'PO-2024-00124',
    date: '2024-01-14T14:00:00',
    supplier: { id: 'SUP002', name: 'Samsung Electronics PH', contact: 'Maria Santos', email: 'supply@samsung.ph', phone: '+63 2 8888 0002' },
    branch: 'Downtown Store',
    createdBy: 'Store Manager',
    items: [
      { name: 'Samsung Galaxy S24 Ultra 512GB', sku: 'SAM-GS24U-512', qty: 30, unitCost: 750.00, total: 22500.00 },
      { name: 'Samsung Galaxy Buds3 Pro', sku: 'SAM-GB3P', qty: 50, unitCost: 130.00, total: 6500.00 },
    ],
    subtotal: 29000.00,
    tax: 3480.00,
    shipping: 300.00,
    total: 32780.00,
    status: 'approved',
    priority: 'normal',
    expectedDelivery: '2024-01-22',
    paymentTerms: 'Net 15',
    notes: '',
  },
  {
    id: 'PO-2024-00123',
    date: '2024-01-13T10:30:00',
    supplier: { id: 'SUP003', name: 'Logitech Authorized', contact: 'Pedro Reyes', email: 'orders@logitech.ph', phone: '+63 2 8888 0003' },
    branch: 'Warehouse',
    createdBy: 'Warehouse Manager',
    items: [
      { name: 'Logitech MX Master 3S Mouse', sku: 'LOG-MX-MASTER3S', qty: 200, unitCost: 60.00, total: 12000.00 },
      { name: 'Logitech MX Keys', sku: 'LOG-MX-KEYS', qty: 150, unitCost: 80.00, total: 12000.00 },
    ],
    subtotal: 24000.00,
    tax: 2880.00,
    shipping: 200.00,
    total: 27080.00,
    status: 'ordered',
    priority: 'normal',
    expectedDelivery: '2024-01-20',
    paymentTerms: 'COD',
    notes: 'Regular monthly restock',
    orderSentDate: '2024-01-13T15:00:00',
  },
  {
    id: 'PO-2024-00122',
    date: '2024-01-12T11:00:00',
    supplier: { id: 'SUP004', name: 'Sony Philippines', contact: 'Ana Garcia', email: 'supply@sony.ph', phone: '+63 2 8888 0004' },
    branch: 'Main Branch',
    createdBy: 'Purchasing Manager',
    items: [
      { name: 'Sony WH-1000XM5 Headphones', sku: 'SON-WH1000XM5', qty: 75, unitCost: 240.00, total: 18000.00 },
    ],
    subtotal: 18000.00,
    tax: 2160.00,
    shipping: 150.00,
    total: 20310.00,
    status: 'partial_received',
    priority: 'low',
    expectedDelivery: '2024-01-18',
    paymentTerms: 'Net 30',
    notes: '',
    receivedQty: 50,
    receivedDate: '2024-01-16',
  },
  {
    id: 'PO-2024-00121',
    date: '2024-01-10T09:30:00',
    supplier: { id: 'SUP005', name: 'Dell Technologies PH', contact: 'Carlos Tan', email: 'orders@dell.ph', phone: '+63 2 8888 0005' },
    branch: 'Warehouse',
    createdBy: 'Warehouse Manager',
    items: [
      { name: 'Dell Monitor 27" 4K', sku: 'DEL-MON27-4K', qty: 40, unitCost: 350.00, total: 14000.00 },
    ],
    subtotal: 14000.00,
    tax: 1680.00,
    shipping: 200.00,
    total: 15880.00,
    status: 'received',
    priority: 'normal',
    expectedDelivery: '2024-01-15',
    paymentTerms: 'Net 15',
    notes: '',
    receivedDate: '2024-01-15',
    receivedBy: 'Warehouse Staff',
  },
  {
    id: 'PO-2024-00120',
    date: '2024-01-08T14:00:00',
    supplier: { id: 'SUP001', name: 'Apple Philippines', contact: 'Juan dela Cruz', email: 'orders@apple.ph', phone: '+63 2 8888 0001' },
    branch: 'Main Branch',
    createdBy: 'Store Manager',
    items: [
      { name: 'iPad Pro 12.9" M2 256GB', sku: 'APL-IPADP-129-M2', qty: 25, unitCost: 999.00, total: 24975.00 },
    ],
    subtotal: 24975.00,
    tax: 2997.00,
    shipping: 250.00,
    total: 28222.00,
    status: 'cancelled',
    priority: 'normal',
    expectedDelivery: '2024-01-16',
    paymentTerms: 'Net 30',
    notes: '',
    cancelReason: 'Supplier out of stock - order cancelled',
    cancelledBy: 'Purchasing Manager',
    cancelledDate: '2024-01-09',
  },
];

const orderStatuses = [
  { value: 'pending', label: 'Pending', color: 'default', step: 0 },
  { value: 'approved', label: 'Approved', color: 'blue', step: 1 },
  { value: 'ordered', label: 'Ordered', color: 'processing', step: 2 },
  { value: 'partial_received', label: 'Partial Received', color: 'orange', step: 3 },
  { value: 'received', label: 'Received', color: 'success', step: 4 },
  { value: 'cancelled', label: 'Cancelled', color: 'error', step: -1 },
];

const suppliers = [
  { id: 'SUP001', name: 'Apple Philippines' },
  { id: 'SUP002', name: 'Samsung Electronics PH' },
  { id: 'SUP003', name: 'Logitech Authorized' },
  { id: 'SUP004', name: 'Sony Philippines' },
  { id: 'SUP005', name: 'Dell Technologies PH' },
];

const branches = ['Main Branch', 'Downtown Store', 'Warehouse'];

const PurchaseOrders = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterSupplier, setFilterSupplier] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [form] = Form.useForm();

  // Calculate stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const orderedValue = orders.filter(o => ['ordered', 'partial_received'].includes(o.status))
    .reduce((sum, o) => sum + o.total, 0);
  const totalSpent = orders.filter(o => o.status === 'received')
    .reduce((sum, o) => sum + o.total, 0);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchText || 
      order.id.toLowerCase().includes(searchText.toLowerCase()) ||
      order.supplier.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !filterStatus || order.status === filterStatus;
    const matchesSupplier = !filterSupplier || order.supplier.id === filterSupplier;
    const matchesDate = !dateRange || (
      dayjs(order.date).isAfter(dateRange[0].startOf('day')) &&
      dayjs(order.date).isBefore(dateRange[1].endOf('day'))
    );
    return matchesSearch && matchesStatus && matchesSupplier && matchesDate;
  });

  // Get status config
  const getStatusConfig = (status) => {
    return orderStatuses.find(s => s.value === status) || orderStatuses[0];
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    const colors = { high: 'red', normal: 'blue', low: 'default' };
    return colors[priority] || 'default';
  };

  // Table columns
  const columns = [
    {
      title: 'PO Number',
      dataIndex: 'id',
      key: 'id',
      width: 140,
      fixed: 'left',
      render: (id, record) => (
        <div>
          <Text strong style={{ color: '#1890ff' }}>{id}</Text>
          {record.priority === 'high' && (
            <Tag color="red" style={{ marginLeft: 4 }}>URGENT</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 110,
      render: (date) => dayjs(date).format('MMM D, YYYY'),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Supplier',
      key: 'supplier',
      width: 180,
      render: (_, record) => (
        <div>
          <Text strong>{record.supplier.name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 11 }}>{record.supplier.contact}</Text>
        </div>
      ),
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
      key: 'branch',
      width: 130,
      render: (branch) => (
        <Space>
          <ShopOutlined />
          {branch}
        </Space>
      ),
    },
    {
      title: 'Items',
      key: 'items',
      width: 80,
      align: 'center',
      render: (_, record) => (
        <Badge count={record.items.reduce((sum, i) => sum + i.qty, 0)} showZero color="#1890ff" />
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: 130,
      align: 'right',
      render: (total) => <Text strong>${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>,
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: 'Expected',
      dataIndex: 'expectedDelivery',
      key: 'expectedDelivery',
      width: 110,
      render: (date, record) => {
        const isOverdue = dayjs(date).isBefore(dayjs(), 'day') && !['received', 'cancelled'].includes(record.status);
        return (
          <Text type={isOverdue ? 'danger' : undefined}>
            {dayjs(date).format('MMM D')}
            {isOverdue && ' (Late)'}
          </Text>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button 
              type="text" 
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          {record.status === 'pending' && (
            <>
              <Tooltip title="Approve">
                <Button 
                  type="text" 
                  icon={<CheckOutlined style={{ color: '#52c41a' }} />}
                  onClick={() => handleApprove(record)}
                />
              </Tooltip>
              <Tooltip title="Cancel">
                <Button 
                  type="text" 
                  icon={<CloseOutlined style={{ color: '#ff4d4f' }} />}
                  onClick={() => handleCancel(record)}
                />
              </Tooltip>
            </>
          )}
          {record.status === 'approved' && (
            <Tooltip title="Send to Supplier">
              <Button 
                type="text" 
                icon={<SendOutlined style={{ color: '#1890ff' }} />}
                onClick={() => handleSendOrder(record)}
              />
            </Tooltip>
          )}
          {['ordered', 'partial_received'].includes(record.status) && (
            <Tooltip title="Receive Goods">
              <Button 
                type="text" 
                icon={<InboxOutlined style={{ color: '#722ed1' }} />}
                onClick={() => handleReceive(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  // Item columns
  const itemColumns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div>
          <div>{name}</div>
          <Text type="secondary" style={{ fontSize: 11 }}>{record.sku}</Text>
        </div>
      ),
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      width: 80,
      align: 'center',
    },
    {
      title: 'Unit Cost',
      dataIndex: 'unitCost',
      key: 'unitCost',
      width: 100,
      align: 'right',
      render: (cost) => `$${cost.toFixed(2)}`,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: 120,
      align: 'right',
      render: (total) => <Text strong>${total.toFixed(2)}</Text>,
    },
  ];

  // Handlers
  const handleCreateOrder = () => {
    form.resetFields();
    setSelectedOrder(null);
    setDrawerVisible(true);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailDrawerVisible(true);
  };

  const handleApprove = (order) => {
    setOrders(orders.map(o => o.id === order.id ? { ...o, status: 'approved' } : o));
    message.success(`PO ${order.id} approved`);
  };

  const handleCancel = (order) => {
    setOrders(orders.map(o => o.id === order.id ? { 
      ...o, 
      status: 'cancelled',
      cancelReason: 'Cancelled by user',
      cancelledBy: 'Current User',
      cancelledDate: dayjs().format('YYYY-MM-DD'),
    } : o));
    message.warning(`PO ${order.id} cancelled`);
  };

  const handleSendOrder = (order) => {
    setOrders(orders.map(o => o.id === order.id ? { 
      ...o, 
      status: 'ordered',
      orderSentDate: new Date().toISOString(),
    } : o));
    message.success(`PO ${order.id} sent to supplier`);
  };

  const handleReceive = () => {
    message.info('Opening goods receiving...');
  };

  const handleSaveOrder = () => {
    form.validateFields().then(values => {
      const newOrder = {
        id: `PO-2024-${String(orders.length + 126).padStart(5, '0')}`,
        date: new Date().toISOString(),
        ...values,
        status: 'pending',
        items: [],
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0,
        createdBy: 'Current User',
      };
      setOrders([newOrder, ...orders]);
      message.success('Purchase order created');
      setDrawerVisible(false);
    });
  };

  // Form fields
  const formFields = [
    {
      name: 'supplier',
      label: 'Supplier',
      type: 'select',
      options: suppliers.map(s => ({ label: s.name, value: s.id })),
      rules: [{ required: true, message: 'Please select supplier' }],
      span: 24,
    },
    {
      name: 'branch',
      label: 'Receiving Branch',
      type: 'select',
      options: branches.map(b => ({ label: b, value: b })),
      rules: [{ required: true, message: 'Please select branch' }],
      span: 12,
    },
    {
      name: 'priority',
      label: 'Priority',
      type: 'select',
      options: [
        { label: 'High', value: 'high' },
        { label: 'Normal', value: 'normal' },
        { label: 'Low', value: 'low' },
      ],
      rules: [{ required: true, message: 'Please select priority' }],
      span: 12,
    },
    {
      name: 'expectedDelivery',
      label: 'Expected Delivery',
      type: 'date',
      rules: [{ required: true, message: 'Please select expected delivery date' }],
      span: 12,
    },
    {
      name: 'paymentTerms',
      label: 'Payment Terms',
      type: 'select',
      options: [
        { label: 'COD', value: 'COD' },
        { label: 'Net 15', value: 'Net 15' },
        { label: 'Net 30', value: 'Net 30' },
        { label: 'Net 60', value: 'Net 60' },
      ],
      rules: [{ required: true, message: 'Please select payment terms' }],
      span: 12,
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea',
      span: 24,
    },
  ];

  // Get current step
  const getCurrentStep = (status) => {
    const config = getStatusConfig(status);
    return config.step;
  };

  return (
    <div>
      <PageHeader
        title="Purchase Orders"
        subtitle={`${filteredOrders.length} orders`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'Purchasing', path: '/purchasing' },
          { title: 'Orders', path: '/purchasing/orders' },
        ]}
        actions={[
          <Button key="export" icon={<ExportOutlined />}>Export</Button>,
          <Button key="create" type="primary" icon={<PlusOutlined />} onClick={handleCreateOrder}>
            New PO
          </Button>,
        ]}
      />

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Orders"
            value={totalOrders}
            icon={<ShoppingOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Pending Approval"
            value={pendingOrders}
            icon={<ClockCircleOutlined style={{ fontSize: 24, color: '#faad14' }} />}
            color="#faad14"
            warning={pendingOrders > 0}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="On Order"
            value={`$${orderedValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            icon={<SyncOutlined style={{ fontSize: 24, color: '#722ed1' }} />}
            color="#722ed1"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Spent (Received)"
            value={`$${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            icon={<DollarOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
            color="#52c41a"
          />
        </Col>
      </Row>

      {/* Filters and Table */}
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
            <RangePicker 
              value={dateRange}
              onChange={setDateRange}
            />
            <Select
              placeholder="Status"
              allowClear
              style={{ width: 140 }}
              value={filterStatus}
              onChange={setFilterStatus}
              options={orderStatuses.map(s => ({ label: s.label, value: s.value }))}
            />
            <Select
              placeholder="Supplier"
              allowClear
              style={{ width: 180 }}
              value={filterSupplier}
              onChange={setFilterSupplier}
              options={suppliers.map(s => ({ label: s.name, value: s.id }))}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1400 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} orders`,
          }}
        />
      </Card>

      {/* Create Order Drawer */}
      <FormDrawer
        title="Create Purchase Order"
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onSubmit={handleSaveOrder}
        form={form}
        fields={formFields}
        width={600}
      />

      {/* Order Details Drawer */}
      <Drawer
        title="Purchase Order Details"
        placement="right"
        width={700}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        extra={
          selectedOrder && (
            <Space>
              <Button icon={<PrinterOutlined />}>Print</Button>
              {selectedOrder.status === 'pending' && (
                <Button type="primary" icon={<CheckOutlined />} onClick={() => {
                  handleApprove(selectedOrder);
                  setDetailDrawerVisible(false);
                }}>
                  Approve
                </Button>
              )}
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
                <Tag color={getPriorityColor(selectedOrder.priority)}>
                  {selectedOrder.priority.toUpperCase()}
                </Tag>
              </Space>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">
                  <CalendarOutlined /> Created: {dayjs(selectedOrder.date).format('MMMM D, YYYY h:mm A')}
                </Text>
              </div>
            </div>

            {/* Order Workflow */}
            {selectedOrder.status !== 'cancelled' && (
              <Card size="small" style={{ marginBottom: 24 }}>
                <Steps 
                  current={getCurrentStep(selectedOrder.status)}
                  size="small"
                  items={[
                    { title: 'Pending', icon: <ClockCircleOutlined /> },
                    { title: 'Approved', icon: <CheckCircleOutlined /> },
                    { title: 'Ordered', icon: <SendOutlined /> },
                    { title: 'Partial', icon: <InboxOutlined /> },
                    { title: 'Received', icon: <CheckCircleOutlined /> },
                  ]}
                />
              </Card>
            )}

            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={12}>
                <Card size="small" title="Supplier">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Text strong>{selectedOrder.supplier.name}</Text>
                    <Text><UserOutlined /> {selectedOrder.supplier.contact}</Text>
                    <Text><FileTextOutlined /> {selectedOrder.supplier.email}</Text>
                    <Text>{selectedOrder.supplier.phone}</Text>
                  </Space>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="Order Info">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Branch">
                      <ShopOutlined /> {selectedOrder.branch}
                    </Descriptions.Item>
                    <Descriptions.Item label="Expected Delivery">
                      {dayjs(selectedOrder.expectedDelivery).format('MMM D, YYYY')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Payment Terms">
                      {selectedOrder.paymentTerms}
                    </Descriptions.Item>
                    <Descriptions.Item label="Created By">
                      {selectedOrder.createdBy}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>

            <Divider orientation="left">Order Items</Divider>
            <Table
              columns={itemColumns}
              dataSource={selectedOrder.items}
              rowKey="sku"
              pagination={false}
              size="small"
              style={{ marginBottom: 24 }}
            />

            <Card size="small">
              <Row justify="space-between" style={{ marginBottom: 8 }}>
                <Text>Subtotal</Text>
                <Text>${selectedOrder.subtotal.toFixed(2)}</Text>
              </Row>
              <Row justify="space-between" style={{ marginBottom: 8 }}>
                <Text>Tax (12%)</Text>
                <Text>${selectedOrder.tax.toFixed(2)}</Text>
              </Row>
              <Row justify="space-between" style={{ marginBottom: 8 }}>
                <Text>Shipping</Text>
                <Text>${selectedOrder.shipping.toFixed(2)}</Text>
              </Row>
              <Divider style={{ margin: '12px 0' }} />
              <Row justify="space-between">
                <Title level={4} style={{ margin: 0 }}>Total</Title>
                <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                  ${selectedOrder.total.toFixed(2)}
                </Title>
              </Row>
            </Card>

            {selectedOrder.notes && (
              <>
                <Divider orientation="left">Notes</Divider>
                <Card size="small" style={{ backgroundColor: '#fafafa' }}>
                  <Text>{selectedOrder.notes}</Text>
                </Card>
              </>
            )}

            {selectedOrder.cancelReason && (
              <>
                <Divider orientation="left">Cancellation</Divider>
                <Card size="small" style={{ backgroundColor: '#fff2f0', borderColor: '#ffccc7' }}>
                  <Text type="danger">{selectedOrder.cancelReason}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    Cancelled by {selectedOrder.cancelledBy} on {selectedOrder.cancelledDate}
                  </Text>
                </Card>
              </>
            )}
          </>
        )}
      </Drawer>
    </div>
  );
};

export default PurchaseOrders;
