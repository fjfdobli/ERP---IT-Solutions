import React, { useState } from 'react';
import { 
  Table, Button, Space, Input, Tag, Card, Row, Col, 
  Drawer, Form, Select, InputNumber, Descriptions, Badge,
  Typography, message, Modal, Alert, Timeline, Divider,
  Statistic, Progress
} from 'antd';
import { 
  PlusOutlined, SearchOutlined, EditOutlined, EyeOutlined,
  DesktopOutlined, LockOutlined, UnlockOutlined, SyncOutlined,
  DollarOutlined, CheckCircleOutlined, CloseCircleOutlined,
  HistoryOutlined, ExclamationCircleOutlined, PrinterOutlined
} from '@ant-design/icons';
import { PageHeader, StatCard } from '../../components/Common';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;

// Mock data for cash registers
const mockRegisters = [
  {
    id: 1,
    registerNo: 'REG-001',
    name: 'Main Register',
    branch: 'Main Branch',
    terminal: 'POS-01',
    status: 'open',
    currentCashier: 'John Doe',
    openedAt: '2025-01-15 08:00:00',
    openingFloat: 5000,
    currentBalance: 15420.50,
    totalSales: 12150.50,
    cashSales: 8420.50,
    cardSales: 3730.00,
    transactions: 45,
    lastActivity: '2025-01-15 14:30:00',
  },
  {
    id: 2,
    registerNo: 'REG-002',
    name: 'Express Lane',
    branch: 'Main Branch',
    terminal: 'POS-02',
    status: 'open',
    currentCashier: 'Jane Smith',
    openedAt: '2025-01-15 09:00:00',
    openingFloat: 3000,
    currentBalance: 8750.25,
    totalSales: 6250.25,
    cashSales: 5750.25,
    cardSales: 500.00,
    transactions: 32,
    lastActivity: '2025-01-15 14:25:00',
  },
  {
    id: 3,
    registerNo: 'REG-003',
    name: 'Checkout 3',
    branch: 'Main Branch',
    terminal: 'POS-03',
    status: 'closed',
    currentCashier: null,
    closedAt: '2025-01-15 12:00:00',
    openingFloat: 3000,
    closingBalance: 11200.00,
    totalSales: 8500.00,
    cashSales: 8200.00,
    cardSales: 300.00,
    transactions: 28,
    variance: 300.00,
    lastActivity: '2025-01-15 12:00:00',
  },
  {
    id: 4,
    registerNo: 'REG-101',
    name: 'Register 1',
    branch: 'Makati Branch',
    terminal: 'POS-101',
    status: 'open',
    currentCashier: 'Mike Johnson',
    openedAt: '2025-01-15 10:00:00',
    openingFloat: 5000,
    currentBalance: 22350.75,
    totalSales: 18350.75,
    cashSales: 17350.75,
    cardSales: 1000.00,
    transactions: 52,
    lastActivity: '2025-01-15 14:28:00',
  },
  {
    id: 5,
    registerNo: 'REG-102',
    name: 'Register 2',
    branch: 'Makati Branch',
    terminal: 'POS-102',
    status: 'inactive',
    currentCashier: null,
    note: 'Under maintenance',
    lastActivity: '2025-01-14 18:00:00',
  },
  {
    id: 6,
    registerNo: 'REG-201',
    name: 'Store Register',
    branch: 'Quezon City Branch',
    terminal: 'POS-201',
    status: 'open',
    currentCashier: 'Anna Garcia',
    openedAt: '2025-01-15 08:30:00',
    openingFloat: 4000,
    currentBalance: 19850.50,
    totalSales: 16350.50,
    cashSales: 15850.50,
    cardSales: 500.00,
    transactions: 48,
    lastActivity: '2025-01-15 14:20:00',
  },
];

