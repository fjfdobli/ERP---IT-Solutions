import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Input, Select, Tag, 
  Tooltip, Badge, message, Typography, Drawer, Descriptions, 
  Avatar, Divider, Form, Statistic, Tabs, List, Progress
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
  ShopOutlined,
  TeamOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer, ConfirmModal } from '../../components/Common';
import dayjs from 'dayjs';

const { Search, TextArea } = Input;
const { Text, Title } = Typography;
const { TabPane } = Tabs;

// Mock branches data
const mockBranches = [
  {
    id: 'BR001',
    name: 'Main Branch - Makati',
    code: 'MKT-001',
    type: 'flagship',
    address: '6750 Ayala Avenue, Makati City, Metro Manila',
    phone: '+63 2 8888 0001',
    email: 'makati@erp.com',
    manager: 'Juan Dela Cruz',
    status: 'active',
    openingDate: '2018-01-15',
    operatingHours: '9:00 AM - 9:00 PM',
    employeeCount: 45,
    monthlyRevenue: 2500000,
    monthlyTransactions: 1250,
    inventoryValue: 15000000,
    avgDailySales: 85000,
    hasWarehouse: true,
    warehouseCapacity: '2,500 sqm',
    coordinates: { lat: 14.5547, lng: 121.0244 },
    features: ['POS Terminal', 'Service Center', 'Product Display', 'Customer Lounge', 'Parking'],
  },
  {
    id: 'BR002',
    name: 'BGC Branch',
    code: 'BGC-001',
    type: 'standard',
    address: '30th Floor, SM Aura Tower, BGC, Taguig City',
    phone: '+63 2 8888 0002',
    email: 'bgc@erp.com',
    manager: 'Maria Santos',
    status: 'active',
    openingDate: '2020-06-20',
    operatingHours: '10:00 AM - 10:00 PM',
    employeeCount: 28,
    monthlyRevenue: 1800000,
    monthlyTransactions: 920,
    inventoryValue: 8500000,
    avgDailySales: 62000,
    hasWarehouse: false,
    warehouseCapacity: null,
    coordinates: { lat: 14.5499, lng: 121.0549 },
    features: ['POS Terminal', 'Product Display', 'Customer Lounge'],
  },
  {
    id: 'BR003',
    name: 'Alabang Branch',
    code: 'ALB-001',
    type: 'standard',
    address: '789 Ayala Highway, Alabang, Muntinlupa City',
    phone: '+63 2 8888 0003',
    email: 'alabang@erp.com',
    manager: 'Pedro Reyes',
    status: 'active',
    openingDate: '2019-03-10',
    operatingHours: '10:00 AM - 9:00 PM',
    employeeCount: 22,
    monthlyRevenue: 1200000,
    monthlyTransactions: 680,
    inventoryValue: 6000000,
    avgDailySales: 42000,
    hasWarehouse: true,
    warehouseCapacity: '1,200 sqm',
    coordinates: { lat: 14.4168, lng: 121.0434 },
    features: ['POS Terminal', 'Product Display', 'Parking'],
  },
  {
    id: 'BR004',
    name: 'Ortigas Branch',
    code: 'ORT-001',
    type: 'standard',
    address: '654 Ortigas Center, Pasig City',
    phone: '+63 2 8888 0004',
    email: 'ortigas@erp.com',
    manager: 'Carlos Tan',
    status: 'active',
    openingDate: '2021-08-15',
    operatingHours: '10:00 AM - 9:00 PM',
    employeeCount: 18,
    monthlyRevenue: 950000,
    monthlyTransactions: 520,
    inventoryValue: 4500000,
    avgDailySales: 33000,
    hasWarehouse: false,
    warehouseCapacity: null,
    coordinates: { lat: 14.5873, lng: 121.0615 },
    features: ['POS Terminal', 'Product Display'],
  },
  {
    id: 'BR005',
    name: 'Quezon City Branch',
    code: 'QC-001',
    type: 'kiosk',
    address: 'SM North EDSA, Quezon City',
    phone: '+63 2 8888 0005',
    email: 'qc@erp.com',
    manager: 'Ana Garcia',
    status: 'active',
    openingDate: '2022-11-01',
    operatingHours: '10:00 AM - 10:00 PM',
    employeeCount: 8,
    monthlyRevenue: 450000,
    monthlyTransactions: 380,
    inventoryValue: 2000000,
    avgDailySales: 15500,
    hasWarehouse: false,
    warehouseCapacity: null,
    coordinates: { lat: 14.6576, lng: 121.0309 },
    features: ['POS Terminal'],
  },
  {
    id: 'BR006',
    name: 'Cebu Branch',
    code: 'CEB-001',
    type: 'standard',
    address: 'Ayala Center Cebu, Cebu City',
    phone: '+63 32 888 0006',
    email: 'cebu@erp.com',
    manager: 'Roberto Lim',
    status: 'maintenance',
    openingDate: '2020-02-20',
    operatingHours: '10:00 AM - 9:00 PM',
    employeeCount: 15,
    monthlyRevenue: 0,
    monthlyTransactions: 0,
    inventoryValue: 3500000,
    avgDailySales: 0,
    hasWarehouse: true,
    warehouseCapacity: '800 sqm',
    coordinates: { lat: 10.3157, lng: 123.8854 },
    features: ['POS Terminal', 'Product Display', 'Parking'],
  },
];

