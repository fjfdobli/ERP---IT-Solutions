import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Input, Select, Tag, 
  Tooltip, Badge, message, Typography, Drawer, Descriptions, 
  Avatar, Divider, Form, Statistic, Tabs, Timeline, Progress
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
  UserOutlined,
  TeamOutlined,
  IdcardOutlined,
  CalendarOutlined,
  DollarOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer, ConfirmModal } from '../../components/Common';
import dayjs from 'dayjs';

const { Search, TextArea } = Input;
const { Text, Title } = Typography;
const { TabPane } = Tabs;

// Mock employees data
const mockEmployees = [
  {
    id: 'EMP001',
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    email: 'juan.delacruz@erp.com',
    phone: '+63 917 123 4567',
    department: 'Sales',
    position: 'Sales Manager',
    branchId: 'BR001',
    branchName: 'Main Branch - Makati',
    employmentType: 'full-time',
    status: 'active',
    hireDate: '2020-01-15',
    salary: 85000,
    sss: '33-1234567-8',
    philhealth: '12-123456789-0',
    pagibig: '1234-5678-9012',
    tin: '123-456-789-000',
    address: '123 Rizal Street, Makati City',
    emergencyContact: 'Maria Dela Cruz - +63 918 234 5678 (Spouse)',
    avatar: null,
    manager: 'Pedro Reyes',
    attendanceRate: 98,
    performanceRating: 4.5,
    leaveBalance: { vacation: 10, sick: 8, emergency: 3 },
  },
  {
    id: 'EMP002',
    firstName: 'Maria',
    lastName: 'Santos',
    email: 'maria.santos@erp.com',
    phone: '+63 918 234 5678',
    department: 'HR',
    position: 'HR Supervisor',
    branchId: 'BR001',
    branchName: 'Main Branch - Makati',
    employmentType: 'full-time',
    status: 'active',
    hireDate: '2019-06-20',
    salary: 65000,
    sss: '33-2345678-9',
    philhealth: '12-234567890-1',
    pagibig: '2345-6789-0123',
    tin: '234-567-890-000',
    address: '456 Bonifacio Ave, BGC, Taguig City',
    emergencyContact: 'Jose Santos - +63 919 345 6789 (Father)',
    avatar: null,
    manager: 'Ana Garcia',
    attendanceRate: 100,
    performanceRating: 4.8,
    leaveBalance: { vacation: 12, sick: 10, emergency: 3 },
  },
  {
    id: 'EMP003',
    firstName: 'Pedro',
    lastName: 'Reyes',
    email: 'pedro.reyes@erp.com',
    phone: '+63 919 345 6789',
    department: 'Sales',
    position: 'Regional Sales Director',
    branchId: 'BR001',
    branchName: 'Main Branch - Makati',
    employmentType: 'full-time',
    status: 'active',
    hireDate: '2018-03-10',
    salary: 120000,
    sss: '33-3456789-0',
    philhealth: '12-345678901-2',
    pagibig: '3456-7890-1234',
    tin: '345-678-901-000',
    address: '789 Ayala Highway, Alabang, Muntinlupa',
    emergencyContact: 'Elena Reyes - +63 920 456 7890 (Spouse)',
    avatar: null,
    manager: null,
    attendanceRate: 95,
    performanceRating: 4.2,
    leaveBalance: { vacation: 8, sick: 6, emergency: 2 },
  },
  {
    id: 'EMP004',
    firstName: 'Ana',
    lastName: 'Garcia',
    email: 'ana.garcia@erp.com',
    phone: '+63 920 456 7890',
    department: 'HR',
    position: 'HR Director',
    branchId: 'BR001',
    branchName: 'Main Branch - Makati',
    employmentType: 'full-time',
    status: 'active',
    hireDate: '2017-08-15',
    salary: 130000,
    sss: '33-4567890-1',
    philhealth: '12-456789012-3',
    pagibig: '4567-8901-2345',
    tin: '456-789-012-000',
    address: '321 Quezon Ave, Quezon City',
    emergencyContact: 'Roberto Garcia - +63 921 567 8901 (Husband)',
    avatar: null,
    manager: null,
    attendanceRate: 99,
    performanceRating: 4.9,
    leaveBalance: { vacation: 15, sick: 10, emergency: 3 },
  },
  {
    id: 'EMP005',
    firstName: 'Carlos',
    lastName: 'Tan',
    email: 'carlos.tan@erp.com',
    phone: '+63 921 567 8901',
    department: 'IT',
    position: 'IT Manager',
    branchId: 'BR001',
    branchName: 'Main Branch - Makati',
    employmentType: 'full-time',
    status: 'active',
    hireDate: '2019-11-01',
    salary: 95000,
    sss: '33-5678901-2',
    philhealth: '12-567890123-4',
    pagibig: '5678-9012-3456',
    tin: '567-890-123-000',
    address: '654 Ortigas Center, Pasig City',
    emergencyContact: 'Lisa Tan - +63 922 678 9012 (Sister)',
    avatar: null,
    manager: 'Pedro Reyes',
    attendanceRate: 92,
    performanceRating: 4.3,
    leaveBalance: { vacation: 5, sick: 7, emergency: 3 },
  },
  {
    id: 'EMP006',
    firstName: 'Lisa',
    lastName: 'Wong',
    email: 'lisa.wong@erp.com',
    phone: '+63 922 678 9012',
    department: 'Finance',
    position: 'Accountant',
    branchId: 'BR002',
    branchName: 'BGC Branch',
    employmentType: 'full-time',
    status: 'active',
    hireDate: '2021-02-15',
    salary: 55000,
    sss: '33-6789012-3',
    philhealth: '12-678901234-5',
    pagibig: '6789-0123-4567',
    tin: '678-901-234-000',
    address: '987 España Blvd, Manila',
    emergencyContact: 'Robert Wong - +63 923 789 0123 (Father)',
    avatar: null,
    manager: 'Roberto Lim',
    attendanceRate: 97,
    performanceRating: 4.0,
    leaveBalance: { vacation: 10, sick: 10, emergency: 3 },
  },
  {
    id: 'EMP007',
    firstName: 'Roberto',
    lastName: 'Lim',
    email: 'roberto.lim@erp.com',
    phone: '+63 923 789 0123',
    department: 'Finance',
    position: 'Finance Manager',
    branchId: 'BR001',
    branchName: 'Main Branch - Makati',
    employmentType: 'full-time',
    status: 'active',
    hireDate: '2018-07-20',
    salary: 110000,
    sss: '33-7890123-4',
    philhealth: '12-789012345-6',
    pagibig: '7890-1234-5678',
    tin: '789-012-345-000',
    address: '159 Shaw Blvd, Mandaluyong City',
    emergencyContact: 'Carmen Lim - +63 924 890 1234 (Spouse)',
    avatar: null,
    manager: null,
    attendanceRate: 94,
    performanceRating: 4.6,
    leaveBalance: { vacation: 7, sick: 8, emergency: 3 },
  },
  {
    id: 'EMP008',
    firstName: 'Elena',
    lastName: 'Flores',
    email: 'elena.flores@erp.com',
    phone: '+63 924 890 1234',
    department: 'Operations',
    position: 'Store Supervisor',
    branchId: 'BR003',
    branchName: 'Alabang Branch',
    employmentType: 'full-time',
    status: 'on-leave',
    hireDate: '2020-09-10',
    salary: 45000,
    sss: '33-8901234-5',
    philhealth: '12-890123456-7',
    pagibig: '8901-2345-6789',
    tin: '890-123-456-000',
    address: '753 Alabang-Zapote Road, Muntinlupa',
    emergencyContact: 'Miguel Flores - +63 925 901 2345 (Brother)',
    avatar: null,
    manager: 'Pedro Reyes',
    attendanceRate: 88,
    performanceRating: 3.8,
    leaveBalance: { vacation: 2, sick: 3, emergency: 1 },
  },
];

