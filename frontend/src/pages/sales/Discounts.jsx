import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Input, Select, Tag, 
  Tooltip, Badge, message, Typography, DatePicker, Drawer,
  Descriptions, Switch, Progress, Form, InputNumber, Divider
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ExportOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  TagOutlined,
  PercentageOutlined,
  DollarOutlined,
  GiftOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  PauseCircleOutlined,
  FireOutlined,
  ShopOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer, ConfirmModal } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

// Mock discounts data
const mockDiscounts = [
  {
    id: 'PROMO-001',
    name: 'New Year Sale 2024',
    code: 'NEWYEAR2024',
    type: 'percentage',
    value: 15,
    minPurchase: 100,
    maxDiscount: 50,
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    usageLimit: 1000,
    usedCount: 456,
    perCustomerLimit: 1,
    status: 'active',
    applicableTo: 'all_products',
    categories: [],
    products: [],
    customerTypes: ['all'],
    branches: ['all'],
    description: 'New Year celebration discount - 15% off on all items',
    createdBy: 'Admin',
    createdAt: '2023-12-20',
  },
  {
    id: 'PROMO-002',
    name: 'VIP Member Exclusive',
    code: 'VIP20',
    type: 'percentage',
    value: 20,
    minPurchase: 200,
    maxDiscount: null,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    usageLimit: null,
    usedCount: 89,
    perCustomerLimit: null,
    status: 'active',
    applicableTo: 'all_products',
    categories: [],
    products: [],
    customerTypes: ['VIP'],
    branches: ['all'],
    description: 'Exclusive discount for VIP members',
    createdBy: 'Admin',
    createdAt: '2024-01-01',
  },
  {
    id: 'PROMO-003',
    name: 'Flash Sale - Electronics',
    code: 'FLASH50',
    type: 'fixed',
    value: 50,
    minPurchase: 500,
    maxDiscount: 50,
    startDate: '2024-01-15',
    endDate: '2024-01-15',
    usageLimit: 100,
    usedCount: 100,
    perCustomerLimit: 1,
    status: 'expired',
    applicableTo: 'specific_categories',
    categories: ['Electronics', 'Smartphones'],
    products: [],
    customerTypes: ['all'],
    branches: ['Main Branch', 'Downtown Store'],
    description: 'One day flash sale on electronics',
    createdBy: 'Marketing',
    createdAt: '2024-01-10',
  },
  {
    id: 'PROMO-004',
    name: 'Buy 2 Get 1 Free - Accessories',
    code: 'B2G1ACC',
    type: 'buy_x_get_y',
    value: 0,
    buyQuantity: 2,
    getQuantity: 1,
    minPurchase: 0,
    maxDiscount: null,
    startDate: '2024-01-10',
    endDate: '2024-02-28',
    usageLimit: 500,
    usedCount: 123,
    perCustomerLimit: 3,
    status: 'active',
    applicableTo: 'specific_categories',
    categories: ['Accessories'],
    products: [],
    customerTypes: ['all'],
    branches: ['all'],
    description: 'Buy 2 accessories, get 1 free',
    createdBy: 'Marketing',
    createdAt: '2024-01-08',
  },
  {
    id: 'PROMO-005',
    name: 'First Purchase Discount',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minPurchase: 50,
    maxDiscount: 25,
    startDate: '2024-01-01',
    endDate: null,
    usageLimit: null,
    usedCount: 234,
    perCustomerLimit: 1,
    status: 'active',
    applicableTo: 'all_products',
    categories: [],
    products: [],
    customerTypes: ['all'],
    isFirstPurchaseOnly: true,
    branches: ['all'],
    description: 'Welcome discount for new customers',
    createdBy: 'Admin',
    createdAt: '2024-01-01',
  },
  {
    id: 'PROMO-006',
    name: 'Corporate Bulk Discount',
    code: 'CORP25',
    type: 'percentage',
    value: 25,
    minPurchase: 5000,
    maxDiscount: null,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    usageLimit: null,
    usedCount: 12,
    perCustomerLimit: null,
    status: 'active',
    applicableTo: 'all_products',
    categories: [],
    products: [],
    customerTypes: ['Corporate'],
    branches: ['all'],
    description: 'Special discount for corporate bulk orders',
    createdBy: 'Admin',
    createdAt: '2024-01-01',
  },
  {
    id: 'PROMO-007',
    name: 'Paused Holiday Promo',
    code: 'HOLIDAY20',
    type: 'percentage',
    value: 20,
    minPurchase: 150,
    maxDiscount: 100,
    startDate: '2024-02-01',
    endDate: '2024-02-14',
    usageLimit: 500,
    usedCount: 0,
    perCustomerLimit: 2,
    status: 'paused',
    applicableTo: 'all_products',
    categories: [],
    products: [],
    customerTypes: ['all'],
    branches: ['all'],
    description: 'Valentine\'s Day special - temporarily paused',
    createdBy: 'Marketing',
    createdAt: '2024-01-15',
  },
];

