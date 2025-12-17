import React, { useState } from 'react';
import { 
  Table, Button, Space, Input, Tag, Card, Row, Col, 
  Drawer, Form, Select, InputNumber, Descriptions, Badge,
  Typography, message, Tabs, Timeline, Divider, Avatar,
  Statistic, Progress, DatePicker, List, Alert, Modal, Upload
} from 'antd';
import { 
  PlusOutlined, SearchOutlined, EditOutlined, EyeOutlined,
  DollarOutlined, WalletOutlined, ArrowUpOutlined, ArrowDownOutlined,
  CheckCircleOutlined, ClockCircleOutlined, FileTextOutlined,
  PrinterOutlined, UploadOutlined, ExclamationCircleOutlined,
  BankOutlined, SyncOutlined, DeleteOutlined
} from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer, ConfirmModal } from '../../components/Common';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

// Mock petty cash funds
const mockFunds = [
  {
    id: 1,
    fundCode: 'PCF-001',
    name: 'Main Office Petty Cash',
    branch: 'Main Branch',
    custodian: 'Maria Santos',
    custodianId: 'EMP-003',
    authorizedAmount: 10000,
    currentBalance: 3250.50,
    status: 'active',
    lastReplenishment: '2025-01-10',
    disbursementsThisMonth: 8,
    totalDisbursedThisMonth: 6749.50,
  },
  {
    id: 2,
    fundCode: 'PCF-002',
    name: 'Warehouse Petty Cash',
    branch: 'Main Branch',
    custodian: 'Juan Cruz',
    custodianId: 'EMP-010',
    authorizedAmount: 5000,
    currentBalance: 1850.00,
    status: 'active',
    lastReplenishment: '2025-01-08',
    disbursementsThisMonth: 12,
    totalDisbursedThisMonth: 3150.00,
  },
  {
    id: 3,
    fundCode: 'PCF-101',
    name: 'Makati Branch Petty Cash',
    branch: 'Makati Branch',
    custodian: 'Anna Garcia',
    custodianId: 'EMP-015',
    authorizedAmount: 8000,
    currentBalance: 5200.00,
    status: 'active',
    lastReplenishment: '2025-01-12',
    disbursementsThisMonth: 5,
    totalDisbursedThisMonth: 2800.00,
  },
  {
    id: 4,
    fundCode: 'PCF-201',
    name: 'QC Branch Petty Cash',
    branch: 'Quezon City Branch',
    custodian: 'Pedro Reyes',
    custodianId: 'EMP-020',
    authorizedAmount: 6000,
    currentBalance: 450.00,
    status: 'low',
    lastReplenishment: '2025-01-05',
    disbursementsThisMonth: 15,
    totalDisbursedThisMonth: 5550.00,
  },
];

