import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Input, Select, Tag, 
  Tooltip, Badge, message, Typography, Drawer, Descriptions, 
  Avatar, Divider, Form, Timeline, Statistic, Progress, Alert
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ExportOutlined,
  EyeOutlined,
  EditOutlined,
  DollarOutlined,
  CreditCardOutlined,
  UserOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer, ConfirmModal } from '../../components/Common';
import dayjs from 'dayjs';

const { Search, TextArea } = Input;
const { Text, Title } = Typography;

// Mock credit accounts data
const mockCreditAccounts = [
  {
    id: 'CRE001',
    customerId: 'CUST001',
    customerName: 'Juan Dela Cruz',
    customerType: 'VIP',
    creditLimit: 50000,
    currentBalance: 15000,
    availableCredit: 35000,
    status: 'active',
    paymentTerms: 'Net 30',
    lastPayment: '2024-01-10',
    lastPaymentAmount: 25000,
    lastPurchase: '2024-01-15',
    totalCreditUsed: 125000,
    overdueAmount: 0,
    dueDate: '2024-02-15',
    transactions: [
      { date: '2024-01-15', type: 'purchase', description: 'MacBook Pro M3', amount: 15000 },
      { date: '2024-01-10', type: 'payment', description: 'Payment received', amount: -25000 },
      { date: '2024-01-05', type: 'purchase', description: 'AirPods Pro', amount: 14990 },
    ],
  },
  {
    id: 'CRE002',
    customerId: 'CUST003',
    customerName: 'Pedro Reyes',
    customerType: 'Wholesale',
    creditLimit: 100000,
    currentBalance: 32500,
    availableCredit: 67500,
    status: 'active',
    paymentTerms: 'Net 45',
    lastPayment: '2024-01-08',
    lastPaymentAmount: 50000,
    lastPurchase: '2024-01-13',
    totalCreditUsed: 350000,
    overdueAmount: 0,
    dueDate: '2024-02-28',
    transactions: [
      { date: '2024-01-13', type: 'purchase', description: 'Bulk Order - Samsung S24', amount: 32500 },
      { date: '2024-01-08', type: 'payment', description: 'Bank transfer', amount: -50000 },
    ],
  },
  {
    id: 'CRE003',
    customerId: 'CUST005',
    customerName: 'Carlos Tan',
    customerType: 'Corporate',
    creditLimit: 200000,
    currentBalance: 85000,
    availableCredit: 115000,
    status: 'active',
    paymentTerms: 'Net 30',
    lastPayment: '2024-01-05',
    lastPaymentAmount: 75000,
    lastPurchase: '2024-01-11',
    totalCreditUsed: 520000,
    overdueAmount: 0,
    dueDate: '2024-02-11',
    transactions: [
      { date: '2024-01-11', type: 'purchase', description: 'Dell Monitors (5 units)', amount: 45000 },
      { date: '2024-01-05', type: 'purchase', description: 'Network Equipment', amount: 40000 },
      { date: '2024-01-05', type: 'payment', description: 'Check payment #12345', amount: -75000 },
    ],
  },
  {
    id: 'CRE004',
    customerId: 'CUST007',
    customerName: 'Roberto Lim',
    customerType: 'Wholesale',
    creditLimit: 75000,
    currentBalance: 0,
    availableCredit: 75000,
    status: 'active',
    paymentTerms: 'Net 30',
    lastPayment: '2024-01-09',
    lastPaymentAmount: 35000,
    lastPurchase: '2024-01-10',
    totalCreditUsed: 180000,
    overdueAmount: 0,
    dueDate: null,
    transactions: [
      { date: '2024-01-10', type: 'purchase', description: 'Keyboards & Mice bundle', amount: 35000 },
      { date: '2024-01-09', type: 'payment', description: 'Full payment', amount: -35000 },
    ],
  },
  {
    id: 'CRE005',
    customerId: 'CUST010',
    customerName: 'Ramon Aquino',
    customerType: 'VIP',
    creditLimit: 30000,
    currentBalance: 28500,
    availableCredit: 1500,
    status: 'warning',
    paymentTerms: 'Net 15',
    lastPayment: '2023-12-20',
    lastPaymentAmount: 10000,
    lastPurchase: '2024-01-08',
    totalCreditUsed: 85000,
    overdueAmount: 8500,
    dueDate: '2024-01-23',
    transactions: [
      { date: '2024-01-08', type: 'purchase', description: 'Sony Headphones', amount: 12000 },
      { date: '2024-01-02', type: 'purchase', description: 'iPad Mini', amount: 16500 },
      { date: '2023-12-20', type: 'payment', description: 'Partial payment', amount: -10000 },
    ],
  },
  {
    id: 'CRE006',
    customerId: 'CUST012',
    customerName: 'Elena Flores',
    customerType: 'Corporate',
    creditLimit: 150000,
    currentBalance: 125000,
    availableCredit: 25000,
    status: 'overdue',
    paymentTerms: 'Net 30',
    lastPayment: '2023-11-30',
    lastPaymentAmount: 50000,
    lastPurchase: '2024-01-05',
    totalCreditUsed: 420000,
    overdueAmount: 75000,
    dueDate: '2024-01-05',
    transactions: [
      { date: '2024-01-05', type: 'purchase', description: 'Office Equipment Bulk', amount: 50000 },
      { date: '2023-12-15', type: 'purchase', description: 'Laptops (3 units)', amount: 75000 },
      { date: '2023-11-30', type: 'payment', description: 'Bank transfer', amount: -50000 },
    ],
  },
];