const discountTypes = [
  { value: 'percentage', label: 'Percentage Off', icon: <PercentageOutlined /> },
  { value: 'fixed', label: 'Fixed Amount', icon: <DollarOutlined /> },
  { value: 'buy_x_get_y', label: 'Buy X Get Y Free', icon: <GiftOutlined /> },
];

const Discounts = () => {
  const [discounts, setDiscounts] = useState(mockDiscounts);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [form] = Form.useForm();

  // Calculate stats
  const activeDiscounts = discounts.filter(d => d.status === 'active').length;
  const totalUsage = discounts.reduce((sum, d) => sum + d.usedCount, 0);
  const avgUsageRate = discounts.filter(d => d.usageLimit)
    .reduce((sum, d, _, arr) => sum + (d.usedCount / d.usageLimit * 100) / arr.length, 0);

  // Filter discounts
  const filteredDiscounts = discounts.filter(discount => {
    const matchesSearch = !searchText || 
      discount.name.toLowerCase().includes(searchText.toLowerCase()) ||
      discount.code.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !filterStatus || discount.status === filterStatus;
    const matchesType = !filterType || discount.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Get status config
  const getStatusConfig = (status) => {
    const config = {
      active: { color: 'success', text: 'Active', icon: <CheckCircleOutlined /> },
      paused: { color: 'warning', text: 'Paused', icon: <PauseCircleOutlined /> },
      expired: { color: 'default', text: 'Expired', icon: <ClockCircleOutlined /> },
      scheduled: { color: 'processing', text: 'Scheduled', icon: <CalendarOutlined /> },
    };
    return config[status] || config.active;
  };

  // Get type config
  const getTypeConfig = (type) => {
    return discountTypes.find(t => t.value === type) || discountTypes[0];
  };

  // Format discount value
  const formatValue = (discount) => {
    if (discount.type === 'percentage') {
      return `${discount.value}%`;
    } else if (discount.type === 'fixed') {
      return `$${discount.value}`;
    } else if (discount.type === 'buy_x_get_y') {
      return `Buy ${discount.buyQuantity} Get ${discount.getQuantity}`;
    }
    return discount.value;
  };

  // Table columns
  const columns = [
    {
      title: 'Promo Code',
      key: 'code',
      width: 180,
      fixed: 'left',
      render: (_, record) => (
        <div>
          <Space>
            <Text strong style={{ color: '#1890ff', fontFamily: 'monospace' }}>{record.code}</Text>
            <Tooltip title="Copy Code">
              <Button 
                type="text" 
                size="small"
                icon={<CopyOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(record.code);
                  message.success('Code copied!');
                }}
              />
            </Tooltip>
          </Space>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>{record.name}</Text>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 140,
      render: (type) => {
        const config = getTypeConfig(type);
        return (
          <Space>
            {config.icon}
            <span>{config.label}</span>
          </Space>
        );
      },
    },
    {
      title: 'Value',
      key: 'value',
      width: 120,
      render: (_, record) => (
        <Text strong style={{ color: '#52c41a', fontSize: 16 }}>
          {formatValue(record)}
        </Text>
      ),
    },
    {
      title: 'Validity',
      key: 'validity',
      width: 180,
      render: (_, record) => (
        <div>
          <div>{dayjs(record.startDate).format('MMM D')} - {record.endDate ? dayjs(record.endDate).format('MMM D, YYYY') : 'No End'}</div>
          {record.endDate && dayjs().isAfter(record.endDate) ? (
            <Text type="secondary" style={{ fontSize: 11 }}>Ended</Text>
          ) : (
            <Text type="secondary" style={{ fontSize: 11 }}>
              {dayjs(record.endDate).diff(dayjs(), 'day')} days left
            </Text>
          )}
        </div>
      ),
    },
    {
      title: 'Usage',
      key: 'usage',
      width: 150,
      render: (_, record) => (
        <div>
          {record.usageLimit ? (
            <>
              <Progress 
                percent={Math.round((record.usedCount / record.usageLimit) * 100)}
                size="small"
                status={record.usedCount >= record.usageLimit ? 'exception' : undefined}
              />
              <Text type="secondary" style={{ fontSize: 11 }}>
                {record.usedCount} / {record.usageLimit}
              </Text>
            </>
          ) : (
            <Text>{record.usedCount} uses (unlimited)</Text>
          )}
        </div>
      ),
    },
    {
      title: 'Applicable To',
      key: 'applicableTo',
      width: 150,
      render: (_, record) => (
        <div>
          {record.applicableTo === 'all_products' ? (
            <Tag>All Products</Tag>
          ) : (
            <Space wrap>
              {record.categories.slice(0, 2).map((cat, idx) => (
                <Tag key={idx}>{cat}</Tag>
              ))}
              {record.categories.length > 2 && (
                <Tag>+{record.categories.length - 2}</Tag>
              )}
            </Space>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color} icon={config.icon}>{config.text}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
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
          <Tooltip title="Edit">
            <Button 
              type="text" 
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title={record.status === 'active' ? 'Pause' : 'Activate'}>
            <Switch 
              size="small"
              checked={record.status === 'active'}
              onChange={() => handleToggleStatus(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Handlers
  const handleCreateDiscount = () => {
    form.resetFields();
    setSelectedDiscount(null);
    setDrawerVisible(true);
  };

  const handleViewDetails = (discount) => {
    setSelectedDiscount(discount);
    setDetailDrawerVisible(true);
  };

  const handleEdit = (discount) => {
    setSelectedDiscount(discount);
    form.setFieldsValue(discount);
    setDrawerVisible(true);
  };

  const handleToggleStatus = (discount) => {
    const newStatus = discount.status === 'active' ? 'paused' : 'active';
    setDiscounts(discounts.map(d => d.id === discount.id ? { ...d, status: newStatus } : d));
    message.success(`Discount ${newStatus === 'active' ? 'activated' : 'paused'}`);
  };

  const handleSaveDiscount = () => {
    form.validateFields().then(values => {
      if (selectedDiscount) {
        setDiscounts(discounts.map(d => d.id === selectedDiscount.id ? { ...d, ...values } : d));
        message.success('Discount updated');
      } else {
        const newDiscount = {
          id: `PROMO-${String(discounts.length + 8).padStart(3, '0')}`,
          ...values,
          status: 'active',
          usedCount: 0,
          createdBy: 'Current User',
          createdAt: dayjs().format('YYYY-MM-DD'),
        };
        setDiscounts([newDiscount, ...discounts]);
        message.success('Discount created');
      }
      setDrawerVisible(false);
    });
  };

  // Form fields
  const formFields = [
    {
      name: 'name',
      label: 'Promotion Name',
      type: 'input',
      placeholder: 'e.g., Summer Sale 2024',
      rules: [{ required: true, message: 'Please enter promotion name' }],
      span: 24,
    },
    {
      name: 'code',
      label: 'Promo Code',
      type: 'input',
      placeholder: 'e.g., SUMMER20',
      rules: [{ required: true, message: 'Please enter promo code' }],
      span: 12,
    },
    {
      name: 'type',
      label: 'Discount Type',
      type: 'select',
      options: discountTypes.map(t => ({ label: t.label, value: t.value })),
      rules: [{ required: true, message: 'Please select type' }],
      span: 12,
    },
    {
      name: 'value',
      label: 'Value',
      type: 'number',
      placeholder: '0',
      rules: [{ required: true, message: 'Please enter value' }],
      span: 12,
    },
    {
      name: 'minPurchase',
      label: 'Min. Purchase',
      type: 'number',
      placeholder: '0',
      span: 12,
    },
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      rules: [{ required: true, message: 'Please select start date' }],
      span: 12,
    },
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
      span: 12,
    },
    {
      name: 'usageLimit',
      label: 'Usage Limit',
      type: 'number',
      placeholder: 'Leave empty for unlimited',
      span: 12,
    },
    {
      name: 'perCustomerLimit',
      label: 'Per Customer Limit',
      type: 'number',
      placeholder: 'Leave empty for unlimited',
      span: 12,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      span: 24,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Discounts & Promotions"
        subtitle={`${filteredDiscounts.length} promotions`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'Sales', path: '/sales' },
          { title: 'Discounts', path: '/sales/discounts' },
        ]}
        actions={[
          <Button key="export" icon={<ExportOutlined />}>Export</Button>,
          <Button key="create" type="primary" icon={<PlusOutlined />} onClick={handleCreateDiscount}>
            New Promotion
          </Button>,
        ]}
      />

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Promotions"
            value={discounts.length}
            icon={<TagOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Active"
            value={activeDiscounts}
            icon={<FireOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Redemptions"
            value={totalUsage}
            icon={<GiftOutlined style={{ fontSize: 24, color: '#722ed1' }} />}
            color="#722ed1"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Avg. Usage Rate"
            value={`${avgUsageRate.toFixed(1)}%`}
            icon={<PercentageOutlined style={{ fontSize: 24, color: '#faad14' }} />}
            color="#faad14"
          />
        </Col>
      </Row>

      {/* Active Promotions Highlight */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {discounts.filter(d => d.status === 'active').slice(0, 3).map(promo => (
          <Col xs={24} md={8} key={promo.id}>
            <Card 
              size="small" 
              hoverable
              onClick={() => handleViewDetails(promo)}
              style={{ borderLeft: '4px solid #52c41a' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Tag color="success">Active</Tag>
                  <Title level={5} style={{ marginTop: 8, marginBottom: 4 }}>
                    <Text copyable={{ text: promo.code }}>{promo.code}</Text>
                  </Title>
                  <Text type="secondary">{promo.name}</Text>
                </div>
                <Title level={3} style={{ margin: 0, color: '#52c41a' }}>
                  {formatValue(promo)}
                </Title>
              </div>
              {promo.usageLimit && (
                <Progress 
                  percent={Math.round((promo.usedCount / promo.usageLimit) * 100)}
                  size="small"
                  style={{ marginTop: 12 }}
                />
              )}
            </Card>
          </Col>
        ))}
      </Row>

      {/* Filters and Table */}
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Space wrap>
            <Search
              placeholder="Search promotions..."
              allowClear
              style={{ width: 220 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              placeholder="Status"
              allowClear
              style={{ width: 130 }}
              value={filterStatus}
              onChange={setFilterStatus}
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Paused', value: 'paused' },
                { label: 'Expired', value: 'expired' },
              ]}
            />
            <Select
              placeholder="Type"
              allowClear
              style={{ width: 160 }}
              value={filterType}
              onChange={setFilterType}
              options={discountTypes.map(t => ({ label: t.label, value: t.value }))}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredDiscounts}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1300 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} promotions`,
          }}
        />
      </Card>

      {/* Create/Edit Drawer */}
      <FormDrawer
        title={selectedDiscount ? 'Edit Promotion' : 'Create Promotion'}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onSubmit={handleSaveDiscount}
        form={form}
        fields={formFields}
        width={600}
      />

      {/* Details Drawer */}
      <Drawer
        title="Promotion Details"
        placement="right"
        width={550}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        extra={
          <Space>
            <Button icon={<EditOutlined />} onClick={() => {
              setDetailDrawerVisible(false);
              handleEdit(selectedDiscount);
            }}>Edit</Button>
          </Space>
        }
      >
        {selectedDiscount && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24, padding: 24, background: '#f5f5f5', borderRadius: 8 }}>
              <Tag color={getStatusConfig(selectedDiscount.status).color} style={{ marginBottom: 8 }}>
                {getStatusConfig(selectedDiscount.status).text}
              </Tag>
              <Title level={2} style={{ margin: '8px 0', color: '#1890ff', fontFamily: 'monospace' }}>
                {selectedDiscount.code}
              </Title>
              <Text>{selectedDiscount.name}</Text>
              <div style={{ marginTop: 16 }}>
                <Title level={1} style={{ margin: 0, color: '#52c41a' }}>
                  {formatValue(selectedDiscount)}
                </Title>
                <Text type="secondary">{getTypeConfig(selectedDiscount.type).label}</Text>
              </div>
            </div>

            <Descriptions column={2} bordered size="small" style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Min. Purchase">
                ${selectedDiscount.minPurchase || 0}
              </Descriptions.Item>
              <Descriptions.Item label="Max Discount">
                {selectedDiscount.maxDiscount ? `$${selectedDiscount.maxDiscount}` : 'No Limit'}
              </Descriptions.Item>
              <Descriptions.Item label="Start Date">
                {dayjs(selectedDiscount.startDate).format('MMM D, YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="End Date">
                {selectedDiscount.endDate ? dayjs(selectedDiscount.endDate).format('MMM D, YYYY') : 'No End'}
              </Descriptions.Item>
              <Descriptions.Item label="Usage Limit">
                {selectedDiscount.usageLimit || 'Unlimited'}
              </Descriptions.Item>
              <Descriptions.Item label="Used">
                {selectedDiscount.usedCount} times
              </Descriptions.Item>
              <Descriptions.Item label="Per Customer">
                {selectedDiscount.perCustomerLimit || 'Unlimited'}
              </Descriptions.Item>
              <Descriptions.Item label="Created By">
                {selectedDiscount.createdBy}
              </Descriptions.Item>
            </Descriptions>

            {selectedDiscount.usageLimit && (
              <Card size="small" style={{ marginBottom: 24 }}>
                <Text strong>Usage Progress</Text>
                <Progress 
                  percent={Math.round((selectedDiscount.usedCount / selectedDiscount.usageLimit) * 100)}
                  status={selectedDiscount.usedCount >= selectedDiscount.usageLimit ? 'exception' : 'active'}
                  format={() => `${selectedDiscount.usedCount} / ${selectedDiscount.usageLimit}`}
                />
              </Card>
            )}

            <Divider orientation="left">Applicability</Divider>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Products">
                {selectedDiscount.applicableTo === 'all_products' ? (
                  <Tag color="blue">All Products</Tag>
                ) : (
                  <Space wrap>
                    {selectedDiscount.categories.map((cat, idx) => (
                      <Tag key={idx}>{cat}</Tag>
                    ))}
                  </Space>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Customer Types">
                {selectedDiscount.customerTypes.includes('all') ? (
                  <Tag color="green">All Customers</Tag>
                ) : (
                  <Space wrap>
                    {selectedDiscount.customerTypes.map((type, idx) => (
                      <Tag key={idx} icon={<UserOutlined />}>{type}</Tag>
                    ))}
                  </Space>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Branches">
                {selectedDiscount.branches.includes('all') ? (
                  <Tag color="purple">All Branches</Tag>
                ) : (
                  <Space wrap>
                    {selectedDiscount.branches.map((branch, idx) => (
                      <Tag key={idx} icon={<ShopOutlined />}>{branch}</Tag>
                    ))}
                  </Space>
                )}
              </Descriptions.Item>
            </Descriptions>

            {selectedDiscount.description && (
              <>
                <Divider orientation="left">Description</Divider>
                <Card size="small" style={{ backgroundColor: '#fafafa' }}>
                  <Text>{selectedDiscount.description}</Text>
                </Card>
              </>
            )}
          </>
        )}
      </Drawer>
    </div>
  );
};

export default Discounts;
