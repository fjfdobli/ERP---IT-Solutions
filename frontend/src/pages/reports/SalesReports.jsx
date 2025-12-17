import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Select, Tag, 
  Typography, DatePicker, Statistic, Progress, Tooltip
} from 'antd';
import {
  ExportOutlined,
  PrinterOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  RiseOutlined,
  FallOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CalendarOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard } from '../../components/Common';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

// Mock sales report data
const mockSalesSummary = {
  totalSales: 2847562.50,
  salesGrowth: 12.5,
  totalOrders: 1256,
  ordersGrowth: 8.2,
  avgOrderValue: 2266.37,
  aovGrowth: 3.9,
  totalItems: 4532,
  itemsGrowth: 15.3,
  refunds: 45680.00,
  refundsPercent: 1.6,
};

const mockDailySales = [
  { date: '2024-01-15', sales: 125000, orders: 45, items: 156, avgOrder: 2778 },
  { date: '2024-01-14', sales: 112500, orders: 42, items: 138, avgOrder: 2679 },
  { date: '2024-01-13', sales: 98000, orders: 38, items: 121, avgOrder: 2579 },
  { date: '2024-01-12', sales: 145000, orders: 52, items: 178, avgOrder: 2788 },
  { date: '2024-01-11', sales: 132000, orders: 48, items: 162, avgOrder: 2750 },
  { date: '2024-01-10', sales: 89000, orders: 35, items: 112, avgOrder: 2543 },
  { date: '2024-01-09', sales: 156000, orders: 58, items: 195, avgOrder: 2690 },
];

const mockTopProducts = [
  { id: 1, name: 'Laptop Computer HP ProBook', sku: 'LP-HP-001', quantity: 125, revenue: 625000, growth: 15.2 },
  { id: 2, name: 'Wireless Mouse Logitech', sku: 'WM-LOG-001', quantity: 450, revenue: 247500, growth: 22.5 },
  { id: 3, name: 'USB-C Hub 7-in-1', sku: 'USB-HUB-7', quantity: 280, revenue: 196000, growth: 8.7 },
  { id: 4, name: 'Mechanical Keyboard RGB', sku: 'KB-MECH-01', quantity: 185, revenue: 185000, growth: -3.2 },
  { id: 5, name: '27" Monitor 4K', sku: 'MON-4K-27', quantity: 65, revenue: 162500, growth: 11.3 },
];

const mockSalesByCategory = [
  { category: 'Electronics', sales: 1250000, percent: 43.9, growth: 15.2 },
  { category: 'Computers', sales: 850000, percent: 29.8, growth: 8.5 },
  { category: 'Accessories', sales: 425000, percent: 14.9, growth: 22.1 },
  { category: 'Office Supplies', sales: 222562.50, percent: 7.8, growth: -2.5 },
  { category: 'Furniture', sales: 100000, percent: 3.5, growth: 5.8 },
];

const mockSalesByBranch = [
  { branch: 'Manila Main', sales: 850000, orders: 380, avgOrder: 2237 },
  { branch: 'Cebu', sales: 620000, orders: 290, avgOrder: 2138 },
  { branch: 'Davao', sales: 480000, orders: 215, avgOrder: 2233 },
  { branch: 'Makati', sales: 520000, orders: 225, avgOrder: 2311 },
  { branch: 'Quezon City', sales: 377562.50, orders: 146, avgOrder: 2586 },
];

const mockPaymentMethods = [
  { method: 'Cash', amount: 854269, percent: 30 },
  { method: 'Credit Card', amount: 711891, percent: 25 },
  { method: 'Bank Transfer', amount: 569513, percent: 20 },
  { method: 'GCash', amount: 427134, percent: 15 },
  { method: 'Maya', amount: 284756.50, percent: 10 },
];

