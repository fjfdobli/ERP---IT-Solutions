import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Select, Tag, 
  Typography, DatePicker, Statistic, Progress, Divider
} from 'antd';
import {
  ExportOutlined,
  PrinterOutlined,
  DollarOutlined,
  RiseOutlined,
  FallOutlined,
  BankOutlined,
  WalletOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  FileTextOutlined,
  PieChartOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard } from '../../components/Common';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

// Mock financial report data
const mockProfitLoss = {
  revenue: {
    sales: 2847562.50,
    otherIncome: 125000,
    total: 2972562.50,
  },
  costOfGoods: {
    inventory: 1450000,
    freight: 85000,
    total: 1535000,
  },
  grossProfit: 1437562.50,
  grossMargin: 48.4,
  operatingExpenses: {
    payroll: 650000,
    rent: 150000,
    utilities: 125000,
    marketing: 75000,
    depreciation: 45000,
    other: 68480,
    total: 1113480,
  },
  operatingIncome: 324082.50,
  otherExpenses: {
    interest: 25000,
    taxes: 75000,
    total: 100000,
  },
  netIncome: 224082.50,
  netMargin: 7.5,
};

const mockBalanceSheet = {
  assets: {
    current: {
      cash: 856420,
      accountsReceivable: 425680,
      inventory: 1250000,
      prepaidExpenses: 85000,
      total: 2617100,
    },
    fixed: {
      equipment: 450000,
      furniture: 125000,
      vehicles: 350000,
      lessDepreciation: -180000,
      total: 745000,
    },
    totalAssets: 3362100,
  },
  liabilities: {
    current: {
      accountsPayable: 312450,
      accruedExpenses: 125000,
      shortTermLoans: 200000,
      total: 637450,
    },
    longTerm: {
      bankLoans: 500000,
      total: 500000,
    },
    totalLiabilities: 1137450,
  },
  equity: {
    capital: 2000000,
    retainedEarnings: 224650,
    total: 2224650,
  },
};

const mockCashFlow = {
  operating: {
    netIncome: 224082.50,
    adjustments: 45000,
    receivablesChange: -50000,
    payablesChange: 25000,
    inventoryChange: -125000,
    total: 119082.50,
  },
  investing: {
    equipmentPurchase: -85000,
    assetSale: 15000,
    total: -70000,
  },
  financing: {
    loanPayment: -50000,
    capitalContribution: 100000,
    dividends: 0,
    total: 50000,
  },
  netChange: 99082.50,
  beginningCash: 757337.50,
  endingCash: 856420,
};

const mockExpenseBreakdown = [
  { category: 'Payroll', amount: 650000, percent: 58.4, budget: 700000 },
  { category: 'Rent', amount: 150000, percent: 13.5, budget: 150000 },
  { category: 'Utilities', amount: 125000, percent: 11.2, budget: 120000 },
  { category: 'Marketing', amount: 75000, percent: 6.7, budget: 100000 },
  { category: 'Depreciation', amount: 45000, percent: 4.0, budget: 45000 },
  { category: 'Other', amount: 68480, percent: 6.2, budget: 85000 },
];

// Monthly trend data - ready for chart visualization
const MONTHLY_TREND = [
  { month: 'Oct 2023', revenue: 2450000, expenses: 2100000, profit: 350000 },
  { month: 'Nov 2023', revenue: 2680000, expenses: 2200000, profit: 480000 },
  { month: 'Dec 2023', revenue: 3150000, expenses: 2450000, profit: 700000 },
  { month: 'Jan 2024', revenue: 2972562.50, expenses: 2748480, profit: 224082.50 },
];

