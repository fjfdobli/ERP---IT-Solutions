import React, { useState } from 'react';
import { 
  Table, Button, Space, Input, Tag, Card, Row, Col, 
  Drawer, Form, Select, InputNumber, Descriptions, Badge,
  Typography, Tabs, Timeline, Divider, Avatar,
  Statistic, Progress, DatePicker, List, Alert, Modal
} from 'antd';
import { 
  PlusOutlined, SearchOutlined, EyeOutlined,
  ClockCircleOutlined, UserOutlined, DollarOutlined,
  CheckCircleOutlined, CloseCircleOutlined, LoginOutlined,
  LogoutOutlined, WarningOutlined, CalendarOutlined,
  PrinterOutlined, HistoryOutlined
} from '@ant-design/icons';
import { PageHeader, StatCard } from '../../components/Common';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

// Mock data for shifts
const mockShifts = [
  {
    id: 1,
    shiftNo: 'SHF-20250115-001',
    cashier: 'John Doe',
    cashierId: 'EMP-001',
    register: 'REG-001',
    registerName: 'Main Register',
    branch: 'Main Branch',
    status: 'active',
    startTime: '2025-01-15 08:00:00',
    endTime: null,
    openingFloat: 5000,
    currentCash: 15420.50,
    totalSales: 12150.50,
    cashSales: 8420.50,
    cardSales: 3730.00,
    ewalletSales: 0,
    transactions: 45,
    voids: 2,
    refunds: 1,
    refundAmount: 320.00,
    payouts: 500.00,
    cashPickups: 3000.00,
    expectedCash: 9920.50,
  },
  {
    id: 2,
    shiftNo: 'SHF-20250115-002',
    cashier: 'Jane Smith',
    cashierId: 'EMP-002',
    register: 'REG-002',
    registerName: 'Express Lane',
    branch: 'Main Branch',
    status: 'active',
    startTime: '2025-01-15 09:00:00',
    endTime: null,
    openingFloat: 3000,
    currentCash: 8750.25,
    totalSales: 6250.25,
    cashSales: 5750.25,
    cardSales: 500.00,
    ewalletSales: 0,
    transactions: 32,
    voids: 0,
    refunds: 0,
    refundAmount: 0,
    payouts: 0,
    cashPickups: 0,
    expectedCash: 8750.25,
  },
  {
    id: 3,
    shiftNo: 'SHF-20250115-003',
    cashier: 'Maria Santos',
    cashierId: 'EMP-003',
    register: 'REG-003',
    registerName: 'Checkout 3',
    branch: 'Main Branch',
    status: 'closed',
    startTime: '2025-01-15 06:00:00',
    endTime: '2025-01-15 12:00:00',
    openingFloat: 3000,
    closingCash: 11500.00,
    totalSales: 8500.00,
    cashSales: 8200.00,
    cardSales: 300.00,
    ewalletSales: 0,
    transactions: 28,
    voids: 1,
    refunds: 0,
    refundAmount: 0,
    payouts: 200.00,
    cashPickups: 0,
    expectedCash: 11000.00,
    actualCash: 11500.00,
    variance: 500.00,
    varianceNotes: 'Customer overpayment returned next day',
  },
  {
    id: 4,
    shiftNo: 'SHF-20250115-004',
    cashier: 'Mike Johnson',
    cashierId: 'EMP-004',
    register: 'REG-101',
    registerName: 'Register 1',
    branch: 'Makati Branch',
    status: 'active',
    startTime: '2025-01-15 10:00:00',
    endTime: null,
    openingFloat: 5000,
    currentCash: 22350.75,
    totalSales: 18350.75,
    cashSales: 17350.75,
    cardSales: 1000.00,
    ewalletSales: 0,
    transactions: 52,
    voids: 3,
    refunds: 2,
    refundAmount: 650.00,
    payouts: 0,
    cashPickups: 0,
    expectedCash: 21700.75,
  },
  {
    id: 5,
    shiftNo: 'SHF-20250114-010',
    cashier: 'John Doe',
    cashierId: 'EMP-001',
    register: 'REG-001',
    registerName: 'Main Register',
    branch: 'Main Branch',
    status: 'closed',
    startTime: '2025-01-14 08:00:00',
    endTime: '2025-01-14 17:00:00',
    openingFloat: 5000,
    closingCash: 28750.00,
    totalSales: 24500.00,
    cashSales: 23750.00,
    cardSales: 750.00,
    ewalletSales: 0,
    transactions: 68,
    voids: 2,
    refunds: 1,
    refundAmount: 450.00,
    payouts: 300.00,
    cashPickups: 0,
    expectedCash: 28000.00,
    actualCash: 28750.00,
    variance: 750.00,
    varianceNotes: 'Under investigation',
  },
  {
    id: 6,
    shiftNo: 'SHF-20250114-011',
    cashier: 'Jane Smith',
    cashierId: 'EMP-002',
    register: 'REG-002',
    registerName: 'Express Lane',
    branch: 'Main Branch',
    status: 'closed',
    startTime: '2025-01-14 09:00:00',
    endTime: '2025-01-14 18:00:00',
    openingFloat: 3000,
    closingCash: 15200.00,
    totalSales: 12200.00,
    cashSales: 12200.00,
    cardSales: 0,
    ewalletSales: 0,
    transactions: 42,
    voids: 0,
    refunds: 0,
    refundAmount: 0,
    payouts: 0,
    cashPickups: 0,
    expectedCash: 15200.00,
    actualCash: 15200.00,
    variance: 0,
  },
];

