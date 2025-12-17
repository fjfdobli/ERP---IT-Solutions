import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Input, Select, Tag, 
  Tooltip, Badge, message, Typography, DatePicker, Drawer,
  Descriptions, Avatar, Divider, Timeline, Steps, Form, InputNumber
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
  ShoppingCartOutlined,
  DollarOutlined,
  UserOutlined,
  ShopOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  FileDoneOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer, ConfirmModal } from '../../components/Common';
import dayjs from 'dayjs';

const { Search, TextArea } = Input;
const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

// Mock order data
const mockOrders = [
  {
    id: 'SO-2024-00045',
    date: '2024-01-15T10:00:00',
    customer: { id: 'C005', name: 'Robert Chen', type: 'Corporate', email: 'robert@company.com', phone: '+1 234 567 890' },
    branch: 'Main Branch',
    salesPerson: 'Sarah Wilson',
    items: [
      { name: 'MacBook Pro 14" M3 Pro', sku: 'APL-MBP14-M3P', qty: 10, price: 1899.00, discount: 100 },
      { name: 'Magic Mouse', sku: 'APL-MM', qty: 10, price: 79.00, discount: 0 },
    ],
    subtotal: 19780.00,
    discount: 1000.00,
    tax: 1502.40,
    total: 20282.40,
    status: 'pending',
    priority: 'high',
    paymentTerms: 'Net 30',
    deliveryDate: '2024-01-25',
    deliveryAddress: '123 Business Ave, Suite 100, Metro Manila',
    notes: 'Corporate bulk order - requires manager approval',
  },
  {
    id: 'SO-2024-00044',
    date: '2024-01-14T14:30:00',
    customer: { id: 'C002', name: 'Jane Doe', type: 'VIP', email: 'jane@email.com', phone: '+1 345 678 901' },
    branch: 'Downtown Store',
    salesPerson: 'Mike Johnson',
    items: [
      { name: 'iPhone 15 Pro Max 256GB', sku: 'APL-IP15PM-256', qty: 2, price: 1099.00, discount: 50 },
      { name: 'AirPods Pro 2nd Generation', sku: 'APL-APP2', qty: 2, price: 180.00, discount: 0 },
    ],
    subtotal: 2558.00,
    discount: 100.00,
    tax: 196.64,
    total: 2654.64,
    status: 'confirmed',
    priority: 'normal',
    paymentTerms: 'COD',
    deliveryDate: '2024-01-18',
    deliveryAddress: '456 Residential St, Makati City',
    notes: 'VIP customer - express delivery',
  },
  {
    id: 'SO-2024-00043',
    date: '2024-01-13T11:00:00',
    customer: { id: 'C006', name: 'Tech Solutions Inc', type: 'Corporate', email: 'orders@techsolutions.com', phone: '+1 456 789 012' },
    branch: 'Main Branch',
    salesPerson: 'Tom Brown',
    items: [
      { name: 'Dell Monitor 27" 4K', sku: 'DEL-MON27-4K', qty: 20, price: 450.00, discount: 50 },
      { name: 'Logitech MX Master 3S Mouse', sku: 'LOG-MX-MASTER3S', qty: 20, price: 75.00, discount: 5 },
    ],
    subtotal: 10500.00,
    discount: 1100.00,
    tax: 752.00,
    total: 10152.00,
    status: 'processing',
    priority: 'normal',
    paymentTerms: 'Net 15',
    deliveryDate: '2024-01-20',
    deliveryAddress: '789 Tech Park, BGC, Taguig',
    notes: 'Partial shipment acceptable',
  },
  {
    id: 'SO-2024-00042',
    date: '2024-01-12T09:30:00',
    customer: { id: 'C007', name: 'Maria Santos', type: 'Regular', email: 'maria@email.com', phone: '+1 567 890 123' },
    branch: 'Downtown Store',
    salesPerson: 'Sarah Wilson',
    items: [
      { name: 'Samsung Galaxy S24 Ultra 512GB', sku: 'SAM-GS24U-512', qty: 1, price: 899.00, discount: 0 },
      { name: 'Samsung Galaxy Buds3 Pro', sku: 'SAM-GB3P', qty: 1, price: 159.00, discount: 0 },
    ],
    subtotal: 1058.00,
    discount: 0,
    tax: 84.64,
    total: 1142.64,
    status: 'shipped',
    priority: 'normal',
    paymentTerms: 'COD',
    deliveryDate: '2024-01-15',
    deliveryAddress: '321 Home Street, Quezon City',
    notes: '',
  },
  {
    id: 'SO-2024-00041',
    date: '2024-01-11T16:00:00',
    customer: { id: 'C008', name: 'Global Enterprises', type: 'Corporate', email: 'purchasing@global.com', phone: '+1 678 901 234' },
    branch: 'Main Branch',
    salesPerson: 'Mike Johnson',
    items: [
      { name: 'HP LaserJet Pro MFP', sku: 'HP-LJ-MFP', qty: 5, price: 599.00, discount: 30 },
    ],
    subtotal: 2995.00,
    discount: 150.00,
    tax: 227.60,
    total: 3072.60,
    status: 'delivered',
    priority: 'low',
    paymentTerms: 'Net 30',
    deliveryDate: '2024-01-14',
    deliveryAddress: '555 Corporate Blvd, Pasig City',
    notes: 'Recurring order customer',
  },
  {
    id: 'SO-2024-00040',
    date: '2024-01-10T13:45:00',
    customer: { id: 'C001', name: 'John Smith', type: 'Regular', email: 'john@email.com', phone: '+1 789 012 345' },
    branch: 'Downtown Store',
    salesPerson: 'Tom Brown',
    items: [
      { name: 'Sony WH-1000XM5 Headphones', sku: 'SON-WH1000XM5', qty: 1, price: 299.00, discount: 0 },
    ],
    subtotal: 299.00,
    discount: 0,
    tax: 23.92,
    total: 322.92,
    status: 'cancelled',
    priority: 'normal',
    paymentTerms: 'COD',
    deliveryDate: '2024-01-13',
    deliveryAddress: '888 Customer Lane, Manila',
    notes: '',
    cancelReason: 'Customer requested cancellation',
  },
];

