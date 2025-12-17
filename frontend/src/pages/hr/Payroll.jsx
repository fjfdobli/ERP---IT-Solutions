import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Input, Select, Tag, 
  Tooltip, message, Typography, DatePicker, Statistic, Drawer,
  Descriptions, Avatar, Tabs, Divider, Progress, Alert, Badge, List
} from 'antd';
import {
  PlusOutlined,
  ExportOutlined,
  EyeOutlined,
  PrinterOutlined,
  DollarOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CalculatorOutlined,
  BankOutlined,
  SendOutlined,
  TeamOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text, Title } = Typography;

// Mock payroll data
const mockPayroll = [
  {
    id: 'PAY001',
    payrollPeriod: '2024-01-01 to 2024-01-15',
    periodStart: '2024-01-01',
    periodEnd: '2024-01-15',
    employeeId: 'EMP001',
    employeeName: 'Juan Dela Cruz',
    department: 'Sales',
    position: 'Sales Manager',
    employmentType: 'full-time',
    basicPay: 35000,
    daysWorked: 11,
    hoursWorked: 88,
    overtimeHours: 8,
    overtimePay: 3181.82,
    allowances: {
      transportation: 2000,
      meal: 1500,
      communication: 500,
    },
    totalAllowances: 4000,
    grossPay: 42181.82,
    deductions: {
      sss: 1125,
      philHealth: 437.50,
      pagIbig: 100,
      tax: 3500,
      lateDeduction: 0,
      absenceDeduction: 0,
      loans: 2000,
    },
    totalDeductions: 7162.50,
    netPay: 35019.32,
    status: 'paid',
    paymentDate: '2024-01-17',
    paymentMethod: 'bank_transfer',
    bankAccount: '****1234',
  },
  {
    id: 'PAY002',
    payrollPeriod: '2024-01-01 to 2024-01-15',
    periodStart: '2024-01-01',
    periodEnd: '2024-01-15',
    employeeId: 'EMP002',
    employeeName: 'Maria Santos',
    department: 'HR',
    position: 'HR Officer',
    employmentType: 'full-time',
    basicPay: 25000,
    daysWorked: 11,
    hoursWorked: 88,
    overtimeHours: 0,
    overtimePay: 0,
    allowances: {
      transportation: 1500,
      meal: 1500,
      communication: 300,
    },
    totalAllowances: 3300,
    grossPay: 28300,
    deductions: {
      sss: 900,
      philHealth: 312.50,
      pagIbig: 100,
      tax: 1800,
      lateDeduction: 0,
      absenceDeduction: 0,
      loans: 0,
    },
    totalDeductions: 3112.50,
    netPay: 25187.50,
    status: 'paid',
    paymentDate: '2024-01-17',
    paymentMethod: 'bank_transfer',
    bankAccount: '****5678',
  },
  {
    id: 'PAY003',
    payrollPeriod: '2024-01-01 to 2024-01-15',
    periodStart: '2024-01-01',
    periodEnd: '2024-01-15',
    employeeId: 'EMP003',
    employeeName: 'Pedro Reyes',
    department: 'Sales',
    position: 'Sales Representative',
    employmentType: 'full-time',
    basicPay: 18000,
    daysWorked: 10,
    hoursWorked: 80,
    overtimeHours: 12,
    overtimePay: 1636.36,
    allowances: {
      transportation: 1000,
      meal: 1000,
      communication: 200,
    },
    totalAllowances: 2200,
    grossPay: 21836.36,
    deductions: {
      sss: 720,
      philHealth: 225,
      pagIbig: 100,
      tax: 950,
      lateDeduction: 272.73,
      absenceDeduction: 1636.36,
      loans: 1500,
    },
    totalDeductions: 5404.09,
    netPay: 16432.27,
    status: 'pending',
    paymentDate: null,
    paymentMethod: 'bank_transfer',
    bankAccount: '****9012',
  },
  {
    id: 'PAY004',
    payrollPeriod: '2024-01-01 to 2024-01-15',
    periodStart: '2024-01-01',
    periodEnd: '2024-01-15',
    employeeId: 'EMP004',
    employeeName: 'Ana Garcia',
    department: 'HR',
    position: 'HR Manager',
    employmentType: 'full-time',
    basicPay: 45000,
    daysWorked: 11,
    hoursWorked: 88,
    overtimeHours: 4,
    overtimePay: 2045.45,
    allowances: {
      transportation: 3000,
      meal: 2000,
      communication: 1000,
    },
    totalAllowances: 6000,
    grossPay: 53045.45,
    deductions: {
      sss: 1350,
      philHealth: 562.50,
      pagIbig: 100,
      tax: 6500,
      lateDeduction: 0,
      absenceDeduction: 0,
      loans: 0,
    },
    totalDeductions: 8512.50,
    netPay: 44532.95,
    status: 'paid',
    paymentDate: '2024-01-17',
    paymentMethod: 'bank_transfer',
    bankAccount: '****3456',
  },
  {
    id: 'PAY005',
    payrollPeriod: '2024-01-01 to 2024-01-15',
    periodStart: '2024-01-01',
    periodEnd: '2024-01-15',
    employeeId: 'EMP005',
    employeeName: 'Carlos Tan',
    department: 'IT',
    position: 'Senior Developer',
    employmentType: 'full-time',
    basicPay: 55000,
    daysWorked: 9,
    hoursWorked: 72,
    overtimeHours: 0,
    overtimePay: 0,
    allowances: {
      transportation: 2500,
      meal: 2000,
      communication: 1500,
    },
    totalAllowances: 6000,
    grossPay: 61000,
    deductions: {
      sss: 1350,
      philHealth: 687.50,
      pagIbig: 100,
      tax: 8500,
      lateDeduction: 0,
      absenceDeduction: 10000,
      loans: 3000,
    },
    totalDeductions: 23637.50,
    netPay: 37362.50,
    status: 'processing',
    paymentDate: null,
    paymentMethod: 'bank_transfer',
    bankAccount: '****7890',
  },
  {
    id: 'PAY006',
    payrollPeriod: '2024-01-01 to 2024-01-15',
    periodStart: '2024-01-01',
    periodEnd: '2024-01-15',
    employeeId: 'EMP006',
    employeeName: 'Lisa Wong',
    department: 'Finance',
    position: 'Accountant',
    employmentType: 'full-time',
    basicPay: 32000,
    daysWorked: 11,
    hoursWorked: 86,
    overtimeHours: 0,
    overtimePay: 0,
    allowances: {
      transportation: 1800,
      meal: 1500,
      communication: 500,
    },
    totalAllowances: 3800,
    grossPay: 35800,
    deductions: {
      sss: 1080,
      philHealth: 400,
      pagIbig: 100,
      tax: 2800,
      lateDeduction: 0,
      absenceDeduction: 363.64,
      loans: 1000,
    },
    totalDeductions: 5743.64,
    netPay: 30056.36,
    status: 'paid',
    paymentDate: '2024-01-17',
    paymentMethod: 'bank_transfer',
    bankAccount: '****2345',
  },
];