// Mock transaction history
const mockTransactionHistory = [
  { time: '14:30:00', type: 'sale', description: 'Sale #TXN-20250115-045', amount: 1250.00, balance: 15420.50 },
  { time: '14:15:00', type: 'sale', description: 'Sale #TXN-20250115-044', amount: 890.00, balance: 14170.50 },
  { time: '14:00:00', type: 'void', description: 'Voided #TXN-20250115-041', amount: -320.00, balance: 13280.50 },
  { time: '13:45:00', type: 'sale', description: 'Sale #TXN-20250115-043', amount: 2150.00, balance: 13600.50 },
  { time: '13:30:00', type: 'payout', description: 'Supplier payment - Advance', amount: -500.00, balance: 11450.50 },
  { time: '13:15:00', type: 'sale', description: 'Sale #TXN-20250115-042', amount: 750.00, balance: 11950.50 },
  { time: '12:45:00', type: 'pickup', description: 'Cash pickup by Manager', amount: -3000.00, balance: 11200.50 },
  { time: '12:30:00', type: 'sale', description: 'Sale #TXN-20250115-040', amount: 1580.00, balance: 14200.50 },
];

// Denomination breakdown
const denominations = [
  { name: '₱1,000', value: 1000 },
  { name: '₱500', value: 500 },
  { name: '₱200', value: 200 },
  { name: '₱100', value: 100 },
  { name: '₱50', value: 50 },
  { name: '₱20', value: 20 },
  { name: '₱10', value: 10 },
  { name: '₱5', value: 5 },
  { name: '₱1', value: 1 },
  { name: 'Coins', value: 0.01 },
];

