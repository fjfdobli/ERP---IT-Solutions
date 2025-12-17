import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Input, Tag, 
  Tooltip, Badge, message, Typography, Form, Popconfirm, 
  Drawer, Descriptions, Avatar, Statistic, List
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  UserOutlined,
  EyeOutlined,
  ApartmentOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer } from '../../components/Common';

const { Search, TextArea } = Input;
const { Text, Title } = Typography;

// Mock departments data
const mockDepartments = [
  {
    id: 'DEPT001',
    name: 'Sales',
    code: 'SLS',
    description: 'Sales and business development team responsible for revenue generation',
    headId: 'EMP003',
    headName: 'Pedro Reyes',
    headPosition: 'Regional Sales Director',
    employeeCount: 18,
    budget: 2500000,
    status: 'active',
    color: '#1890ff',
    location: 'Main Branch - Makati',
    subDepartments: ['Retail Sales', 'Corporate Sales', 'Online Sales'],
    keyMetrics: { revenue: 15000000, targets: 95, satisfaction: 4.2 },
  },
  {
    id: 'DEPT002',
    name: 'Human Resources',
    code: 'HR',
    description: 'Human capital management, recruitment, training, and employee relations',
    headId: 'EMP004',
    headName: 'Ana Garcia',
    headPosition: 'HR Director',
    employeeCount: 8,
    budget: 800000,
    status: 'active',
    color: '#722ed1',
    location: 'Main Branch - Makati',
    subDepartments: ['Recruitment', 'Training', 'Employee Relations'],
    keyMetrics: { retention: 92, hiring: 45, training: 120 },
  },
  {
    id: 'DEPT003',
    name: 'Information Technology',
    code: 'IT',
    description: 'Technology infrastructure, software development, and technical support',
    headId: 'EMP005',
    headName: 'Carlos Tan',
    headPosition: 'IT Manager',
    employeeCount: 12,
    budget: 1500000,
    status: 'active',
    color: '#13c2c2',
    location: 'Main Branch - Makati',
    subDepartments: ['Development', 'Infrastructure', 'Support'],
    keyMetrics: { uptime: 99.9, tickets: 250, projects: 12 },
  },
  {
    id: 'DEPT004',
    name: 'Finance',
    code: 'FIN',
    description: 'Financial planning, accounting, budgeting, and financial reporting',
    headId: 'EMP007',
    headName: 'Roberto Lim',
    headPosition: 'Finance Manager',
    employeeCount: 10,
    budget: 600000,
    status: 'active',
    color: '#faad14',
    location: 'Main Branch - Makati',
    subDepartments: ['Accounting', 'Budgeting', 'Payroll'],
    keyMetrics: { accuracy: 99.8, audits: 4, reports: 48 },
  },
  {
    id: 'DEPT005',
    name: 'Operations',
    code: 'OPS',
    description: 'Day-to-day operations, store management, and customer service',
    headId: null,
    headName: 'Vacant',
    headPosition: 'Operations Director',
    employeeCount: 45,
    budget: 3000000,
    status: 'active',
    color: '#52c41a',
    location: 'All Branches',
    subDepartments: ['Store Operations', 'Customer Service', 'Quality Assurance'],
    keyMetrics: { efficiency: 88, satisfaction: 4.5, incidents: 5 },
  },
  {
    id: 'DEPT006',
    name: 'Marketing',
    code: 'MKT',
    description: 'Brand management, advertising, promotions, and market research',
    headId: null,
    headName: 'Vacant',
    headPosition: 'Marketing Manager',
    employeeCount: 6,
    budget: 1200000,
    status: 'active',
    color: '#eb2f96',
    location: 'Main Branch - Makati',
    subDepartments: ['Digital Marketing', 'Brand Management', 'Events'],
    keyMetrics: { reach: 500000, campaigns: 24, roi: 3.2 },
  },
  {
    id: 'DEPT007',
    name: 'Warehouse',
    code: 'WHS',
    description: 'Inventory management, logistics, and supply chain operations',
    headId: null,
    headName: 'Jose Rizal',
    headPosition: 'Warehouse Manager',
    employeeCount: 25,
    budget: 1800000,
    status: 'active',
    color: '#fa8c16',
    location: 'Distribution Center - Laguna',
    subDepartments: ['Receiving', 'Storage', 'Dispatch'],
    keyMetrics: { accuracy: 99.5, fulfillment: 98, turnaround: 2.5 },
  },
];

