import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Input, Select, Tag, 
  Tooltip, Badge, message, Typography, Drawer, Descriptions, 
  Avatar, Divider, Form, Timeline, Statistic, Progress, Tabs
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ExportOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  CreditCardOutlined,
  GiftOutlined,
  HistoryOutlined,
  StarOutlined,
  StarFilled,
  HeartOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer, ConfirmModal } from '../../components/Common';
import dayjs from 'dayjs';

const { Search, TextArea } = Input;
const { Text, Title } = Typography;
const { TabPane } = Tabs;

// Mock customers data
const mockCustomers = [
  {
    id: 'CUST001',
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    email: 'juan.delacruz@email.com',
    phone: '+63 917 123 4567',
    address: '123 Rizal Street, Barangay San Isidro, Makati City',
    city: 'Makati City',
    type: 'VIP',
    status: 'active',
    totalPurchases: 125000,
    totalOrders: 45,
    loyaltyPoints: 2500,
    creditLimit: 50000,
    creditBalance: 15000,
    lastPurchase: '2024-01-15',
    joinDate: '2022-03-10',
    notes: 'Preferred customer, handles bulk orders for office equipment',
    isFavorite: true,
    recentPurchases: [
      { date: '2024-01-15', items: 'MacBook Pro M3', amount: 99490 },
      { date: '2024-01-10', items: 'AirPods Pro', amount: 14990 },
      { date: '2024-01-05', items: 'Magic Keyboard', amount: 4990 },
    ],
  },
  {
    id: 'CUST002',
    firstName: 'Maria',
    lastName: 'Santos',
    email: 'maria.santos@gmail.com',
    phone: '+63 918 234 5678',
    address: '456 Bonifacio Ave, BGC, Taguig City',
    city: 'Taguig City',
    type: 'Regular',
    status: 'active',
    totalPurchases: 45000,
    totalOrders: 18,
    loyaltyPoints: 900,
    creditLimit: 0,
    creditBalance: 0,
    lastPurchase: '2024-01-14',
    joinDate: '2023-01-15',
    notes: '',
    isFavorite: false,
    recentPurchases: [
      { date: '2024-01-14', items: 'iPhone 15 Case', amount: 1990 },
      { date: '2024-01-08', items: 'USB-C Cable', amount: 790 },
    ],
  },
  {
    id: 'CUST003',
    firstName: 'Pedro',
    lastName: 'Reyes',
    email: 'pedro.reyes@company.com',
    phone: '+63 919 345 6789',
    address: '789 Ayala Highway, Alabang, Muntinlupa City',
    city: 'Muntinlupa City',
    type: 'Wholesale',
    status: 'active',
    totalPurchases: 350000,
    totalOrders: 28,
    loyaltyPoints: 5000,
    creditLimit: 100000,
    creditBalance: 32500,
    lastPurchase: '2024-01-13',
    joinDate: '2021-08-20',
    notes: 'Wholesale buyer for electronics shop chain',
    isFavorite: true,
    recentPurchases: [
      { date: '2024-01-13', items: 'Bulk: Samsung Galaxy S24 (10 units)', amount: 499900 },
    ],
  },
  {
    id: 'CUST004',
    firstName: 'Ana',
    lastName: 'Garcia',
    email: 'ana.garcia@yahoo.com',
    phone: '+63 920 456 7890',
    address: '321 Quezon Ave, Quezon City',
    city: 'Quezon City',
    type: 'Regular',
    status: 'active',
    totalPurchases: 28000,
    totalOrders: 12,
    loyaltyPoints: 560,
    creditLimit: 0,
    creditBalance: 0,
    lastPurchase: '2024-01-12',
    joinDate: '2023-06-05',
    notes: '',
    isFavorite: false,
    recentPurchases: [
      { date: '2024-01-12', items: 'Logitech Mouse', amount: 2490 },
    ],
  },
  {
    id: 'CUST005',
    firstName: 'Carlos',
    lastName: 'Tan',
    email: 'carlos.tan@business.com',
    phone: '+63 921 567 8901',
    address: '654 Ortigas Center, Pasig City',
    city: 'Pasig City',
    type: 'Corporate',
    status: 'active',
    totalPurchases: 520000,
    totalOrders: 35,
    loyaltyPoints: 10400,
    creditLimit: 200000,
    creditBalance: 85000,
    lastPurchase: '2024-01-11',
    joinDate: '2020-11-12',
    notes: 'IT Manager at TechCorp - handles all company IT purchases',
    isFavorite: true,
    recentPurchases: [
      { date: '2024-01-11', items: 'Dell Monitors (5 units)', amount: 75000 },
      { date: '2024-01-05', items: 'Network Equipment', amount: 45000 },
    ],
  },
  {
    id: 'CUST006',
    firstName: 'Lisa',
    lastName: 'Wong',
    email: 'lisa.wong@email.com',
    phone: '+63 922 678 9012',
    address: '987 España Blvd, Manila',
    city: 'Manila',
    type: 'Regular',
    status: 'inactive',
    totalPurchases: 8500,
    totalOrders: 5,
    loyaltyPoints: 170,
    creditLimit: 0,
    creditBalance: 0,
    lastPurchase: '2023-08-20',
    joinDate: '2023-02-28',
    notes: 'Inactive - no purchases in 5+ months',
    isFavorite: false,
    recentPurchases: [
      { date: '2023-08-20', items: 'Wireless Earbuds', amount: 3490 },
    ],
  },
  {
    id: 'CUST007',
    firstName: 'Roberto',
    lastName: 'Lim',
    email: 'roberto.lim@shop.com',
    phone: '+63 923 789 0123',
    address: '159 Shaw Blvd, Mandaluyong City',
    city: 'Mandaluyong City',
    type: 'Wholesale',
    status: 'active',
    totalPurchases: 180000,
    totalOrders: 22,
    loyaltyPoints: 3600,
    creditLimit: 75000,
    creditBalance: 0,
    lastPurchase: '2024-01-10',
    joinDate: '2022-07-14',
    notes: 'Reseller for computer accessories',
    isFavorite: false,
    recentPurchases: [
      { date: '2024-01-10', items: 'Keyboards & Mice bundle (20 sets)', amount: 35000 },
    ],
  },
];

