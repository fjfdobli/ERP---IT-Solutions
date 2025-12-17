import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Typography, Tag, Statistic,
  Progress, Tooltip, DatePicker, Select
} from 'antd';
import {
  DollarOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  BankOutlined,
  WalletOutlined,
  CreditCardOutlined,
  LineChartOutlined,
  PieChartOutlined,
  ExportOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard } from '../../components/Common';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

// Mock financial data
const mockSummary = {
  totalRevenue: 2847562.50,
  revenueGrowth: 12.5,
  totalExpenses: 1523480.00,
  expenseGrowth: 8.2,
  netIncome: 1324082.50,
  incomeGrowth: 15.8,
  cashOnHand: 856420.00,
  accountsReceivable: 425680.00,
  accountsPayable: 312450.00,
  inventory: 1250000.00,
};

const mockRecentTransactions = [
  { id: 'TRX001', date: '2024-01-15', description: 'Sales Revenue - Cebu Branch', type: 'credit', category: 'Sales', amount: 125000.00 },
  { id: 'TRX002', date: '2024-01-15', description: 'Supplier Payment - ABC Electronics', type: 'debit', category: 'Purchases', amount: 45000.00 },
  { id: 'TRX003', date: '2024-01-15', description: 'Employee Payroll', type: 'debit', category: 'Payroll', amount: 350000.00 },
  { id: 'TRX004', date: '2024-01-14', description: 'Sales Revenue - Manila Branch', type: 'credit', category: 'Sales', amount: 98500.00 },
  { id: 'TRX005', date: '2024-01-14', description: 'Utility Bills Payment', type: 'debit', category: 'Utilities', amount: 25000.00 },
  { id: 'TRX006', date: '2024-01-14', description: 'Customer Payment Received', type: 'credit', category: 'Collections', amount: 75000.00 },
  { id: 'TRX007', date: '2024-01-13', description: 'Office Supplies', type: 'debit', category: 'Operations', amount: 8500.00 },
  { id: 'TRX008', date: '2024-01-13', description: 'Rental Income', type: 'credit', category: 'Other Income', amount: 50000.00 },
];

const mockBankAccounts = [
  { id: 1, bank: 'BDO', accountName: 'Main Operating Account', accountNumber: '****1234', balance: 456780.00, type: 'checking' },
  { id: 2, bank: 'BPI', accountName: 'Savings Account', accountNumber: '****5678', balance: 285640.00, type: 'savings' },
  { id: 3, bank: 'Metrobank', accountName: 'Payroll Account', accountNumber: '****9012', balance: 114000.00, type: 'checking' },
];

const mockExpenseBreakdown = [
  { category: 'Payroll', amount: 650000, percent: 42.7 },
  { category: 'Inventory', amount: 450000, percent: 29.5 },
  { category: 'Utilities', amount: 125000, percent: 8.2 },
  { category: 'Rent', amount: 150000, percent: 9.8 },
  { category: 'Operations', amount: 98480, percent: 6.5 },
  { category: 'Others', amount: 50000, percent: 3.3 },
];

const mockRevenueByBranch = [
  { branch: 'Manila Main', revenue: 850000, growth: 15.2 },
  { branch: 'Cebu', revenue: 620000, growth: 22.5 },
  { branch: 'Davao', revenue: 480000, growth: 8.7 },
  { branch: 'Makati', revenue: 520000, growth: 11.3 },
  { branch: 'Quezon City', revenue: 377562.50, growth: -2.1 },
];