const CashRegisters = () => {
  const [registers] = useState(mockRegisters);
  const [searchText, setSearchText] = useState('');
  const [filterBranch, setFilterBranch] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedRegister, setSelectedRegister] = useState(null);
  const [closeRegisterModalOpen, setCloseRegisterModalOpen] = useState(false);
  const [openRegisterModalOpen, setOpenRegisterModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [closeForm] = Form.useForm();

  // Calculate statistics
  const stats = {
    totalRegisters: registers.length,
    openRegisters: registers.filter(r => r.status === 'open').length,
    closedRegisters: registers.filter(r => r.status === 'closed').length,
    inactiveRegisters: registers.filter(r => r.status === 'inactive').length,
    totalCashInRegisters: registers.filter(r => r.status === 'open').reduce((sum, r) => sum + (r.currentBalance || 0), 0),
    totalSalesToday: registers.reduce((sum, r) => sum + (r.totalSales || 0), 0),
    totalTransactions: registers.reduce((sum, r) => sum + (r.transactions || 0), 0),
  };

  // Filter registers
  const filteredRegisters = registers.filter(register => {
    const matchesSearch = register.registerNo.toLowerCase().includes(searchText.toLowerCase()) ||
      register.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (register.currentCashier || '').toLowerCase().includes(searchText.toLowerCase());
    const matchesBranch = !filterBranch || register.branch === filterBranch;
    const matchesStatus = !filterStatus || register.status === filterStatus;
    return matchesSearch && matchesBranch && matchesStatus;
  });

  const getStatusConfig = (status) => {
    const config = {
      'open': { color: 'green', text: 'Open', icon: <UnlockOutlined /> },
      'closed': { color: 'default', text: 'Closed', icon: <LockOutlined /> },
      'inactive': { color: 'red', text: 'Inactive', icon: <CloseCircleOutlined /> },
    };
    return config[status] || { color: 'default', text: status };
  };

  const getTransactionIcon = (type) => {
    const icons = {
      'sale': <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      'void': <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      'payout': <DollarOutlined style={{ color: '#faad14' }} />,
      'pickup': <DollarOutlined style={{ color: '#722ed1' }} />,
    };
    return icons[type] || <DollarOutlined />;
  };

  const handleViewDetail = (register) => {
    setSelectedRegister(register);
    setDetailDrawerOpen(true);
  };

  const handleOpenRegister = (register) => {
    setSelectedRegister(register);
    form.setFieldsValue({
      openingFloat: 5000,
      cashier: null,
    });
    setOpenRegisterModalOpen(true);
  };

  const handleCloseRegister = (register) => {
    setSelectedRegister(register);
    closeForm.resetFields();
    setCloseRegisterModalOpen(true);
  };

  const confirmOpenRegister = () => {
    form.validateFields().then(() => {
      message.success(`Register ${selectedRegister.registerNo} opened successfully`);
      setOpenRegisterModalOpen(false);
    });
  };

  const confirmCloseRegister = () => {
    closeForm.validateFields().then(values => {
      // Calculate total from denominations
      const total = denominations.reduce((sum, d) => {
        const count = values[`denom_${d.value}`] || 0;
        return sum + (count * d.value);
      }, 0);
      
      const expectedBalance = selectedRegister.currentBalance;
      const variance = total - expectedBalance;
      
      if (Math.abs(variance) > 0) {
        confirm({
          title: 'Cash Variance Detected',
          icon: <ExclamationCircleOutlined />,
          content: (
            <div>
              <p>There is a variance in the cash count:</p>
              <p><strong>Expected:</strong> ₱{expectedBalance.toLocaleString()}</p>
              <p><strong>Counted:</strong> ₱{total.toLocaleString()}</p>
              <p><strong>Variance:</strong> <span style={{ color: variance > 0 ? '#52c41a' : '#ff4d4f' }}>
                ₱{variance.toLocaleString()}
              </span></p>
              <p>Do you want to proceed with closing the register?</p>
            </div>
          ),
          onOk() {
            message.success(`Register ${selectedRegister.registerNo} closed with variance of ₱${variance.toLocaleString()}`);
            setCloseRegisterModalOpen(false);
          },
        });
      } else {
        message.success(`Register ${selectedRegister.registerNo} closed successfully - No variance`);
        setCloseRegisterModalOpen(false);
      }
    });
  };

  const columns = [
    {
      title: 'Register',
      key: 'register',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            <DesktopOutlined style={{ marginRight: 8 }} />
            {record.registerNo}
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
      title: 'Status',
      dataIndex: 'status',
      render: (status) => {
        const config = getStatusConfig(status);
        return (
          <Tag icon={config.icon} color={config.color}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: 'Current Cashier',
      dataIndex: 'currentCashier',
      render: (cashier, record) => (
        <div>
          <div>{cashier || '-'}</div>
          {record.openedAt && (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Since {dayjs(record.openedAt).format('HH:mm')}
            </Text>
          )}
        </div>
      ),
    },
    {
      title: 'Current Balance',
      key: 'balance',
      render: (_, record) => (
        <div>
          {record.status === 'open' ? (
            <>
              <div style={{ fontWeight: 500, color: '#52c41a' }}>
                ₱{record.currentBalance?.toLocaleString()}
              </div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Float: ₱{record.openingFloat?.toLocaleString()}
              </Text>
            </>
          ) : record.status === 'closed' ? (
            <>
              <div>₱{record.closingBalance?.toLocaleString()}</div>
              {record.variance !== undefined && record.variance !== 0 && (
                <Tag color={record.variance > 0 ? 'green' : 'red'} style={{ fontSize: '11px' }}>
                  Variance: ₱{record.variance?.toLocaleString()}
                </Tag>
              )}
            </>
          ) : (
            <Text type="secondary">-</Text>
          )}
        </div>
      ),
    },
    {
      title: 'Sales Today',
      key: 'sales',
      render: (_, record) => (
        <div>
          <div>₱{record.totalSales?.toLocaleString() || '0'}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.transactions || 0} transactions
          </Text>
        </div>
      ),
    },
    {
      title: 'Last Activity',
      dataIndex: 'lastActivity',
      render: (date) => (
        <div>
          <div>{dayjs(date).format('MMM D')}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {dayjs(date).format('HH:mm')}
          </Text>
        </div>
      ),
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
          {record.status === 'closed' && (
            <Button 
              type="link" 
              icon={<UnlockOutlined />}
              onClick={() => handleOpenRegister(record)}
            >
              Open
            </Button>
          )}
          {record.status === 'open' && (
            <Button 
              type="link" 
              icon={<LockOutlined />}
              onClick={() => handleCloseRegister(record)}
            >
              Close
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const branches = [...new Set(registers.map(r => r.branch))];

  return (
    <div>
      <PageHeader
        title="Cash Registers"
        subtitle="Manage POS terminals and cash drawers"
        action={
          <Button type="primary" icon={<PlusOutlined />}>
            Add Register
          </Button>
        }
      />

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <StatCard
            title="Total Registers"
            value={stats.totalRegisters}
            icon={<DesktopOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard
            title="Open Registers"
            value={stats.openRegisters}
            icon={<UnlockOutlined />}
            color="#52c41a"
            suffix={`/ ${stats.totalRegisters}`}
          />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard
            title="Cash in Registers"
            value={`₱${stats.totalCashInRegisters.toLocaleString()}`}
            icon={<DollarOutlined />}
            color="#faad14"
          />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard
            title="Today's Sales"
            value={`₱${stats.totalSalesToday.toLocaleString()}`}
            icon={<DollarOutlined />}
            color="#722ed1"
            suffix={`${stats.totalTransactions} txns`}
          />
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Input
              placeholder="Search registers or cashiers..."
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
              <Option value="open">Open</Option>
              <Option value="closed">Closed</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredRegisters}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Detail Drawer */}
      <Drawer
        title={`Register Details - ${selectedRegister?.registerNo}`}
        placement="right"
        width={600}
        onClose={() => setDetailDrawerOpen(false)}
        open={detailDrawerOpen}
        extra={
          <Space>
            <Button icon={<PrinterOutlined />}>Print Report</Button>
            <Button icon={<SyncOutlined />}>Refresh</Button>
          </Space>
        }
      >
        {selectedRegister && (
          <div>
            {/* Status Banner */}
            <Alert
              message={
                <Space>
                  {getStatusConfig(selectedRegister.status).icon}
                  <span>Register is {selectedRegister.status.toUpperCase()}</span>
                </Space>
              }
              type={selectedRegister.status === 'open' ? 'success' : selectedRegister.status === 'inactive' ? 'error' : 'info'}
              style={{ marginBottom: 24 }}
            />

            {/* Register Info */}
            <Descriptions column={2} bordered size="small" style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Register No">{selectedRegister.registerNo}</Descriptions.Item>
              <Descriptions.Item label="Name">{selectedRegister.name}</Descriptions.Item>
              <Descriptions.Item label="Branch">{selectedRegister.branch}</Descriptions.Item>
              <Descriptions.Item label="Terminal">{selectedRegister.terminal}</Descriptions.Item>
              <Descriptions.Item label="Current Cashier" span={2}>
                {selectedRegister.currentCashier || 'None assigned'}
              </Descriptions.Item>
            </Descriptions>

            {selectedRegister.status === 'open' && (
              <>
                {/* Current Session Stats */}
                <Title level={5}>Current Session</Title>
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                  <Col span={8}>
                    <Card size="small">
                      <Statistic
                        title="Opening Float"
                        value={selectedRegister.openingFloat}
                        prefix="₱"
                        valueStyle={{ fontSize: '18px' }}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small">
                      <Statistic
                        title="Current Balance"
                        value={selectedRegister.currentBalance}
                        prefix="₱"
                        valueStyle={{ fontSize: '18px', color: '#52c41a' }}
                      />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small">
                      <Statistic
                        title="Net Sales"
                        value={selectedRegister.currentBalance - selectedRegister.openingFloat}
                        prefix="₱"
                        valueStyle={{ fontSize: '18px', color: '#1890ff' }}
                      />
                    </Card>
                  </Col>
                </Row>

                {/* Sales Breakdown */}
                <Title level={5}>Sales Breakdown</Title>
                <Card size="small" style={{ marginBottom: 24 }}>
                  <Row gutter={16}>
                    <Col span={8}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 600 }}>
                          ₱{selectedRegister.totalSales?.toLocaleString()}
                        </div>
                        <Text type="secondary">Total Sales</Text>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 600, color: '#52c41a' }}>
                          ₱{selectedRegister.cashSales?.toLocaleString()}
                        </div>
                        <Text type="secondary">Cash Sales</Text>
                        <Progress 
                          percent={Math.round((selectedRegister.cashSales / selectedRegister.totalSales) * 100)} 
                          size="small"
                          showInfo={false}
                          strokeColor="#52c41a"
                        />
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 600, color: '#1890ff' }}>
                          ₱{selectedRegister.cardSales?.toLocaleString()}
                        </div>
                        <Text type="secondary">Card Sales</Text>
                        <Progress 
                          percent={Math.round((selectedRegister.cardSales / selectedRegister.totalSales) * 100)} 
                          size="small"
                          showInfo={false}
                        />
                      </div>
                    </Col>
                  </Row>
                </Card>

                {/* Transaction History */}
                <Title level={5}>
                  <HistoryOutlined style={{ marginRight: 8 }} />
                  Recent Activity
                </Title>
                <Card size="small">
                  <Timeline>
                    {mockTransactionHistory.map((txn, index) => (
                      <Timeline.Item key={index} dot={getTransactionIcon(txn.type)}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <div>
                            <Text strong>{txn.time}</Text> - {txn.description}
                          </div>
                          <div>
                            <Text type={txn.amount >= 0 ? 'success' : 'danger'}>
                              {txn.amount >= 0 ? '+' : ''}₱{txn.amount.toLocaleString()}
                            </Text>
                          </div>
                        </div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          Balance: ₱{txn.balance.toLocaleString()}
                        </Text>
                      </Timeline.Item>
                    ))}
                  </Timeline>
                </Card>
              </>
            )}

            {selectedRegister.status === 'inactive' && (
              <Alert
                message="Register Inactive"
                description={selectedRegister.note || 'This register is currently not available for use.'}
                type="warning"
                showIcon
              />
            )}
          </div>
        )}
      </Drawer>

      {/* Open Register Modal */}
      <Modal
        title={`Open Register ${selectedRegister?.registerNo}`}
        open={openRegisterModalOpen}
        onCancel={() => setOpenRegisterModalOpen(false)}
        onOk={confirmOpenRegister}
        okText="Open Register"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="cashier"
            label="Assign Cashier"
            rules={[{ required: true, message: 'Please select a cashier' }]}
          >
            <Select placeholder="Select cashier">
              <Option value="john">John Doe</Option>
              <Option value="jane">Jane Smith</Option>
              <Option value="mike">Mike Johnson</Option>
              <Option value="anna">Anna Garcia</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="openingFloat"
            label="Opening Float"
            rules={[{ required: true, message: 'Please enter opening float' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              prefix="₱"
              min={0}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
          <Alert
            message="Opening a register will start a new cash session and the assigned cashier will be responsible for all transactions."
            type="info"
            showIcon
          />
        </Form>
      </Modal>

      {/* Close Register Modal */}
      <Modal
        title={`Close Register ${selectedRegister?.registerNo}`}
        open={closeRegisterModalOpen}
        onCancel={() => setCloseRegisterModalOpen(false)}
        onOk={confirmCloseRegister}
        okText="Close Register"
        width={600}
      >
        <Form form={closeForm} layout="vertical">
          <Alert
            message={`Expected Balance: ₱${selectedRegister?.currentBalance?.toLocaleString()}`}
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
          
          <Title level={5}>Cash Count by Denomination</Title>
          <Row gutter={[16, 8]}>
            {denominations.map(denom => (
              <Col span={12} key={denom.value}>
                <Form.Item
                  name={`denom_${denom.value}`}
                  label={denom.name}
                  initialValue={0}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    min={0}
                    placeholder={`Count of ${denom.name}`}
                  />
                </Form.Item>
              </Col>
            ))}
          </Row>

          <Divider />

          <Form.Item
            name="notes"
            label="Closing Notes"
          >
            <Input.TextArea rows={3} placeholder="Any notes about this shift..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CashRegisters;