const departments = ['Sales', 'HR', 'IT', 'Finance', 'Operations', 'Marketing', 'Warehouse'];

const Payroll = () => {
  const [payrollRecords] = useState(mockPayroll);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterDepartment, setFilterDepartment] = useState(null);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Calculate statistics
  const totalGross = payrollRecords.reduce((sum, r) => sum + r.grossPay, 0);
  const totalNet = payrollRecords.reduce((sum, r) => sum + r.netPay, 0);
  const totalDeductions = payrollRecords.reduce((sum, r) => sum + r.totalDeductions, 0);
  const paidCount = payrollRecords.filter(r => r.status === 'paid').length;
  const pendingCount = payrollRecords.filter(r => r.status === 'pending').length;
  const processingCount = payrollRecords.filter(r => r.status === 'processing').length;

  // Filter records
  const filteredRecords = payrollRecords.filter(record => {
    const matchesSearch = !searchText || 
      record.employeeName.toLowerCase().includes(searchText.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !filterStatus || record.status === filterStatus;
    const matchesDepartment = !filterDepartment || record.department === filterDepartment;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const getStatusConfig = (status) => {
    const configs = {
      'paid': { color: 'success', text: 'Paid', icon: <CheckCircleOutlined /> },
      'pending': { color: 'warning', text: 'Pending', icon: <ClockCircleOutlined /> },
      'processing': { color: 'processing', text: 'Processing', icon: <CalculatorOutlined /> },
      'cancelled': { color: 'error', text: 'Cancelled' },
    };
    return configs[status] || configs['pending'];
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  // Table columns
  const columns = [
    {
      title: 'Employee',
      key: 'employee',
      width: 220,
      fixed: 'left',
      render: (_, record) => (
        <Space>
          <Avatar 
            style={{ backgroundColor: getDepartmentColor(record.department) }}
          >
            {record.employeeName.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <div>
            <Text strong>{record.employeeName}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 11 }}>{record.position}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 110,
      render: (dept) => <Tag color={getDepartmentColor(dept)}>{dept}</Tag>,
    },
    {
      title: 'Period',
      key: 'period',
      width: 180,
      render: (_, record) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {dayjs(record.periodStart).format('MMM D')} - {dayjs(record.periodEnd).format('MMM D, YYYY')}
        </Text>
      ),
    },
    {
      title: 'Days',
      dataIndex: 'daysWorked',
      key: 'daysWorked',
      width: 70,
      align: 'center',
    },
    {
      title: 'Basic Pay',
      dataIndex: 'basicPay',
      key: 'basicPay',
      width: 120,
      align: 'right',
      render: (amount) => formatCurrency(amount),
    },
    {
      title: 'Allowances',
      dataIndex: 'totalAllowances',
      key: 'totalAllowances',
      width: 110,
      align: 'right',
      render: (amount) => <Text type="success">+{formatCurrency(amount)}</Text>,
    },
    {
      title: 'Overtime',
      dataIndex: 'overtimePay',
      key: 'overtimePay',
      width: 110,
      align: 'right',
      render: (amount) => amount > 0 ? <Text type="success">+{formatCurrency(amount)}</Text> : '-',
    },
    {
      title: 'Deductions',
      dataIndex: 'totalDeductions',
      key: 'totalDeductions',
      width: 110,
      align: 'right',
      render: (amount) => <Text type="danger">-{formatCurrency(amount)}</Text>,
    },
    {
      title: 'Net Pay',
      dataIndex: 'netPay',
      key: 'netPay',
      width: 130,
      align: 'right',
      render: (amount) => <Text strong style={{ color: '#52c41a' }}>{formatCurrency(amount)}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status) => {
        const config = getStatusConfig(status);
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Payslip">
            <Button 
              type="text" 
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Print">
            <Button 
              type="text" 
              icon={<PrinterOutlined />}
              onClick={() => message.info('Printing payslip...')}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Handlers
  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setDetailDrawerVisible(true);
  };

  return (
    <div>
      <PageHeader
        title="Payroll"
        subtitle="January 1-15, 2024"
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'HR', path: '/hr' },
          { title: 'Payroll', path: '/hr/payroll' },
        ]}
        actions={[
          <Button key="run" type="primary" icon={<CalculatorOutlined />}>
            Run Payroll
          </Button>,
          <Button key="export" icon={<ExportOutlined />}>Export</Button>,
        ]}
      />

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Gross Payroll"
            value={formatCurrency(totalGross)}
            icon={<DollarOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Net Payroll"
            value={formatCurrency(totalNet)}
            icon={<WalletOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Deductions"
            value={formatCurrency(totalDeductions)}
            icon={<BankOutlined />}
            color="#faad14"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Employees"
            value={payrollRecords.length}
            icon={<TeamOutlined />}
            color="#722ed1"
          />
        </Col>
      </Row>

      {/* Status Summary */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={16}>
          <Card title="Payroll Status" size="small">
            <Row gutter={[16, 16]}>
              <Col span={8} style={{ textAlign: 'center' }}>
                <Progress 
                  type="circle"
                  percent={Math.round((paidCount / payrollRecords.length) * 100)}
                  strokeColor="#52c41a"
                  format={() => paidCount}
                />
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">Paid</Text>
                </div>
              </Col>
              <Col span={8} style={{ textAlign: 'center' }}>
                <Progress 
                  type="circle"
                  percent={Math.round((processingCount / payrollRecords.length) * 100)}
                  strokeColor="#1890ff"
                  format={() => processingCount}
                />
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">Processing</Text>
                </div>
              </Col>
              <Col span={8} style={{ textAlign: 'center' }}>
                <Progress 
                  type="circle"
                  percent={Math.round((pendingCount / payrollRecords.length) * 100)}
                  strokeColor="#faad14"
                  format={() => pendingCount}
                />
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">Pending</Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Government Contributions" size="small" style={{ height: '100%' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>SSS</Text>
                <Text strong>{formatCurrency(payrollRecords.reduce((sum, r) => sum + r.deductions.sss, 0))}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>PhilHealth</Text>
                <Text strong>{formatCurrency(payrollRecords.reduce((sum, r) => sum + r.deductions.philHealth, 0))}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Pag-IBIG</Text>
                <Text strong>{formatCurrency(payrollRecords.reduce((sum, r) => sum + r.deductions.pagIbig, 0))}</Text>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Withholding Tax</Text>
                <Text strong type="danger">{formatCurrency(payrollRecords.reduce((sum, r) => sum + r.deductions.tax, 0))}</Text>
              </div>
            </Space>
          </Card>
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
                { label: 'Paid', value: 'paid' },
                { label: 'Processing', value: 'processing' },
                { label: 'Pending', value: 'pending' },
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
          <Space>
            <Button icon={<SendOutlined />}>
              Send All Payslips
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredRecords}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1500 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} records`,
          }}
        />
      </Card>

      {/* Payslip Detail Drawer */}
      <Drawer
        title={
          <Space>
            <FileTextOutlined />
            Payslip Details
          </Space>
        }
        placement="right"
        width={600}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        extra={
          <Space>
            <Button icon={<PrinterOutlined />}>Print</Button>
            <Button type="primary" icon={<SendOutlined />}>Send</Button>
          </Space>
        }
      >
        {selectedRecord && (
          <Tabs
            items={[
              {
                key: 'summary',
                label: 'Summary',
                children: (
                  <>
                    <div style={{ textAlign: 'center', marginBottom: 24, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
                      <Avatar 
                        size={60}
                        style={{ backgroundColor: getDepartmentColor(selectedRecord.department) }}
                      >
                        {selectedRecord.employeeName.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Title level={4} style={{ marginTop: 12, marginBottom: 4 }}>
                        {selectedRecord.employeeName}
                      </Title>
                      <Text type="secondary">{selectedRecord.position}</Text>
                      <br />
                      <Space style={{ marginTop: 8 }}>
                        <Tag color={getDepartmentColor(selectedRecord.department)}>
                          {selectedRecord.department}
                        </Tag>
                        <Tag>{selectedRecord.employeeId}</Tag>
                      </Space>
                    </div>

                    <Alert
                      message={`Pay Period: ${dayjs(selectedRecord.periodStart).format('MMMM D')} - ${dayjs(selectedRecord.periodEnd).format('D, YYYY')}`}
                      type="info"
                      showIcon
                      style={{ marginBottom: 24 }}
                    />

                    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                      <Col span={8}>
                        <Card size="small" style={{ textAlign: 'center' }}>
                          <Statistic title="Days Worked" value={selectedRecord.daysWorked} suffix="/ 11" />
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card size="small" style={{ textAlign: 'center' }}>
                          <Statistic title="Hours Worked" value={selectedRecord.hoursWorked} suffix="h" />
                        </Card>
                      </Col>
                      <Col span={8}>
                        <Card size="small" style={{ textAlign: 'center' }}>
                          <Statistic 
                            title="Overtime" 
                            value={selectedRecord.overtimeHours} 
                            suffix="h"
                            valueStyle={{ color: selectedRecord.overtimeHours > 0 ? '#52c41a' : undefined }}
                          />
                        </Card>
                      </Col>
                    </Row>

                    <Card 
                      title="Net Pay" 
                      size="small" 
                      style={{ marginBottom: 16, background: '#f6ffed', borderColor: '#b7eb8f' }}
                    >
                      <Title level={2} style={{ color: '#52c41a', margin: 0, textAlign: 'center' }}>
                        {formatCurrency(selectedRecord.netPay)}
                      </Title>
                    </Card>

                    <Descriptions column={1} bordered size="small">
                      <Descriptions.Item label="Status">
                        <Tag color={getStatusConfig(selectedRecord.status).color}>
                          {getStatusConfig(selectedRecord.status).text}
                        </Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Payment Date">
                        {selectedRecord.paymentDate ? dayjs(selectedRecord.paymentDate).format('MMMM D, YYYY') : 'Pending'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Payment Method">
                        {selectedRecord.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'Cash'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Bank Account">
                        {selectedRecord.bankAccount}
                      </Descriptions.Item>
                    </Descriptions>
                  </>
                ),
              },
              {
                key: 'earnings',
                label: 'Earnings',
                children: (
                  <>
                    <Card title="Basic Compensation" size="small" style={{ marginBottom: 16 }}>
                      <List
                        size="small"
                        dataSource={[
                          { label: 'Basic Pay', amount: selectedRecord.basicPay },
                        ]}
                        renderItem={item => (
                          <List.Item>
                            <Text>{item.label}</Text>
                            <Text strong>{formatCurrency(item.amount)}</Text>
                          </List.Item>
                        )}
                      />
                    </Card>

                    <Card title="Allowances" size="small" style={{ marginBottom: 16 }}>
                      <List
                        size="small"
                        dataSource={[
                          { label: 'Transportation Allowance', amount: selectedRecord.allowances.transportation },
                          { label: 'Meal Allowance', amount: selectedRecord.allowances.meal },
                          { label: 'Communication Allowance', amount: selectedRecord.allowances.communication },
                        ]}
                        renderItem={item => (
                          <List.Item>
                            <Text>{item.label}</Text>
                            <Text type="success">+{formatCurrency(item.amount)}</Text>
                          </List.Item>
                        )}
                        footer={
                          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                            <Text strong>Total Allowances</Text>
                            <Text strong type="success">+{formatCurrency(selectedRecord.totalAllowances)}</Text>
                          </div>
                        }
                      />
                    </Card>

                    {selectedRecord.overtimePay > 0 && (
                      <Card title="Overtime" size="small" style={{ marginBottom: 16 }}>
                        <List
                          size="small"
                          dataSource={[
                            { label: `Overtime (${selectedRecord.overtimeHours} hours)`, amount: selectedRecord.overtimePay },
                          ]}
                          renderItem={item => (
                            <List.Item>
                              <Text>{item.label}</Text>
                              <Text type="success">+{formatCurrency(item.amount)}</Text>
                            </List.Item>
                          )}
                        />
                      </Card>
                    )}

                    <Card size="small" style={{ background: '#e6f7ff', borderColor: '#91d5ff' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Title level={5} style={{ margin: 0 }}>Gross Pay</Title>
                        <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                          {formatCurrency(selectedRecord.grossPay)}
                        </Title>
                      </div>
                    </Card>
                  </>
                ),
              },
              {
                key: 'deductions',
                label: 'Deductions',
                children: (
                  <>
                    <Card title="Government Contributions" size="small" style={{ marginBottom: 16 }}>
                      <List
                        size="small"
                        dataSource={[
                          { label: 'SSS Contribution', amount: selectedRecord.deductions.sss },
                          { label: 'PhilHealth Contribution', amount: selectedRecord.deductions.philHealth },
                          { label: 'Pag-IBIG Contribution', amount: selectedRecord.deductions.pagIbig },
                          { label: 'Withholding Tax', amount: selectedRecord.deductions.tax },
                        ]}
                        renderItem={item => (
                          <List.Item>
                            <Text>{item.label}</Text>
                            <Text type="danger">-{formatCurrency(item.amount)}</Text>
                          </List.Item>
                        )}
                      />
                    </Card>

                    <Card title="Other Deductions" size="small" style={{ marginBottom: 16 }}>
                      <List
                        size="small"
                        dataSource={[
                          { label: 'Late Deduction', amount: selectedRecord.deductions.lateDeduction },
                          { label: 'Absence Deduction', amount: selectedRecord.deductions.absenceDeduction },
                          { label: 'Loan Payment', amount: selectedRecord.deductions.loans },
                        ].filter(item => item.amount > 0)}
                        renderItem={item => (
                          <List.Item>
                            <Text>{item.label}</Text>
                            <Text type="danger">-{formatCurrency(item.amount)}</Text>
                          </List.Item>
                        )}
                        locale={{ emptyText: 'No other deductions' }}
                      />
                    </Card>

                    <Card size="small" style={{ background: '#fff2f0', borderColor: '#ffccc7' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Title level={5} style={{ margin: 0 }}>Total Deductions</Title>
                        <Title level={4} style={{ margin: 0, color: '#ff4d4f' }}>
                          -{formatCurrency(selectedRecord.totalDeductions)}
                        </Title>
                      </div>
                    </Card>
                  </>
                ),
              },
            ]}
          />
        )}
      </Drawer>
    </div>
  );
};

export default Payroll;