// Mock disbursements
const mockDisbursements = [
  {
    id: 1,
    voucherNo: 'PCV-2025-001',
    fundCode: 'PCF-001',
    date: '2025-01-15',
    payee: 'Mercury Drug',
    category: 'Office Supplies',
    description: 'First aid supplies for office',
    amount: 450.00,
    receiptNo: 'MD-12345',
    status: 'approved',
    approvedBy: 'John Manager',
    approvedAt: '2025-01-15 10:30:00',
  },
  {
    id: 2,
    voucherNo: 'PCV-2025-002',
    fundCode: 'PCF-001',
    date: '2025-01-14',
    payee: 'Grab',
    category: 'Transportation',
    description: 'Rush delivery to client - Makati',
    amount: 285.00,
    receiptNo: 'GRB-98765',
    status: 'approved',
    approvedBy: 'John Manager',
    approvedAt: '2025-01-14 14:15:00',
  },
  {
    id: 3,
    voucherNo: 'PCV-2025-003',
    fundCode: 'PCF-001',
    date: '2025-01-14',
    payee: 'National Bookstore',
    category: 'Office Supplies',
    description: 'Printer paper, pens, stapler',
    amount: 1250.00,
    receiptNo: 'NBS-54321',
    status: 'approved',
    approvedBy: 'John Manager',
    approvedAt: '2025-01-14 11:00:00',
  },
  {
    id: 4,
    voucherNo: 'PCV-2025-004',
    fundCode: 'PCF-001',
    date: '2025-01-13',
    payee: 'Jollibee',
    category: 'Food & Meals',
    description: 'Snacks for overtime work',
    amount: 850.00,
    receiptNo: 'JB-11111',
    status: 'approved',
    approvedBy: 'John Manager',
    approvedAt: '2025-01-13 20:00:00',
  },
  {
    id: 5,
    voucherNo: 'PCV-2025-005',
    fundCode: 'PCF-001',
    date: '2025-01-15',
    payee: 'LBC Express',
    category: 'Courier/Postage',
    description: 'Document delivery - Cebu branch',
    amount: 320.00,
    receiptNo: null,
    status: 'pending',
    approvedBy: null,
    approvedAt: null,
  },
  {
    id: 6,
    voucherNo: 'PCV-2025-006',
    fundCode: 'PCF-002',
    date: '2025-01-15',
    payee: 'Hardware Store',
    category: 'Repairs & Maintenance',
    description: 'Replacement bulbs for warehouse',
    amount: 450.00,
    receiptNo: 'HW-77777',
    status: 'approved',
    approvedBy: 'Warehouse Supervisor',
    approvedAt: '2025-01-15 09:00:00',
  },
];

// Mock replenishments
const mockReplenishments = [
  {
    id: 1,
    replenishmentNo: 'PCR-2025-001',
    fundCode: 'PCF-001',
    date: '2025-01-10',
    amount: 8000.00,
    vouchersIncluded: 15,
    totalDisbursed: 7850.00,
    variance: 150.00,
    status: 'completed',
    approvedBy: 'Finance Manager',
    checkNo: 'CHK-5001',
  },
  {
    id: 2,
    replenishmentNo: 'PCR-2025-002',
    fundCode: 'PCF-002',
    date: '2025-01-08',
    amount: 4500.00,
    vouchersIncluded: 10,
    totalDisbursed: 4500.00,
    variance: 0,
    status: 'completed',
    approvedBy: 'Finance Manager',
    checkNo: 'CHK-5002',
  },
];

// Categories for petty cash
const expenseCategories = [
  'Office Supplies',
  'Transportation',
  'Food & Meals',
  'Courier/Postage',
  'Repairs & Maintenance',
  'Utilities',
  'Miscellaneous',
];