const branchTypes = ['flagship', 'standard', 'kiosk', 'warehouse'];

const Branches = () => {
  const [branches, setBranches] = useState(mockBranches);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [form] = Form.useForm();

  // Calculate stats
  const totalBranches = branches.length;
  const activeBranches = branches.filter(b => b.status === 'active').length;
  const totalRevenue = branches.reduce((sum, b) => sum + b.monthlyRevenue, 0);
  const totalEmployees = branches.reduce((sum, b) => sum + b.employeeCount, 0);

  // Filter branches
  const filteredBranches = branches.filter(branch => {
    const matchesSearch = !searchText || 
      branch.name.toLowerCase().includes(searchText.toLowerCase()) ||
      branch.code.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !filterStatus || branch.status === filterStatus;
    const matchesType = !filterType || branch.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getTypeColor = (type) => {
    const colors = {
      'flagship': 'gold',
      'standard': 'blue',
      'kiosk': 'cyan',
      'warehouse': 'purple',
    };
    return colors[type] || 'default';
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'success',
      'inactive': 'default',
      'maintenance': 'warning',
    };
    return colors[status] || 'default';
  };

  // Table columns
  const columns = [
    {
      title: 'Branch',
      key: 'branch',
      width: 250,
      fixed: 'left',
      render: (_, record) => (
        <Space>
          <Avatar 
            size={40} 
            style={{ 
              backgroundColor: record.type === 'flagship' ? '#faad14' : '#1890ff',
            }}
            icon={<ShopOutlined />}
          />
          <div>
            <Text strong>{record.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 11 }}>{record.code}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => (
        <Tag color={getTypeColor(type)} style={{ textTransform: 'capitalize' }}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Manager',
      dataIndex: 'manager',
      key: 'manager',
      width: 140,
    },
    {
      title: 'Employees',
      dataIndex: 'employeeCount',
      key: 'employeeCount',
      width: 100,
      align: 'center',
      render: (count) => (
        <Badge count={count} style={{ backgroundColor: '#1890ff' }} overflowCount={999} />
      ),
    },
    {
      title: 'Monthly Revenue',
      dataIndex: 'monthlyRevenue',
      key: 'monthlyRevenue',
      width: 150,
      align: 'right',
      render: (amount) => (
        <Text strong type={amount > 0 ? 'success' : 'secondary'}>
          ₱{(amount / 1000).toFixed(0)}K
        </Text>
      ),
      sorter: (a, b) => a.monthlyRevenue - b.monthlyRevenue,
    },
    {
      title: 'Transactions',
      dataIndex: 'monthlyTransactions',
      key: 'monthlyTransactions',
      width: 110,
      align: 'center',
      sorter: (a, b) => a.monthlyTransactions - b.monthlyTransactions,
    },
    {
      title: 'Inventory Value',
      dataIndex: 'inventoryValue',
      key: 'inventoryValue',
      width: 140,
      align: 'right',
      render: (amount) => `₱${(amount / 1000000).toFixed(1)}M`,
    },
    {
      title: 'Warehouse',
      dataIndex: 'hasWarehouse',
      key: 'hasWarehouse',
      width: 100,
      align: 'center',
      render: (has) => (
        <Tag color={has ? 'green' : 'default'}>{has ? 'Yes' : 'No'}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status) => (
        <Tag color={getStatusColor(status)} style={{ textTransform: 'capitalize' }}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
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
  const handleCreateBranch = () => {
    form.resetFields();
    setSelectedBranch(null);
    setDrawerVisible(true);
  };

  const handleViewDetails = (branch) => {
    setSelectedBranch(branch);
    setDetailDrawerVisible(true);
  };

  const handleEdit = (branch) => {
    setSelectedBranch(branch);
    form.setFieldsValue(branch);
    setDrawerVisible(true);
  };

  const handleSaveBranch = () => {
    form.validateFields().then(values => {
      if (selectedBranch) {
        setBranches(branches.map(b => b.id === selectedBranch.id ? { ...b, ...values } : b));
        message.success('Branch updated');
      } else {
        const newBranch = {
          id: `BR${String(branches.length + 7).padStart(3, '0')}`,
          ...values,
          status: 'active',
          openingDate: dayjs().format('YYYY-MM-DD'),
          monthlyRevenue: 0,
          monthlyTransactions: 0,
          avgDailySales: 0,
          features: [],
        };
        setBranches([newBranch, ...branches]);
        message.success('Branch created');
      }
      setDrawerVisible(false);
    });
  };

  // Form fields
  const formFields = [
    {
      name: 'name',
      label: 'Branch Name',
      type: 'input',
      rules: [{ required: true, message: 'Please enter branch name' }],
      span: 24,
    },
    {
      name: 'code',
      label: 'Branch Code',
      type: 'input',
      placeholder: 'e.g., MKT-001',
      rules: [{ required: true, message: 'Please enter branch code' }],
      span: 12,
    },
    {
      name: 'type',
      label: 'Branch Type',
      type: 'select',
      options: [
        { label: 'Flagship', value: 'flagship' },
        { label: 'Standard', value: 'standard' },
        { label: 'Kiosk', value: 'kiosk' },
        { label: 'Warehouse', value: 'warehouse' },
      ],
      rules: [{ required: true, message: 'Please select branch type' }],
      span: 12,
    },
    {
      name: 'manager',
      label: 'Branch Manager',
      type: 'input',
      rules: [{ required: true, message: 'Please enter branch manager' }],
      span: 12,
    },
    {
      name: 'employeeCount',
      label: 'Employee Count',
      type: 'number',
      placeholder: '0',
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
      name: 'email',
      label: 'Email',
      type: 'input',
      rules: [{ required: true, type: 'email', message: 'Please enter valid email' }],
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
      name: 'operatingHours',
      label: 'Operating Hours',
      type: 'input',
      placeholder: 'e.g., 9:00 AM - 9:00 PM',
      span: 12,
    },
    {
      name: 'inventoryValue',
      label: 'Inventory Value',
      type: 'number',
      placeholder: '0',
      span: 12,
    },
    {
      name: 'hasWarehouse',
      label: 'Has Warehouse',
      type: 'switch',
      span: 12,
    },
    {
      name: 'warehouseCapacity',
      label: 'Warehouse Capacity',
      type: 'input',
      placeholder: 'e.g., 1,000 sqm',
      span: 12,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Branches"
        subtitle={`${filteredBranches.length} branches`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'Branches', path: '/branches' },
        ]}
        actions={[
          <Button key="export" icon={<ExportOutlined />}>Export</Button>,
          <Button key="create" type="primary" icon={<PlusOutlined />} onClick={handleCreateBranch}>
            Add Branch
          </Button>,
        ]}
      />

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Branches"
            value={totalBranches}
            icon={<ShopOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Active Branches"
            value={activeBranches}
            icon={<CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Monthly Revenue"
            value={`₱${(totalRevenue / 1000000).toFixed(1)}M`}
            icon={<DollarOutlined style={{ fontSize: 24, color: '#722ed1' }} />}
            color="#722ed1"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Employees"
            value={totalEmployees}
            icon={<TeamOutlined style={{ fontSize: 24, color: '#faad14' }} />}
            color="#faad14"
          />
        </Col>
      </Row>

      {/* Filters and Table */}
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Space wrap>
            <Search
              placeholder="Search branches..."
              allowClear
              style={{ width: 250 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              placeholder="Status"
              allowClear
              style={{ width: 130 }}
              value={filterStatus}
              onChange={setFilterStatus}
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
                { label: 'Maintenance', value: 'maintenance' },
              ]}
            />
            <Select
              placeholder="Type"
              allowClear
              style={{ width: 120 }}
              value={filterType}
              onChange={setFilterType}
              options={branchTypes.map(t => ({ label: t.charAt(0).toUpperCase() + t.slice(1), value: t }))}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredBranches}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1500 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} branches`,
          }}
        />
      </Card>

      {/* Create/Edit Drawer */}
      <FormDrawer
        title={selectedBranch ? 'Edit Branch' : 'Add Branch'}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onSubmit={handleSaveBranch}
        form={form}
        fields={formFields}
        width={600}
      />

      {/* Details Drawer */}
      <Drawer
        title="Branch Details"
        placement="right"
        width={650}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        extra={
          <Button icon={<EditOutlined />} onClick={() => {
            setDetailDrawerVisible(false);
            handleEdit(selectedBranch);
          }}>
            Edit
          </Button>
        }
      >
        {selectedBranch && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar 
                size={80} 
                style={{ 
                  backgroundColor: selectedBranch.type === 'flagship' ? '#faad14' : '#1890ff',
                  fontSize: 32,
                }}
                icon={<ShopOutlined />}
              />
              <Title level={4} style={{ marginTop: 12, marginBottom: 4 }}>
                {selectedBranch.name}
              </Title>
              <Space>
                <Tag>{selectedBranch.code}</Tag>
                <Tag color={getTypeColor(selectedBranch.type)} style={{ textTransform: 'capitalize' }}>
                  {selectedBranch.type}
                </Tag>
                <Tag color={getStatusColor(selectedBranch.status)} style={{ textTransform: 'capitalize' }}>
                  {selectedBranch.status}
                </Tag>
              </Space>
            </div>

            {/* Performance Stats */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic 
                    title="Monthly Revenue" 
                    value={selectedBranch.monthlyRevenue} 
                    prefix="₱"
                    valueStyle={{ fontSize: 16 }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic 
                    title="Transactions" 
                    value={selectedBranch.monthlyTransactions}
                    valueStyle={{ fontSize: 16 }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic 
                    title="Avg Daily Sales" 
                    value={selectedBranch.avgDailySales}
                    prefix="₱"
                    valueStyle={{ fontSize: 16 }}
                  />
                </Card>
              </Col>
            </Row>

            <Tabs defaultActiveKey="info">
              <TabPane tab="Information" key="info">
                <Descriptions column={2} bordered size="small" style={{ marginBottom: 24 }}>
                  <Descriptions.Item label={<><TeamOutlined /> Manager</>}>
                    {selectedBranch.manager}
                  </Descriptions.Item>
                  <Descriptions.Item label="Employees">
                    {selectedBranch.employeeCount}
                  </Descriptions.Item>
                  <Descriptions.Item label={<><PhoneOutlined /> Phone</>}>
                    {selectedBranch.phone}
                  </Descriptions.Item>
                  <Descriptions.Item label={<><MailOutlined /> Email</>}>
                    {selectedBranch.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Operating Hours" span={2}>
                    {selectedBranch.operatingHours}
                  </Descriptions.Item>
                  <Descriptions.Item label={<><EnvironmentOutlined /> Address</>} span={2}>
                    {selectedBranch.address}
                  </Descriptions.Item>
                  <Descriptions.Item label="Opening Date">
                    {dayjs(selectedBranch.openingDate).format('MMMM D, YYYY')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Inventory Value">
                    ₱{selectedBranch.inventoryValue.toLocaleString()}
                  </Descriptions.Item>
                </Descriptions>

                {selectedBranch.hasWarehouse && (
                  <Card title="Warehouse Information" size="small" style={{ marginBottom: 24 }}>
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="Has Warehouse">
                        <Tag color="green">Yes</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Capacity">
                        {selectedBranch.warehouseCapacity}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>
                )}
              </TabPane>

              <TabPane tab="Features" key="features">
                <List
                  bordered
                  dataSource={selectedBranch.features}
                  renderItem={(item) => (
                    <List.Item>
                      <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                      {item}
                    </List.Item>
                  )}
                />
              </TabPane>
            </Tabs>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default Branches;