const Departments = () => {
  const [departments, setDepartments] = useState(mockDepartments);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [form] = Form.useForm();

  // Calculate stats
  const totalDepartments = departments.length;
  const totalEmployees = departments.reduce((sum, d) => sum + d.employeeCount, 0);
  const totalBudget = departments.reduce((sum, d) => sum + d.budget, 0);
  const vacantHeads = departments.filter(d => !d.headId || d.headName === 'Vacant').length;

  // Filter departments
  const filteredDepartments = departments.filter(dept =>
    !searchText || 
    dept.name.toLowerCase().includes(searchText.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchText.toLowerCase())
  );

  // Table columns
  const columns = [
    {
      title: 'Department',
      key: 'department',
      width: 250,
      render: (_, record) => (
        <Space>
          <div style={{ 
            width: 40, 
            height: 40, 
            borderRadius: 8, 
            backgroundColor: `${record.color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: record.color,
            fontSize: 18,
          }}>
            <ApartmentOutlined />
          </div>
          <div>
            <Text strong>{record.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 11 }}>{record.code}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Department Head',
      key: 'head',
      width: 200,
      render: (_, record) => (
        record.headName !== 'Vacant' ? (
          <Space>
            <Avatar size="small" style={{ backgroundColor: record.color }}>
              {record.headName.split(' ').map(n => n[0]).join('')}
            </Avatar>
            <div>
              <Text>{record.headName}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 10 }}>{record.headPosition}</Text>
            </div>
          </Space>
        ) : (
          <Tag color="warning">Position Vacant</Tag>
        )
      ),
    },
    {
      title: 'Employees',
      dataIndex: 'employeeCount',
      key: 'employeeCount',
      width: 110,
      align: 'center',
      render: (count) => (
        <Badge count={count} style={{ backgroundColor: '#1890ff' }} overflowCount={999} />
      ),
      sorter: (a, b) => a.employeeCount - b.employeeCount,
    },
    {
      title: 'Budget',
      dataIndex: 'budget',
      key: 'budget',
      width: 130,
      align: 'right',
      render: (budget) => `₱${(budget / 1000000).toFixed(1)}M`,
      sorter: (a, b) => a.budget - b.budget,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      width: 180,
      ellipsis: true,
    },
    {
      title: 'Sub-departments',
      dataIndex: 'subDepartments',
      key: 'subDepartments',
      width: 200,
      render: (subs) => (
        <Space wrap size={2}>
          {subs.slice(0, 2).map((sub, idx) => (
            <Tag key={idx} style={{ fontSize: 10 }}>{sub}</Tag>
          ))}
          {subs.length > 2 && <Tag style={{ fontSize: 10 }}>+{subs.length - 2}</Tag>}
        </Space>
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
      width: 100,
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
  const handleCreate = () => {
    form.resetFields();
    setSelectedDepartment(null);
    setDrawerVisible(true);
  };

  const handleViewDetails = (department) => {
    setSelectedDepartment(department);
    setDetailDrawerVisible(true);
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    form.setFieldsValue(department);
    setDrawerVisible(true);
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      if (selectedDepartment) {
        setDepartments(departments.map(d => 
          d.id === selectedDepartment.id ? { ...d, ...values } : d
        ));
        message.success('Department updated');
      } else {
        const newDepartment = {
          id: `DEPT${String(departments.length + 8).padStart(3, '0')}`,
          ...values,
          status: 'active',
          employeeCount: 0,
          color: '#1890ff',
          subDepartments: [],
          keyMetrics: {},
        };
        setDepartments([...departments, newDepartment]);
        message.success('Department created');
      }
      setDrawerVisible(false);
    });
  };

  // Form fields
  const formFields = [
    {
      name: 'name',
      label: 'Department Name',
      type: 'input',
      rules: [{ required: true, message: 'Please enter department name' }],
      span: 12,
    },
    {
      name: 'code',
      label: 'Code',
      type: 'input',
      placeholder: 'e.g., SLS, HR',
      rules: [{ required: true, message: 'Please enter code' }],
      span: 12,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      rules: [{ required: true, message: 'Please enter description' }],
      span: 24,
    },
    {
      name: 'headName',
      label: 'Department Head',
      type: 'input',
      placeholder: 'Employee name',
      span: 12,
    },
    {
      name: 'headPosition',
      label: 'Head Position',
      type: 'input',
      placeholder: 'e.g., Director, Manager',
      span: 12,
    },
    {
      name: 'location',
      label: 'Location',
      type: 'input',
      placeholder: 'Branch or office location',
      span: 24,
    },
    {
      name: 'budget',
      label: 'Annual Budget',
      type: 'number',
      placeholder: '0',
      span: 24,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Departments"
        subtitle={`${totalDepartments} departments`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'HR', path: '/hr' },
          { title: 'Departments', path: '/hr/departments' },
        ]}
        actions={[
          <Button key="create" type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Add Department
          </Button>,
        ]}
      />

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Departments"
            value={totalDepartments}
            icon={<ApartmentOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Employees"
            value={totalEmployees}
            icon={<TeamOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Budget"
            value={`₱${(totalBudget / 1000000).toFixed(1)}M`}
            icon={<DollarOutlined style={{ fontSize: 24, color: '#faad14' }} />}
            color="#faad14"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Vacant Positions"
            value={vacantHeads}
            icon={<UserOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />}
            color="#ff4d4f"
          />
        </Col>
      </Row>

      {/* Department Cards Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {departments.slice(0, 4).map(dept => (
          <Col xs={24} sm={12} lg={6} key={dept.id}>
            <Card 
              size="small" 
              hoverable
              style={{ borderTop: `3px solid ${dept.color}` }}
              onClick={() => handleViewDetails(dept)}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: 50, 
                  height: 50, 
                  borderRadius: '50%', 
                  backgroundColor: `${dept.color}20`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: dept.color,
                  fontSize: 24,
                  marginBottom: 8,
                }}>
                  <ApartmentOutlined />
                </div>
                <div>
                  <Text strong>{dept.name}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 11 }}>{dept.employeeCount} employees</Text>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Table */}
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="Search departments..."
            allowClear
            style={{ width: 250 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredDepartments}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </Card>

      {/* Create/Edit Drawer */}
      <FormDrawer
        title={selectedDepartment ? 'Edit Department' : 'Add Department'}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onSubmit={handleSave}
        form={form}
        fields={formFields}
        width={500}
      />

      {/* Details Drawer */}
      <Drawer
        title="Department Details"
        placement="right"
        width={600}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        extra={
          <Button icon={<EditOutlined />} onClick={() => {
            setDetailDrawerVisible(false);
            handleEdit(selectedDepartment);
          }}>
            Edit
          </Button>
        }
      >
        {selectedDepartment && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ 
                width: 80, 
                height: 80, 
                borderRadius: '50%', 
                backgroundColor: `${selectedDepartment.color}20`,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: selectedDepartment.color,
                fontSize: 36,
                marginBottom: 12,
              }}>
                <ApartmentOutlined />
              </div>
              <Title level={4} style={{ marginBottom: 4 }}>{selectedDepartment.name}</Title>
              <Tag>{selectedDepartment.code}</Tag>
            </div>

            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic 
                    title="Employees" 
                    value={selectedDepartment.employeeCount}
                    valueStyle={{ fontSize: 16 }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic 
                    title="Budget" 
                    value={selectedDepartment.budget}
                    prefix="₱"
                    valueStyle={{ fontSize: 16 }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic 
                    title="Sub-depts" 
                    value={selectedDepartment.subDepartments.length}
                    valueStyle={{ fontSize: 16 }}
                  />
                </Card>
              </Col>
            </Row>

            <Descriptions column={1} bordered size="small" style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Description">
                {selectedDepartment.description}
              </Descriptions.Item>
              <Descriptions.Item label="Department Head">
                {selectedDepartment.headName !== 'Vacant' ? (
                  <Space>
                    <Avatar size="small" style={{ backgroundColor: selectedDepartment.color }}>
                      {selectedDepartment.headName.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <div>
                      <Text>{selectedDepartment.headName}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 11 }}>{selectedDepartment.headPosition}</Text>
                    </div>
                  </Space>
                ) : (
                  <Tag color="warning">Position Vacant</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Location">
                {selectedDepartment.location}
              </Descriptions.Item>
            </Descriptions>

            <Card title="Sub-departments" size="small" style={{ marginBottom: 24 }}>
              <Space wrap>
                {selectedDepartment.subDepartments.map((sub, idx) => (
                  <Tag key={idx} color={selectedDepartment.color}>{sub}</Tag>
                ))}
              </Space>
            </Card>

            <Card title="Key Metrics" size="small">
              <Row gutter={16}>
                {Object.entries(selectedDepartment.keyMetrics).map(([key, value]) => (
                  <Col span={8} key={key} style={{ textAlign: 'center', marginBottom: 16 }}>
                    <Text type="secondary" style={{ textTransform: 'capitalize' }}>{key}</Text>
                    <br />
                    <Text strong style={{ fontSize: 18 }}>{value}{typeof value === 'number' && value < 10 ? '' : ''}</Text>
                  </Col>
                ))}
              </Row>
            </Card>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default Departments;
