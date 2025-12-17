import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Input, Select, Tag, 
  Tooltip, Badge, message, Typography, Drawer, Descriptions, 
  Avatar, Divider, Rate, Form, Statistic, Progress
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
  GlobalOutlined,
  EnvironmentOutlined,
  ShopOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StarOutlined,
  UserOutlined,
  FileTextOutlined,
  BankOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer, ConfirmModal } from '../../components/Common';
import dayjs from 'dayjs';

const { Search, TextArea } = Input;
const { Text, Title } = Typography;

// Mock suppliers data
const mockSuppliers = [
  {
    id: 'SUP001',
    name: 'Apple Philippines',
    code: 'APPLE-PH',
    category: 'Electronics',
    contactPerson: 'Juan dela Cruz',
    email: 'orders@apple.ph',
    phone: '+63 2 8888 0001',
    website: 'https://www.apple.com/ph',
    address: '6750 Ayala Avenue, Makati City, Metro Manila',
    country: 'Philippines',
    paymentTerms: 'Net 30',
    creditLimit: 500000,
    currentBalance: 105164,
    rating: 5,
    status: 'active',
    totalOrders: 45,
    totalSpent: 2500000,
    onTimeDelivery: 98,
    qualityRating: 99,
    lastOrderDate: '2024-01-15',
    notes: 'Primary Apple authorized distributor',
    bankDetails: {
      bankName: 'BDO Unibank',
      accountName: 'Apple Philippines Inc.',
      accountNumber: '1234567890',
    },
  },
  {
    id: 'SUP002',
    name: 'Samsung Electronics PH',
    code: 'SAM-PH',
    category: 'Electronics',
    contactPerson: 'Maria Santos',
    email: 'supply@samsung.ph',
    phone: '+63 2 8888 0002',
    website: 'https://www.samsung.com/ph',
    address: '30th Floor, SM Aura Tower, BGC, Taguig City',
    country: 'Philippines',
    paymentTerms: 'Net 15',
    creditLimit: 300000,
    currentBalance: 32780,
    rating: 4,
    status: 'active',
    totalOrders: 38,
    totalSpent: 1800000,
    onTimeDelivery: 92,
    qualityRating: 95,
    lastOrderDate: '2024-01-14',
    notes: 'Samsung authorized reseller',
    bankDetails: {
      bankName: 'Metrobank',
      accountName: 'Samsung Electronics Philippines',
      accountNumber: '0987654321',
    },
  },
  {
    id: 'SUP003',
    name: 'Logitech Authorized',
    code: 'LOG-AUTH',
    category: 'Peripherals',
    contactPerson: 'Pedro Reyes',
    email: 'orders@logitech.ph',
    phone: '+63 2 8888 0003',
    website: 'https://www.logitech.com',
    address: '5th Floor, Robinsons Cybergate Tower, Mandaluyong City',
    country: 'Philippines',
    paymentTerms: 'COD',
    creditLimit: 100000,
    currentBalance: 0,
    rating: 4,
    status: 'active',
    totalOrders: 52,
    totalSpent: 950000,
    onTimeDelivery: 88,
    qualityRating: 92,
    lastOrderDate: '2024-01-13',
    notes: 'Good prices, reliable delivery',
    bankDetails: {
      bankName: 'BPI',
      accountName: 'Logitech Auth Distributor',
      accountNumber: '5678901234',
    },
  },
  {
    id: 'SUP004',
    name: 'Sony Philippines',
    code: 'SONY-PH',
    category: 'Electronics',
    contactPerson: 'Ana Garcia',
    email: 'supply@sony.ph',
    phone: '+63 2 8888 0004',
    website: 'https://www.sony.com.ph',
    address: '25th Floor, GT Tower, Makati City',
    country: 'Philippines',
    paymentTerms: 'Net 30',
    creditLimit: 250000,
    currentBalance: 20310,
    rating: 5,
    status: 'active',
    totalOrders: 28,
    totalSpent: 850000,
    onTimeDelivery: 95,
    qualityRating: 98,
    lastOrderDate: '2024-01-12',
    notes: 'Premium audio equipment supplier',
    bankDetails: {
      bankName: 'Unionbank',
      accountName: 'Sony Philippines Corporation',
      accountNumber: '1122334455',
    },
  },
  {
    id: 'SUP005',
    name: 'Dell Technologies PH',
    code: 'DELL-PH',
    category: 'Computers',
    contactPerson: 'Carlos Tan',
    email: 'orders@dell.ph',
    phone: '+63 2 8888 0005',
    website: 'https://www.dell.com/ph',
    address: '12th Floor, Net Lima Building, BGC, Taguig City',
    country: 'Philippines',
    paymentTerms: 'Net 15',
    creditLimit: 400000,
    currentBalance: 0,
    rating: 4,
    status: 'active',
    totalOrders: 22,
    totalSpent: 650000,
    onTimeDelivery: 90,
    qualityRating: 94,
    lastOrderDate: '2024-01-10',
    notes: 'Corporate laptop and monitor supplier',
    bankDetails: {
      bankName: 'Security Bank',
      accountName: 'Dell Technologies Phil.',
      accountNumber: '6677889900',
    },
  },
  {
    id: 'SUP006',
    name: 'HP Inc. Philippines',
    code: 'HP-PH',
    category: 'Computers',
    contactPerson: 'Lisa Wong',
    email: 'procurement@hp.ph',
    phone: '+63 2 8888 0006',
    website: 'https://www.hp.com/ph',
    address: '8th Floor, Philamlife Tower, Paseo de Roxas, Makati',
    country: 'Philippines',
    paymentTerms: 'Net 30',
    creditLimit: 350000,
    currentBalance: 45000,
    rating: 4,
    status: 'inactive',
    totalOrders: 18,
    totalSpent: 420000,
    onTimeDelivery: 85,
    qualityRating: 90,
    lastOrderDate: '2023-12-15',
    notes: 'Currently on hold - reviewing contract terms',
    bankDetails: {
      bankName: 'RCBC',
      accountName: 'HP Inc. Philippines',
      accountNumber: '2233445566',
    },
  },
];

