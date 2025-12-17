import { useState, useEffect } from 'react';
import { 
  Row, Col, Card, Typography, Progress, Tag, List, Avatar, 
  Table, Button, Space, DatePicker, Select, Tooltip, Badge, Divider,
  Skeleton, Empty, Alert
} from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  UserOutlined,
  InboxOutlined,
  ShopOutlined,
  BankOutlined,
  FileTextOutlined,
  TeamOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  EyeOutlined,
  PlusOutlined,
  ReloadOutlined,
  CalendarOutlined,
  RiseOutlined,
  FallOutlined,
  TrophyOutlined,
  BellOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { StatCard } from '../components/Common';

dayjs.extend(relativeTime);

const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

// ============ MOCK DATA - Replace with API calls ============
const dashboardStats = {
  todaySales: { value: 45678.90, change: 12.5, trend: 'up' },
  todayOrders: { value: 156, change: 8.2, trend: 'up' },
  todayCustomers: { value: 42, change: -3.1, trend: 'down' },
  lowStockItems: { value: 23, change: 5, trend: 'up', warning: true },
  pendingOrders: { value: 34, change: -15.2, trend: 'down' },
  totalRevenue: { value: 1254890.50, change: 18.7, trend: 'up' },
  avgOrderValue: { value: 285.50, change: 4.2, trend: 'up' },
  returnRate: { value: 2.3, change: -0.5, trend: 'down' },
};

const recentTransactions = [
  { 
    id: 'TXN-2024-001', 
    type: 'sale', 
    customer: 'John Doe', 
    amount: 1250.00, 
    status: 'completed', 
    payment: 'Cash',
    branch: 'Main Branch',
    items: 5,
    date: '2024-01-15T10:30:00' 
  },
  { 
    id: 'TXN-2024-002', 
    type: 'sale', 
    customer: 'Jane Smith', 
    amount: 890.50, 
    status: 'pending', 
    payment: 'Credit Card',
    branch: 'Downtown Store',
    items: 3,
    date: '2024-01-15T09:45:00' 
  },
  { 
    id: 'TXN-2024-003', 
    type: 'return', 
    customer: 'Bob Wilson', 
    amount: -210.00, 
    status: 'completed', 
    payment: 'Refund',
    branch: 'Main Branch',
    items: 1,
    date: '2024-01-15T09:15:00' 
  },
  { 
    id: 'TXN-2024-004', 
    type: 'sale', 
    customer: 'Alice Brown', 
    amount: 3450.00, 
    status: 'processing', 
    payment: 'Bank Transfer',
    branch: 'Warehouse Outlet',
    items: 12,
    date: '2024-01-14T16:20:00' 
  },
  { 
    id: 'TXN-2024-005', 
    type: 'sale', 
    customer: 'Charlie Davis', 
    amount: 567.25, 
    status: 'completed', 
    payment: 'Cash',
    branch: 'Main Branch',
    items: 2,
    date: '2024-01-14T14:10:00' 
  },
];

const branchPerformance = [
  { name: 'Main Branch', sales: 125000, target: 150000, orders: 450, growth: 12.5 },
  { name: 'Downtown Store', sales: 98000, target: 100000, orders: 380, growth: 8.2 },
  { name: 'Warehouse Outlet', sales: 75000, target: 80000, orders: 290, growth: -2.1 },
  { name: 'Mall Kiosk', sales: 45000, target: 50000, orders: 180, growth: 15.8 },
];

const topProducts = [
  { rank: 1, name: 'iPhone 15 Pro Max', sku: 'APL-IP15PM', sales: 245, revenue: 367500, stock: 45, category: 'Electronics' },
  { rank: 2, name: 'Samsung Galaxy S24', sku: 'SAM-GS24', sales: 198, revenue: 178200, stock: 67, category: 'Electronics' },
  { rank: 3, name: 'MacBook Pro M3', sku: 'APL-MBP-M3', sales: 89, revenue: 222500, stock: 12, category: 'Computers' },
  { rank: 4, name: 'Sony WH-1000XM5', sku: 'SNY-WH5', sales: 167, revenue: 58450, stock: 89, category: 'Audio' },
  { rank: 5, name: 'iPad Air M2', sku: 'APL-IPA-M2', sales: 132, revenue: 105600, stock: 34, category: 'Tablets' },
];

