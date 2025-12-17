import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Input, Select, Tag, 
  Tooltip, Badge, message, Typography, Drawer, Descriptions, 
  Avatar, Divider, Form, Statistic, Progress, List
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ExportOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
  InboxOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  SwapOutlined,
  BoxPlotOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer, ConfirmModal } from '../../components/Common';
import dayjs from 'dayjs';

const { Search, TextArea } = Input;
const { Text, Title } = Typography;

// Mock warehouses data
const mockWarehouses = [
  {
    id: 'WH001',
    name: 'Main Warehouse - Makati',
    code: 'WH-MKT',
    branchId: 'BR001',
    branchName: 'Main Branch - Makati',
    type: 'main',
    address: '6750 Ayala Avenue, Makati City, Metro Manila',
    phone: '+63 2 8888 1001',
    email: 'warehouse.makati@erp.com',
    manager: 'Jose Rizal',
    status: 'active',
    totalCapacity: 2500,
    usedCapacity: 1875,
    capacityUnit: 'sqm',
    totalSKUs: 1250,
    totalValue: 15000000,
    zones: [
      { name: 'Electronics', capacity: 800, used: 680, items: 450 },
      { name: 'Accessories', capacity: 600, used: 520, items: 380 },
      { name: 'Computers', capacity: 700, used: 450, items: 280 },
      { name: 'Staging', capacity: 400, used: 225, items: 140 },
    ],
    features: ['Climate Control', 'Security System', 'Loading Dock', 'Forklift Access', 'CCTV'],
    lastInventoryCount: '2024-01-10',
    staffCount: 15,
  },
  {
    id: 'WH002',
    name: 'Alabang Warehouse',
    code: 'WH-ALB',
    branchId: 'BR003',
    branchName: 'Alabang Branch',
    type: 'branch',
    address: '789 Ayala Highway, Alabang, Muntinlupa City',
    phone: '+63 2 8888 1002',
    email: 'warehouse.alabang@erp.com',
    manager: 'Andres Bonifacio',
    status: 'active',
    totalCapacity: 1200,
    usedCapacity: 840,
    capacityUnit: 'sqm',
    totalSKUs: 680,
    totalValue: 6000000,
    zones: [
      { name: 'Electronics', capacity: 500, used: 380, items: 320 },
      { name: 'Accessories', capacity: 400, used: 300, items: 240 },
      { name: 'Staging', capacity: 300, used: 160, items: 120 },
    ],
    features: ['Security System', 'Loading Dock', 'CCTV'],
    lastInventoryCount: '2024-01-08',
    staffCount: 8,
  },
  {
    id: 'WH003',
    name: 'Cebu Warehouse',
    code: 'WH-CEB',
    branchId: 'BR006',
    branchName: 'Cebu Branch',
    type: 'regional',
    address: 'Ayala Center Cebu, Cebu City',
    phone: '+63 32 888 1003',
    email: 'warehouse.cebu@erp.com',
    manager: 'Lapu-Lapu Santos',
    status: 'maintenance',
    totalCapacity: 800,
    usedCapacity: 560,
    capacityUnit: 'sqm',
    totalSKUs: 420,
    totalValue: 3500000,
    zones: [
      { name: 'Electronics', capacity: 350, used: 280, items: 200 },
      { name: 'Accessories', capacity: 250, used: 180, items: 140 },
      { name: 'Staging', capacity: 200, used: 100, items: 80 },
    ],
    features: ['Security System', 'CCTV'],
    lastInventoryCount: '2024-01-05',
    staffCount: 6,
  },
  {
    id: 'WH004',
    name: 'Distribution Center - Laguna',
    code: 'DC-LAG',
    branchId: null,
    branchName: 'Central Distribution',
    type: 'distribution',
    address: 'Laguna Technopark, Biñan, Laguna',
    phone: '+63 49 888 1004',
    email: 'dc.laguna@erp.com',
    manager: 'Emilio Aguinaldo',
    status: 'active',
    totalCapacity: 5000,
    usedCapacity: 3250,
    capacityUnit: 'sqm',
    totalSKUs: 2500,
    totalValue: 45000000,
    zones: [
      { name: 'Electronics', capacity: 1500, used: 1200, items: 850 },
      { name: 'Accessories', capacity: 1200, used: 900, items: 680 },
      { name: 'Computers', capacity: 1300, used: 750, items: 520 },
      { name: 'Staging', capacity: 500, used: 250, items: 280 },
      { name: 'Returns', capacity: 500, used: 150, items: 170 },
    ],
    features: ['Climate Control', 'Security System', 'Loading Dock', 'Forklift Access', 'CCTV', 'Automated Sorting', '24/7 Operations'],
    lastInventoryCount: '2024-01-12',
    staffCount: 35,
  },
];

