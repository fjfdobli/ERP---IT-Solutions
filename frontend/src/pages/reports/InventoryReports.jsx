import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Select, Tag, 
  Typography, DatePicker, Statistic, Progress, Alert, Badge
} from 'antd';
import {
  ExportOutlined,
  PrinterOutlined,
  InboxOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SyncOutlined,
  BarChartOutlined,
  PieChartOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard } from '../../components/Common';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

// Mock inventory report data
const mockInventorySummary = {
  totalSKU: 2450,
  totalValue: 12500000,
  avgValue: 5102.04,
  lowStock: 45,
  outOfStock: 12,
  overstocked: 28,
  turnoverRate: 4.2,
  daysToSell: 87,
};

const mockStockByCategory = [
  { category: 'Electronics', skus: 580, value: 4500000, percent: 36, status: 'healthy' },
  { category: 'Computers', skus: 320, value: 3200000, percent: 25.6, status: 'healthy' },
  { category: 'Accessories', skus: 890, value: 2400000, percent: 19.2, status: 'healthy' },
  { category: 'Office Supplies', skus: 450, value: 1500000, percent: 12, status: 'warning' },
  { category: 'Furniture', skus: 210, value: 900000, percent: 7.2, status: 'healthy' },
];

const mockStockByWarehouse = [
  { warehouse: 'Main Warehouse - Manila', skus: 1850, value: 8500000, utilization: 78, status: 'healthy' },
  { warehouse: 'Distribution Center - Cebu', skus: 420, value: 2200000, utilization: 65, status: 'healthy' },
  { warehouse: 'Branch Storage - Davao', skus: 180, value: 1800000, utilization: 92, status: 'warning' },
];

const mockLowStockItems = [
  { id: 1, name: 'Laptop Computer HP ProBook', sku: 'LP-HP-001', stock: 5, reorderPoint: 20, avgSales: 8, daysLeft: 0.6 },
  { id: 2, name: 'Wireless Mouse Logitech', sku: 'WM-LOG-001', stock: 15, reorderPoint: 50, avgSales: 12, daysLeft: 1.3 },
  { id: 3, name: 'USB-C Hub 7-in-1', sku: 'USB-HUB-7', stock: 8, reorderPoint: 30, avgSales: 6, daysLeft: 1.3 },
  { id: 4, name: 'Mechanical Keyboard RGB', sku: 'KB-MECH-01', stock: 3, reorderPoint: 25, avgSales: 5, daysLeft: 0.6 },
  { id: 5, name: '27" Monitor 4K', sku: 'MON-4K-27', stock: 2, reorderPoint: 10, avgSales: 3, daysLeft: 0.7 },
];

const mockStockMovements = [
  { type: 'Sales', in: 0, out: 4532, net: -4532 },
  { type: 'Purchases', in: 3850, out: 0, net: 3850 },
  { type: 'Returns', in: 125, out: 45, net: 80 },
  { type: 'Transfers', in: 320, out: 320, net: 0 },
  { type: 'Adjustments', in: 15, out: 28, net: -13 },
];

const mockAgingAnalysis = [
  { age: '0-30 days', value: 5200000, percent: 41.6, status: 'success' },
  { age: '31-60 days', value: 3500000, percent: 28, status: 'success' },
  { age: '61-90 days', value: 2200000, percent: 17.6, status: 'warning' },
  { age: '91-180 days', value: 1100000, percent: 8.8, status: 'warning' },
  { age: '180+ days', value: 500000, percent: 4, status: 'error' },
];

const mockTopMovers = [
  { id: 1, name: 'Wireless Mouse Logitech', sku: 'WM-LOG-001', sold: 450, turnover: 8.5 },
  { id: 2, name: 'USB Flash Drive 32GB', sku: 'USB-32GB', sold: 380, turnover: 7.2 },
  { id: 3, name: 'HDMI Cable 2m', sku: 'HDMI-2M', sold: 320, turnover: 6.8 },
  { id: 4, name: 'Laptop Bag 15"', sku: 'BAG-15', sold: 285, turnover: 6.1 },
  { id: 5, name: 'Webcam HD 1080p', sku: 'WC-HD-1080', sold: 245, turnover: 5.5 },
];

const mockSlowMovers = [
  { id: 1, name: 'Office Chair Executive', sku: 'CHR-EXEC', sold: 5, daysToSell: 180 },
  { id: 2, name: 'Conference Table Large', sku: 'TBL-CONF-L', sold: 2, daysToSell: 270 },
  { id: 3, name: 'Server Rack 42U', sku: 'RACK-42U', sold: 1, daysToSell: 365 },
  { id: 4, name: 'Printer Industrial', sku: 'PRT-IND-01', sold: 3, daysToSell: 150 },
  { id: 5, name: 'UPS 3000VA', sku: 'UPS-3000', sold: 4, daysToSell: 120 },
];