const pendingTasks = [
  { id: 1, title: 'Approve Purchase Order #PO-2024-089', priority: 'high', type: 'purchase', due: '2024-01-15' },
  { id: 2, title: 'Review Stock Transfer Request', priority: 'medium', type: 'inventory', due: '2024-01-16' },
  { id: 3, title: 'Process Customer Refund #REF-001', priority: 'high', type: 'refund', due: '2024-01-15' },
  { id: 4, title: 'Complete Monthly Inventory Count', priority: 'low', type: 'inventory', due: '2024-01-20' },
  { id: 5, title: 'Verify Supplier Invoice #INV-5567', priority: 'medium', type: 'finance', due: '2024-01-17' },
];

const lowStockAlerts = [
  { id: 1, name: 'iPhone 15 Pro (256GB)', sku: 'APL-IP15-256', current: 5, minimum: 20, branch: 'Main Branch' },
  { id: 2, name: 'AirPods Pro 2', sku: 'APL-APP2', current: 3, minimum: 15, branch: 'Downtown Store' },
  { id: 3, name: 'USB-C Cables', sku: 'ACC-USBC', current: 8, minimum: 50, branch: 'All Branches' },
  { id: 4, name: 'MacBook Charger 96W', sku: 'APL-CHG96', current: 2, minimum: 10, branch: 'Warehouse' },
];

const recentActivities = [
  { id: 1, type: 'sale', title: 'New sale completed', description: 'Order #ORD-2024-156 - $1,250.00', time: '2 minutes ago', user: 'John Cashier' },
  { id: 2, type: 'inventory', title: 'Stock received', description: '50 units of iPhone 15 Pro added', time: '15 minutes ago', user: 'Warehouse Staff' },
  { id: 3, type: 'payment', title: 'Payment received', description: 'Invoice #INV-889 paid - $3,450.00', time: '1 hour ago', user: 'Accounting' },
  { id: 4, type: 'user', title: 'New user registered', description: 'Sarah Manager joined as Branch Manager', time: '2 hours ago', user: 'Admin' },
  { id: 5, type: 'alert', title: 'Low stock alert', description: 'AirPods Pro 2 below minimum level', time: '3 hours ago', user: 'System' },
  { id: 6, type: 'order', title: 'Purchase order approved', description: 'PO-2024-088 approved for $12,500', time: '4 hours ago', user: 'Manager' },
];

const QuickActionButton = ({ icon, title, description, onClick, color = '#1890ff' }) => (
  <Card 
    hoverable 
    style={{ textAlign: 'center', height: '100%', cursor: 'pointer' }}
    onClick={onClick}
    bodyStyle={{ padding: '20px 12px' }}
  >
    <div style={{ 
      width: 48, 
      height: 48, 
      borderRadius: '50%', 
      background: `${color}15`, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      margin: '0 auto 12px'
    }}>
      {icon}
    </div>
    <Text strong style={{ display: 'block', marginBottom: 4 }}>{title}</Text>
    <Text type="secondary" style={{ fontSize: 12 }}>{description}</Text>
  </Card>
);

const PriorityTag = ({ priority }) => {
  const colors = { high: 'red', medium: 'orange', low: 'blue' };
  return <Tag color={colors[priority]}>{priority.toUpperCase()}</Tag>;
};

const TransactionStatusTag = ({ status }) => {
  const config = {
    completed: { color: 'success', icon: <CheckCircleOutlined /> },
    pending: { color: 'warning', icon: <ClockCircleOutlined /> },
    processing: { color: 'processing', icon: <SyncOutlined spin /> },
    cancelled: { color: 'error', icon: <WarningOutlined /> },
  };
  const { color, icon } = config[status] || config.pending;
  return (
    <Tag color={color} icon={icon}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Tag>
  );
};