const orderStatuses = [
  { value: 'pending', label: 'Pending', color: 'default', step: 0 },
  { value: 'confirmed', label: 'Confirmed', color: 'blue', step: 1 },
  { value: 'processing', label: 'Processing', color: 'processing', step: 2 },
  { value: 'shipped', label: 'Shipped', color: 'cyan', step: 3 },
  { value: 'delivered', label: 'Delivered', color: 'success', step: 4 },
  { value: 'cancelled', label: 'Cancelled', color: 'error', step: -1 },
];

const branches = ['Main Branch', 'Downtown Store', 'Warehouse'];

const SalesOrders = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterBranch, setFilterBranch] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [form] = Form.useForm();

  // Calculate stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const processingOrders = orders.filter(o => ['confirmed', 'processing', 'shipped'].includes(o.status)).length;
  const totalValue = orders.filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchText || 
      order.id.toLowerCase().includes(searchText.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !filterStatus || order.status === filterStatus;
    const matchesBranch = !filterBranch || order.branch === filterBranch;
    const matchesDate = !dateRange || (
      dayjs(order.date).isAfter(dateRange[0].startOf('day')) &&
      dayjs(order.date).isBefore(dateRange[1].endOf('day'))
    );
    return matchesSearch && matchesStatus && matchesBranch && matchesDate;
  });

  // Get status config
  const getStatusConfig = (status) => {
    return orderStatuses.find(s => s.value === status) || orderStatuses[0];
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    const colors = {
      high: 'red',
      normal: 'blue',
      low: 'default',
    };
    return colors[priority] || 'default';
  };

  // Table columns
  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      width: 140,
      fixed: 'left',
      render: (id, record) => (
        <div>
          <Text strong style={{ color: '#1890ff' }}>{id}</Text>
          {record.priority === 'high' && (
            <Tag color="red" style={{ marginLeft: 4 }}>HIGH</Tag>
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
      title: 'Customer',
      key: 'customer',
      width: 180,
      render: (_, record) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <div>
            <div>{record.customer.name}</div>
            <Tag size="small">{record.customer.type}</Tag>
          </div>
        </Space>
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
      width: 120,
      align: 'right',
      render: (total) => <Text strong>${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>,
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: 'Delivery',
      dataIndex: 'deliveryDate',
      key: 'deliveryDate',
      width: 110,
      render: (date, record) => {
        const isOverdue = dayjs(date).isBefore(dayjs(), 'day') && !['delivered', 'cancelled'].includes(record.status);
        return (
          <Text type={isOverdue ? 'danger' : undefined}>
            {dayjs(date).format('MMM D')}
            {isOverdue && <span> (Overdue)</span>}
          </Text>
        );
      },
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
              <Tooltip title="Confirm Order">
                <Button 
                  type="text" 
                  icon={<CheckOutlined style={{ color: '#52c41a' }} />}
                  onClick={() => handleConfirm(record)}
                />
              </Tooltip>
              <Tooltip title="Cancel Order">
                <Button 
                  type="text" 
                  icon={<CloseOutlined style={{ color: '#ff4d4f' }} />}
                  onClick={() => handleCancel(record)}
                />
              </Tooltip>
            </>
          )}
          {record.status === 'confirmed' && (
            <Tooltip title="Start Processing">
              <Button 
                type="text" 
                icon={<SyncOutlined style={{ color: '#1890ff' }} />}
                onClick={() => handleProcess(record)}
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
      width: 60,
      align: 'center',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      align: 'right',
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      width: 80,
      align: 'right',
      render: (discount) => discount > 0 ? <Text type="danger">-${discount.toFixed(2)}</Text> : '—',
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      width: 100,
      align: 'right',
      render: (_, record) => {
        const subtotal = (record.price * record.qty) - record.discount;
        return <Text strong>${subtotal.toFixed(2)}</Text>;
      },
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

  const handleConfirm = (order) => {
    setOrders(orders.map(o => o.id === order.id ? { ...o, status: 'confirmed' } : o));
    message.success(`Order ${order.id} confirmed`);
  };

  const handleCancel = (order) => {
    setOrders(orders.map(o => o.id === order.id ? { 
      ...o, 
      status: 'cancelled',
      cancelReason: 'Cancelled by staff'
    } : o));
    message.warning(`Order ${order.id} cancelled`);
  };

  const handleProcess = (order) => {
    setOrders(orders.map(o => o.id === order.id ? { ...o, status: 'processing' } : o));
    message.info(`Order ${order.id} is now being processed`);
  };

  const handleSaveOrder = () => {
    form.validateFields().then(values => {
      const newOrder = {
        id: `SO-2024-${String(orders.length + 46).padStart(5, '0')}`,
        date: new Date().toISOString(),
        ...values,
        status: 'pending',
        items: [],
        subtotal: 0,
        discount: 0,
        tax: 0,
        total: 0,
      };
      setOrders([newOrder, ...orders]);
      message.success('Order created successfully');
      setDrawerVisible(false);
    });
  };

  // Form fields
  const formFields = [
    {
      name: 'customer',
      label: 'Customer',
      type: 'select',
      options: [
        { label: 'John Smith - Regular', value: 'C001' },
        { label: 'Jane Doe - VIP', value: 'C002' },
        { label: 'Robert Chen - Corporate', value: 'C005' },
      ],
      rules: [{ required: true, message: 'Please select customer' }],
      span: 24,
    },
    {
      name: 'branch',
      label: 'Branch',
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
      name: 'paymentTerms',
      label: 'Payment Terms',
      type: 'select',
      options: [
        { label: 'COD', value: 'COD' },
        { label: 'Net 15', value: 'Net 15' },
        { label: 'Net 30', value: 'Net 30' },
      ],
      rules: [{ required: true, message: 'Please select payment terms' }],
      span: 12,
    },
    {
      name: 'deliveryDate',
      label: 'Expected Delivery',
      type: 'date',
      rules: [{ required: true, message: 'Please select delivery date' }],
      span: 12,
    },
    {
      name: 'deliveryAddress',
      label: 'Delivery Address',
      type: 'textarea',
      rules: [{ required: true, message: 'Please enter delivery address' }],
      span: 24,
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea',
      span: 24,
    },
  ];

  // Get current step for order workflow
  const getCurrentStep = (status) => {
    const statusConfig = getStatusConfig(status);
    return statusConfig.step;
  };

  return (
    <div>
      <PageHeader
        title="Sales Orders"
        subtitle={`${filteredOrders.length} orders`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'Sales', path: '/sales' },
          { title: 'Orders', path: '/sales/orders' },
        ]}
        actions={[
          <Button key="export" icon={<ExportOutlined />}>Export</Button>,
          <Button key="create" type="primary" icon={<PlusOutlined />} onClick={handleCreateOrder}>
            New Order
          </Button>,
        ]}
      />

      {/* Statistics Cards */}
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
            title="Pending Approval"
            value={pendingOrders}
            icon={<ClockCircleOutlined style={{ fontSize: 24, color: '#faad14' }} />}
            color="#faad14"
            warning={pendingOrders > 0}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="In Progress"
            value={processingOrders}
            icon={<SyncOutlined style={{ fontSize: 24, color: '#722ed1' }} />}
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
              style={{ width: 130 }}
              value={filterStatus}
              onChange={setFilterStatus}
              options={orderStatuses.map(s => ({ label: s.label, value: s.value }))}
            />
            <Select
              placeholder="Branch"
              allowClear
              style={{ width: 140 }}
              value={filterBranch}
              onChange={setFilterBranch}
              options={branches.map(b => ({ label: b, value: b }))}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1300 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} orders`,
          }}
        />
      </Card>

      {/* Create Order Drawer */}
      <FormDrawer
        title="Create Sales Order"
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onSubmit={handleSaveOrder}
        form={form}
        fields={formFields}
        width={600}
      />

      {/* Order Details Drawer */}
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
              {selectedOrder.status === 'pending' && (
                <Button type="primary" icon={<CheckOutlined />} onClick={() => {
                  handleConfirm(selectedOrder);
                  setDetailDrawerVisible(false);
                }}>
                  Confirm Order
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
                  {selectedOrder.priority.toUpperCase()} PRIORITY
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
                    { title: 'Confirmed', icon: <CheckCircleOutlined /> },
                    { title: 'Processing', icon: <SyncOutlined /> },
                    { title: 'Shipped', icon: <SendOutlined /> },
                    { title: 'Delivered', icon: <FileDoneOutlined /> },
                  ]}
                />
              </Card>
            )}

            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={12}>
                <Card size="small" title="Customer Information">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Space>
                      <Avatar icon={<UserOutlined />} />
                      <div>
                        <Text strong>{selectedOrder.customer.name}</Text>
                        <br />
                        <Tag size="small">{selectedOrder.customer.type}</Tag>
                      </div>
                    </Space>
                    <Text><FileTextOutlined /> {selectedOrder.customer.email}</Text>
                    <Text>{selectedOrder.customer.phone}</Text>
                  </Space>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="Order Information">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Branch">
                      <ShopOutlined /> {selectedOrder.branch}
                    </Descriptions.Item>
                    <Descriptions.Item label="Sales Person">
                      {selectedOrder.salesPerson}
                    </Descriptions.Item>
                    <Descriptions.Item label="Payment Terms">
                      {selectedOrder.paymentTerms}
                    </Descriptions.Item>
                    <Descriptions.Item label="Delivery Date">
                      {dayjs(selectedOrder.deliveryDate).format('MMM D, YYYY')}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>

            <Card size="small" title="Delivery Address" style={{ marginBottom: 24 }}>
              <Text>{selectedOrder.deliveryAddress}</Text>
            </Card>

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
              {selectedOrder.discount > 0 && (
                <Row justify="space-between" style={{ marginBottom: 8 }}>
                  <Text>Discount</Text>
                  <Text type="danger">-${selectedOrder.discount.toFixed(2)}</Text>
                </Row>
              )}
              <Row justify="space-between" style={{ marginBottom: 8 }}>
                <Text>Tax (8%)</Text>
                <Text>${selectedOrder.tax.toFixed(2)}</Text>
              </Row>
              <Divider style={{ margin: '12px 0' }} />
              <Row justify="space-between">
                <Title level={4} style={{ margin: 0 }}>Total</Title>
                <Title level={4} style={{ margin: 0, color: '#52c41a' }}>
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
                </Card>
              </>
            )}
          </>
        )}
      </Drawer>
    </div>
  );
};

export default SalesOrders;
