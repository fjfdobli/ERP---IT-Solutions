import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Input, Select, Tag, 
  Tooltip, Badge, Typography, DatePicker, Timeline,
  Drawer, Descriptions, Avatar, Tabs, Statistic
} from 'antd';
import {
  SearchOutlined,
  ExportOutlined,
  EyeOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SwapOutlined,
  ToolOutlined,
  ShoppingCartOutlined,
  InboxOutlined,
  FilterOutlined,
  CalendarOutlined,
  UserOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

// Mock movement data
const mockMovements = [
  {
    id: 'MOV-2024-001',
    date: '2024-01-15T14:30:00',
    type: 'sale',
    product: { sku: 'APL-IP15PM-256', name: 'iPhone 15 Pro Max 256GB' },
    quantity: -2,
    reference: 'ORD-2024-156',
    branch: 'Main Branch',
    location: 'A-1-3',
    user: 'John Cashier',
    notes: 'Walk-in customer purchase',
    beforeQty: 27,
    afterQty: 25,
  },
  {
    id: 'MOV-2024-002',
    date: '2024-01-15T10:15:00',
    type: 'receiving',
    product: { sku: 'APL-APP2', name: 'AirPods Pro 2nd Generation' },
    quantity: 20,
    reference: 'PO-2024-089',
    branch: 'Warehouse',
    location: 'WH-C-8',
    user: 'Warehouse Staff',
    notes: 'Received from Apple Inc.',
    beforeQty: 0,
    afterQty: 20,
  },
  {
    id: 'MOV-2024-003',
    date: '2024-01-15T09:00:00',
    type: 'transfer_out',
    product: { sku: 'SNY-WH1000XM5', name: 'Sony WH-1000XM5 Headphones' },
    quantity: -5,
    reference: 'TRF-2024-012',
    branch: 'Main Branch',
    location: 'A-4-5',
    user: 'Manager',
    notes: 'Transfer to Downtown Store',
    beforeQty: 40,
    afterQty: 35,
  },
  {
    id: 'MOV-2024-004',
    date: '2024-01-15T09:00:00',
    type: 'transfer_in',
    product: { sku: 'SNY-WH1000XM5', name: 'Sony WH-1000XM5 Headphones' },
    quantity: 5,
    reference: 'TRF-2024-012',
    branch: 'Downtown Store',
    location: 'B-4-3',
    user: 'Store Staff',
    notes: 'Received from Main Branch',
    beforeQty: 13,
    afterQty: 18,
  },
  {
    id: 'MOV-2024-005',
    date: '2024-01-14T16:45:00',
    type: 'adjustment',
    product: { sku: 'LOG-MX-MASTER3S', name: 'Logitech MX Master 3S Mouse' },
    quantity: -1,
    reference: 'ADJ-2024-005',
    branch: 'Main Branch',
    location: 'A-5-2',
    user: 'Inventory Manager',
    notes: 'Damaged during handling',
    beforeQty: 46,
    afterQty: 45,
  },
  {
    id: 'MOV-2024-006',
    date: '2024-01-14T14:20:00',
    type: 'sale',
    product: { sku: 'APL-MBP-M3-14', name: 'MacBook Pro 14" M3 Pro' },
    quantity: -1,
    reference: 'ORD-2024-155',
    branch: 'Downtown Store',
    location: 'B-3-1',
    user: 'Sales Rep',
    notes: 'Corporate sale',
    beforeQty: 4,
    afterQty: 3,
  },
  {
    id: 'MOV-2024-007',
    date: '2024-01-14T11:30:00',
    type: 'return',
    product: { sku: 'SAM-GS24U-512', name: 'Samsung Galaxy S24 Ultra 512GB' },
    quantity: 1,
    reference: 'RET-2024-008',
    branch: 'Main Branch',
    location: 'A-1-4',
    user: 'Customer Service',
    notes: 'Customer return - unopened',
    beforeQty: 17,
    afterQty: 18,
  },
  {
    id: 'MOV-2024-008',
    date: '2024-01-14T09:00:00',
    type: 'count',
    product: { sku: 'LG-OLED65C3', name: 'LG OLED 65" C3 4K Smart TV' },
    quantity: 1,
    reference: 'CNT-2024-001',
    branch: 'Main Branch',
    location: 'A-6-1',
    user: 'Inventory Team',
    notes: 'Adjustment after physical count',
    beforeQty: 3,
    afterQty: 4,
  },
  {
    id: 'MOV-2024-009',
    date: '2024-01-13T15:00:00',
    type: 'receiving',
    product: { sku: 'DEL-XPS15-9530', name: 'Dell XPS 15 9530' },
    quantity: 15,
    reference: 'PO-2024-087',
    branch: 'Warehouse',
    location: 'WH-B-8',
    user: 'Warehouse Staff',
    notes: 'New stock from Dell',
    beforeQty: 0,
    afterQty: 15,
  },
  {
    id: 'MOV-2024-010',
    date: '2024-01-13T10:00:00',
    type: 'sale',
    product: { sku: 'APL-IP15PM-256', name: 'iPhone 15 Pro Max 256GB' },
    quantity: -3,
    reference: 'ORD-2024-152',
    branch: 'Main Branch',
    location: 'A-1-3',
    user: 'John Cashier',
    notes: 'Bulk purchase',
    beforeQty: 30,
    afterQty: 27,
  },
];

const movementTypes = [
  { value: 'sale', label: 'Sale', color: 'red', icon: <ShoppingCartOutlined /> },
  { value: 'receiving', label: 'Receiving', color: 'green', icon: <ArrowDownOutlined /> },
  { value: 'transfer_out', label: 'Transfer Out', color: 'orange', icon: <ArrowUpOutlined /> },
  { value: 'transfer_in', label: 'Transfer In', color: 'blue', icon: <ArrowDownOutlined /> },
  { value: 'adjustment', label: 'Adjustment', color: 'purple', icon: <ToolOutlined /> },
  { value: 'return', label: 'Return', color: 'cyan', icon: <SwapOutlined /> },
  { value: 'count', label: 'Count Adjustment', color: 'gold', icon: <InboxOutlined /> },
];

const branches = ['Main Branch', 'Downtown Store', 'Warehouse'];

const StockMovements = () => {
  const [movements] = useState(mockMovements);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState(null);
  const [filterBranch, setFilterBranch] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState(null);

  // Calculate stats
  const totalMovements = movements.length;
  const inboundMovements = movements.filter(m => m.quantity > 0).length;
  const outboundMovements = movements.filter(m => m.quantity < 0).length;
  const totalInbound = movements.filter(m => m.quantity > 0).reduce((sum, m) => sum + m.quantity, 0);
  const totalOutbound = Math.abs(movements.filter(m => m.quantity < 0).reduce((sum, m) => sum + m.quantity, 0));

  // Filter movements
  const filteredMovements = movements.filter(movement => {
    const matchesSearch = !searchText || 
      movement.product.name.toLowerCase().includes(searchText.toLowerCase()) ||
      movement.product.sku.toLowerCase().includes(searchText.toLowerCase()) ||
      movement.reference.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = !filterType || movement.type === filterType;
    const matchesBranch = !filterBranch || movement.branch === filterBranch;
    const matchesDate = !dateRange || (
      dayjs(movement.date).isAfter(dateRange[0].startOf('day')) &&
      dayjs(movement.date).isBefore(dateRange[1].endOf('day'))
    );
    return matchesSearch && matchesType && matchesBranch && matchesDate;
  });

  // Get movement type config
  const getTypeConfig = (type) => {
    return movementTypes.find(t => t.value === type) || { color: 'default', label: type, icon: <InboxOutlined /> };
  };

  // Table columns
  const columns = [
    {
      title: 'Movement ID',
      dataIndex: 'id',
      key: 'id',
      width: 140,
      render: (id) => <Text strong style={{ color: '#1890ff' }}>{id}</Text>,
    },
    {
      title: 'Date & Time',
      dataIndex: 'date',
      key: 'date',
      width: 160,
      render: (date) => (
        <Space direction="vertical" size={0}>
          <Text>{dayjs(date).format('MMM D, YYYY')}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {dayjs(date).format('h:mm A')}
          </Text>
        </Space>
      ),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 140,
      render: (type) => {
        const config = getTypeConfig(type);
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.label}
          </Tag>
        );
      },
      filters: movementTypes.map(t => ({ text: t.label, value: t.value })),
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Product',
      key: 'product',
      width: 250,
      render: (_, record) => (
        <Space>
          <Avatar 
            size="small"
            icon={<InboxOutlined />}
            style={{ backgroundColor: '#f5f5f5', color: '#666' }}
          />
          <div>
            <Text style={{ display: 'block' }}>{record.product.name}</Text>
            <Text type="secondary" style={{ fontSize: 11 }}>{record.product.sku}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      align: 'center',
      render: (quantity) => (
        <Text strong style={{ color: quantity > 0 ? '#52c41a' : '#ff4d4f', fontSize: 16 }}>
          {quantity > 0 ? '+' : ''}{quantity}
        </Text>
      ),
    },
    {
      title: 'Before → After',
      key: 'stockChange',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Text type="secondary">
          {record.beforeQty} → <Text strong>{record.afterQty}</Text>
        </Text>
      ),
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
      key: 'branch',
      width: 140,
      render: (branch) => (
        <Space>
          <ShopOutlined />
          {branch}
        </Space>
      ),
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference',
      width: 130,
      render: (reference) => <Tag>{reference}</Tag>,
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      width: 130,
      render: (user) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <Text type="secondary">{user}</Text>
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      render: (_, record) => (
        <Tooltip title="View Details">
          <Button 
            type="text" 
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          />
        </Tooltip>
      ),
    },
  ];

  // Handlers
  const handleViewDetails = (movement) => {
    setSelectedMovement(movement);
    setDetailDrawerVisible(true);
  };

  return (
    <div>
      <PageHeader
        title="Stock Movements"
        subtitle={`${totalMovements} movements recorded`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'Inventory', path: '/inventory' },
          { title: 'Stock Movements', path: '/inventory/movements' },
        ]}
        actions={[
          <Button key="export" icon={<ExportOutlined />}>Export</Button>,
        ]}
      />

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Movements"
            value={totalMovements}
            icon={<SwapOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Inbound"
            value={inboundMovements}
            suffix={`(${totalInbound} units)`}
            icon={<ArrowDownOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Outbound"
            value={outboundMovements}
            suffix={`(${totalOutbound} units)`}
            icon={<ArrowUpOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />}
            color="#ff4d4f"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Net Change"
            value={totalInbound - totalOutbound}
            icon={<InboxOutlined style={{ fontSize: 24, color: '#722ed1' }} />}
            color="#722ed1"
          />
        </Col>
      </Row>

      {/* Movement Type Summary */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {movementTypes.map((type) => {
          const count = movements.filter(m => m.type === type.value).length;
          return (
            <Col xs={12} sm={8} md={6} lg={3} key={type.value}>
              <Card 
                size="small" 
                hoverable
                style={{ 
                  textAlign: 'center',
                  borderColor: filterType === type.value ? type.color : undefined,
                  cursor: 'pointer'
                }}
                onClick={() => setFilterType(filterType === type.value ? null : type.value)}
              >
                <Tag color={type.color} icon={type.icon}>{type.label}</Tag>
                <Title level={4} style={{ margin: '8px 0 0' }}>{count}</Title>
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
              placeholder="Search product, SKU, or reference..."
              allowClear
              style={{ width: 280 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              placeholder="Movement Type"
              allowClear
              style={{ width: 150 }}
              value={filterType}
              onChange={setFilterType}
              options={movementTypes.map(t => ({ label: t.label, value: t.value }))}
            />
            <Select
              placeholder="Branch"
              allowClear
              style={{ width: 150 }}
              value={filterBranch}
              onChange={setFilterBranch}
              options={branches.map(b => ({ label: b, value: b }))}
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
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredMovements}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1500 }}
          pagination={{
            pageSize: 15,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} movements`,
          }}
        />
      </Card>

      {/* Movement Details Drawer */}
      <Drawer
        title="Movement Details"
        placement="right"
        width={500}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
      >
        {selectedMovement && (
          <>
            <div style={{ marginBottom: 24 }}>
              <Space>
                <Tag color={getTypeConfig(selectedMovement.type).color} icon={getTypeConfig(selectedMovement.type).icon}>
                  {getTypeConfig(selectedMovement.type).label}
                </Tag>
                <Text type="secondary">{selectedMovement.id}</Text>
              </Space>
            </div>

            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Date & Time">
                {dayjs(selectedMovement.date).format('MMMM D, YYYY h:mm A')}
              </Descriptions.Item>
              <Descriptions.Item label="Product">
                <Space direction="vertical" size={0}>
                  <Text strong>{selectedMovement.product.name}</Text>
                  <Text type="secondary">{selectedMovement.product.sku}</Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Quantity Change">
                <Text strong style={{ 
                  color: selectedMovement.quantity > 0 ? '#52c41a' : '#ff4d4f',
                  fontSize: 18
                }}>
                  {selectedMovement.quantity > 0 ? '+' : ''}{selectedMovement.quantity}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Stock Before">
                {selectedMovement.beforeQty}
              </Descriptions.Item>
              <Descriptions.Item label="Stock After">
                <Text strong>{selectedMovement.afterQty}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Branch">
                {selectedMovement.branch}
              </Descriptions.Item>
              <Descriptions.Item label="Location">
                {selectedMovement.location}
              </Descriptions.Item>
              <Descriptions.Item label="Reference">
                <Tag>{selectedMovement.reference}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Processed By">
                <Space>
                  <Avatar size="small" icon={<UserOutlined />} />
                  {selectedMovement.user}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Notes">
                {selectedMovement.notes || 'No notes'}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default StockMovements;