const mockKeyRatios = [
  { name: 'Current Ratio', value: 4.11, benchmark: 2.0, status: 'good' },
  { name: 'Quick Ratio', value: 2.01, benchmark: 1.0, status: 'good' },
  { name: 'Debt to Equity', value: 0.51, benchmark: 1.0, status: 'good' },
  { name: 'Return on Assets', value: 6.7, benchmark: 5.0, status: 'good', suffix: '%' },
  { name: 'Return on Equity', value: 10.1, benchmark: 8.0, status: 'good', suffix: '%' },
  { name: 'Gross Margin', value: 48.4, benchmark: 40.0, status: 'good', suffix: '%' },
  { name: 'Net Margin', value: 7.5, benchmark: 10.0, status: 'warning', suffix: '%' },
  { name: 'Inventory Turnover', value: 4.2, benchmark: 4.0, status: 'good', suffix: 'x' },
];

const FinancialReports = () => {
  const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs()]);
  const [reportType, setReportType] = useState('profit_loss');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  return (
    <div>
      <PageHeader
        title="Financial Reports"
        subtitle={`${dateRange[0].format('MMM D')} - ${dateRange[1].format('MMM D, YYYY')}`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'Reports', path: '/reports' },
          { title: 'Financial', path: '/reports/financial' },
        ]}
        actions={[
          <RangePicker
            key="range"
            value={dateRange}
            onChange={setDateRange}
            allowClear={false}
          />,
          <Select
            key="type"
            value={reportType}
            onChange={setReportType}
            style={{ width: 180 }}
            options={[
              { label: 'Profit & Loss', value: 'profit_loss' },
              { label: 'Balance Sheet', value: 'balance_sheet' },
              { label: 'Cash Flow', value: 'cash_flow' },
            ]}
          />,
          <Button key="print" icon={<PrinterOutlined />}>Print</Button>,
          <Button key="export" icon={<ExportOutlined />}>Export</Button>,
        ]}
      />

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={mockProfitLoss.revenue.total}
              precision={2}
              prefix="₱"
              valueStyle={{ color: '#52c41a' }}
            />
            <Text type="success" style={{ fontSize: 12 }}>
              <ArrowUpOutlined /> 12.5% from last month
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Gross Profit"
              value={mockProfitLoss.grossProfit}
              precision={2}
              prefix="₱"
              valueStyle={{ color: '#1890ff' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {mockProfitLoss.grossMargin}% margin
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Operating Income"
              value={mockProfitLoss.operatingIncome}
              precision={2}
              prefix="₱"
              valueStyle={{ color: '#722ed1' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              10.9% operating margin
            </Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Net Income"
              value={mockProfitLoss.netIncome}
              precision={2}
              prefix="₱"
              valueStyle={{ color: mockProfitLoss.netIncome >= 0 ? '#52c41a' : '#f5222d' }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {mockProfitLoss.netMargin}% net margin
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Profit & Loss Statement */}
      <Card 
        title={<><FileTextOutlined /> Profit & Loss Statement</>} 
        size="small" 
        style={{ marginBottom: 24 }}
      >
        <Row gutter={[24, 0]}>
          <Col xs={24} lg={16}>
            <Table
              dataSource={[
                { key: 'revenue_header', item: 'Revenue', amount: null, isHeader: true },
                { key: 'sales', item: 'Sales Revenue', amount: mockProfitLoss.revenue.sales, indent: 1 },
                { key: 'other_income', item: 'Other Income', amount: mockProfitLoss.revenue.otherIncome, indent: 1 },
                { key: 'total_revenue', item: 'Total Revenue', amount: mockProfitLoss.revenue.total, isTotal: true },
                { key: 'cogs_header', item: 'Cost of Goods Sold', amount: null, isHeader: true },
                { key: 'cogs_inventory', item: 'Inventory Cost', amount: mockProfitLoss.costOfGoods.inventory, indent: 1 },
                { key: 'cogs_freight', item: 'Freight & Shipping', amount: mockProfitLoss.costOfGoods.freight, indent: 1 },
                { key: 'total_cogs', item: 'Total COGS', amount: mockProfitLoss.costOfGoods.total, isTotal: true, negative: true },
                { key: 'gross_profit', item: 'Gross Profit', amount: mockProfitLoss.grossProfit, isTotal: true, highlight: true },
                { key: 'opex_header', item: 'Operating Expenses', amount: null, isHeader: true },
                { key: 'opex_payroll', item: 'Payroll', amount: mockProfitLoss.operatingExpenses.payroll, indent: 1 },
                { key: 'opex_rent', item: 'Rent', amount: mockProfitLoss.operatingExpenses.rent, indent: 1 },
                { key: 'opex_utilities', item: 'Utilities', amount: mockProfitLoss.operatingExpenses.utilities, indent: 1 },
                { key: 'opex_marketing', item: 'Marketing', amount: mockProfitLoss.operatingExpenses.marketing, indent: 1 },
                { key: 'opex_depreciation', item: 'Depreciation', amount: mockProfitLoss.operatingExpenses.depreciation, indent: 1 },
                { key: 'opex_other', item: 'Other Expenses', amount: mockProfitLoss.operatingExpenses.other, indent: 1 },
                { key: 'total_opex', item: 'Total Operating Expenses', amount: mockProfitLoss.operatingExpenses.total, isTotal: true, negative: true },
                { key: 'operating_income', item: 'Operating Income', amount: mockProfitLoss.operatingIncome, isTotal: true, highlight: true },
                { key: 'other_exp_header', item: 'Other Expenses', amount: null, isHeader: true },
                { key: 'interest', item: 'Interest Expense', amount: mockProfitLoss.otherExpenses.interest, indent: 1 },
                { key: 'taxes', item: 'Income Tax', amount: mockProfitLoss.otherExpenses.taxes, indent: 1 },
                { key: 'net_income', item: 'Net Income', amount: mockProfitLoss.netIncome, isTotal: true, highlight: true, final: true },
              ]}
              pagination={false}
              size="small"
              showHeader={false}
              columns={[
                {
                  dataIndex: 'item',
                  key: 'item',
                  render: (text, record) => (
                    <Text 
                      strong={record.isHeader || record.isTotal}
                      style={{ 
                        paddingLeft: record.indent ? 24 : 0,
                        fontSize: record.final ? 16 : 14,
                      }}
                    >
                      {text}
                    </Text>
                  ),
                },
                {
                  dataIndex: 'amount',
                  key: 'amount',
                  align: 'right',
                  render: (amount, record) => {
                    if (amount === null) return null;
                    return (
                      <Text 
                        strong={record.isTotal}
                        type={record.highlight && !record.negative ? 'success' : record.negative ? 'danger' : undefined}
                        style={{ fontSize: record.final ? 16 : 14 }}
                      >
                        {record.negative ? '(' : ''}{formatCurrency(amount)}{record.negative ? ')' : ''}
                      </Text>
                    );
                  },
                },
              ]}
              rowClassName={(record) => record.highlight ? 'highlight-row' : ''}
            />
          </Col>
          <Col xs={24} lg={8}>
            <Card size="small" title="Expense Breakdown" style={{ height: '100%' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                {mockExpenseBreakdown.map((item) => (
                  <div key={item.category}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text>{item.category}</Text>
                      <Text strong>{formatCurrency(item.amount)}</Text>
                    </div>
                    <Progress 
                      percent={(item.amount / item.budget) * 100}
                      strokeColor={item.amount > item.budget ? '#f5222d' : '#52c41a'}
                      format={(p) => `${p.toFixed(0)}% of budget`}
                      size="small"
                    />
                  </div>
                ))}
              </Space>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Key Financial Ratios */}
      <Card title={<><LineChartOutlined /> Key Financial Ratios</>} size="small" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          {mockKeyRatios.map((ratio) => (
            <Col xs={12} sm={8} md={6} lg={3} key={ratio.name}>
              <Card size="small" style={{ textAlign: 'center' }}>
                <Text type="secondary" style={{ fontSize: 11 }}>{ratio.name}</Text>
                <Title level={4} style={{ margin: '8px 0', color: ratio.status === 'good' ? '#52c41a' : '#faad14' }}>
                  {ratio.value}{ratio.suffix || ''}
                </Title>
                <Text type="secondary" style={{ fontSize: 10 }}>
                  Target: {ratio.benchmark}{ratio.suffix || ''}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* Balance Sheet Summary & Cash Position */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title={<><BankOutlined /> Balance Sheet Summary</>} size="small">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div>
                <Text strong>Total Assets</Text>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Progress 
                    percent={100} 
                    strokeColor="#1890ff"
                    showInfo={false}
                    style={{ flex: 1, marginRight: 16 }}
                  />
                  <Text strong>{formatCurrency(mockBalanceSheet.assets.totalAssets)}</Text>
                </div>
              </div>
              <div>
                <Text type="secondary">Current Assets</Text>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Progress 
                    percent={(mockBalanceSheet.assets.current.total / mockBalanceSheet.assets.totalAssets) * 100} 
                    strokeColor="#52c41a"
                    showInfo={false}
                    style={{ flex: 1, marginRight: 16 }}
                  />
                  <Text>{formatCurrency(mockBalanceSheet.assets.current.total)}</Text>
                </div>
              </div>
              <div>
                <Text type="secondary">Fixed Assets</Text>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Progress 
                    percent={(mockBalanceSheet.assets.fixed.total / mockBalanceSheet.assets.totalAssets) * 100} 
                    strokeColor="#722ed1"
                    showInfo={false}
                    style={{ flex: 1, marginRight: 16 }}
                  />
                  <Text>{formatCurrency(mockBalanceSheet.assets.fixed.total)}</Text>
                </div>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <div>
                <Text strong>Total Liabilities</Text>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Progress 
                    percent={(mockBalanceSheet.liabilities.totalLiabilities / mockBalanceSheet.assets.totalAssets) * 100} 
                    strokeColor="#f5222d"
                    showInfo={false}
                    style={{ flex: 1, marginRight: 16 }}
                  />
                  <Text type="danger">{formatCurrency(mockBalanceSheet.liabilities.totalLiabilities)}</Text>
                </div>
              </div>
              <div>
                <Text strong>Total Equity</Text>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Progress 
                    percent={(mockBalanceSheet.equity.total / mockBalanceSheet.assets.totalAssets) * 100} 
                    strokeColor="#52c41a"
                    showInfo={false}
                    style={{ flex: 1, marginRight: 16 }}
                  />
                  <Text type="success">{formatCurrency(mockBalanceSheet.equity.total)}</Text>
                </div>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={<><WalletOutlined /> Cash Flow Summary</>} size="small">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Card size="small" style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Operating Activities</Text>
                  <Text strong type="success">{formatCurrency(mockCashFlow.operating.total)}</Text>
                </div>
              </Card>
              <Card size="small" style={{ background: '#fff2f0', borderColor: '#ffccc7' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Investing Activities</Text>
                  <Text strong type="danger">{formatCurrency(mockCashFlow.investing.total)}</Text>
                </div>
              </Card>
              <Card size="small" style={{ background: '#e6f7ff', borderColor: '#91d5ff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Financing Activities</Text>
                  <Text strong type={mockCashFlow.financing.total >= 0 ? 'success' : 'danger'}>
                    {formatCurrency(mockCashFlow.financing.total)}
                  </Text>
                </div>
              </Card>
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Net Cash Change</Text>
                <Text strong type={mockCashFlow.netChange >= 0 ? 'success' : 'danger'}>
                  {mockCashFlow.netChange >= 0 ? '+' : ''}{formatCurrency(mockCashFlow.netChange)}
                </Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Beginning Cash</Text>
                <Text>{formatCurrency(mockCashFlow.beginningCash)}</Text>
              </div>
              <Card size="small" style={{ background: '#f0f5ff', borderColor: '#adc6ff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong>Ending Cash Balance</Text>
                  <Text strong style={{ color: '#1890ff', fontSize: 18 }}>
                    {formatCurrency(mockCashFlow.endingCash)}
                  </Text>
                </div>
              </Card>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FinancialReports;