const warehouseTypes = ['main', 'branch', 'regional', 'distribution'];

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState(mockWarehouses);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [form] = Form.useForm();
  const totalWarehouses = warehouses.length;
  const activeWarehouses = warehouses.filter(w => w.status === 'active').length;
  const totalCapacity = warehouses.reduce((sum, w) => sum + w.totalCapacity, 0);
  const totalUsed = warehouses.reduce((sum, w) => sum + w.usedCapacity, 0);
  const totalValue = warehouses.reduce((sum, w) => sum + w.totalValue, 0);

  const filteredWarehouses = warehouses.filter(warehouse => {
    const matchesSearch = !searchText || 
      warehouse.name.toLowerCase().includes(searchText.toLowerCase()) ||
      warehouse.code.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !filterStatus || warehouse.status === filterStatus;
    const matchesType = !filterType || warehouse.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getTypeColor = (type) => {
    const colors = {
      'main': 'gold',
      'branch': 'blue',
      'regional': 'cyan',
      'distribution': 'purple',
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

  const columns = [
    {
      title: 'Warehouse',
      key: 'warehouse',
      width: 250,
      fixed: 'left',
      render: (_, record) => (
        <Space>
          <Avatar 
            size={40} 
            style={{ backgroundColor: '#722ed1' }}
            icon={<HomeOutlined />}
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
      width: 110,
      render: (type) => (
        <Tag color={getTypeColor(type)} style={{ textTransform: 'capitalize' }}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Branch',
      dataIndex: 'branchName',
      key: 'branchName',
      width: 160,
      render: (name) => name || <Text type="secondary">N/A</Text>,
    },
    {
      title: 'Manager',
      dataIndex: 'manager',
      key: 'manager',
      width: 140,
    },
    {
      title: 'Capacity',
      key: 'capacity',
      width: 180,
      render: (_, record) => {
        const utilization = Math.round((record.usedCapacity / record.totalCapacity) * 100);
        return (
          <div>
            <Progress 
              percent={utilization} 
              size="small"
              status={utilization >= 90 ? 'exception' : utilization >= 70 ? 'active' : 'normal'}
              strokeColor={utilization >= 90 ? '#ff4d4f' : utilization >= 70 ? '#faad14' : '#52c41a'}
            />
            <Text type="secondary" style={{ fontSize: 11 }}>
              {record.usedCapacity.toLocaleString()} / {record.totalCapacity.toLocaleString()} {record.capacityUnit}
            </Text>
          </div>
        );
      },
    },
    {
      title: 'SKUs',
      dataIndex: 'totalSKUs',
      key: 'totalSKUs',
      width: 100,
      align: 'center',
      render: (count) => <Badge count={count} style={{ backgroundColor: '#1890ff' }} overflowCount={9999} />,
    },
    {
      title: 'Total Value',
      dataIndex: 'totalValue',
      key: 'totalValue',
      width: 130,
      align: 'right',
      render: (amount) => `₱${(amount / 1000000).toFixed(1)}M`,
      sorter: (a, b) => a.totalValue - b.totalValue,
    },
    {
      title: 'Staff',
      dataIndex: 'staffCount',
      key: 'staffCount',
      width: 80,
      align: 'center',
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

  const handleCreateWarehouse = () => {
    form.resetFields();
    setSelectedWarehouse(null);
    setDrawerVisible(true);
  };

  const handleViewDetails = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setDetailDrawerVisible(true);
  };

  const handleEdit = (warehouse) => {
    setSelectedWarehouse(warehouse);
    form.setFieldsValue(warehouse);
    setDrawerVisible(true);
  };

  const handleSaveWarehouse = () => {
    form.validateFields().then(values => {
      if (selectedWarehouse) {
        setWarehouses(warehouses.map(w => w.id === selectedWarehouse.id ? { ...w, ...values } : w));
        message.success('Warehouse updated');
      } else {
        const newWarehouse = {
          id: `WH${String(warehouses.length + 5).padStart(3, '0')}`,
          ...values,
          status: 'active',
          usedCapacity: 0,
          totalSKUs: 0,
          totalValue: 0,
          zones: [],
          features: [],
          lastInventoryCount: null,
        };
        setWarehouses([newWarehouse, ...warehouses]);
        message.success('Warehouse created');
      }
      setDrawerVisible(false);
    });
  };

  // Form fields
  const formFields = [
    {
      name: 'name',
      label: 'Warehouse Name',
      type: 'input',
      rules: [{ required: true, message: 'Please enter warehouse name' }],
      span: 24,
    },
    {
      name: 'code',
      label: 'Warehouse Code',
      type: 'input',
      placeholder: 'e.g., WH-MKT',
      rules: [{ required: true, message: 'Please enter warehouse code' }],
      span: 12,
    },
    {
      name: 'type',
      label: 'Warehouse Type',
      type: 'select',
      options: [
        { label: 'Main', value: 'main' },
        { label: 'Branch', value: 'branch' },
        { label: 'Regional', value: 'regional' },
        { label: 'Distribution', value: 'distribution' },
      ],
      rules: [{ required: true, message: 'Please select warehouse type' }],
      span: 12,
    },
    {
      name: 'branchName',
      label: 'Associated Branch',
      type: 'input',
      placeholder: 'Branch name or Central Distribution',
      span: 24,
    },
    {
      name: 'manager',
      label: 'Warehouse Manager',
      type: 'input',
      rules: [{ required: true, message: 'Please enter manager name' }],
      span: 12,
    },
    {
      name: 'staffCount',
      label: 'Staff Count',
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
      name: 'totalCapacity',
      label: 'Total Capacity (sqm)',
      type: 'number',
      placeholder: '0',
      rules: [{ required: true, message: 'Please enter capacity' }],
      span: 12,
    },
    {
      name: 'capacityUnit',
      label: 'Capacity Unit',
      type: 'select',
      options: [
        { label: 'Square Meters (sqm)', value: 'sqm' },
        { label: 'Pallets', value: 'pallets' },
        { label: 'Cubic Meters', value: 'cbm' },
      ],
      span: 12,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Warehouses"
        subtitle={`${filteredWarehouses.length} warehouses`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'Branches', path: '/branches' },
          { title: 'Warehouses', path: '/branches/warehouses' },
        ]}
        actions={[
          <Button key="export" icon={<ExportOutlined />}>Export</Button>,
          <Button key="create" type="primary" icon={<PlusOutlined />} onClick={handleCreateWarehouse}>
            Add Warehouse
          </Button>,
        ]}
      />

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Warehouses"
            value={totalWarehouses}
            icon={<HomeOutlined style={{ fontSize: 24, color: '#722ed1' }} />}
            color="#722ed1"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Active Warehouses"
            value={activeWarehouses}
            icon={<CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Capacity Utilization"
            value={`${Math.round((totalUsed / totalCapacity) * 100)}%`}
            icon={<BoxPlotOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Inventory Value"
            value={`₱${(totalValue / 1000000).toFixed(1)}M`}
            icon={<InboxOutlined style={{ fontSize: 24, color: '#faad14' }} />}
            color="#faad14"
          />
        </Col>
      </Row>

      {/* Filters and Table */}
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Space wrap>
            <Search
              placeholder="Search warehouses..."
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
              style={{ width: 130 }}
              value={filterType}
              onChange={setFilterType}
              options={warehouseTypes.map(t => ({ label: t.charAt(0).toUpperCase() + t.slice(1), value: t }))}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredWarehouses}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1500 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} warehouses`,
          }}
        />
      </Card>

      {/* Create/Edit Drawer */}
      <FormDrawer
        title={selectedWarehouse ? 'Edit Warehouse' : 'Add Warehouse'}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onSubmit={handleSaveWarehouse}
        form={form}
        fields={formFields}
        width={600}
      />

      {/* Details Drawer */}
      <Drawer
        title="Warehouse Details"
        placement="right"
        width={650}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        extra={
          <Button icon={<EditOutlined />} onClick={() => {
            setDetailDrawerVisible(false);
            handleEdit(selectedWarehouse);
          }}>
            Edit
          </Button>
        }
      >
        {selectedWarehouse && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar 
                size={80} 
                style={{ 
                  backgroundColor: '#722ed1',
                  fontSize: 32,
                }}
                icon={<HomeOutlined />}
              />
              <Title level={4} style={{ marginTop: 12, marginBottom: 4 }}>
                {selectedWarehouse.name}
              </Title>
              <Space>
                <Tag>{selectedWarehouse.code}</Tag>
                <Tag color={getTypeColor(selectedWarehouse.type)} style={{ textTransform: 'capitalize' }}>
                  {selectedWarehouse.type}
                </Tag>
                <Tag color={getStatusColor(selectedWarehouse.status)} style={{ textTransform: 'capitalize' }}>
                  {selectedWarehouse.status}
                </Tag>
              </Space>
            </div>

            {/* Capacity Stats */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic 
                    title="Total SKUs" 
                    value={selectedWarehouse.totalSKUs}
                    valueStyle={{ fontSize: 16 }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic 
                    title="Inventory Value" 
                    value={selectedWarehouse.totalValue}
                    prefix="₱"
                    valueStyle={{ fontSize: 16 }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic 
                    title="Staff" 
                    value={selectedWarehouse.staffCount}
                    valueStyle={{ fontSize: 16 }}
                  />
                </Card>
              </Col>
            </Row>

            <Card title="Capacity Utilization" size="small" style={{ marginBottom: 24 }}>
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Used Capacity</Text>
                  <Text strong>
                    {selectedWarehouse.usedCapacity.toLocaleString()} / {selectedWarehouse.totalCapacity.toLocaleString()} {selectedWarehouse.capacityUnit}
                  </Text>
                </div>
                <Progress 
                  percent={Math.round((selectedWarehouse.usedCapacity / selectedWarehouse.totalCapacity) * 100)}
                  status={selectedWarehouse.usedCapacity >= selectedWarehouse.totalCapacity * 0.9 ? 'exception' : 'normal'}
                />
              </div>
            </Card>

            <Divider orientation="left">Zone Breakdown</Divider>
            <List
              bordered
              dataSource={selectedWarehouse.zones}
              renderItem={(zone) => (
                <List.Item>
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text strong>{zone.name}</Text>
                      <Text type="secondary">{zone.items} items</Text>
                    </div>
                    <Progress 
                      percent={Math.round((zone.used / zone.capacity) * 100)} 
                      size="small"
                      format={() => `${zone.used}/${zone.capacity}`}
                    />
                  </div>
                </List.Item>
              )}
              style={{ marginBottom: 24 }}
            />

            <Descriptions column={2} bordered size="small" style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Manager">{selectedWarehouse.manager}</Descriptions.Item>
              <Descriptions.Item label="Branch">{selectedWarehouse.branchName}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedWarehouse.phone}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedWarehouse.email}</Descriptions.Item>
              <Descriptions.Item label="Address" span={2}>
                {selectedWarehouse.address}
              </Descriptions.Item>
              <Descriptions.Item label="Last Inventory Count">
                {selectedWarehouse.lastInventoryCount ? dayjs(selectedWarehouse.lastInventoryCount).format('MMM D, YYYY') : 'N/A'}
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">Features</Divider>
            <Space wrap>
              {selectedWarehouse.features.map((feature, idx) => (
                <Tag key={idx} color="blue" icon={<CheckCircleOutlined />}>{feature}</Tag>
              ))}
            </Space>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default Warehouses;