const PettyCash = () => {
  const [funds] = useState(mockFunds);
  const [disbursements] = useState(mockDisbursements);
  const [searchText, setSearchText] = useState('');
  const [filterBranch, setFilterBranch] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [selectedFund, setSelectedFund] = useState(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [disbursementDrawerOpen, setDisbursementDrawerOpen] = useState(false);
  const [replenishmentModalOpen, setReplenishmentModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [replenishForm] = Form.useForm();

  // Calculate statistics
  const stats = {
    totalFunds: funds.length,
    totalAuthorized: funds.reduce((sum, f) => sum + f.authorizedAmount, 0),
    totalBalance: funds.reduce((sum, f) => sum + f.currentBalance, 0),
    lowFunds: funds.filter(f => f.status === 'low').length,
    pendingVouchers: disbursements.filter(d => d.status === 'pending').length,
    totalDisbursedMonth: funds.reduce((sum, f) => sum + f.totalDisbursedThisMonth, 0),
  };

  // Filter funds
  const filteredFunds = funds.filter(fund => {
    const matchesSearch = fund.fundCode.toLowerCase().includes(searchText.toLowerCase()) ||
      fund.name.toLowerCase().includes(searchText.toLowerCase()) ||
      fund.custodian.toLowerCase().includes(searchText.toLowerCase());
    const matchesBranch = !filterBranch || fund.branch === filterBranch;
    const matchesStatus = !filterStatus || fund.status === filterStatus;
    return matchesSearch && matchesBranch && matchesStatus;
  });

  const handleViewDetail = (fund) => {
    setSelectedFund(fund);
    setDetailDrawerOpen(true);
  };

  const handleNewDisbursement = (fund) => {
    setSelectedFund(fund);
    form.resetFields();
    form.setFieldsValue({
      fundCode: fund.fundCode,
      date: dayjs(),
    });
    setDisbursementDrawerOpen(true);
  };

  const handleRequestReplenishment = (fund) => {
    setSelectedFund(fund);
    const totalDisbursed = fund.authorizedAmount - fund.currentBalance;
    replenishForm.setFieldsValue({
      amount: totalDisbursed,
      vouchersCount: fund.disbursementsThisMonth,
    });
    setReplenishmentModalOpen(true);
  };

  const submitDisbursement = () => {
    form.validateFields().then(() => {
      message.success('Petty cash voucher created successfully');
      setDisbursementDrawerOpen(false);
    });
  };

  const submitReplenishment = () => {
    replenishForm.validateFields().then(() => {
      message.success('Replenishment request submitted for approval');
      setReplenishmentModalOpen(false);
    });
  };

  const getBalancePercentage = (current, authorized) => {
    return Math.round((current / authorized) * 100);
  };

  const getBalanceStatus = (percentage) => {
    if (percentage <= 15) return { color: '#ff4d4f', status: 'exception' };
    if (percentage <= 30) return { color: '#faad14', status: 'normal' };
    return { color: '#52c41a', status: 'success' };
  };

  const columns = [
    {
      title: 'Fund',
      key: 'fund',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            <WalletOutlined style={{ marginRight: 8 }} />
            {record.fundCode}
          </div>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.name}</Text>
        </div>
      ),
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
    },
    {
      title: 'Custodian',
      key: 'custodian',
      render: (_, record) => (
        <div>
          <div>{record.custodian}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.custodianId}</Text>
        </div>
      ),
    },
    {
      title: 'Authorized',
      dataIndex: 'authorizedAmount',
      render: (val) => `₱${val.toLocaleString()}`,
    },
    {
      title: 'Current Balance',
      key: 'balance',
      render: (_, record) => {
        const percentage = getBalancePercentage(record.currentBalance, record.authorizedAmount);
        const status = getBalanceStatus(percentage);
        return (
          <div style={{ minWidth: 150 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontWeight: 500, color: status.color }}>
                ₱{record.currentBalance.toLocaleString()}
              </span>
              <span style={{ fontSize: '12px', color: '#999' }}>{percentage}%</span>
            </div>
            <Progress 
              percent={percentage} 
              size="small" 
              showInfo={false}
              strokeColor={status.color}
              status={status.status}
            />
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => {
        const config = {
          'active': { color: 'green', text: 'Active' },
          'low': { color: 'orange', text: 'Low Balance' },
          'inactive': { color: 'default', text: 'Inactive' },
        };
        const c = config[status] || { color: 'default', text: status };
        return <Tag color={c.color}>{c.text}</Tag>;
      },
    },
    {
      title: 'Last Replenished',
      dataIndex: 'lastReplenishment',
      render: (date) => dayjs(date).format('MMM D, YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            View
          </Button>
          <Button 
            type="link" 
            icon={<PlusOutlined />}
            onClick={() => handleNewDisbursement(record)}
          >
            Disburse
          </Button>
        </Space>
      ),
    },
  ];

  const disbursementColumns = [
    {
      title: 'Voucher #',
      dataIndex: 'voucherNo',
      render: (val) => <Text strong>{val}</Text>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      render: (date) => dayjs(date).format('MMM D, YYYY'),
    },
    {
      title: 'Payee',
      dataIndex: 'payee',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      render: (cat) => <Tag>{cat}</Tag>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      ellipsis: true,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      render: (val) => (
        <span style={{ fontWeight: 500 }}>₱{val.toLocaleString()}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => {
        const config = {
          'approved': { color: 'green', icon: <CheckCircleOutlined /> },
          'pending': { color: 'orange', icon: <ClockCircleOutlined /> },
          'rejected': { color: 'red', icon: <ExclamationCircleOutlined /> },
        };
        const c = config[status] || { color: 'default' };
        return <Tag color={c.color} icon={c.icon}>{status.toUpperCase()}</Tag>;
      },
    },
  ];

  const branches = [...new Set(funds.map(f => f.branch))];

  return (
    <div>
      <PageHeader
        title="Petty Cash Management"
        subtitle="Manage petty cash funds, disbursements, and replenishments"
        action={
          <Button type="primary" icon={<PlusOutlined />}>
            New Fund
          </Button>
        }
      />

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <StatCard
            title="Total Funds"
            value={stats.totalFunds}
            icon={<WalletOutlined />}
            color="#1890ff"
            suffix={`₱${stats.totalAuthorized.toLocaleString()} authorized`}
          />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard
            title="Total Balance"
            value={`₱${stats.totalBalance.toLocaleString()}`}
            icon={<DollarOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard
            title="Low Balance Funds"
            value={stats.lowFunds}
            icon={<ExclamationCircleOutlined />}
            color="#faad14"
          />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard
            title="Disbursed This Month"
            value={`₱${stats.totalDisbursedMonth.toLocaleString()}`}
            icon={<ArrowDownOutlined />}
            color="#722ed1"
            suffix={`${stats.pendingVouchers} pending`}
          />
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Input
              placeholder="Search funds..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </Col>
          <Col xs={12} sm={8}>
            <Select
              placeholder="Filter by Branch"
              allowClear
              style={{ width: '100%' }}
              value={filterBranch}
              onChange={setFilterBranch}
            >
              {branches.map(branch => (
                <Option key={branch} value={branch}>{branch}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={12} sm={8}>
            <Select
              placeholder="Filter by Status"
              allowClear
              style={{ width: '100%' }}
              value={filterStatus}
              onChange={setFilterStatus}
            >
              <Option value="active">Active</Option>
              <Option value="low">Low Balance</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Funds Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredFunds}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Detail Drawer */}
      <Drawer
        title={`Petty Cash Fund - ${selectedFund?.fundCode}`}
        placement="right"
        width={800}
        onClose={() => setDetailDrawerOpen(false)}
        open={detailDrawerOpen}
        extra={
          <Space>
            <Button 
              icon={<SyncOutlined />}
              onClick={() => handleRequestReplenishment(selectedFund)}
            >
              Request Replenishment
            </Button>
            <Button 
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleNewDisbursement(selectedFund)}
            >
              New Disbursement
            </Button>
          </Space>
        }
      >
        {selectedFund && (
          <Tabs defaultActiveKey="overview">
            <TabPane tab="Overview" key="overview">
              {/* Balance Alert */}
              {selectedFund.status === 'low' && (
                <Alert
                  message="Low Balance Warning"
                  description="This fund is running low and may need replenishment soon."
                  type="warning"
                  showIcon
                  style={{ marginBottom: 24 }}
                />
              )}

              {/* Fund Info */}
              <Descriptions title="Fund Information" bordered column={2} size="small" style={{ marginBottom: 24 }}>
                <Descriptions.Item label="Fund Code">{selectedFund.fundCode}</Descriptions.Item>
                <Descriptions.Item label="Name">{selectedFund.name}</Descriptions.Item>
                <Descriptions.Item label="Branch">{selectedFund.branch}</Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Badge status={selectedFund.status === 'active' ? 'success' : 'warning'} text={selectedFund.status} />
                </Descriptions.Item>
                <Descriptions.Item label="Custodian">{selectedFund.custodian}</Descriptions.Item>
                <Descriptions.Item label="Employee ID">{selectedFund.custodianId}</Descriptions.Item>
              </Descriptions>

              {/* Balance Summary */}
              <Title level={5}>Balance Summary</Title>
              <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col span={8}>
                  <Card size="small">
                    <Statistic
                      title="Authorized Amount"
                      value={selectedFund.authorizedAmount}
                      prefix="₱"
                      valueStyle={{ fontSize: '18px' }}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small">
                    <Statistic
                      title="Current Balance"
                      value={selectedFund.currentBalance}
                      prefix="₱"
                      valueStyle={{ 
                        fontSize: '18px', 
                        color: getBalanceStatus(getBalancePercentage(selectedFund.currentBalance, selectedFund.authorizedAmount)).color 
                      }}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small">
                    <Statistic
                      title="Total Disbursed"
                      value={selectedFund.authorizedAmount - selectedFund.currentBalance}
                      prefix="₱"
                      valueStyle={{ fontSize: '18px', color: '#ff4d4f' }}
                    />
                  </Card>
                </Col>
              </Row>

              {/* Balance Progress */}
              <Card size="small" style={{ marginBottom: 24 }}>
                <div style={{ marginBottom: 8 }}>
                  <Text strong>Fund Utilization</Text>
                </div>
                <Progress 
                  percent={100 - getBalancePercentage(selectedFund.currentBalance, selectedFund.authorizedAmount)} 
                  strokeColor={{
                    '0%': '#52c41a',
                    '50%': '#faad14',
                    '100%': '#ff4d4f',
                  }}
                  format={(percent) => `${percent}% used`}
                />
                <Row gutter={16} style={{ marginTop: 16 }}>
                  <Col span={8}>
                    <Text type="secondary">This Month</Text>
                    <div style={{ fontSize: 20, fontWeight: 500 }}>
                      {selectedFund.disbursementsThisMonth} vouchers
                    </div>
                  </Col>
                  <Col span={8}>
                    <Text type="secondary">Amount Disbursed</Text>
                    <div style={{ fontSize: 20, fontWeight: 500 }}>
                      ₱{selectedFund.totalDisbursedThisMonth.toLocaleString()}
                    </div>
                  </Col>
                  <Col span={8}>
                    <Text type="secondary">Last Replenishment</Text>
                    <div style={{ fontSize: 20, fontWeight: 500 }}>
                      {dayjs(selectedFund.lastReplenishment).format('MMM D')}
                    </div>
                  </Col>
                </Row>
              </Card>

              {/* Category Breakdown */}
              <Title level={5}>Expense Categories</Title>
              <Card size="small">
                <List
                  size="small"
                  dataSource={[
                    { category: 'Office Supplies', amount: 2500, count: 4 },
                    { category: 'Transportation', amount: 1850, count: 8 },
                    { category: 'Food & Meals', amount: 1200, count: 3 },
                    { category: 'Courier/Postage', amount: 650, count: 5 },
                    { category: 'Repairs & Maintenance', amount: 549.50, count: 2 },
                  ]}
                  renderItem={item => (
                    <List.Item>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <Space>
                          <Tag>{item.category}</Tag>
                          <Text type="secondary">{item.count} vouchers</Text>
                        </Space>
                        <Text strong>₱{item.amount.toLocaleString()}</Text>
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            </TabPane>

            <TabPane tab="Disbursements" key="disbursements">
              <Table
                size="small"
                columns={disbursementColumns}
                dataSource={disbursements.filter(d => d.fundCode === selectedFund.fundCode)}
                rowKey="id"
                pagination={{ pageSize: 10 }}
              />
            </TabPane>

            <TabPane tab="Replenishments" key="replenishments">
              <Timeline>
                {mockReplenishments.filter(r => r.fundCode === selectedFund?.fundCode).map(rep => (
                  <Timeline.Item key={rep.id} color="green">
                    <Card size="small" style={{ marginBottom: 8 }}>
                      <Row gutter={16}>
                        <Col span={6}>
                          <Text type="secondary">Date</Text>
                          <div style={{ fontWeight: 500 }}>{dayjs(rep.date).format('MMM D, YYYY')}</div>
                        </Col>
                        <Col span={6}>
                          <Text type="secondary">Amount</Text>
                          <div style={{ fontWeight: 500, color: '#52c41a' }}>₱{rep.amount.toLocaleString()}</div>
                        </Col>
                        <Col span={6}>
                          <Text type="secondary">Vouchers</Text>
                          <div style={{ fontWeight: 500 }}>{rep.vouchersIncluded}</div>
                        </Col>
                        <Col span={6}>
                          <Text type="secondary">Check #</Text>
                          <div style={{ fontWeight: 500 }}>{rep.checkNo}</div>
                        </Col>
                      </Row>
                      <Divider style={{ margin: '12px 0' }} />
                      <Row>
                        <Col span={12}>
                          <Text type="secondary">Total Disbursed: </Text>
                          <Text>₱{rep.totalDisbursed.toLocaleString()}</Text>
                        </Col>
                        <Col span={12}>
                          <Text type="secondary">Variance: </Text>
                          <Text type={rep.variance === 0 ? 'success' : 'warning'}>
                            ₱{rep.variance.toLocaleString()}
                          </Text>
                        </Col>
                      </Row>
                    </Card>
                  </Timeline.Item>
                ))}
                {mockReplenishments.filter(r => r.fundCode === selectedFund?.fundCode).length === 0 && (
                  <Alert message="No replenishment history found" type="info" />
                )}
              </Timeline>
            </TabPane>
          </Tabs>
        )}
      </Drawer>

      {/* New Disbursement Drawer */}
      <Drawer
        title="New Petty Cash Disbursement"
        placement="right"
        width={500}
        onClose={() => setDisbursementDrawerOpen(false)}
        open={disbursementDrawerOpen}
        extra={
          <Space>
            <Button onClick={() => setDisbursementDrawerOpen(false)}>Cancel</Button>
            <Button type="primary" onClick={submitDisbursement}>Submit</Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="fundCode"
            label="Fund"
          >
            <Input disabled />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="date"
                label="Date"
                rules={[{ required: true, message: 'Please select date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select category">
                  {expenseCategories.map(cat => (
                    <Option key={cat} value={cat}>{cat}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="payee"
            label="Payee"
            rules={[{ required: true, message: 'Please enter payee' }]}
          >
            <Input placeholder="Enter payee name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description/Purpose"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <TextArea rows={3} placeholder="Enter purpose of disbursement" />
          </Form.Item>

          <Form.Item
            name="amount"
            label="Amount"
            rules={[{ required: true, message: 'Please enter amount' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              prefix="₱"
              min={0}
              max={selectedFund?.currentBalance}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="receiptNo"
            label="Receipt/Invoice Number"
          >
            <Input placeholder="Enter receipt number (if available)" />
          </Form.Item>

          <Form.Item
            name="attachment"
            label="Attach Receipt"
          >
            <Upload>
              <Button icon={<UploadOutlined />}>Upload Receipt</Button>
            </Upload>
          </Form.Item>

          <Alert
            message={`Available Balance: ₱${selectedFund?.currentBalance?.toLocaleString()}`}
            type="info"
            showIcon
          />
        </Form>
      </Drawer>

      {/* Replenishment Modal */}
      <Modal
        title="Request Petty Cash Replenishment"
        open={replenishmentModalOpen}
        onCancel={() => setReplenishmentModalOpen(false)}
        onOk={submitReplenishment}
        okText="Submit Request"
        width={500}
      >
        <Form form={replenishForm} layout="vertical">
          <Alert
            message="Replenishment Summary"
            description={
              <div>
                <p><strong>Fund:</strong> {selectedFund?.fundCode} - {selectedFund?.name}</p>
                <p><strong>Current Balance:</strong> ₱{selectedFund?.currentBalance?.toLocaleString()}</p>
                <p><strong>Authorized Amount:</strong> ₱{selectedFund?.authorizedAmount?.toLocaleString()}</p>
              </div>
            }
            type="info"
            style={{ marginBottom: 24 }}
          />

          <Form.Item
            name="amount"
            label="Replenishment Amount"
            rules={[{ required: true, message: 'Please enter amount' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              prefix="₱"
              min={0}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="vouchersCount"
            label="Number of Vouchers"
          >
            <InputNumber style={{ width: '100%' }} min={0} disabled />
          </Form.Item>

          <Form.Item
            name="notes"
            label="Notes"
          >
            <TextArea rows={3} placeholder="Any additional notes for approval" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PettyCash;