const ActivityIcon = ({ type }) => {
  const config = {
    sale: { bg: '#1890ff', icon: <ShoppingCartOutlined /> },
    order: { bg: '#1890ff', icon: <FileTextOutlined /> },
    inventory: { bg: '#faad14', icon: <InboxOutlined /> },
    payment: { bg: '#52c41a', icon: <DollarOutlined /> },
    user: { bg: '#722ed1', icon: <UserOutlined /> },
    alert: { bg: '#ff4d4f', icon: <WarningOutlined /> },
  };
  const { bg, icon } = config[type] || config.order;
  return (
    <Avatar style={{ backgroundColor: bg }} icon={icon} />
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState([dayjs().subtract(30, 'day'), dayjs()]);
  const [selectedBranch, setSelectedBranch] = useState('all');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const transactionColumns = [
    {
      title: 'Transaction ID',
      dataIndex: 'id',
      key: 'id',
      render: (id, record) => (
        <Space>
          <Text strong style={{ color: record.type === 'return' ? '#ff4d4f' : '#1890ff' }}>
            {id}
          </Text>
          {record.type === 'return' && <Tag color="red">Return</Tag>}
        </Space>
      ),
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      render: (customer) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          {customer}
        </Space>
      ),
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
      key: 'branch',
      render: (branch) => <Tag icon={<ShopOutlined />}>{branch}</Tag>,
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      align: 'center',
      render: (items) => <Badge count={items} style={{ backgroundColor: '#1890ff' }} />,
    },
    {
      title: 'Payment',
      dataIndex: 'payment',
      key: 'payment',
      render: (payment) => <Text type="secondary">{payment}</Text>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (amount) => (
        <Text strong style={{ color: amount < 0 ? '#ff4d4f' : '#52c41a' }}>
          {amount < 0 ? '-' : ''}${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <TransactionStatusTag status={status} />,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => (
        <Tooltip title={dayjs(date).format('MMMM D, YYYY h:mm A')}>
          <Text type="secondary">{dayjs(date).fromNow()}</Text>
        </Tooltip>
      ),
    },
    {
      title: '',
      key: 'action',
      width: 50,
      render: () => (
        <Tooltip title="View Details">
          <Button type="text" icon={<EyeOutlined />} size="small" />
        </Tooltip>
      ),
    },
  ];

  // Top products table columns
  const topProductColumns = [
    {
      title: '#',
      dataIndex: 'rank',
      key: 'rank',
      width: 50,
      render: (rank) => (
        <Badge 
          count={rank} 
          style={{ 
            backgroundColor: rank <= 3 ? '#faad14' : '#d9d9d9',
            color: rank <= 3 ? '#fff' : '#666'
          }} 
        />
      ),
    },
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div>
          <Text strong>{name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>{record.sku}</Text>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag>{category}</Tag>,
    },
    {
      title: 'Units Sold',
      dataIndex: 'sales',
      key: 'sales',
      align: 'right',
      sorter: (a, b) => a.sales - b.sales,
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      align: 'right',
      render: (revenue) => (
        <Text strong style={{ color: '#52c41a' }}>
          ${revenue.toLocaleString()}
        </Text>
      ),
      sorter: (a, b) => a.revenue - b.revenue,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      align: 'right',
      render: (stock) => (
        <Text style={{ color: stock < 20 ? '#ff4d4f' : stock < 50 ? '#faad14' : '#52c41a' }}>
          {stock}
        </Text>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <Skeleton active paragraph={{ rows: 1 }} />
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          {[1, 2, 3, 4].map((i) => (
            <Col xs={24} sm={12} lg={6} key={i}>
              <Card><Skeleton active paragraph={{ rows: 2 }} /></Card>
            </Col>
          ))}
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card><Skeleton active paragraph={{ rows: 8 }} /></Card>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 0 24px 0' }}>
      {/* Header Section */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Welcome back! 👋
          </Title>
          <Text type="secondary">
            Here's what's happening with your business today
          </Text>
        </div>
        <Space wrap>
          <Select
            value={selectedBranch}
            onChange={setSelectedBranch}
            style={{ width: 160 }}
            options={[
              { value: 'all', label: 'All Branches' },
              { value: 'main', label: 'Main Branch' },
              { value: 'downtown', label: 'Downtown Store' },
              { value: 'warehouse', label: 'Warehouse Outlet' },
            ]}
          />
          <RangePicker 
            value={dateRange}
            onChange={setDateRange}
            presets={[
              { label: 'Today', value: [dayjs(), dayjs()] },
              { label: 'This Week', value: [dayjs().startOf('week'), dayjs()] },
              { label: 'This Month', value: [dayjs().startOf('month'), dayjs()] },
              { label: 'Last 30 Days', value: [dayjs().subtract(30, 'day'), dayjs()] },
            ]}
          />
          <Tooltip title="Refresh Dashboard">
            <Button icon={<ReloadOutlined />} onClick={handleRefresh} />
          </Tooltip>
        </Space>
      </div>

      {/* Alert Banner */}
      {dashboardStats.lowStockItems.value > 20 && (
        <Alert
          message="Low Stock Warning"
          description={`${dashboardStats.lowStockItems.value} products are below minimum stock levels. Review and reorder to avoid stockouts.`}
          type="warning"
          showIcon
          closable
          style={{ marginBottom: 24 }}
          action={
            <Button size="small" type="primary" onClick={() => navigate('/inventory/stock')}>
              View Stock
            </Button>
          }
        />
      )}

      {/* KPI Stats Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Today's Sales"
            value={dashboardStats.todaySales.value}
            prefix="$"
            trend={dashboardStats.todaySales.trend}
            trendValue={dashboardStats.todaySales.change}
            icon={<DollarOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Today's Orders"
            value={dashboardStats.todayOrders.value}
            trend={dashboardStats.todayOrders.trend}
            trendValue={dashboardStats.todayOrders.change}
            icon={<ShoppingCartOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="New Customers"
            value={dashboardStats.todayCustomers.value}
            trend={dashboardStats.todayCustomers.trend}
            trendValue={dashboardStats.todayCustomers.change}
            icon={<TeamOutlined style={{ fontSize: 24, color: '#722ed1' }} />}
            color="#722ed1"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Low Stock Items"
            value={dashboardStats.lowStockItems.value}
            trend="up"
            trendValue={dashboardStats.lowStockItems.change}
            icon={<WarningOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />}
            color="#ff4d4f"
            warning={true}
          />
        </Col>
      </Row>

      {/* Secondary Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Pending Orders"
            value={dashboardStats.pendingOrders.value}
            trend={dashboardStats.pendingOrders.trend}
            trendValue={dashboardStats.pendingOrders.change}
            icon={<ClockCircleOutlined style={{ fontSize: 24, color: '#faad14' }} />}
            color="#faad14"
            size="small"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Monthly Revenue"
            value={dashboardStats.totalRevenue.value}
            prefix="$"
            trend={dashboardStats.totalRevenue.trend}
            trendValue={dashboardStats.totalRevenue.change}
            icon={<RiseOutlined style={{ fontSize: 24, color: '#13c2c2' }} />}
            color="#13c2c2"
            size="small"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Avg. Order Value"
            value={dashboardStats.avgOrderValue.value}
            prefix="$"
            trend={dashboardStats.avgOrderValue.trend}
            trendValue={dashboardStats.avgOrderValue.change}
            icon={<BankOutlined style={{ fontSize: 24, color: '#eb2f96' }} />}
            color="#eb2f96"
            size="small"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Return Rate"
            value={dashboardStats.returnRate.value}
            suffix="%"
            trend={dashboardStats.returnRate.trend}
            trendValue={dashboardStats.returnRate.change}
            trendInverted={true}
            icon={<FallOutlined style={{ fontSize: 24, color: '#fa8c16' }} />}
            color="#fa8c16"
            size="small"
          />
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card 
        title={<Space><TrophyOutlined /> Quick Actions</Space>}
        style={{ marginBottom: 24 }}
        bodyStyle={{ padding: 16 }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={8} md={6} lg={4}>
            <QuickActionButton
              icon={<PlusOutlined style={{ fontSize: 20, color: '#1890ff' }} />}
              title="New Sale"
              description="Create transaction"
              onClick={() => navigate('/sales/pos')}
              color="#1890ff"
            />
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <QuickActionButton
              icon={<InboxOutlined style={{ fontSize: 20, color: '#52c41a' }} />}
              title="Add Product"
              description="New inventory item"
              onClick={() => navigate('/products')}
              color="#52c41a"
            />
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <QuickActionButton
              icon={<FileTextOutlined style={{ fontSize: 20, color: '#722ed1' }} />}
              title="Purchase Order"
              description="Create new PO"
              onClick={() => navigate('/purchasing/orders')}
              color="#722ed1"
            />
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <QuickActionButton
              icon={<UserOutlined style={{ fontSize: 20, color: '#eb2f96' }} />}
              title="Add Customer"
              description="New customer profile"
              onClick={() => navigate('/customers')}
              color="#eb2f96"
            />
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <QuickActionButton
              icon={<BankOutlined style={{ fontSize: 20, color: '#fa8c16' }} />}
              title="Record Payment"
              description="Add payment entry"
              onClick={() => navigate('/cash-management')}
              color="#fa8c16"
            />
          </Col>
          <Col xs={12} sm={8} md={6} lg={4}>
            <QuickActionButton
              icon={<FileTextOutlined style={{ fontSize: 20, color: '#13c2c2' }} />}
              title="View Reports"
              description="Sales & analytics"
              onClick={() => navigate('/reports')}
              color="#13c2c2"
            />
          </Col>
        </Row>
      </Card>

      {/* Recent Transactions */}
      <Card 
        title={<Space><ShoppingCartOutlined /> Recent Transactions</Space>}
        extra={
          <Button type="link" onClick={() => navigate('/sales/transactions')}>
            View All Transactions
          </Button>
        }
        style={{ marginBottom: 24 }}
      >
        <Table
          columns={transactionColumns}
          dataSource={recentTransactions}
          rowKey="id"
          pagination={false}
          size="middle"
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Two Column Section */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Branch Performance */}
        <Col xs={24} lg={12}>
          <Card 
            title={<Space><ShopOutlined /> Branch Performance</Space>}
            extra={<Button type="link" onClick={() => navigate('/reports/branch')}>Details</Button>}
            bodyStyle={{ padding: '12px 24px' }}
          >
            {branchPerformance.map((branch, index) => (
              <div key={branch.name} style={{ marginBottom: index < branchPerformance.length - 1 ? 20 : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <div>
                    <Text strong>{branch.name}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {branch.orders} orders • ${branch.sales.toLocaleString()} / ${branch.target.toLocaleString()}
                    </Text>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Text 
                      style={{ 
                        color: branch.growth >= 0 ? '#52c41a' : '#ff4d4f',
                        fontWeight: 500
                      }}
                    >
                      {branch.growth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                      {' '}{Math.abs(branch.growth)}%
                    </Text>
                  </div>
                </div>
                <Progress 
                  percent={Math.round((branch.sales / branch.target) * 100)} 
                  strokeColor={
                    branch.sales >= branch.target ? '#52c41a' : 
                    branch.sales >= branch.target * 0.8 ? '#1890ff' : '#faad14'
                  }
                  size="small"
                />
              </div>
            ))}
          </Card>
        </Col>

        {/* Top Products */}
        <Col xs={24} lg={12}>
          <Card 
            title={<Space><TrophyOutlined /> Top Selling Products</Space>}
            extra={<Button type="link" onClick={() => navigate('/reports/products')}>Full Report</Button>}
          >
            <Table
              columns={topProductColumns}
              dataSource={topProducts}
              rowKey="sku"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>

      {/* Three Column Section */}
      <Row gutter={[16, 16]}>
        {/* Pending Tasks */}
        <Col xs={24} md={12} lg={8}>
          <Card 
            title={<Space><ClockCircleOutlined /> Pending Tasks</Space>}
            extra={<Badge count={pendingTasks.length} style={{ backgroundColor: '#ff4d4f' }} />}
            bodyStyle={{ padding: 0 }}
          >
            <List
              itemLayout="horizontal"
              dataSource={pendingTasks}
              renderItem={(item) => (
                <List.Item 
                  style={{ padding: '12px 24px' }}
                  actions={[<PriorityTag priority={item.priority} key="priority" />]}
                >
                  <List.Item.Meta
                    title={
                      <Text style={{ fontSize: 13 }}>{item.title}</Text>
                    }
                    description={
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        <CalendarOutlined /> Due: {dayjs(item.due).format('MMM D, YYYY')}
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Low Stock Alerts */}
        <Col xs={24} md={12} lg={8}>
          <Card 
            title={<Space><WarningOutlined style={{ color: '#ff4d4f' }} /> Low Stock Alerts</Space>}
            extra={
              <Button type="primary" danger size="small" onClick={() => navigate('/inventory/stock')}>
                View All
              </Button>
            }
            bodyStyle={{ padding: 0 }}
          >
            <List
              itemLayout="horizontal"
              dataSource={lowStockAlerts}
              renderItem={(item) => (
                <List.Item style={{ padding: '12px 24px' }}>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        style={{ backgroundColor: '#fff1f0', color: '#ff4d4f' }}
                        icon={<InboxOutlined />}
                      />
                    }
                    title={<Text style={{ fontSize: 13 }}>{item.name}</Text>}
                    description={
                      <Space direction="vertical" size={0}>
                        <Text type="secondary" style={{ fontSize: 12 }}>SKU: {item.sku}</Text>
                        <Text type="danger" style={{ fontSize: 12 }}>
                          {item.current} left (Min: {item.minimum})
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Recent Activity */}
        <Col xs={24} lg={8}>
          <Card 
            title={<Space><BellOutlined /> Recent Activity</Space>}
            bodyStyle={{ padding: 0, maxHeight: 400, overflow: 'auto' }}
          >
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item style={{ padding: '12px 24px' }}>
                  <List.Item.Meta
                    avatar={<ActivityIcon type={item.type} />}
                    title={<Text style={{ fontSize: 13 }}>{item.title}</Text>}
                    description={
                      <Space direction="vertical" size={0}>
                        <Text type="secondary" style={{ fontSize: 12 }}>{item.description}</Text>
                        <Text type="secondary" style={{ fontSize: 11 }}>
                          {item.time} • {item.user}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