const SalesReports = () => {
  const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs()]);
  const [selectedBranch, setSelectedBranch] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  const dailyColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('MMM D, YYYY'),
    },
    {
      title: 'Sales',
      dataIndex: 'sales',
      key: 'sales',
      align: 'right',
      render: (val) => formatCurrency(val),
    },
    {
      title: 'Orders',
      dataIndex: 'orders',
      key: 'orders',
      align: 'center',
    },
    {
      title: 'Items Sold',
      dataIndex: 'items',
      key: 'items',
      align: 'center',
    },
    {
      title: 'Avg Order',
      dataIndex: 'avgOrder',
      key: 'avgOrder',
      align: 'right',
      render: (val) => formatCurrency(val),
    },
  ];

  const topProductsColumns = [
    {
      title: 'Rank',
      key: 'rank',
      width: 60,
      align: 'center',
      render: (_, __, index) => (
        <Tag color={index < 3 ? 'gold' : 'default'}>{index + 1}</Tag>
      ),
    },
    {
      title: 'Product',
      key: 'product',
      render: (_, record) => (
        <div>
          <Text strong>{record.name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 11 }}>{record.sku}</Text>
        </div>
      ),
    },
    {
      title: 'Qty Sold',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      align: 'right',
      render: (val) => formatCurrency(val),
    },
    {
      title: 'Growth',
      dataIndex: 'growth',
      key: 'growth',
      align: 'center',
      render: (val) => (
        <Text type={val >= 0 ? 'success' : 'danger'}>
          {val >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          {' '}{Math.abs(val)}%
        </Text>
      ),
    },
  ];

  const getCategoryColor = (index) => {
    const colors = ['#1890ff', '#52c41a', '#faad14', '#722ed1', '#13c2c2'];
    return colors[index % colors.length];
  };

  return (
    <div>
      <PageHeader
        title="Sales Reports"
        subtitle={`${dateRange[0].format('MMM D')} - ${dateRange[1].format('MMM D, YYYY')}`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'Reports', path: '/reports' },
          { title: 'Sales', path: '/reports/sales' },
        ]}
        actions={[
          <RangePicker
            key="range"
            value={dateRange}
            onChange={setDateRange}
            allowClear={false}
          />,
          <Select
            key="branch"
            placeholder="All Branches"
            allowClear
            style={{ width: 150 }}
            value={selectedBranch}
            onChange={setSelectedBranch}
            options={mockSalesByBranch.map(b => ({ label: b.branch, value: b.branch }))}
          />,
          <Button key="print" icon={<PrinterOutlined />}>Print</Button>,
          <Button key="export" icon={<ExportOutlined />}>Export</Button>,
        ]}
      />

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={8} lg={4}>
          <Card size="small">
            <Statistic
              title="Total Sales"
              value={mockSalesSummary.totalSales}
              precision={2}
              prefix="₱"
              valueStyle={{ color: '#52c41a', fontSize: 18 }}
            />
            <Text type="success" style={{ fontSize: 12 }}>
              <ArrowUpOutlined /> {mockSalesSummary.salesGrowth}%
            </Text>
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card size="small">
            <Statistic
              title="Total Orders"
              value={mockSalesSummary.totalOrders}
              valueStyle={{ fontSize: 18 }}
            />
            <Text type="success" style={{ fontSize: 12 }}>
              <ArrowUpOutlined /> {mockSalesSummary.ordersGrowth}%
            </Text>
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card size="small">
            <Statistic
              title="Avg Order Value"
              value={mockSalesSummary.avgOrderValue}
              precision={2}
              prefix="₱"
              valueStyle={{ fontSize: 18 }}
            />
            <Text type="success" style={{ fontSize: 12 }}>
              <ArrowUpOutlined /> {mockSalesSummary.aovGrowth}%
            </Text>
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card size="small">
            <Statistic
              title="Items Sold"
              value={mockSalesSummary.totalItems}
              valueStyle={{ fontSize: 18 }}
            />
            <Text type="success" style={{ fontSize: 12 }}>
              <ArrowUpOutlined /> {mockSalesSummary.itemsGrowth}%
            </Text>
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card size="small">
            <Statistic
              title="Refunds"
              value={mockSalesSummary.refunds}
              precision={2}
              prefix="₱"
              valueStyle={{ color: '#f5222d', fontSize: 18 }}
            />
            <Text type="danger" style={{ fontSize: 12 }}>
              {mockSalesSummary.refundsPercent}% of sales
            </Text>
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card size="small">
            <Statistic
              title="Net Sales"
              value={mockSalesSummary.totalSales - mockSalesSummary.refunds}
              precision={2}
              prefix="₱"
              valueStyle={{ color: '#1890ff', fontSize: 18 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Sales by Category & Payment Methods */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title={<><PieChartOutlined /> Sales by Category</>} size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              {mockSalesByCategory.map((item, index) => (
                <div key={item.category}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Space>
                      <Text>{item.category}</Text>
                      <Text type={item.growth >= 0 ? 'success' : 'danger'} style={{ fontSize: 12 }}>
                        {item.growth >= 0 ? '+' : ''}{item.growth}%
                      </Text>
                    </Space>
                    <Text strong>{formatCurrency(item.sales)}</Text>
                  </div>
                  <Progress 
                    percent={item.percent} 
                    strokeColor={getCategoryColor(index)}
                    format={(p) => `${p}%`}
                  />
                </div>
              ))}
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={<><BarChartOutlined /> Payment Methods</>} size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              {mockPaymentMethods.map((item, index) => (
                <div key={item.method}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text>{item.method}</Text>
                    <Text strong>{formatCurrency(item.amount)}</Text>
                  </div>
                  <Progress 
                    percent={item.percent} 
                    strokeColor={getCategoryColor(index)}
                    format={(p) => `${p}%`}
                  />
                </div>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Sales by Branch */}
      <Card title={<><ShoppingCartOutlined /> Sales by Branch</>} size="small" style={{ marginBottom: 24 }}>
        <Table
          dataSource={mockSalesByBranch}
          rowKey="branch"
          pagination={false}
          size="small"
          columns={[
            {
              title: 'Branch',
              dataIndex: 'branch',
              key: 'branch',
              render: (branch) => <Text strong>{branch}</Text>,
            },
            {
              title: 'Sales',
              dataIndex: 'sales',
              key: 'sales',
              align: 'right',
              render: (val) => formatCurrency(val),
              sorter: (a, b) => a.sales - b.sales,
            },
            {
              title: 'Orders',
              dataIndex: 'orders',
              key: 'orders',
              align: 'center',
            },
            {
              title: 'Avg Order',
              dataIndex: 'avgOrder',
              key: 'avgOrder',
              align: 'right',
              render: (val) => formatCurrency(val),
            },
            {
              title: '% of Total',
              key: 'percent',
              align: 'center',
              render: (_, record) => {
                const percent = (record.sales / mockSalesSummary.totalSales * 100).toFixed(1);
                return <Progress type="circle" percent={parseFloat(percent)} size={40} />;
              },
            },
          ]}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell><Text strong>Total</Text></Table.Summary.Cell>
              <Table.Summary.Cell align="right">
                <Text strong>{formatCurrency(mockSalesByBranch.reduce((s, b) => s + b.sales, 0))}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell align="center">
                <Text strong>{mockSalesByBranch.reduce((s, b) => s + b.orders, 0)}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell align="right">
                <Text strong>{formatCurrency(mockSalesSummary.avgOrderValue)}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell />
            </Table.Summary.Row>
          )}
        />
      </Card>

      {/* Daily Sales & Top Products */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title={<><CalendarOutlined /> Daily Sales</>} size="small">
            <Table
              columns={dailyColumns}
              dataSource={mockDailySales}
              rowKey="date"
              pagination={false}
              size="small"
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell><Text strong>Total</Text></Table.Summary.Cell>
                  <Table.Summary.Cell align="right">
                    <Text strong>{formatCurrency(mockDailySales.reduce((s, d) => s + d.sales, 0))}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell align="center">
                    <Text strong>{mockDailySales.reduce((s, d) => s + d.orders, 0)}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell align="center">
                    <Text strong>{mockDailySales.reduce((s, d) => s + d.items, 0)}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell />
                </Table.Summary.Row>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={<><RiseOutlined /> Top Products</>} size="small">
            <Table
              columns={topProductsColumns}
              dataSource={mockTopProducts}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SalesReports;