const categories = ['Electronics', 'Peripherals', 'Computers', 'Accessories', 'Software'];

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [form] = Form.useForm();

  // Calculate stats
  const activeSuppliers = suppliers.filter(s => s.status === 'active').length;
  const totalSpent = suppliers.reduce((sum, s) => sum + s.totalSpent, 0);
  const totalOutstanding = suppliers.reduce((sum, s) => sum + s.currentBalance, 0);
  // Filter suppliers
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = !searchText || 
      supplier.name.toLowerCase().includes(searchText.toLowerCase()) ||
      supplier.code.toLowerCase().includes(searchText.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !filterStatus || supplier.status === filterStatus;
    const matchesCategory = !filterCategory || supplier.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Table columns
  const columns = [
    {
      title: 'Supplier',
      key: 'supplier',
      width: 250,
      fixed: 'left',
      render: (_, record) => (
        <Space>
          <Avatar 
            size={40} 
            style={{ backgroundColor: record.status === 'active' ? '#1890ff' : '#d9d9d9' }}
          >
            {record.name.charAt(0)}
          </Avatar>
          <div>
            <Text strong>{record.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 11 }}>{record.code}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category) => <Tag>{category}</Tag>,
    },
    {
      title: 'Contact',
      key: 'contact',
      width: 200,
      render: (_, record) => (
        <div>
          <Text>{record.contactPerson}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 11 }}>{record.email}</Text>
        </div>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: 140,
      render: (rating) => <Rate disabled defaultValue={rating} style={{ fontSize: 14 }} />,
      sorter: (a, b) => a.rating - b.rating,
    },
    {
      title: 'Total Orders',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
      width: 100,
      align: 'center',
      sorter: (a, b) => a.totalOrders - b.totalOrders,
    },
    {
      title: 'Total Spent',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      width: 130,
      align: 'right',
      render: (amount) => <Text strong>${(amount / 1000).toFixed(0)}K</Text>,
      sorter: (a, b) => a.totalSpent - b.totalSpent,
    },
    {
      title: 'Outstanding',
      dataIndex: 'currentBalance',
      key: 'currentBalance',
      width: 120,
      align: 'right',
      render: (amount) => (
        <Text type={amount > 0 ? 'warning' : 'secondary'}>
          ${amount.toLocaleString('en-US')}
        </Text>
      ),
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
        </Space>
      ),
    },
  ];

  // Handlers
  const handleCreateSupplier = () => {
    form.resetFields();
    setSelectedSupplier(null);
    setDrawerVisible(true);
  };

  const handleViewDetails = (supplier) => {
    setSelectedSupplier(supplier);
    setDetailDrawerVisible(true);
  };

  const handleEdit = (supplier) => {
    setSelectedSupplier(supplier);
    form.setFieldsValue(supplier);
    setDrawerVisible(true);
  };

  const handleSaveSupplier = () => {
    form.validateFields().then(values => {
      if (selectedSupplier) {
        setSuppliers(suppliers.map(s => s.id === selectedSupplier.id ? { ...s, ...values } : s));
        message.success('Supplier updated');
      } else {
        const newSupplier = {
          id: `SUP${String(suppliers.length + 7).padStart(3, '0')}`,
          ...values,
          status: 'active',
          rating: 0,
          totalOrders: 0,
          totalSpent: 0,
          currentBalance: 0,
          onTimeDelivery: 0,
          qualityRating: 0,
        };
        setSuppliers([newSupplier, ...suppliers]);
        message.success('Supplier created');
      }
      setDrawerVisible(false);
    });
  };

  // Form fields
  const formFields = [
    {
      name: 'name',
      label: 'Company Name',
      type: 'input',
      rules: [{ required: true, message: 'Please enter company name' }],
      span: 24,
    },
    {
      name: 'code',
      label: 'Supplier Code',
      type: 'input',
      placeholder: 'e.g., APPLE-PH',
      rules: [{ required: true, message: 'Please enter supplier code' }],
      span: 12,
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      options: categories.map(c => ({ label: c, value: c })),
      rules: [{ required: true, message: 'Please select category' }],
      span: 12,
    },
    {
      name: 'contactPerson',
      label: 'Contact Person',
      type: 'input',
      rules: [{ required: true, message: 'Please enter contact person' }],
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
      name: 'website',
      label: 'Website',
      type: 'input',
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
      name: 'creditLimit',
      label: 'Credit Limit',
      type: 'number',
      placeholder: '0',
      span: 12,
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
        title="Suppliers"
        subtitle={`${filteredSuppliers.length} suppliers`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'Purchasing', path: '/purchasing' },
          { title: 'Suppliers', path: '/purchasing/suppliers' },
        ]}
        actions={[
          <Button key="export" icon={<ExportOutlined />}>Export</Button>,
          <Button key="create" type="primary" icon={<PlusOutlined />} onClick={handleCreateSupplier}>
            Add Supplier
          </Button>,
        ]}
      />

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Suppliers"
            value={suppliers.length}
            icon={<ShopOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Active"
            value={activeSuppliers}
            icon={<CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Spent (YTD)"
            value={`$${(totalSpent / 1000000).toFixed(1)}M`}
            icon={<DollarOutlined style={{ fontSize: 24, color: '#722ed1' }} />}
            color="#722ed1"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Outstanding"
            value={`$${totalOutstanding.toLocaleString('en-US')}`}
            icon={<ClockCircleOutlined style={{ fontSize: 24, color: '#faad14' }} />}
            color="#faad14"
          />
        </Col>
      </Row>

      {/* Filters and Table */}
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Space wrap>
            <Search
              placeholder="Search suppliers..."
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
              placeholder="Category"
              allowClear
              style={{ width: 140 }}
              value={filterCategory}
              onChange={setFilterCategory}
              options={categories.map(c => ({ label: c, value: c }))}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredSuppliers}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1400 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} suppliers`,
          }}
        />
      </Card>

      {/* Create/Edit Drawer */}
      <FormDrawer
        title={selectedSupplier ? 'Edit Supplier' : 'Add Supplier'}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onSubmit={handleSaveSupplier}
        form={form}
        fields={formFields}
        width={600}
      />

      {/* Details Drawer */}
      <Drawer
        title="Supplier Details"
        placement="right"
        width={650}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        extra={
          <Button icon={<EditOutlined />} onClick={() => {
            setDetailDrawerVisible(false);
            handleEdit(selectedSupplier);
          }}>
            Edit
          </Button>
        }
      >
        {selectedSupplier && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar 
                size={80} 
                style={{ 
                  backgroundColor: selectedSupplier.status === 'active' ? '#1890ff' : '#d9d9d9',
                  fontSize: 32
                }}
              >
                {selectedSupplier.name.charAt(0)}
              </Avatar>
              <Title level={4} style={{ marginTop: 12, marginBottom: 4 }}>{selectedSupplier.name}</Title>
              <Space>
                <Tag>{selectedSupplier.code}</Tag>
                <Tag color={selectedSupplier.status === 'active' ? 'success' : 'default'}>
                  {selectedSupplier.status === 'active' ? 'Active' : 'Inactive'}
                </Tag>
              </Space>
              <div style={{ marginTop: 12 }}>
                <Rate disabled value={selectedSupplier.rating} />
              </div>
            </div>

            {/* Performance Metrics */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic 
                    title="On-Time Delivery" 
                    value={selectedSupplier.onTimeDelivery} 
                    suffix="%" 
                    valueStyle={{ color: selectedSupplier.onTimeDelivery >= 90 ? '#52c41a' : '#faad14' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic 
                    title="Quality Rating" 
                    value={selectedSupplier.qualityRating} 
                    suffix="%" 
                    valueStyle={{ color: selectedSupplier.qualityRating >= 90 ? '#52c41a' : '#faad14' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic 
                    title="Total Orders" 
                    value={selectedSupplier.totalOrders}
                  />
                </Card>
              </Col>
            </Row>

            <Descriptions column={2} bordered size="small" style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Category">
                <Tag>{selectedSupplier.category}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Payment Terms">
                {selectedSupplier.paymentTerms}
              </Descriptions.Item>
              <Descriptions.Item label="Credit Limit">
                ${selectedSupplier.creditLimit.toLocaleString('en-US')}
              </Descriptions.Item>
              <Descriptions.Item label="Current Balance">
                <Text type={selectedSupplier.currentBalance > 0 ? 'warning' : 'success'}>
                  ${selectedSupplier.currentBalance.toLocaleString('en-US')}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Total Spent">
                ${selectedSupplier.totalSpent.toLocaleString('en-US')}
              </Descriptions.Item>
              <Descriptions.Item label="Last Order">
                {dayjs(selectedSupplier.lastOrderDate).format('MMM D, YYYY')}
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">Contact Information</Divider>
            <Card size="small" style={{ marginBottom: 24 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space>
                  <UserOutlined />
                  <Text strong>{selectedSupplier.contactPerson}</Text>
                </Space>
                <Space>
                  <MailOutlined />
                  <Text copyable>{selectedSupplier.email}</Text>
                </Space>
                <Space>
                  <PhoneOutlined />
                  <Text>{selectedSupplier.phone}</Text>
                </Space>
                <Space>
                  <GlobalOutlined />
                  <a href={selectedSupplier.website} target="_blank" rel="noopener noreferrer">
                    {selectedSupplier.website}
                  </a>
                </Space>
                <Space align="start">
                  <EnvironmentOutlined />
                  <Text>{selectedSupplier.address}</Text>
                </Space>
              </Space>
            </Card>

            <Divider orientation="left">Bank Details</Divider>
            <Card size="small" style={{ marginBottom: 24 }}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Bank">
                  <BankOutlined /> {selectedSupplier.bankDetails.bankName}
                </Descriptions.Item>
                <Descriptions.Item label="Account Name">
                  {selectedSupplier.bankDetails.accountName}
                </Descriptions.Item>
                <Descriptions.Item label="Account Number">
                  <Text copyable>{selectedSupplier.bankDetails.accountNumber}</Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {selectedSupplier.notes && (
              <>
                <Divider orientation="left">Notes</Divider>
                <Card size="small" style={{ backgroundColor: '#fafafa' }}>
                  <Text>{selectedSupplier.notes}</Text>
                </Card>
              </>
            )}
          </>
        )}
      </Drawer>
    </div>
  );
};

export default Suppliers;
