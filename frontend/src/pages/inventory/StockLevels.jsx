import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Input, Select, Tag, 
  Tooltip, Progress, Badge, Dropdown, message, Typography,
  Drawer, Descriptions, Avatar, Tabs, Timeline, Statistic
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  ExportOutlined,
  EyeOutlined,
  MoreOutlined,
  InboxOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  HistoryOutlined,
  ShopOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard } from '../../components/Common';

const { Search } = Input;
const { Text, Title } = Typography;

// Mock stock data
const mockStockData = [
  {
    id: 1,
    sku: 'APL-IP15PM-256',
    name: 'iPhone 15 Pro Max 256GB',
    category: 'Smartphones',
    brand: 'Apple',
    branches: [
      { branch: 'Main Branch', stock: 25, minStock: 10, maxStock: 50, location: 'A-1-3' },
      { branch: 'Downtown Store', stock: 12, minStock: 5, maxStock: 30, location: 'B-2-1' },
      { branch: 'Warehouse', stock: 8, minStock: 20, maxStock: 100, location: 'WH-A-12' },
    ],
    totalStock: 45,
    reserved: 5,
    available: 40,
    inTransit: 10,
    costPrice: 1099.00,
    sellingPrice: 1499.00,
    totalValue: 49455.00,
    lastRestocked: '2024-01-14',
    lastSold: '2024-01-15',
    status: 'normal',
  },
  {
    id: 2,
    sku: 'SAM-GS24U-512',
    name: 'Samsung Galaxy S24 Ultra 512GB',
    category: 'Smartphones',
    brand: 'Samsung',
    branches: [
      { branch: 'Main Branch', stock: 18, minStock: 10, maxStock: 40, location: 'A-1-4' },
      { branch: 'Downtown Store', stock: 8, minStock: 5, maxStock: 25, location: 'B-2-2' },
      { branch: 'Warehouse', stock: 6, minStock: 15, maxStock: 80, location: 'WH-A-13' },
    ],
    totalStock: 32,
    reserved: 3,
    available: 29,
    inTransit: 0,
    costPrice: 899.00,
    sellingPrice: 1299.00,
    totalValue: 28768.00,
    lastRestocked: '2024-01-12',
    lastSold: '2024-01-15',
    status: 'normal',
  },
  {
    id: 3,
    sku: 'APL-MBP-M3-14',
    name: 'MacBook Pro 14" M3 Pro',
    category: 'Laptops',
    brand: 'Apple',
    branches: [
      { branch: 'Main Branch', stock: 5, minStock: 5, maxStock: 15, location: 'A-2-1' },
      { branch: 'Downtown Store', stock: 3, minStock: 3, maxStock: 10, location: 'B-3-1' },
      { branch: 'Warehouse', stock: 4, minStock: 8, maxStock: 30, location: 'WH-B-5' },
    ],
    totalStock: 12,
    reserved: 2,
    available: 10,
    inTransit: 5,
    costPrice: 1799.00,
    sellingPrice: 2499.00,
    totalValue: 21588.00,
    lastRestocked: '2024-01-10',
    lastSold: '2024-01-14',
    status: 'low_stock',
  },
  {
    id: 4,
    sku: 'APL-APP2',
    name: 'AirPods Pro 2nd Generation',
    category: 'Audio',
    brand: 'Apple',
    branches: [
      { branch: 'Main Branch', stock: 2, minStock: 10, maxStock: 50, location: 'A-4-2' },
      { branch: 'Downtown Store', stock: 1, minStock: 5, maxStock: 30, location: 'B-4-1' },
      { branch: 'Warehouse', stock: 0, minStock: 25, maxStock: 100, location: 'WH-C-8' },
    ],
    totalStock: 3,
    reserved: 1,
    available: 2,
    inTransit: 20,
    costPrice: 180.00,
    sellingPrice: 249.00,
    totalValue: 540.00,
    lastRestocked: '2024-01-05',
    lastSold: '2024-01-15',
    status: 'critical',
  },
  {
    id: 5,
    sku: 'DEL-XPS15-9530',
    name: 'Dell XPS 15 9530',
    category: 'Laptops',
    brand: 'Dell',
    branches: [
      { branch: 'Main Branch', stock: 0, minStock: 5, maxStock: 15, location: 'A-2-3' },
      { branch: 'Downtown Store', stock: 0, minStock: 3, maxStock: 10, location: 'B-3-2' },
      { branch: 'Warehouse', stock: 0, minStock: 10, maxStock: 40, location: 'WH-B-8' },
    ],
    totalStock: 0,
    reserved: 0,
    available: 0,
    inTransit: 15,
    costPrice: 1400.00,
    sellingPrice: 1899.00,
    totalValue: 0,
    lastRestocked: '2024-01-01',
    lastSold: '2024-01-13',
    status: 'out_of_stock',
  },
  {
    id: 6,
    sku: 'SNY-WH1000XM5',
    name: 'Sony WH-1000XM5 Headphones',
    category: 'Audio',
    brand: 'Sony',
    branches: [
      { branch: 'Main Branch', stock: 35, minStock: 10, maxStock: 60, location: 'A-4-5' },
      { branch: 'Downtown Store', stock: 18, minStock: 8, maxStock: 40, location: 'B-4-3' },
      { branch: 'Warehouse', stock: 14, minStock: 20, maxStock: 100, location: 'WH-C-12' },
    ],
    totalStock: 67,
    reserved: 4,
    available: 63,
    inTransit: 0,
    costPrice: 250.00,
    sellingPrice: 399.00,
    totalValue: 16750.00,
    lastRestocked: '2024-01-11',
    lastSold: '2024-01-15',
    status: 'normal',
  },
  {
    id: 7,
    sku: 'LOG-MX-MASTER3S',
    name: 'Logitech MX Master 3S Mouse',
    category: 'Accessories',
    brand: 'Logitech',
    branches: [
      { branch: 'Main Branch', stock: 45, minStock: 15, maxStock: 80, location: 'A-5-2' },
      { branch: 'Downtown Store', stock: 32, minStock: 10, maxStock: 50, location: 'B-5-1' },
      { branch: 'Warehouse', stock: 43, minStock: 30, maxStock: 150, location: 'WH-D-3' },
    ],
    totalStock: 120,
    reserved: 8,
    available: 112,
    inTransit: 0,
    costPrice: 75.00,
    sellingPrice: 99.00,
    totalValue: 9000.00,
    lastRestocked: '2024-01-13',
    lastSold: '2024-01-15',
    status: 'overstock',
  },
  {
    id: 8,
    sku: 'LG-OLED65C3',
    name: 'LG OLED 65" C3 4K Smart TV',
    category: 'Television',
    brand: 'LG',
    branches: [
      { branch: 'Main Branch', stock: 4, minStock: 3, maxStock: 10, location: 'A-6-1' },
      { branch: 'Downtown Store', stock: 2, minStock: 2, maxStock: 6, location: 'B-6-1' },
      { branch: 'Warehouse', stock: 2, minStock: 5, maxStock: 20, location: 'WH-E-1' },
    ],
    totalStock: 8,
    reserved: 1,
    available: 7,
    inTransit: 3,
    costPrice: 1200.00,
    sellingPrice: 1799.00,
    totalValue: 9600.00,
    lastRestocked: '2024-01-08',
    lastSold: '2024-01-14',
    status: 'low_stock',
  },
];

