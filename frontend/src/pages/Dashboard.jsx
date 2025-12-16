import { Row, Col, Card, Statistic, Table, Typography, Progress, Tag, List, Avatar } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  UserOutlined,
  InboxOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

// Mock data - replace with real API calls later
const recentOrders = [
  { id: 'ORD-001', customer: 'John Doe', amount: 1250.00, status: 'completed', date: '2024-01-15' },
  { id: 'ORD-002', customer: 'Jane Smith', amount: 890.50, status: 'pending', date: '2024-01-15' },
  { id: 'ORD-003', customer: 'Bob Wilson', amount: 2100.00, status: 'processing', date: '2024-01-14' },
  { id: 'ORD-004', customer: 'Alice Brown', amount: 450.00, status: 'completed', date: '2024-01-14' },
  { id: 'ORD-005', customer: 'Charlie Davis', amount: 3200.00, status: 'completed', date: '2024-01-13' },
];

const topProducts = [
  { name: 'Product A', sales: 245, revenue: 12250 },
  { name: 'Product B', sales: 198, revenue: 9900 },
  { name: 'Product C', sales: 167, revenue: 8350 },
  { name: 'Product D', sales: 145, revenue: 7250 },
  { name: 'Product E', sales: 132, revenue: 6600 },
];

const recentActivities = [
  { title: 'New order placed', description: 'Order #ORD-001 received', time: '2 minutes ago', type: 'order' },
  { title: 'Stock updated', description: 'Product A stock increased by 50', time: '15 minutes ago', type: 'inventory' },
  { title: 'Payment received', description: '$1,250.00 from John Doe', time: '1 hour ago', type: 'payment' },
  { title: 'New user registered', description: 'Staff member added', time: '3 hours ago', type: 'user' },
];

const orderColumns = [
  { title: 'Order ID', dataIndex: 'id', key: 'id' },
  { title: 'Customer', dataIndex: 'customer', key: 'customer' },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    render: (amount) => `$${amount.toFixed(2)}`,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      const colors = {
        completed: 'green',
        pending: 'orange',
        processing: 'blue',
        cancelled: 'red',
      };
      return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
    },
  },
  { title: 'Date', dataIndex: 'date', key: 'date' },
];

const Dashboard = () => {
  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        Dashboard
      </Title>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={125420}
              precision={2}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#3f8600' }}
              suffix={
                <Text type="success" style={{ fontSize: 14 }}>
                  <ArrowUpOutlined /> 12%
                </Text>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={1284}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1890ff' }}
              suffix={
                <Text type="success" style={{ fontSize: 14 }}>
                  <ArrowUpOutlined /> 8%
                </Text>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Users"
              value={342}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
              suffix={
                <Text type="danger" style={{ fontSize: 14 }}>
                  <ArrowDownOutlined /> 3%
                </Text>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Products in Stock"
              value={5678}
              prefix={<InboxOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Orders and Top Products */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Recent Orders" extra={<a href="/sales/orders">View All</a>}>
            <Table
              columns={orderColumns}
              dataSource={recentOrders}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Top Products">
            {topProducts.map((product, index) => (
              <div key={product.name} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text>
                    {index + 1}. {product.name}
                  </Text>
                  <Text type="secondary">{product.sales} sales</Text>
                </div>
                <Progress
                  percent={Math.round((product.sales / topProducts[0].sales) * 100)}
                  showInfo={false}
                  strokeColor="#1890ff"
                />
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Recent Activity">
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{
                          backgroundColor:
                            item.type === 'order'
                              ? '#1890ff'
                              : item.type === 'payment'
                              ? '#52c41a'
                              : item.type === 'inventory'
                              ? '#faad14'
                              : '#722ed1',
                        }}
                        icon={
                          item.type === 'order' ? (
                            <ShoppingCartOutlined />
                          ) : item.type === 'payment' ? (
                            <DollarOutlined />
                          ) : item.type === 'inventory' ? (
                            <InboxOutlined />
                          ) : (
                            <UserOutlined />
                          )
                        }
                      />
                    }
                    title={item.title}
                    description={
                      <>
                        <Text type="secondary">{item.description}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {item.time}
                        </Text>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Sales Overview">
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Progress
                type="circle"
                percent={75}
                size={150}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
              <div style={{ marginTop: 24 }}>
                <Title level={4}>Monthly Target</Title>
                <Text type="secondary">$94,065 / $125,420</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