const InventoryReports = () => {
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      'healthy': 'success',
      'warning': 'warning',
      'critical': 'error',
    };
    return colors[status] || 'default';
  };

  return (
    <div>
      <PageHeader
        title="Inventory Reports"
        subtitle={`As of ${dayjs().format('MMMM D, YYYY')}`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'Reports', path: '/reports' },
          { title: 'Inventory', path: '/reports/inventory' },
        ]}
        actions={[
          <Select
            key="warehouse"
            placeholder="All Warehouses"
            allowClear
            style={{ width: 200 }}
            value={selectedWarehouse}
            onChange={setSelectedWarehouse}
            options={mockStockByWarehouse.map(w => ({ label: w.warehouse, value: w.warehouse }))}
          />,
          <Button key="print" icon={<PrinterOutlined />}>Print</Button>,
          <Button key="export" icon={<ExportOutlined />}>Export</Button>,
        ]}
      />

      {/* Alerts */}
      {(mockInventorySummary.outOfStock > 0 || mockInventorySummary.lowStock > 10) && (
        <Alert
          message="Inventory Alerts"
          description={
            <Space>
              {mockInventorySummary.outOfStock > 0 && (
                <Tag color="error">{mockInventorySummary.outOfStock} items out of stock</Tag>
              )}
              {mockInventorySummary.lowStock > 0 && (
                <Tag color="warning">{mockInventorySummary.lowStock} items low on stock</Tag>
              )}
              {mockInventorySummary.overstocked > 0 && (
                <Tag color="blue">{mockInventorySummary.overstocked} items overstocked</Tag>
              )}
            </Space>
          }
          type="warning"
          showIcon
          icon={<WarningOutlined />}
          style={{ marginBottom: 24 }}
        />
      )}

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={8} lg={4}>
          <Card size="small">
            <Statistic
              title="Total SKUs"
              value={mockInventorySummary.totalSKU}
              valueStyle={{ fontSize: 18 }}
              prefix={<InboxOutlined style={{ marginRight: 8 }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card size="small">
            <Statistic
              title="Total Value"
              value={mockInventorySummary.totalValue}
              precision={2}
              prefix="₱"
              valueStyle={{ fontSize: 18, color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card size="small">
            <Statistic
              title="Low Stock"
              value={mockInventorySummary.lowStock}
              valueStyle={{ fontSize: 18, color: '#faad14' }}
              prefix={<ExclamationCircleOutlined style={{ marginRight: 8 }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card size="small">
            <Statistic
              title="Out of Stock"
              value={mockInventorySummary.outOfStock}
              valueStyle={{ fontSize: 18, color: '#f5222d' }}
              prefix={<WarningOutlined style={{ marginRight: 8 }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card size="small">
            <Statistic
              title="Turnover Rate"
              value={mockInventorySummary.turnoverRate}
              suffix="x"
              valueStyle={{ fontSize: 18, color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} lg={4}>
          <Card size="small">
            <Statistic
              title="Avg Days to Sell"
              value={mockInventorySummary.daysToSell}
              suffix="days"
              valueStyle={{ fontSize: 18 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Stock by Category & Warehouse */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title={<><PieChartOutlined /> Stock by Category</>} size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              {mockStockByCategory.map((item, index) => (
                <div key={item.category}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Space>
                      <Text>{item.category}</Text>
                      <Badge status={getStatusColor(item.status)} />
                    </Space>
                    <Space>
                      <Text type="secondary">{item.skus} SKUs</Text>
                      <Text strong>{formatCurrency(item.value)}</Text>
                    </Space>
                  </div>
                  <Progress 
                    percent={item.percent} 
                    strokeColor={['#1890ff', '#52c41a', '#faad14', '#722ed1', '#13c2c2'][index]}
                    showInfo
                  />
                </div>
              ))}
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={<><BarChartOutlined /> Stock by Warehouse</>} size="small">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {mockStockByWarehouse.map((item) => (
                <Card 
                  key={item.warehouse} 
                  size="small" 
                  style={{ background: '#fafafa' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                      <Text strong>{item.warehouse}</Text>
                      <br />
                      <Text type="secondary">{item.skus} SKUs</Text>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <Text strong>{formatCurrency(item.value)}</Text>
                      <br />
                      <Tag color={item.utilization > 85 ? 'warning' : 'success'}>
                        {item.utilization}% capacity
                      </Tag>
                    </div>
                  </div>
                  <Progress 
                    percent={item.utilization} 
                    strokeColor={item.utilization > 85 ? '#faad14' : '#52c41a'}
                    showInfo={false}
                  />
                </Card>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Inventory Aging & Stock Movements */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title={<><SyncOutlined /> Inventory Aging</>} size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              {mockAgingAnalysis.map((item) => (
                <div key={item.age}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text>{item.age}</Text>
                    <Text strong>{formatCurrency(item.value)}</Text>
                  </div>
                  <Progress 
                    percent={item.percent} 
                    status={item.status}
                    format={(p) => `${p}%`}
                  />
                </div>
              ))}
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={<><SwapOutlined /> Stock Movements (This Month)</>} size="small">
            <Table
              dataSource={mockStockMovements}
              rowKey="type"
              pagination={false}
              size="small"
              columns={[
                { title: 'Type', dataIndex: 'type', key: 'type' },
                { 
                  title: 'In', 
                  dataIndex: 'in', 
                  key: 'in', 
                  align: 'right',
                  render: (val) => val > 0 ? <Text type="success">+{val}</Text> : '-',
                },
                { 
                  title: 'Out', 
                  dataIndex: 'out', 
                  key: 'out', 
                  align: 'right',
                  render: (val) => val > 0 ? <Text type="danger">-{val}</Text> : '-',
                },
                { 
                  title: 'Net', 
                  dataIndex: 'net', 
                  key: 'net', 
                  align: 'right',
                  render: (val) => (
                    <Text type={val > 0 ? 'success' : val < 0 ? 'danger' : 'secondary'}>
                      {val > 0 ? '+' : ''}{val}
                    </Text>
                  ),
                },
              ]}
              summary={() => {
                const totalIn = mockStockMovements.reduce((s, m) => s + m.in, 0);
                const totalOut = mockStockMovements.reduce((s, m) => s + m.out, 0);
                const totalNet = mockStockMovements.reduce((s, m) => s + m.net, 0);
                return (
                  <Table.Summary.Row>
                    <Table.Summary.Cell><Text strong>Total</Text></Table.Summary.Cell>
                    <Table.Summary.Cell align="right">
                      <Text strong type="success">+{totalIn}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell align="right">
                      <Text strong type="danger">-{totalOut}</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell align="right">
                      <Text strong type={totalNet >= 0 ? 'success' : 'danger'}>
                        {totalNet >= 0 ? '+' : ''}{totalNet}
                      </Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                );
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Low Stock Alert & Top/Slow Movers */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card 
            title={
              <Space>
                <WarningOutlined style={{ color: '#faad14' }} />
                Low Stock Items
              </Space>
            }
            size="small"
            extra={<Button type="link" size="small">View All</Button>}
          >
            <Table
              dataSource={mockLowStockItems}
              rowKey="id"
              pagination={false}
              size="small"
              columns={[
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
                  title: 'Current Stock', 
                  dataIndex: 'stock', 
                  key: 'stock', 
                  align: 'center',
                  render: (stock) => (
                    <Tag color={stock <= 5 ? 'error' : 'warning'}>{stock}</Tag>
                  ),
                },
                { title: 'Reorder Point', dataIndex: 'reorderPoint', key: 'reorderPoint', align: 'center' },
                { title: 'Avg Daily Sales', dataIndex: 'avgSales', key: 'avgSales', align: 'center' },
                { 
                  title: 'Days of Stock', 
                  dataIndex: 'daysLeft', 
                  key: 'daysLeft', 
                  align: 'center',
                  render: (days) => (
                    <Text type={days < 1 ? 'danger' : 'warning'}>
                      {days.toFixed(1)} days
                    </Text>
                  ),
                },
                {
                  title: 'Status',
                  key: 'status',
                  width: 100,
                  render: (_, record) => (
                    <Tag color={record.stock <= 5 ? 'error' : 'warning'}>
                      {record.stock <= 5 ? 'Critical' : 'Low'}
                    </Tag>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <ArrowUpOutlined style={{ color: '#52c41a' }} />
                Top Moving Items
              </Space>
            }
            size="small"
          >
            <Table
              dataSource={mockTopMovers}
              rowKey="id"
              pagination={false}
              size="small"
              columns={[
                {
                  title: 'Rank',
                  key: 'rank',
                  width: 50,
                  align: 'center',
                  render: (_, __, index) => <Tag color="gold">{index + 1}</Tag>,
                },
                {
                  title: 'Product',
                  key: 'product',
                  render: (_, record) => (
                    <div>
                      <Text>{record.name}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 11 }}>{record.sku}</Text>
                    </div>
                  ),
                },
                { title: 'Sold', dataIndex: 'sold', key: 'sold', align: 'center' },
                { 
                  title: 'Turnover', 
                  dataIndex: 'turnover', 
                  key: 'turnover', 
                  align: 'center',
                  render: (val) => <Text type="success">{val}x</Text>,
                },
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <ArrowDownOutlined style={{ color: '#f5222d' }} />
                Slow Moving Items
              </Space>
            }
            size="small"
          >
            <Table
              dataSource={mockSlowMovers}
              rowKey="id"
              pagination={false}
              size="small"
              columns={[
                {
                  title: 'Rank',
                  key: 'rank',
                  width: 50,
                  align: 'center',
                  render: (_, __, index) => <Tag color="volcano">{index + 1}</Tag>,
                },
                {
                  title: 'Product',
                  key: 'product',
                  render: (_, record) => (
                    <div>
                      <Text>{record.name}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 11 }}>{record.sku}</Text>
                    </div>
                  ),
                },
                { title: 'Sold', dataIndex: 'sold', key: 'sold', align: 'center' },
                { 
                  title: 'Days to Sell', 
                  dataIndex: 'daysToSell', 
                  key: 'daysToSell', 
                  align: 'center',
                  render: (val) => <Text type="danger">{val} days</Text>,
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default InventoryReports;