const categories = ['Smartphones', 'Laptops', 'Audio', 'Television', 'Accessories', 'Tablets'];
const brands = ['Apple', 'Samsung', 'Sony', 'LG', 'Dell', 'Logitech'];
const branches = ['Main Branch', 'Downtown Store', 'Warehouse'];

const StockLevels = () => {
  const [stockData] = useState(mockStockData);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState(null);
  const [filterBrand, setFilterBrand] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterBranch, setFilterBranch] = useState(null);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Stats calculation
  const totalSKUs = stockData.length;
  const totalStockUnits = stockData.reduce((sum, p) => sum + p.totalStock, 0);
  const totalInventoryValue = stockData.reduce((sum, p) => sum + p.totalValue, 0);
  const lowStockCount = stockData.filter(p => p.status === 'low_stock' || p.status === 'critical').length;
  const outOfStockCount = stockData.filter(p => p.status === 'out_of_stock').length;

  // Filter stock data
  const filteredData = stockData.filter(item => {
    const matchesSearch = !searchText || 
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = !filterCategory || item.category === filterCategory;
    const matchesBrand = !filterBrand || item.brand === filterBrand;
    const matchesStatus = !filterStatus || item.status === filterStatus;
    return matchesSearch && matchesCategory && matchesBrand && matchesStatus;
  });

  // Table columns
  const columns = [
    {
      title: 'Product',
      key: 'product',
      width: 280,
      fixed: 'left',
      render: (_, record) => (
        <Space>
          <Avatar 
            shape="square" 
            size={40}
            icon={<InboxOutlined />}
            style={{ backgroundColor: '#f5f5f5', color: '#666' }}
          />
          <div>
            <Text strong style={{ display: 'block' }}>{record.name}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>{record.sku}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 110,
      render: (category) => <Tag color="purple">{category}</Tag>,
    },
    {
      title: 'Total Stock',
      key: 'totalStock',
      width: 130,
      align: 'center',
      render: (_, record) => {
        const maxStock = record.branches.reduce((sum, b) => sum + b.maxStock, 0);
        const percentage = (record.totalStock / maxStock) * 100;
        
        return (
          <Tooltip title={`Available: ${record.available} | Reserved: ${record.reserved}`}>
            <div>
              <Text strong style={{ fontSize: 16 }}>{record.totalStock}</Text>
              <Progress 
                percent={percentage} 
                size="small" 
                showInfo={false}
                strokeColor={
                  record.status === 'out_of_stock' ? '#ff4d4f' :
                  record.status === 'critical' ? '#ff4d4f' :
                  record.status === 'low_stock' ? '#faad14' :
                  record.status === 'overstock' ? '#1890ff' : '#52c41a'
                }
              />
            </div>
          </Tooltip>
        );
      },
      sorter: (a, b) => a.totalStock - b.totalStock,
    },
    {
      title: 'Available',
      dataIndex: 'available',
      key: 'available',
      width: 90,
      align: 'center',
      render: (available) => (
        <Text type={available === 0 ? 'danger' : 'secondary'}>{available}</Text>
      ),
    },
    {
      title: 'Reserved',
      dataIndex: 'reserved',
      key: 'reserved',
      width: 90,
      align: 'center',
      render: (reserved) => (
        <Badge count={reserved} style={{ backgroundColor: '#1890ff' }} showZero />
      ),
    },
    {
      title: 'In Transit',
      dataIndex: 'inTransit',
      key: 'inTransit',
      width: 90,
      align: 'center',
      render: (inTransit) => (
        inTransit > 0 ? (
          <Tag icon={<SyncOutlined spin />} color="processing">{inTransit}</Tag>
        ) : (
          <Text type="secondary">—</Text>
        )
      ),
    },
    {
      title: 'Value',
      dataIndex: 'totalValue',
      key: 'totalValue',
      width: 110,
      align: 'right',
      render: (value) => (
        <Text strong>${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
      ),
      sorter: (a, b) => a.totalValue - b.totalValue,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const config = {
          normal: { color: 'success', text: 'Normal', icon: <CheckCircleOutlined /> },
          low_stock: { color: 'warning', text: 'Low Stock', icon: <WarningOutlined /> },
          critical: { color: 'error', text: 'Critical', icon: <WarningOutlined /> },
          out_of_stock: { color: 'default', text: 'Out of Stock', icon: <InboxOutlined /> },
          overstock: { color: 'blue', text: 'Overstock', icon: <ArrowUpOutlined /> },
        };
        const { color, text, icon } = config[status] || config.normal;
        return <Tag color={color} icon={icon}>{text}</Tag>;
      },
    },
    {
      title: 'Last Activity',
      key: 'lastActivity',
      width: 140,
      render: (_, record) => (
        <Tooltip title={`Restocked: ${record.lastRestocked} | Sold: ${record.lastSold}`}>
          <Space direction="vertical" size={0}>
            <Text type="secondary" style={{ fontSize: 11 }}>
              <ArrowUpOutlined style={{ color: '#52c41a' }} /> {record.lastRestocked}
            </Text>
            <Text type="secondary" style={{ fontSize: 11 }}>
              <ArrowDownOutlined style={{ color: '#ff4d4f' }} /> {record.lastSold}
            </Text>
          </Space>
        </Tooltip>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
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
          <Dropdown
            menu={{
              items: [
                { key: 'history', icon: <HistoryOutlined />, label: 'Stock History' },
                { key: 'adjust', icon: <SyncOutlined />, label: 'Adjust Stock' },
                { key: 'transfer', icon: <ShopOutlined />, label: 'Transfer Stock' },
              ],
              onClick: ({ key }) => handleMenuClick(key, record),
            }}
          >
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  // Branch stock columns for detail view
  const branchColumns = [
    {
      title: 'Branch',
      dataIndex: 'branch',
      key: 'branch',
      render: (branch) => (
        <Space>
          <ShopOutlined />
          <Text strong>{branch}</Text>
        </Space>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (location) => <Tag>{location}</Tag>,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      align: 'center',
      render: (stock, record) => (
        <div>
          <Text strong style={{ 
            color: stock === 0 ? '#ff4d4f' : stock <= record.minStock ? '#faad14' : '#52c41a' 
          }}>
            {stock}
          </Text>
          <Progress 
            percent={(stock / record.maxStock) * 100} 
            size="small" 
            showInfo={false}
            strokeColor={stock <= record.minStock ? '#faad14' : '#52c41a'}
          />
        </div>
      ),
    },
    {
      title: 'Min',
      dataIndex: 'minStock',
      key: 'minStock',
      align: 'center',
    },
    {
      title: 'Max',
      dataIndex: 'maxStock',
      key: 'maxStock',
      align: 'center',
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        if (record.stock === 0) return <Tag color="error">Out of Stock</Tag>;
        if (record.stock <= record.minStock) return <Tag color="warning">Low Stock</Tag>;
        if (record.stock >= record.maxStock * 0.9) return <Tag color="blue">Near Full</Tag>;
        return <Tag color="success">Normal</Tag>;
      },
    },
  ];

  // Handlers
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setDetailDrawerVisible(true);
  };

  const handleMenuClick = (key, record) => {
    if (key === 'history') {
      message.info(`Viewing history for ${record.name}`);
    } else if (key === 'adjust') {
      message.info(`Adjusting stock for ${record.name}`);
    } else if (key === 'transfer') {
      message.info(`Transferring stock for ${record.name}`);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('Stock levels refreshed');
    }, 1000);
  };

  return (
    <div>
      <PageHeader
        title="Stock Levels"
        subtitle={`${totalSKUs} products in inventory`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'Inventory', path: '/inventory' },
          { title: 'Stock Levels', path: '/inventory/stock' },
        ]}
        actions={[
          <Button key="refresh" icon={<ReloadOutlined />} onClick={handleRefresh}>
            Refresh
          </Button>,
          <Button key="export" icon={<ExportOutlined />}>Export</Button>,
        ]}
      />

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8} lg={4}>
          <StatCard
            title="Total SKUs"
            value={totalSKUs}
            icon={<InboxOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <StatCard
            title="Total Units"
            value={totalStockUnits}
            icon={<InboxOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <StatCard
            title="Low Stock"
            value={lowStockCount}
            icon={<WarningOutlined style={{ fontSize: 24, color: '#faad14' }} />}
            color="#faad14"
            warning={lowStockCount > 0}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <StatCard
            title="Out of Stock"
            value={outOfStockCount}
            icon={<InboxOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />}
            color="#ff4d4f"
            warning={outOfStockCount > 0}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <StatCard
            title="Total Inventory Value"
            value={totalInventoryValue}
            prefix="$"
            icon={<InboxOutlined style={{ fontSize: 24, color: '#722ed1' }} />}
            color="#722ed1"
          />
        </Col>
      </Row>

      {/* Quick Status Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {['All', 'Normal', 'Low Stock', 'Critical', 'Out of Stock', 'Overstock'].map((status, index) => {
          const statusKey = status.toLowerCase().replace(' ', '_');
          const count = status === 'All' 
            ? stockData.length 
            : stockData.filter(p => p.status === (statusKey === 'all' ? p.status : statusKey)).length;
          const colors = ['#1890ff', '#52c41a', '#faad14', '#ff4d4f', '#d9d9d9', '#1890ff'];
          
          return (
            <Col xs={12} sm={8} md={4} key={status}>
              <Card 
                hoverable
                style={{ 
                  textAlign: 'center',
                  borderColor: filterStatus === (statusKey === 'all' ? null : statusKey) ? colors[index] : undefined,
                  cursor: 'pointer'
                }}
                bodyStyle={{ padding: 12 }}
                onClick={() => setFilterStatus(statusKey === 'all' ? null : statusKey)}
              >
                <Statistic 
                  title={status} 
                  value={count}
                  valueStyle={{ color: colors[index], fontSize: 24 }}
                />
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Filters and Table */}
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Space wrap>
            <Search
              placeholder="Search by name or SKU..."
              allowClear
              style={{ width: 280 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              placeholder="Category"
              allowClear
              style={{ width: 140 }}
              value={filterCategory}
              onChange={setFilterCategory}
              options={categories.map(c => ({ label: c, value: c }))}
            />
            <Select
              placeholder="Brand"
              allowClear
              style={{ width: 130 }}
              value={filterBrand}
              onChange={setFilterBrand}
              options={brands.map(b => ({ label: b, value: b }))}
            />
            <Select
              placeholder="Branch"
              allowClear
              style={{ width: 150 }}
              value={filterBranch}
              onChange={setFilterBranch}
              options={branches.map(b => ({ label: b, value: b }))}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1400 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} products`,
          }}
        />
      </Card>

      {/* Product Stock Details Drawer */}
      <Drawer
        title="Stock Details"
        placement="right"
        width={700}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
      >
        {selectedProduct && (
          <>
            <div style={{ marginBottom: 24 }}>
              <Title level={4}>{selectedProduct.name}</Title>
              <Space>
                <Tag>{selectedProduct.sku}</Tag>
                <Tag color="purple">{selectedProduct.category}</Tag>
                <Tag color="cyan">{selectedProduct.brand}</Tag>
              </Space>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={6}>
                <Card size="small">
                  <Statistic title="Total Stock" value={selectedProduct.totalStock} />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Statistic title="Available" value={selectedProduct.available} valueStyle={{ color: '#52c41a' }} />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Statistic title="Reserved" value={selectedProduct.reserved} valueStyle={{ color: '#1890ff' }} />
                </Card>
              </Col>
              <Col span={6}>
                <Card size="small">
                  <Statistic title="In Transit" value={selectedProduct.inTransit} valueStyle={{ color: '#faad14' }} />
                </Card>
              </Col>
            </Row>

            <Tabs
              items={[
                {
                  key: 'branches',
                  label: 'Stock by Branch',
                  children: (
                    <Table
                      columns={branchColumns}
                      dataSource={selectedProduct.branches}
                      rowKey="branch"
                      pagination={false}
                      size="small"
                    />
                  ),
                },
                {
                  key: 'history',
                  label: 'Recent Activity',
                  children: (
                    <Timeline
                      items={[
                        {
                          color: 'green',
                          children: (
                            <>
                              <Text strong>Stock Received</Text>
                              <br />
                              <Text type="secondary">+20 units from PO-2024-089</Text>
                              <br />
                              <Text type="secondary" style={{ fontSize: 12 }}>Jan 14, 2024 10:30 AM</Text>
                            </>
                          ),
                        },
                        {
                          color: 'red',
                          children: (
                            <>
                              <Text strong>Sales Transaction</Text>
                              <br />
                              <Text type="secondary">-2 units - Order #ORD-2024-156</Text>
                              <br />
                              <Text type="secondary" style={{ fontSize: 12 }}>Jan 15, 2024 2:15 PM</Text>
                            </>
                          ),
                        },
                        {
                          color: 'blue',
                          children: (
                            <>
                              <Text strong>Stock Transfer</Text>
                              <br />
                              <Text type="secondary">5 units: Main Branch → Downtown</Text>
                              <br />
                              <Text type="secondary" style={{ fontSize: 12 }}>Jan 13, 2024 9:00 AM</Text>
                            </>
                          ),
                        },
                        {
                          color: 'orange',
                          children: (
                            <>
                              <Text strong>Stock Adjustment</Text>
                              <br />
                              <Text type="secondary">-1 unit - Damaged goods</Text>
                              <br />
                              <Text type="secondary" style={{ fontSize: 12 }}>Jan 12, 2024 4:45 PM</Text>
                            </>
                          ),
                        },
                      ]}
                    />
                  ),
                },
                {
                  key: 'info',
                  label: 'Product Info',
                  children: (
                    <Descriptions column={2}>
                      <Descriptions.Item label="Cost Price">
                        ${selectedProduct.costPrice.toFixed(2)}
                      </Descriptions.Item>
                      <Descriptions.Item label="Selling Price">
                        ${selectedProduct.sellingPrice.toFixed(2)}
                      </Descriptions.Item>
                      <Descriptions.Item label="Total Value">
                        ${selectedProduct.totalValue.toFixed(2)}
                      </Descriptions.Item>
                      <Descriptions.Item label="Last Restocked">
                        {selectedProduct.lastRestocked}
                      </Descriptions.Item>
                      <Descriptions.Item label="Last Sold">
                        {selectedProduct.lastSold}
                      </Descriptions.Item>
                      <Descriptions.Item label="Status">
                        {selectedProduct.status === 'normal' && <Tag color="success">Normal</Tag>}
                        {selectedProduct.status === 'low_stock' && <Tag color="warning">Low Stock</Tag>}
                        {selectedProduct.status === 'critical' && <Tag color="error">Critical</Tag>}
                        {selectedProduct.status === 'out_of_stock' && <Tag color="default">Out of Stock</Tag>}
                        {selectedProduct.status === 'overstock' && <Tag color="blue">Overstock</Tag>}
                      </Descriptions.Item>
                    </Descriptions>
                  ),
                },
              ]}
            />
          </>
        )}
      </Drawer>
    </div>
  );
};

export default StockLevels;