const departments = ['Sales', 'HR', 'IT', 'Finance', 'Operations', 'Marketing', 'Warehouse'];
const POSITIONS = ['Manager', 'Supervisor', 'Staff', 'Director', 'Accountant', 'Clerk'];
const EMPLOYMENT_TYPES = ['full-time', 'part-time', 'contract', 'probationary'];

const Employees = () => {
  const [employees, setEmployees] = useState(mockEmployees);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterDepartment, setFilterDepartment] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [form] = Form.useForm();

  // Calculate stats
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'active').length;
  const onLeave = employees.filter(e => e.status === 'on-leave').length;
  const avgSalary = Math.round(employees.reduce((sum, e) => sum + e.salary, 0) / employees.length);

  // Filter employees
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = !searchText || 
      `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchText.toLowerCase()) ||
      employee.id.toLowerCase().includes(searchText.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !filterStatus || employee.status === filterStatus;
    const matchesDepartment = !filterDepartment || employee.department === filterDepartment;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const getStatusColor = (status) => {
    const colors = {
      'active': 'success',
      'inactive': 'default',
      'on-leave': 'warning',
      'terminated': 'error',
    };
    return colors[status] || 'default';
  };

  const getDepartmentColor = (dept) => {
    const colors = {
      'Sales': 'blue',
      'HR': 'purple',
      'IT': 'cyan',
      'Finance': 'gold',
      'Operations': 'green',
      'Marketing': 'magenta',
      'Warehouse': 'orange',
    };
    return colors[dept] || 'default';
  };

  // Table columns
  const columns = [
    {
      title: 'Employee',
      key: 'employee',
      width: 250,
      fixed: 'left',
      render: (_, record) => (
        <Space>
          <Avatar 
            size={40} 
            style={{ backgroundColor: getDepartmentColor(record.department) }}
          >
            {record.firstName.charAt(0)}{record.lastName.charAt(0)}
          </Avatar>
          <div>
            <Text strong>{record.firstName} {record.lastName}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 11 }}>{record.id}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
      width: 170,
      render: (position, record) => (
        <div>
          <Text>{position}</Text>
          <br />
          <Tag color={getDepartmentColor(record.department)} style={{ fontSize: 10 }}>
            {record.department}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Branch',
      dataIndex: 'branchName',
      key: 'branchName',
      width: 160,
      ellipsis: true,
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
      title: 'Hire Date',
      dataIndex: 'hireDate',
      key: 'hireDate',
      width: 110,
      render: (date) => dayjs(date).format('MMM D, YYYY'),
      sorter: (a, b) => dayjs(a.hireDate).unix() - dayjs(b.hireDate).unix(),
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      width: 120,
      align: 'right',
      render: (salary) => `₱${salary.toLocaleString()}`,
      sorter: (a, b) => a.salary - b.salary,
    },
    {
      title: 'Attendance',
      dataIndex: 'attendanceRate',
      key: 'attendanceRate',
      width: 110,
      align: 'center',
      render: (rate) => (
        <Progress 
          percent={rate} 
          size="small" 
          strokeColor={rate >= 95 ? '#52c41a' : rate >= 85 ? '#faad14' : '#ff4d4f'}
        />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={getStatusColor(status)} style={{ textTransform: 'capitalize' }}>
          {status.replace('-', ' ')}
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
  const handleCreateEmployee = () => {
    form.resetFields();
    setSelectedEmployee(null);
    setDrawerVisible(true);
  };

  const handleViewDetails = (employee) => {
    setSelectedEmployee(employee);
    setDetailDrawerVisible(true);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    form.setFieldsValue(employee);
    setDrawerVisible(true);
  };

  const handleSaveEmployee = () => {
    form.validateFields().then(values => {
      if (selectedEmployee) {
        setEmployees(employees.map(e => e.id === selectedEmployee.id ? { ...e, ...values } : e));
        message.success('Employee updated');
      } else {
        const newEmployee = {
          id: `EMP${String(employees.length + 9).padStart(3, '0')}`,
          ...values,
          status: 'active',
          hireDate: dayjs().format('YYYY-MM-DD'),
          attendanceRate: 100,
          performanceRating: 0,
          leaveBalance: { vacation: 15, sick: 10, emergency: 3 },
        };
        setEmployees([newEmployee, ...employees]);
        message.success('Employee created');
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
      rules: [{ required: true, message: 'Please enter phone' }],
      span: 12,
    },
    {
      name: 'department',
      label: 'Department',
      type: 'select',
      options: departments.map(d => ({ label: d, value: d })),
      rules: [{ required: true, message: 'Please select department' }],
      span: 12,
    },
    {
      name: 'position',
      label: 'Position',
      type: 'input',
      rules: [{ required: true, message: 'Please enter position' }],
      span: 12,
    },
    {
      name: 'employmentType',
      label: 'Employment Type',
      type: 'select',
      options: [
        { label: 'Full-time', value: 'full-time' },
        { label: 'Part-time', value: 'part-time' },
        { label: 'Contract', value: 'contract' },
        { label: 'Probationary', value: 'probationary' },
      ],
      rules: [{ required: true, message: 'Please select employment type' }],
      span: 12,
    },
    {
      name: 'salary',
      label: 'Monthly Salary',
      type: 'number',
      rules: [{ required: true, message: 'Please enter salary' }],
      span: 12,
    },
    {
      name: 'branchName',
      label: 'Branch',
      type: 'input',
      rules: [{ required: true, message: 'Please enter branch' }],
      span: 24,
    },
    {
      name: 'address',
      label: 'Address',
      type: 'textarea',
      rules: [{ required: true, message: 'Please enter address' }],
      span: 24,
    },
    {
      name: 'sss',
      label: 'SSS Number',
      type: 'input',
      span: 12,
    },
    {
      name: 'philhealth',
      label: 'PhilHealth Number',
      type: 'input',
      span: 12,
    },
    {
      name: 'pagibig',
      label: 'Pag-IBIG Number',
      type: 'input',
      span: 12,
    },
    {
      name: 'tin',
      label: 'TIN',
      type: 'input',
      span: 12,
    },
    {
      name: 'emergencyContact',
      label: 'Emergency Contact',
      type: 'textarea',
      placeholder: 'Name - Phone (Relationship)',
      span: 24,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Employees"
        subtitle={`${filteredEmployees.length} employees`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'HR', path: '/hr' },
          { title: 'Employees', path: '/hr/employees' },
        ]}
        actions={[
          <Button key="export" icon={<ExportOutlined />}>Export</Button>,
          <Button key="create" type="primary" icon={<PlusOutlined />} onClick={handleCreateEmployee}>
            Add Employee
          </Button>,
        ]}
      />

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Employees"
            value={totalEmployees}
            icon={<TeamOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Active"
            value={activeEmployees}
            icon={<CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="On Leave"
            value={onLeave}
            icon={<ClockCircleOutlined style={{ fontSize: 24, color: '#faad14' }} />}
            color="#faad14"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Avg. Salary"
            value={`₱${avgSalary.toLocaleString()}`}
            icon={<DollarOutlined style={{ fontSize: 24, color: '#722ed1' }} />}
            color="#722ed1"
          />
        </Col>
      </Row>

      {/* Filters and Table */}
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Space wrap>
            <Search
              placeholder="Search employees..."
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
                { label: 'On Leave', value: 'on-leave' },
                { label: 'Inactive', value: 'inactive' },
                { label: 'Terminated', value: 'terminated' },
              ]}
            />
            <Select
              placeholder="Department"
              allowClear
              style={{ width: 140 }}
              value={filterDepartment}
              onChange={setFilterDepartment}
              options={departments.map(d => ({ label: d, value: d }))}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredEmployees}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1500 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} employees`,
          }}
        />
      </Card>

      {/* Create/Edit Drawer */}
      <FormDrawer
        title={selectedEmployee ? 'Edit Employee' : 'Add Employee'}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onSubmit={handleSaveEmployee}
        form={form}
        fields={formFields}
        width={700}
      />

      {/* Details Drawer */}
      <Drawer
        title="Employee Details"
        placement="right"
        width={700}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        extra={
          <Button icon={<EditOutlined />} onClick={() => {
            setDetailDrawerVisible(false);
            handleEdit(selectedEmployee);
          }}>
            Edit
          </Button>
        }
      >
        {selectedEmployee && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar 
                size={80} 
                style={{ 
                  backgroundColor: getDepartmentColor(selectedEmployee.department),
                  fontSize: 28,
                }}
              >
                {selectedEmployee.firstName.charAt(0)}{selectedEmployee.lastName.charAt(0)}
              </Avatar>
              <Title level={4} style={{ marginTop: 12, marginBottom: 4 }}>
                {selectedEmployee.firstName} {selectedEmployee.lastName}
              </Title>
              <Text type="secondary">{selectedEmployee.position}</Text>
              <div style={{ marginTop: 8 }}>
                <Space>
                  <Tag color={getDepartmentColor(selectedEmployee.department)}>
                    {selectedEmployee.department}
                  </Tag>
                  <Tag color={getStatusColor(selectedEmployee.status)} style={{ textTransform: 'capitalize' }}>
                    {selectedEmployee.status.replace('-', ' ')}
                  </Tag>
                </Space>
              </div>
            </div>

            {/* Stats */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic 
                    title="Attendance" 
                    value={selectedEmployee.attendanceRate}
                    suffix="%"
                    valueStyle={{ fontSize: 16, color: selectedEmployee.attendanceRate >= 95 ? '#52c41a' : '#faad14' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic 
                    title="Performance" 
                    value={selectedEmployee.performanceRating}
                    suffix="/ 5"
                    valueStyle={{ fontSize: 16 }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic 
                    title="Monthly Salary" 
                    value={selectedEmployee.salary}
                    prefix="₱"
                    valueStyle={{ fontSize: 16 }}
                  />
                </Card>
              </Col>
            </Row>

            <Tabs defaultActiveKey="info">
              <TabPane tab="Information" key="info">
                <Descriptions column={2} bordered size="small" style={{ marginBottom: 24 }}>
                  <Descriptions.Item label="Employee ID">{selectedEmployee.id}</Descriptions.Item>
                  <Descriptions.Item label="Employment Type" style={{ textTransform: 'capitalize' }}>
                    {selectedEmployee.employmentType}
                  </Descriptions.Item>
                  <Descriptions.Item label="Branch">{selectedEmployee.branchName}</Descriptions.Item>
                  <Descriptions.Item label="Hire Date">
                    {dayjs(selectedEmployee.hireDate).format('MMMM D, YYYY')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">{selectedEmployee.email}</Descriptions.Item>
                  <Descriptions.Item label="Phone">{selectedEmployee.phone}</Descriptions.Item>
                  <Descriptions.Item label="Address" span={2}>{selectedEmployee.address}</Descriptions.Item>
                  {selectedEmployee.manager && (
                    <Descriptions.Item label="Reports To" span={2}>{selectedEmployee.manager}</Descriptions.Item>
                  )}
                </Descriptions>

                <Card title="Leave Balance" size="small" style={{ marginBottom: 24 }}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <Text type="secondary">Vacation Leave</Text>
                      <br />
                      <Text strong>{selectedEmployee.leaveBalance.vacation} days</Text>
                    </Col>
                    <Col span={8}>
                      <Text type="secondary">Sick Leave</Text>
                      <br />
                      <Text strong>{selectedEmployee.leaveBalance.sick} days</Text>
                    </Col>
                    <Col span={8}>
                      <Text type="secondary">Emergency Leave</Text>
                      <br />
                      <Text strong>{selectedEmployee.leaveBalance.emergency} days</Text>
                    </Col>
                  </Row>
                </Card>

                <Card title="Emergency Contact" size="small">
                  <Text>{selectedEmployee.emergencyContact}</Text>
                </Card>
              </TabPane>

              <TabPane tab="Government IDs" key="govt">
                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item label="SSS Number">
                    <Text copyable>{selectedEmployee.sss}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="PhilHealth Number">
                    <Text copyable>{selectedEmployee.philhealth}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Pag-IBIG Number">
                    <Text copyable>{selectedEmployee.pagibig}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="TIN">
                    <Text copyable>{selectedEmployee.tin}</Text>
                  </Descriptions.Item>
                </Descriptions>
              </TabPane>
            </Tabs>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default Employees;