const CreditAccounts = () => {
  const [accounts, setAccounts] = useState(mockCreditAccounts);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [paymentDrawerVisible, setPaymentDrawerVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [paymentForm] = Form.useForm();

  // Calculate stats
  const totalCreditLimit = accounts.reduce((sum, a) => sum + a.creditLimit, 0);
  const totalOutstanding = accounts.reduce((sum, a) => sum + a.currentBalance, 0);
  const totalOverdue = accounts.reduce((sum, a) => sum + a.overdueAmount, 0);
  const overdueAccounts = accounts.filter(a => a.status === 'overdue').length;

  // Filter accounts
  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = !searchText || 
      account.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      account.id.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !filterStatus || account.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status) => {
    const configs = {
      'active': { color: 'success', text: 'Good Standing', icon: <CheckCircleOutlined /> },
      'warning': { color: 'warning', text: 'Near Limit', icon: <ExclamationCircleOutlined /> },
      'overdue': { color: 'error', text: 'Overdue', icon: <WarningOutlined /> },
      'suspended': { color: 'default', text: 'Suspended', icon: <ClockCircleOutlined /> },
    };
    return configs[status] || configs['active'];
  };

  // Table columns
  const columns = [
    {
      title: 'Customer',
      key: 'customer',
      width: 220,
      fixed: 'left',
      render: (_, record) => (
        <Space>
          <Avatar style={{ backgroundColor: '#1890ff' }}>
            {record.customerName.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <div>
            <Text strong>{record.customerName}</Text>
            <br />
            <Space size={4}>
              <Text type="secondary" style={{ fontSize: 11 }}>{record.id}</Text>
              <Tag style={{ fontSize: 10 }}>{record.customerType}</Tag>
            </Space>
          </div>
        </Space>
      ),
    },
    {
      title: 'Credit Limit',
      dataIndex: 'creditLimit',
      key: 'creditLimit',
      width: 130,
      align: 'right',
      render: (amount) => <Text>₱{amount.toLocaleString()}</Text>,
      sorter: (a, b) => a.creditLimit - b.creditLimit,
    },
    {
      title: 'Current Balance',
      dataIndex: 'currentBalance',
      key: 'currentBalance',
      width: 140,
      align: 'right',
      render: (amount, record) => (
        <Text type={amount > record.creditLimit * 0.8 ? 'danger' : amount > 0 ? 'warning' : 'success'} strong>
          ₱{amount.toLocaleString()}
        </Text>
      ),
      sorter: (a, b) => a.currentBalance - b.currentBalance,
    },
    {
      title: 'Available',
      dataIndex: 'availableCredit',
      key: 'availableCredit',
      width: 130,
      align: 'right',
      render: (amount) => (
        <Text type={amount > 0 ? 'success' : 'danger'}>₱{amount.toLocaleString()}</Text>
      ),
    },
    {
      title: 'Utilization',
      key: 'utilization',
      width: 140,
      render: (_, record) => {
        const utilization = Math.round((record.currentBalance / record.creditLimit) * 100);
        return (
          <Progress 
            percent={utilization} 
            size="small"
            status={utilization >= 90 ? 'exception' : utilization >= 70 ? 'active' : 'normal'}
            strokeColor={utilization >= 90 ? '#ff4d4f' : utilization >= 70 ? '#faad14' : '#52c41a'}
          />
        );
      },
    },
    {
      title: 'Overdue',
      dataIndex: 'overdueAmount',
      key: 'overdueAmount',
      width: 120,
      align: 'right',
      render: (amount) => (
        amount > 0 ? (
          <Text type="danger" strong>₱{amount.toLocaleString()}</Text>
        ) : <Text type="secondary">-</Text>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 110,
      render: (date) => {
        if (!date) return <Text type="secondary">-</Text>;
        const isOverdue = dayjs(date).isBefore(dayjs());
        return (
          <Text type={isOverdue ? 'danger' : undefined}>
            {dayjs(date).format('MMM D, YYYY')}
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
      width: 130,
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
          <Tooltip title="Record Payment">
            <Button 
              type="text" 
              icon={<DollarOutlined style={{ color: '#52c41a' }} />}
              onClick={() => handleRecordPayment(record)}
              disabled={record.currentBalance === 0}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Handlers
  const handleViewDetails = (account) => {
    setSelectedAccount(account);
    setDetailDrawerVisible(true);
  };

  const handleRecordPayment = (account) => {
    setSelectedAccount(account);
    paymentForm.resetFields();
    setPaymentDrawerVisible(true);
  };

  const handleSavePayment = () => {
    paymentForm.validateFields().then(values => {
      const updatedAccounts = accounts.map(a => {
        if (a.id === selectedAccount.id) {
          const newBalance = Math.max(0, a.currentBalance - values.amount);
          const newOverdue = Math.max(0, a.overdueAmount - values.amount);
          return {
            ...a,
            currentBalance: newBalance,
            availableCredit: a.creditLimit - newBalance,
            overdueAmount: newOverdue,
            lastPayment: dayjs().format('YYYY-MM-DD'),
            lastPaymentAmount: values.amount,
            status: newBalance === 0 ? 'active' : newOverdue > 0 ? 'overdue' : 
                   newBalance > a.creditLimit * 0.9 ? 'warning' : 'active',
            transactions: [
              { date: dayjs().format('YYYY-MM-DD'), type: 'payment', description: values.description || 'Payment received', amount: -values.amount },
              ...a.transactions,
            ],
          };
        }
        return a;
      });
      setAccounts(updatedAccounts);
      message.success('Payment recorded successfully');
      setPaymentDrawerVisible(false);
    });
  };

  // Payment form fields
  const paymentFields = [
    {
      name: 'amount',
      label: 'Payment Amount',
      type: 'number',
      placeholder: 'Enter amount',
      rules: [
        { required: true, message: 'Please enter payment amount' },
        { type: 'number', min: 1, message: 'Amount must be greater than 0' },
      ],
      span: 24,
    },
    {
      name: 'paymentMethod',
      label: 'Payment Method',
      type: 'select',
      options: [
        { label: 'Cash', value: 'cash' },
        { label: 'Bank Transfer', value: 'bank' },
        { label: 'Check', value: 'check' },
        { label: 'Online', value: 'online' },
      ],
      rules: [{ required: true, message: 'Please select payment method' }],
      span: 24,
    },
    {
      name: 'description',
      label: 'Notes',
      type: 'textarea',
      placeholder: 'Reference number, check number, etc.',
      span: 24,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Credit Accounts"
        subtitle={`${filteredAccounts.length} accounts`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'Customers', path: '/customers' },
          { title: 'Credit Accounts', path: '/customers/credits' },
        ]}
        actions={[
          <Button key="export" icon={<ExportOutlined />}>Export</Button>,
        ]}
      />

      {/* Overdue Alert */}
      {overdueAccounts > 0 && (
        <Alert
          message={`${overdueAccounts} account(s) have overdue payments totaling ₱${totalOverdue.toLocaleString()}`}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          action={
            <Button size="small" onClick={() => setFilterStatus('overdue')}>
              View Overdue
            </Button>
          }
        />
      )}

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Credit Limit"
            value={`₱${(totalCreditLimit / 1000).toFixed(0)}K`}
            icon={<CreditCardOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Outstanding"
            value={`₱${(totalOutstanding / 1000).toFixed(0)}K`}
            icon={<WalletOutlined style={{ fontSize: 24, color: '#faad14' }} />}
            color="#faad14"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Overdue"
            value={`₱${totalOverdue.toLocaleString()}`}
            icon={<WarningOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />}
            color="#ff4d4f"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Utilization Rate"
            value={`${Math.round((totalOutstanding / totalCreditLimit) * 100)}%`}
            icon={<CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
            color="#52c41a"
          />
        </Col>
      </Row>

      {/* Filters and Table */}
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Space wrap>
            <Search
              placeholder="Search accounts..."
              allowClear
              style={{ width: 250 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              placeholder="Status"
              allowClear
              style={{ width: 150 }}
              value={filterStatus}
              onChange={setFilterStatus}
              options={[
                { label: 'Good Standing', value: 'active' },
                { label: 'Near Limit', value: 'warning' },
                { label: 'Overdue', value: 'overdue' },
                { label: 'Suspended', value: 'suspended' },
              ]}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredAccounts}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1400 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} accounts`,
          }}
        />
      </Card>

      {/* Details Drawer */}
      <Drawer
        title="Credit Account Details"
        placement="right"
        width={600}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        extra={
          <Button 
            type="primary" 
            icon={<DollarOutlined />}
            onClick={() => {
              setDetailDrawerVisible(false);
              handleRecordPayment(selectedAccount);
            }}
            disabled={selectedAccount?.currentBalance === 0}
          >
            Record Payment
          </Button>
        }
      >
        {selectedAccount && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar size={60} style={{ backgroundColor: '#1890ff', fontSize: 24 }}>
                {selectedAccount.customerName.split(' ').map(n => n[0]).join('')}
              </Avatar>
              <Title level={4} style={{ marginTop: 12, marginBottom: 4 }}>
                {selectedAccount.customerName}
              </Title>
              <Space>
                <Tag>{selectedAccount.customerType}</Tag>
                <Tag color={getStatusConfig(selectedAccount.status).color}>
                  {getStatusConfig(selectedAccount.status).text}
                </Tag>
              </Space>
            </div>

            {/* Credit Overview */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic 
                    title="Credit Limit" 
                    value={selectedAccount.creditLimit} 
                    prefix="₱"
                    valueStyle={{ fontSize: 16 }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic 
                    title="Balance" 
                    value={selectedAccount.currentBalance}
                    prefix="₱"
                    valueStyle={{ fontSize: 16, color: selectedAccount.currentBalance > 0 ? '#faad14' : '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Statistic 
                    title="Available" 
                    value={selectedAccount.availableCredit}
                    prefix="₱"
                    valueStyle={{ fontSize: 16, color: '#52c41a' }}
                  />
                </Card>
              </Col>
            </Row>

            <Card size="small" style={{ marginBottom: 24 }}>
              <Text type="secondary">Credit Utilization</Text>
              <Progress 
                percent={Math.round((selectedAccount.currentBalance / selectedAccount.creditLimit) * 100)}
                status={selectedAccount.currentBalance >= selectedAccount.creditLimit * 0.9 ? 'exception' : 'normal'}
                strokeColor={selectedAccount.currentBalance >= selectedAccount.creditLimit * 0.9 ? '#ff4d4f' : '#1890ff'}
              />
            </Card>

            <Descriptions column={2} bordered size="small" style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Account ID">{selectedAccount.id}</Descriptions.Item>
              <Descriptions.Item label="Payment Terms">{selectedAccount.paymentTerms}</Descriptions.Item>
              <Descriptions.Item label="Last Payment">
                {dayjs(selectedAccount.lastPayment).format('MMM D, YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Last Payment Amount">
                ₱{selectedAccount.lastPaymentAmount.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Total Credit Used (Lifetime)">
                ₱{selectedAccount.totalCreditUsed.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Due Date">
                {selectedAccount.dueDate ? (
                  <Text type={dayjs(selectedAccount.dueDate).isBefore(dayjs()) ? 'danger' : undefined}>
                    {dayjs(selectedAccount.dueDate).format('MMM D, YYYY')}
                  </Text>
                ) : '-'}
              </Descriptions.Item>
              {selectedAccount.overdueAmount > 0 && (
                <Descriptions.Item label="Overdue Amount" span={2}>
                  <Text type="danger" strong>₱{selectedAccount.overdueAmount.toLocaleString()}</Text>
                </Descriptions.Item>
              )}
            </Descriptions>

            <Divider orientation="left">Recent Transactions</Divider>
            <Timeline
              items={selectedAccount.transactions.map(t => ({
                color: t.type === 'payment' ? 'green' : 'blue',
                children: (
                  <div>
                    <Space>
                      {t.type === 'payment' ? <ArrowDownOutlined style={{ color: '#52c41a' }} /> : <ArrowUpOutlined style={{ color: '#1890ff' }} />}
                      <Text strong>{t.description}</Text>
                    </Space>
                    <br />
                    <Space>
                      <Text type="secondary">{dayjs(t.date).format('MMM D, YYYY')}</Text>
                      <Text type={t.amount < 0 ? 'success' : 'warning'}>
                        {t.amount < 0 ? '-' : '+'}₱{Math.abs(t.amount).toLocaleString()}
                      </Text>
                    </Space>
                  </div>
                ),
              }))}
            />
          </>
        )}
      </Drawer>

      {/* Payment Drawer */}
      <FormDrawer
        title={`Record Payment - ${selectedAccount?.customerName}`}
        open={paymentDrawerVisible}
        onClose={() => setPaymentDrawerVisible(false)}
        onSubmit={handleSavePayment}
        form={paymentForm}
        fields={paymentFields}
        width={400}
        submitText="Record Payment"
        extra={
          selectedAccount && (
            <div style={{ marginBottom: 16 }}>
              <Card size="small" style={{ backgroundColor: '#fafafa' }}>
                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">Current Balance:</Text>
                    <Text strong>₱{selectedAccount.currentBalance.toLocaleString()}</Text>
                  </div>
                  {selectedAccount.overdueAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text type="secondary">Overdue Amount:</Text>
                      <Text type="danger" strong>₱{selectedAccount.overdueAmount.toLocaleString()}</Text>
                    </div>
                  )}
                </Space>
              </Card>
            </div>
          )
        }
      />
    </div>
  );
};

export default CreditAccounts;