const FinanceOverview = () => {
  const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs()]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  const transactionColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 100,
      render: (date) => dayjs(date).format('MMM D'),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (cat) => <Tag>{cat}</Tag>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 130,
      align: 'right',
      render: (amount, record) => (
        <Text type={record.type === 'credit' ? 'success' : 'danger'}>
          {record.type === 'credit' ? '+' : '-'}{formatCurrency(amount)}
        </Text>
      ),
    },
  ];

  const getCategoryColor = (category) => {
    const colors = {
      'Payroll': '#f5222d',
      'Inventory': '#fa8c16',
      'Utilities': '#1890ff',
      'Rent': '#722ed1',
      'Operations': '#13c2c2',
      'Others': '#8c8c8c',
    };
    return colors[category] || '#8c8c8c';
  };

  return (
    <div>
      <PageHeader
        title="Finance Overview"
        subtitle={`${dateRange[0].format('MMM D')} - ${dateRange[1].format('MMM D, YYYY')}`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'Finance', path: '/finance' },
          { title: 'Overview', path: '/finance/overview' },
        ]}
        actions={[
          <RangePicker
            key="range"
            value={dateRange}
            onChange={setDateRange}
            allowClear={false}
          />,
          <Button key="export" icon={<ExportOutlined />}>Export</Button>,
        ]}
      />

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={mockSummary.totalRevenue}
              precision={2}
              prefix="₱"
              suffix={
                <Text type="success" style={{ fontSize: 14 }}>
                  <ArrowUpOutlined /> {mockSummary.revenueGrowth}%
                </Text>
              }
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Expenses"
              value={mockSummary.totalExpenses}
              precision={2}
              prefix="₱"
              suffix={
                <Text type="warning" style={{ fontSize: 14 }}>
                  <ArrowUpOutlined /> {mockSummary.expenseGrowth}%
                </Text>
              }
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Net Income"
              value={mockSummary.netIncome}
              precision={2}
              prefix="₱"
              suffix={
                <Text type="success" style={{ fontSize: 14 }}>
                  <ArrowUpOutlined /> {mockSummary.incomeGrowth}%
                </Text>
              }
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Cash on Hand"
              value={mockSummary.cashOnHand}
              precision={2}
              prefix="₱"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Financial Position */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={8}>
          <Card 
            title={<><WalletOutlined /> Accounts Receivable</>}
            extra={<Button type="link" size="small">View All</Button>}
          >
            <Statistic
              value={mockSummary.accountsReceivable}
              precision={2}
              prefix="₱"
              valueStyle={{ color: '#52c41a' }}
            />
            <Progress 
              percent={65} 
              strokeColor="#52c41a"
              format={() => '65% collected'}
              style={{ marginTop: 16 }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              15 outstanding invoices
            </Text>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title={<><CreditCardOutlined /> Accounts Payable</>}
            extra={<Button type="link" size="small">View All</Button>}
          >
            <Statistic
              value={mockSummary.accountsPayable}
              precision={2}
              prefix="₱"
              valueStyle={{ color: '#f5222d' }}
            />
            <Progress 
              percent={42} 
              strokeColor="#f5222d"
              format={() => '₱131K due this week'}
              style={{ marginTop: 16 }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              8 pending bills
            </Text>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title={<><PieChartOutlined /> Inventory Value</>}
            extra={<Button type="link" size="small">View All</Button>}
          >
            <Statistic
              value={mockSummary.inventory}
              precision={2}
              prefix="₱"
              valueStyle={{ color: '#1890ff' }}
            />
            <Progress 
              percent={78} 
              strokeColor="#1890ff"
              format={() => '78% turnover'}
              style={{ marginTop: 16 }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              2,450 SKUs in stock
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Bank Accounts & Recent Transactions */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card 
            title={<><BankOutlined /> Bank Accounts</>}
            extra={<Button type="link" size="small">Manage</Button>}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {mockBankAccounts.map(account => (
                <Card 
                  key={account.id} 
                  size="small" 
                  style={{ backgroundColor: '#fafafa' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Text strong>{account.bank}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {account.accountName} • {account.accountNumber}
                      </Text>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Text strong style={{ fontSize: 16 }}>
                        {formatCurrency(account.balance)}
                      </Text>
                      <br />
                      <Tag color={account.type === 'checking' ? 'blue' : 'green'}>
                        {account.type === 'checking' ? 'Checking' : 'Savings'}
                      </Tag>
                    </div>
                  </div>
                </Card>
              ))}
            </Space>
            <div style={{ marginTop: 16, textAlign: 'center', padding: 8, background: '#e6f7ff', borderRadius: 4 }}>
              <Text type="secondary">Total Balance: </Text>
              <Text strong style={{ color: '#1890ff' }}>
                {formatCurrency(mockBankAccounts.reduce((sum, a) => sum + a.balance, 0))}
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title={<><FileTextOutlined /> Recent Transactions</>}
            extra={<Button type="link" size="small">View All</Button>}
          >
            <Table
              columns={transactionColumns}
              dataSource={mockRecentTransactions}
              rowKey="id"
              size="small"
              pagination={false}
              scroll={{ y: 280 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Expense Breakdown & Revenue by Branch */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title={<><PieChartOutlined /> Expense Breakdown</>}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {mockExpenseBreakdown.map(item => (
                <div key={item.category}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text>{item.category}</Text>
                    <Text strong>{formatCurrency(item.amount)}</Text>
                  </div>
                  <Progress 
                    percent={item.percent} 
                    strokeColor={getCategoryColor(item.category)}
                    showInfo={false}
                  />
                </div>
              ))}
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={<><LineChartOutlined /> Revenue by Branch</>}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {mockRevenueByBranch.map(item => (
                <div 
                  key={item.branch} 
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 12px',
                    background: '#fafafa',
                    borderRadius: 4,
                  }}
                >
                  <div>
                    <Text strong>{item.branch}</Text>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Text strong>{formatCurrency(item.revenue)}</Text>
                    <br />
                    <Text 
                      type={item.growth >= 0 ? 'success' : 'danger'} 
                      style={{ fontSize: 12 }}
                    >
                      {item.growth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                      {' '}{Math.abs(item.growth)}%
                    </Text>
                  </div>
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FinanceOverview;