const customerTypes = ['Regular', 'VIP', 'Wholesale', 'Corporate'];
const cities = ['Makati City', 'Taguig City', 'Muntinlupa City', 'Quezon City', 'Pasig City', 'Manila', 'Mandaluyong City'];

const Customers = () => {
  const [customers, setCustomers] = useState(mockCustomers);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [form] = Form.useForm();

  // Calculate stats
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'active').length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalPurchases, 0);
  const totalLoyaltyPoints = customers.reduce((sum, c) => sum + c.loyaltyPoints, 0);
  // Filter customers
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = !searchText || 
      `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchText.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !filterStatus || customer.status === filterStatus;
    const matchesType = !filterType || customer.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getTypeColor = (type) => {
    const colors = {
      'Regular': 'default',
      'VIP': 'gold',
      'Wholesale': 'blue',
      'Corporate': 'purple',
    };
    return colors[type] || 'default';
  };

  // Table columns
  const columns = [
    {
      title: 'Customer',
      key: 'customer',
      width: 250,
      fixed: 'left',
      render: (_, record) => (
        <Space>
          <Avatar 
            size={40} 
            style={{ 
              backgroundColor: record.type === 'VIP' ? '#faad14' : 
                             record.type === 'Corporate' ? '#722ed1' : 
                             record.type === 'Wholesale' ? '#1890ff' : '#52c41a' 
            }}
          >
            {record.firstName.charAt(0)}{record.lastName.charAt(0)}
          </Avatar>
          <div>
            <Space>
              <Text strong>{record.firstName} {record.lastName}</Text>
              {record.isFavorite && <StarFilled style={{ color: '#faad14', fontSize: 12 }} />}
            </Space>
            <br />
            <Text type="secondary" style={{ fontSize: 11 }}>{record.id}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Contact',
      key: 'contact',
      width: 200,
      render: (_, record) => (
        <div>
          <Text style={{ fontSize: 12 }}>{record.email}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 11 }}>{record.phone}</Text>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => <Tag color={getTypeColor(type)}>{type}</Tag>,
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      width: 130,
    },
    {
      title: 'Total Purchases',
      dataIndex: 'totalPurchases',
      key: 'totalPurchases',
      width: 140,
      align: 'right',
      render: (amount) => <Text strong>₱{amount.toLocaleString('en-US')}</Text>,
      sorter: (a, b) => a.totalPurchases - b.totalPurchases,
    },
    {
      title: 'Orders',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
      width: 80,
      align: 'center',
      sorter: (a, b) => a.totalOrders - b.totalOrders,
    },
    {
      title: 'Loyalty Points',
      dataIndex: 'loyaltyPoints',
      key: 'loyaltyPoints',
      width: 120,
      align: 'center',
      render: (points) => (
        <Badge count={points.toLocaleString()} style={{ backgroundColor: '#52c41a' }} overflowCount={99999} />
      ),
    },
    {
      title: 'Last Purchase',
      dataIndex: 'lastPurchase',
      key: 'lastPurchase',
      width: 120,
      render: (date) => dayjs(date).format('MMM D, YYYY'),
      sorter: (a, b) => dayjs(a.lastPurchase).unix() - dayjs(b.lastPurchase).unix(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
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
          <Tooltip title="Edit">
            <Button 
              type="text" 
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title={record.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}>
            <Button 
              type="text" 
              icon={record.isFavorite ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
              onClick={() => toggleFavorite(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Handlers
  const handleCreateCustomer = () => {
    form.resetFields();
    setSelectedCustomer(null);
    setDrawerVisible(true);
  };

  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
    setDetailDrawerVisible(true);
  };

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    form.setFieldsValue(customer);
    setDrawerVisible(true);
  };

  const toggleFavorite = (customer) => {
    setCustomers(customers.map(c => 
      c.id === customer.id ? { ...c, isFavorite: !c.isFavorite } : c
    ));
    message.success(customer.isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleSaveCustomer = () => {
    form.validateFields().then(values => {
      if (selectedCustomer) {
        setCustomers(customers.map(c => c.id === selectedCustomer.id ? { ...c, ...values } : c));
        message.success('Customer updated');
      } else {
        const newCustomer = {
          id: `CUST${String(customers.length + 8).padStart(3, '0')}`,
          ...values,
          status: 'active',
          totalPurchases: 0,
          totalOrders: 0,
          loyaltyPoints: 0,
          creditBalance: 0,
          isFavorite: false,
          joinDate: dayjs().format('YYYY-MM-DD'),
          recentPurchases: [],
        };
        setCustomers([newCustomer, ...customers]);
        message.success('Customer created');
      }
      setDrawerVisible(false);
    });
  };

  // Form fields
  const formFields = [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'input',
      rules: [{ required: true, message: 'Please enter first name' }],
      span: 12,
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'input',
      rules: [{ required: true, message: 'Please enter last name' }],
      span: 12,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'input',
      rules: [{ required: true, type: 'email', message: 'Please enter valid email' }],
      span: 12,
    },
    {
      name: 'phone',
      label: 'Phone',
      type: 'input',
      rules: [{ required: true, message: 'Please enter phone number' }],
      span: 12,
    },
    {
      name: 'type',
      label: 'Customer Type',
      type: 'select',
      options: customerTypes.map(t => ({ label: t, value: t })),
      rules: [{ required: true, message: 'Please select customer type' }],
      span: 12,
    },
    {
      name: 'city',
      label: 'City',
      type: 'select',
      options: cities.map(c => ({ label: c, value: c })),
      rules: [{ required: true, message: 'Please select city' }],
      span: 12,
    },
    {
      name: 'address',
      label: 'Address',
      type: 'textarea',
      rules: [{ required: true, message: 'Please enter address' }],
      span: 24,
    },
    {
      name: 'creditLimit',
      label: 'Credit Limit',
      type: 'number',
      placeholder: '0 for no credit',
      span: 24,
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea',
      span: 24,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle={`${filteredCustomers.length} customers`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'Customers', path: '/customers' },
        ]}
        actions={[
          <Button key="export" icon={<ExportOutlined />}>Export</Button>,
          <Button key="create" type="primary" icon={<PlusOutlined />} onClick={handleCreateCustomer}>
            Add Customer
          </Button>,
        ]}
      />

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Customers"
            value={totalCustomers}
            icon={<UserOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Active Customers"
            value={activeCustomers}
            icon={<UserOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Revenue"
            value={`₱${(totalRevenue / 1000).toFixed(0)}K`}
            icon={<DollarOutlined style={{ fontSize: 24, color: '#722ed1' }} />}
            color="#722ed1"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Loyalty Points Issued"
            value={totalLoyaltyPoints.toLocaleString()}
            icon={<GiftOutlined style={{ fontSize: 24, color: '#faad14' }} />}
            color="#faad14"
          />
        </Col>
      </Row>

      {/* Filters and Table */}
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Space wrap>
            <Search
              placeholder="Search customers..."
              allowClear
              style={{ width: 250 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              placeholder="Status"
              allowClear
              style={{ width: 120 }}
              value={filterStatus}
              onChange={setFilterStatus}
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
              ]}
            />
            <Select
              placeholder="Type"
              allowClear
              style={{ width: 130 }}
              value={filterType}
              onChange={setFilterType}
              options={customerTypes.map(t => ({ label: t, value: t }))}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredCustomers}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1500 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} customers`,
          }}
        />
      </Card>

      {/* Create/Edit Drawer */}
      <FormDrawer
        title={selectedCustomer ? 'Edit Customer' : 'Add Customer'}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onSubmit={handleSaveCustomer}
        form={form}
        fields={formFields}
        width={600}
      />

      {/* Details Drawer */}
      <Drawer
        title="Customer Details"
        placement="right"
        width={650}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        extra={
          <Space>
            <Button 
              icon={selectedCustomer?.isFavorite ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
              onClick={() => selectedCustomer && toggleFavorite(selectedCustomer)}
            >
              {selectedCustomer?.isFavorite ? 'Favorited' : 'Favorite'}
            </Button>
            <Button icon={<EditOutlined />} onClick={() => {
              setDetailDrawerVisible(false);
              handleEdit(selectedCustomer);
            }}>
              Edit
            </Button>
          </Space>
        }
      >
        {selectedCustomer && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar 
                size={80} 
                style={{ 
                  backgroundColor: selectedCustomer.type === 'VIP' ? '#faad14' : 
                                 selectedCustomer.type === 'Corporate' ? '#722ed1' : 
                                 selectedCustomer.type === 'Wholesale' ? '#1890ff' : '#52c41a',
                  fontSize: 32
                }}
              >
                {selectedCustomer.firstName.charAt(0)}{selectedCustomer.lastName.charAt(0)}
              </Avatar>
              <Title level={4} style={{ marginTop: 12, marginBottom: 4 }}>
                {selectedCustomer.firstName} {selectedCustomer.lastName}
              </Title>
              <Space>
                <Tag>{selectedCustomer.id}</Tag>
                <Tag color={getTypeColor(selectedCustomer.type)}>{selectedCustomer.type}</Tag>
                <Tag color={selectedCustomer.status === 'active' ? 'success' : 'default'}>
                  {selectedCustomer.status === 'active' ? 'Active' : 'Inactive'}
                </Tag>
              </Space>
            </div>

            {/* Customer Stats */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic 
                    title="Total Purchases" 
                    value={selectedCustomer.totalPurchases} 
                    prefix="₱"
                    valueStyle={{ fontSize: 16 }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic 
                    title="Total Orders" 
                    value={selectedCustomer.totalOrders}
                    valueStyle={{ fontSize: 16 }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic 
                    title="Loyalty Points" 
                    value={selectedCustomer.loyaltyPoints}
                    valueStyle={{ fontSize: 16, color: '#52c41a' }}
                  />
                </Card>
              </Col>
            </Row>

            <Tabs defaultActiveKey="info">
              <TabPane tab="Information" key="info">
                <Descriptions column={1} bordered size="small" style={{ marginBottom: 24 }}>
                  <Descriptions.Item label={<><MailOutlined /> Email</>}>
                    <Text copyable>{selectedCustomer.email}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label={<><PhoneOutlined /> Phone</>}>
                    {selectedCustomer.phone}
                  </Descriptions.Item>
                  <Descriptions.Item label={<><EnvironmentOutlined /> Address</>}>
                    {selectedCustomer.address}
                  </Descriptions.Item>
                  <Descriptions.Item label="Member Since">
                    {dayjs(selectedCustomer.joinDate).format('MMMM D, YYYY')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Last Purchase">
                    {dayjs(selectedCustomer.lastPurchase).format('MMMM D, YYYY')}
                  </Descriptions.Item>
                </Descriptions>

                {selectedCustomer.creditLimit > 0 && (
                  <Card title="Credit Account" size="small" style={{ marginBottom: 24 }}>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Text type="secondary">Credit Limit</Text>
                        <br />
                        <Text strong>₱{selectedCustomer.creditLimit.toLocaleString()}</Text>
                      </Col>
                      <Col span={12}>
                        <Text type="secondary">Outstanding Balance</Text>
                        <br />
                        <Text type={selectedCustomer.creditBalance > 0 ? 'warning' : 'success'} strong>
                          ₱{selectedCustomer.creditBalance.toLocaleString()}
                        </Text>
                      </Col>
                    </Row>
                    <Progress 
                      percent={Math.round((selectedCustomer.creditBalance / selectedCustomer.creditLimit) * 100)}
                      status={selectedCustomer.creditBalance > selectedCustomer.creditLimit * 0.8 ? 'exception' : 'normal'}
                      style={{ marginTop: 12 }}
                    />
                  </Card>
                )}

                {selectedCustomer.notes && (
                  <Card title="Notes" size="small">
                    <Text>{selectedCustomer.notes}</Text>
                  </Card>
                )}
              </TabPane>

              <TabPane tab="Purchase History" key="history">
                <Timeline
                  items={selectedCustomer.recentPurchases.map(purchase => ({
                    color: 'green',
                    children: (
                      <div>
                        <Text strong>{purchase.items}</Text>
                        <br />
                        <Space>
                          <Text type="secondary">{dayjs(purchase.date).format('MMM D, YYYY')}</Text>
                          <Text type="success">₱{purchase.amount.toLocaleString()}</Text>
                        </Space>
                      </div>
                    ),
                  }))}
                />
                {selectedCustomer.recentPurchases.length === 0 && (
                  <Text type="secondary">No recent purchases</Text>
                )}
              </TabPane>
            </Tabs>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default Customers;