// Mock transaction details
const mockTransactions = [
  { id: 'TXN-045', time: '14:30', type: 'sale', items: 5, total: 1250.00, payment: 'Cash' },
  { id: 'TXN-044', time: '14:15', type: 'sale', items: 3, total: 890.00, payment: 'Cash' },
  { id: 'TXN-043', time: '14:00', type: 'void', items: 2, total: -320.00, payment: 'Cash', reason: 'Customer cancelled' },
  { id: 'TXN-042', time: '13:45', type: 'sale', items: 8, total: 2150.00, payment: 'Card' },
  { id: 'TXN-041', time: '13:30', type: 'sale', items: 2, total: 750.00, payment: 'Cash' },
  { id: 'TXN-040', time: '13:15', type: 'refund', items: 1, total: -450.00, payment: 'Cash', reason: 'Defective item' },
  { id: 'TXN-039', time: '13:00', type: 'sale', items: 4, total: 1580.00, payment: 'Cash' },
  { id: 'TXN-038', time: '12:45', type: 'sale', items: 6, total: 2350.00, payment: 'Card' },
];

const Shifts = () => {
  const [shifts] = useState(mockShifts);
  const [searchText, setSearchText] = useState('');
  const [filterBranch, setFilterBranch] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterDate, setFilterDate] = useState(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);

  // Calculate statistics
  const stats = {
    activeShifts: shifts.filter(s => s.status === 'active').length,
    todayShifts: shifts.filter(s => dayjs(s.startTime).isSame(dayjs(), 'day')).length,
    totalSalesToday: shifts.filter(s => dayjs(s.startTime).isSame(dayjs(), 'day'))
      .reduce((sum, s) => sum + (s.totalSales || 0), 0),
    avgShiftSales: shifts.length > 0 
      ? shifts.reduce((sum, s) => sum + (s.totalSales || 0), 0) / shifts.length 
      : 0,
    totalVariance: shifts.filter(s => s.status === 'closed')
      .reduce((sum, s) => sum + Math.abs(s.variance || 0), 0),
    shiftsWithVariance: shifts.filter(s => s.status === 'closed' && s.variance !== 0).length,
  };

  // Filter shifts
  const filteredShifts = shifts.filter(shift => {
    const matchesSearch = shift.shiftNo.toLowerCase().includes(searchText.toLowerCase()) ||
      shift.cashier.toLowerCase().includes(searchText.toLowerCase());
    const matchesBranch = !filterBranch || shift.branch === filterBranch;
    const matchesStatus = !filterStatus || shift.status === filterStatus;
    const matchesDate = !filterDate || (
      dayjs(shift.startTime).isAfter(filterDate[0].startOf('day')) &&
      dayjs(shift.startTime).isBefore(filterDate[1].endOf('day'))
    );
    return matchesSearch && matchesBranch && matchesStatus && matchesDate;
  });

  const handleViewDetail = (shift) => {
    setSelectedShift(shift);
    setDetailDrawerOpen(true);
  };

  const getVarianceStatus = (variance) => {
    if (variance === 0 || variance === undefined) return { color: 'green', text: 'Balanced' };
    if (variance > 0) return { color: 'blue', text: 'Over' };
    return { color: 'red', text: 'Short' };
  };

  const columns = [
    {
      title: 'Shift',
      key: 'shift',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.shiftNo}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {dayjs(record.startTime).format('MMM D, YYYY')}
          </Text>
        </div>
      ),
    },
    {
      title: 'Cashier',
      key: 'cashier',
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} size="small" />
          <div>
            <div>{record.cashier}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>{record.cashierId}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Register',
      key: 'register',
      render: (_, record) => (
        <div>
          <div>{record.registerName}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.branch}</Text>
        </div>
      ),
    },
    {
      title: 'Time',
      key: 'time',
      render: (_, record) => (
        <div>
          <div>
            <LoginOutlined style={{ color: '#52c41a', marginRight: 4 }} />
            {dayjs(record.startTime).format('HH:mm')}
          </div>
          {record.endTime && (
            <div>
              <LogoutOutlined style={{ color: '#ff4d4f', marginRight: 4 }} />
              {dayjs(record.endTime).format('HH:mm')}
            </div>
          )}
          {record.status === 'active' && (
            <Tag color="green" style={{ fontSize: '11px' }}>Active</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Total Sales',
      key: 'sales',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>₱{record.totalSales?.toLocaleString()}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.transactions} txns
          </Text>
        </div>
      ),
    },
    {
      title: 'Cash Balance',
      key: 'cash',
      render: (_, record) => {
        if (record.status === 'active') {
          return (
            <div>
              <div style={{ color: '#52c41a' }}>₱{record.currentCash?.toLocaleString()}</div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Expected: ₱{record.expectedCash?.toLocaleString()}
              </Text>
            </div>
          );
        }
        const varianceStatus = getVarianceStatus(record.variance);
        return (
          <div>
            <div>₱{record.actualCash?.toLocaleString()}</div>
            <Tag color={varianceStatus.color} style={{ fontSize: '11px' }}>
              {varianceStatus.text}: ₱{Math.abs(record.variance || 0).toLocaleString()}
            </Tag>
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status, record) => {
        if (status === 'active') {
          return <Badge status="processing" text="Active" />;
        }
        const hasVariance = record.variance !== 0;
        return (
          <Space direction="vertical" size={0}>
            <Badge status="default" text="Closed" />
            {hasVariance && (
              <Tag color="warning" icon={<WarningOutlined />} style={{ fontSize: '10px' }}>
                Variance
              </Tag>
            )}
          </Space>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          View Details
        </Button>
      ),
    },
  ];

  const branches = [...new Set(shifts.map(s => s.branch))];

  return (
    <div>
      <PageHeader
        title="Cashier Shifts"
        subtitle="Monitor and manage cashier shift sessions"
      />

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <StatCard
            title="Active Shifts"
            value={stats.activeShifts}
            icon={<ClockCircleOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard
            title="Today's Shifts"
            value={stats.todayShifts}
            icon={<CalendarOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard
            title="Today's Sales"
            value={`₱${stats.totalSalesToday.toLocaleString()}`}
            icon={<DollarOutlined />}
            color="#722ed1"
          />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard
            title="Shifts w/ Variance"
            value={stats.shiftsWithVariance}
            icon={<WarningOutlined />}
            color="#faad14"
            suffix={`(₱${stats.totalVariance.toLocaleString()})`}
          />
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={24} sm={6}>
            <Input
              placeholder="Search shifts..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
            />
          </Col>
          <Col xs={12} sm={6}>
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
          <Col xs={12} sm={6}>
            <Select
              placeholder="Filter by Status"
              allowClear
              style={{ width: '100%' }}
              value={filterStatus}
              onChange={setFilterStatus}
            >
              <Option value="active">Active</Option>
              <Option value="closed">Closed</Option>
            </Select>
          </Col>
          <Col xs={24} sm={6}>
            <RangePicker
              style={{ width: '100%' }}
              onChange={setFilterDate}
            />
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={filteredShifts}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      {/* Detail Drawer */}
      <Drawer
        title={`Shift Details - ${selectedShift?.shiftNo}`}
        placement="right"
        width={700}
        onClose={() => setDetailDrawerOpen(false)}
        open={detailDrawerOpen}
        extra={
          <Button icon={<PrinterOutlined />}>Print Z-Report</Button>
        }
      >
        {selectedShift && (
          <Tabs defaultActiveKey="summary">
            <TabPane tab="Summary" key="summary">
              {/* Status Alert */}
              <Alert
                message={selectedShift.status === 'active' ? 'Shift is Currently Active' : 'Shift Closed'}
                description={selectedShift.status === 'active' 
                  ? `Started at ${dayjs(selectedShift.startTime).format('HH:mm')} - Running for ${dayjs().diff(dayjs(selectedShift.startTime), 'hour')} hours`
                  : `Closed at ${dayjs(selectedShift.endTime).format('HH:mm')} - Duration: ${dayjs(selectedShift.endTime).diff(dayjs(selectedShift.startTime), 'hour')} hours`
                }
                type={selectedShift.status === 'active' ? 'info' : 'success'}
                showIcon
                style={{ marginBottom: 24 }}
              />

              {/* Cashier Info */}
              <Descriptions title="Shift Information" bordered column={2} size="small" style={{ marginBottom: 24 }}>
                <Descriptions.Item label="Cashier">
                  <Space>
                    <Avatar icon={<UserOutlined />} size="small" />
                    {selectedShift.cashier}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Employee ID">{selectedShift.cashierId}</Descriptions.Item>
                <Descriptions.Item label="Register">{selectedShift.registerName}</Descriptions.Item>
                <Descriptions.Item label="Branch">{selectedShift.branch}</Descriptions.Item>
                <Descriptions.Item label="Start Time">
                  {dayjs(selectedShift.startTime).format('MMM D, YYYY HH:mm')}
                </Descriptions.Item>
                <Descriptions.Item label="End Time">
                  {selectedShift.endTime 
                    ? dayjs(selectedShift.endTime).format('MMM D, YYYY HH:mm')
                    : <Badge status="processing" text="Active" />
                  }
                </Descriptions.Item>
              </Descriptions>

              {/* Sales Summary */}
              <Title level={5}>Sales Summary</Title>
              <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col span={6}>
                  <Card size="small">
                    <Statistic
                      title="Total Sales"
                      value={selectedShift.totalSales}
                      prefix="₱"
                      valueStyle={{ fontSize: '18px' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small">
                    <Statistic
                      title="Cash Sales"
                      value={selectedShift.cashSales}
                      prefix="₱"
                      valueStyle={{ fontSize: '18px', color: '#52c41a' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small">
                    <Statistic
                      title="Card Sales"
                      value={selectedShift.cardSales}
                      prefix="₱"
                      valueStyle={{ fontSize: '18px', color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small">
                    <Statistic
                      title="Transactions"
                      value={selectedShift.transactions}
                      valueStyle={{ fontSize: '18px' }}
                    />
                  </Card>
                </Col>
              </Row>

              {/* Cash Flow */}
              <Title level={5}>Cash Flow Summary</Title>
              <Card size="small" style={{ marginBottom: 24 }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <List
                      size="small"
                      dataSource={[
                        { label: 'Opening Float', value: selectedShift.openingFloat, type: 'in' },
                        { label: 'Cash Sales', value: selectedShift.cashSales, type: 'in' },
                        { label: 'Refunds', value: -selectedShift.refundAmount, type: 'out' },
                        { label: 'Payouts', value: -selectedShift.payouts, type: 'out' },
                        { label: 'Cash Pickups', value: -selectedShift.cashPickups, type: 'out' },
                      ]}
                      renderItem={item => (
                        <List.Item>
                          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <span>{item.label}</span>
                            <span style={{ color: item.type === 'in' ? '#52c41a' : '#ff4d4f' }}>
                              {item.type === 'in' ? '+' : ''}₱{Math.abs(item.value).toLocaleString()}
                            </span>
                          </div>
                        </List.Item>
                      )}
                    />
                  </Col>
                  <Col span={12}>
                    <div style={{ textAlign: 'center', padding: 24 }}>
                      <Text type="secondary">Expected Cash</Text>
                      <div style={{ fontSize: 28, fontWeight: 600, color: '#1890ff' }}>
                        ₱{selectedShift.expectedCash?.toLocaleString()}
                      </div>
                      {selectedShift.status === 'closed' && (
                        <>
                          <Divider style={{ margin: '12px 0' }} />
                          <Text type="secondary">Actual Cash</Text>
                          <div style={{ fontSize: 24, fontWeight: 500 }}>
                            ₱{selectedShift.actualCash?.toLocaleString()}
                          </div>
                          <Tag 
                            color={getVarianceStatus(selectedShift.variance).color}
                            style={{ marginTop: 8 }}
                          >
                            Variance: ₱{Math.abs(selectedShift.variance || 0).toLocaleString()} 
                            ({selectedShift.variance >= 0 ? 'Over' : 'Short'})
                          </Tag>
                        </>
                      )}
                    </div>
                  </Col>
                </Row>
              </Card>

              {/* Activity Stats */}
              <Title level={5}>Activity Statistics</Title>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Card size="small">
                    <Statistic
                      title="Voids"
                      value={selectedShift.voids}
                      valueStyle={{ color: selectedShift.voids > 0 ? '#faad14' : '#52c41a' }}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small">
                    <Statistic
                      title="Refunds"
                      value={selectedShift.refunds}
                      valueStyle={{ color: selectedShift.refunds > 0 ? '#ff4d4f' : '#52c41a' }}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small">
                    <Statistic
                      title="Refund Amount"
                      value={selectedShift.refundAmount}
                      prefix="₱"
                      valueStyle={{ color: '#ff4d4f', fontSize: '16px' }}
                    />
                  </Card>
                </Col>
              </Row>

              {selectedShift.varianceNotes && (
                <Alert
                  message="Variance Notes"
                  description={selectedShift.varianceNotes}
                  type="warning"
                  showIcon
                  style={{ marginTop: 24 }}
                />
              )}
            </TabPane>

            <TabPane tab="Transactions" key="transactions">
              <Title level={5}>
                <HistoryOutlined style={{ marginRight: 8 }} />
                Transaction History
              </Title>
              <Table
                size="small"
                dataSource={mockTransactions}
                rowKey="id"
                columns={[
                  {
                    title: 'ID',
                    dataIndex: 'id',
                    width: 100,
                  },
                  {
                    title: 'Time',
                    dataIndex: 'time',
                    width: 80,
                  },
                  {
                    title: 'Type',
                    dataIndex: 'type',
                    render: (type) => {
                      const config = {
                        'sale': { color: 'green', icon: <CheckCircleOutlined /> },
                        'void': { color: 'orange', icon: <CloseCircleOutlined /> },
                        'refund': { color: 'red', icon: <CloseCircleOutlined /> },
                      };
                      const c = config[type] || { color: 'default' };
                      return <Tag color={c.color} icon={c.icon}>{type.toUpperCase()}</Tag>;
                    },
                  },
                  {
                    title: 'Items',
                    dataIndex: 'items',
                    width: 70,
                  },
                  {
                    title: 'Amount',
                    dataIndex: 'total',
                    render: (val) => (
                      <span style={{ color: val >= 0 ? '#52c41a' : '#ff4d4f' }}>
                        {val >= 0 ? '+' : ''}₱{val.toLocaleString()}
                      </span>
                    ),
                  },
                  {
                    title: 'Payment',
                    dataIndex: 'payment',
                    render: (payment) => <Tag>{payment}</Tag>,
                  },
                  {
                    title: 'Reason',
                    dataIndex: 'reason',
                    render: (reason) => reason || '-',
                  },
                ]}
                pagination={{ pageSize: 10 }}
              />
            </TabPane>

            <TabPane tab="Timeline" key="timeline">
              <Title level={5}>Shift Timeline</Title>
              <Timeline>
                <Timeline.Item color="green">
                  <div style={{ fontWeight: 500 }}>Shift Started</div>
                  <Text type="secondary">{dayjs(selectedShift.startTime).format('HH:mm')} - Opening float: ₱{selectedShift.openingFloat?.toLocaleString()}</Text>
                </Timeline.Item>
                <Timeline.Item>
                  <div style={{ fontWeight: 500 }}>First Transaction</div>
                  <Text type="secondary">08:15 - Sale #TXN-001 - ₱450.00</Text>
                </Timeline.Item>
                {selectedShift.cashPickups > 0 && (
                  <Timeline.Item color="purple">
                    <div style={{ fontWeight: 500 }}>Cash Pickup</div>
                    <Text type="secondary">12:45 - ₱{selectedShift.cashPickups?.toLocaleString()} collected by manager</Text>
                  </Timeline.Item>
                )}
                {selectedShift.refunds > 0 && (
                  <Timeline.Item color="red">
                    <div style={{ fontWeight: 500 }}>Refund Processed</div>
                    <Text type="secondary">13:15 - ₱{selectedShift.refundAmount?.toLocaleString()} - Defective item</Text>
                  </Timeline.Item>
                )}
                {selectedShift.status === 'closed' ? (
                  <Timeline.Item color="blue">
                    <div style={{ fontWeight: 500 }}>Shift Closed</div>
                    <Text type="secondary">
                      {dayjs(selectedShift.endTime).format('HH:mm')} - Final balance: ₱{selectedShift.actualCash?.toLocaleString()}
                    </Text>
                  </Timeline.Item>
                ) : (
                  <Timeline.Item color="green" dot={<ClockCircleOutlined />}>
                    <div style={{ fontWeight: 500 }}>Current Activity</div>
                    <Text type="secondary">Shift is currently active</Text>
                  </Timeline.Item>
                )}
              </Timeline>
            </TabPane>
          </Tabs>
        )}
      </Drawer>
    </div>
  );
};

export default Shifts;
