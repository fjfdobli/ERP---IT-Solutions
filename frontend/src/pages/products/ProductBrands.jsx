import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Input, Tag, 
  Tooltip, Badge, Form, message, Typography, Avatar,
  Popconfirm, Image
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  GlobalOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import { PageHeader, FormDrawer, ConfirmModal, StatCard } from '../../components/Common';

const { Search } = Input;
const { Text, Title, Link } = Typography;

// Mock brands data
const mockBrands = [
  {
    id: 1,
    name: 'Apple',
    slug: 'apple',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    description: 'American multinational technology company',
    website: 'https://www.apple.com',
    country: 'United States',
    productCount: 45,
    status: 'active',
    featured: true,
  },
  {
    id: 2,
    name: 'Samsung',
    slug: 'samsung',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg',
    description: 'South Korean multinational conglomerate',
    website: 'https://www.samsung.com',
    country: 'South Korea',
    productCount: 38,
    status: 'active',
    featured: true,
  },
  {
    id: 3,
    name: 'Sony',
    slug: 'sony',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg',
    description: 'Japanese multinational corporation',
    website: 'https://www.sony.com',
    country: 'Japan',
    productCount: 28,
    status: 'active',
    featured: false,
  },
  {
    id: 4,
    name: 'LG',
    slug: 'lg',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/LG_symbol.svg',
    description: 'South Korean multinational electronics company',
    website: 'https://www.lg.com',
    country: 'South Korea',
    productCount: 22,
    status: 'active',
    featured: false,
  },
  {
    id: 5,
    name: 'Dell',
    slug: 'dell',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg',
    description: 'American computer technology company',
    website: 'https://www.dell.com',
    country: 'United States',
    productCount: 18,
    status: 'active',
    featured: false,
  },
  {
    id: 6,
    name: 'Logitech',
    slug: 'logitech',
    logo: 'https://via.placeholder.com/100?text=L',
    description: 'Swiss manufacturer of computer peripherals',
    website: 'https://www.logitech.com',
    country: 'Switzerland',
    productCount: 35,
    status: 'active',
    featured: true,
  },
  {
    id: 7,
    name: 'Microsoft',
    slug: 'microsoft',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
    description: 'American multinational technology corporation',
    website: 'https://www.microsoft.com',
    country: 'United States',
    productCount: 24,
    status: 'active',
    featured: true,
  },
  {
    id: 8,
    name: 'Google',
    slug: 'google',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg',
    description: 'American multinational technology company',
    website: 'https://www.google.com',
    country: 'United States',
    productCount: 12,
    status: 'active',
    featured: false,
  },
  {
    id: 9,
    name: 'Bose',
    slug: 'bose',
    logo: 'https://via.placeholder.com/100?text=B',
    description: 'American audio equipment manufacturer',
    website: 'https://www.bose.com',
    country: 'United States',
    productCount: 15,
    status: 'active',
    featured: false,
  },
  {
    id: 10,
    name: 'JBL',
    slug: 'jbl',
    logo: 'https://via.placeholder.com/100?text=JBL',
    description: 'American audio electronics company',
    website: 'https://www.jbl.com',
    country: 'United States',
    productCount: 20,
    status: 'inactive',
    featured: false,
  },
];

const ProductBrands = () => {
  const [brands, setBrands] = useState(mockBrands);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [form] = Form.useForm();

  // Stats
  const totalBrands = brands.length;
  const activeBrands = brands.filter(b => b.status === 'active').length;
  const featuredBrands = brands.filter(b => b.featured).length;
  const totalProducts = brands.reduce((sum, b) => sum + b.productCount, 0);

  // Filter brands
  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchText.toLowerCase()) ||
    brand.country.toLowerCase().includes(searchText.toLowerCase())
  );

  // Table columns
  const columns = [
    {
      title: 'Brand',
      key: 'brand',
      width: 280,
      render: (_, record) => (
        <Space>
          <Avatar 
            shape="square" 
            size={48} 
            src={record.logo}
            style={{ backgroundColor: '#f5f5f5' }}
          >
            {record.name[0]}
          </Avatar>
          <div>
            <Space>
              <Text strong>{record.name}</Text>
              {record.featured && <Tag color="gold">Featured</Tag>}
            </Space>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>{record.slug}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 250,
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      width: 130,
      render: (country) => (
        <Space>
          <GlobalOutlined />
          {country}
        </Space>
      ),
      filters: [...new Set(brands.map(b => b.country))].map(c => ({ text: c, value: c })),
      onFilter: (value, record) => record.country === value,
    },
    {
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
      width: 150,
      render: (website) => (
        <Link href={website} target="_blank" style={{ fontSize: 12 }}>
          Visit Website
        </Link>
      ),
    },
    {
      title: 'Products',
      dataIndex: 'productCount',
      key: 'productCount',
      width: 100,
      align: 'center',
      render: (count) => <Badge count={count} style={{ backgroundColor: '#1890ff' }} showZero />,
      sorter: (a, b) => a.productCount - b.productCount,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button 
              type="text" 
              icon={<EditOutlined />}
              onClick={() => handleEditBrand(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this brand?"
            description={record.productCount > 0 ? 
              `This brand has ${record.productCount} products. They will be unassigned.` : 
              'Are you sure?'
            }
            onConfirm={() => handleDelete(record)}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Handlers
  const handleAddBrand = () => {
    setEditingBrand(null);
    form.resetFields();
    setDrawerVisible(true);
  };

  const handleEditBrand = (brand) => {
    setEditingBrand(brand);
    form.setFieldsValue(brand);
    setDrawerVisible(true);
  };

  const handleDelete = (brand) => {
    setBrands(brands.filter(b => b.id !== brand.id));
    message.success(`Brand "${brand.name}" deleted`);
  };

  const handleSaveBrand = () => {
    form.validateFields().then(values => {
      if (editingBrand) {
        setBrands(brands.map(b => 
          b.id === editingBrand.id ? { ...b, ...values } : b
        ));
        message.success('Brand updated successfully');
      } else {
        const newBrand = {
          ...values,
          id: Date.now(),
          productCount: 0,
          slug: values.name.toLowerCase().replace(/\s+/g, '-'),
        };
        setBrands([newBrand, ...brands]);
        message.success('Brand created successfully');
      }
      setDrawerVisible(false);
    });
  };

  // Form fields
  const formFields = [
    {
      name: 'name',
      label: 'Brand Name',
      type: 'input',
      rules: [{ required: true, message: 'Please enter brand name' }],
      span: 24,
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'input',
      placeholder: 'auto-generated-from-name',
      span: 24,
    },
    {
      name: 'logo',
      label: 'Logo URL',
      type: 'input',
      placeholder: 'https://example.com/logo.png',
      span: 24,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      span: 24,
    },
    {
      name: 'website',
      label: 'Website',
      type: 'input',
      placeholder: 'https://www.example.com',
      span: 24,
    },
    {
      name: 'country',
      label: 'Country',
      type: 'select',
      options: [
        { label: 'United States', value: 'United States' },
        { label: 'South Korea', value: 'South Korea' },
        { label: 'Japan', value: 'Japan' },
        { label: 'China', value: 'China' },
        { label: 'Germany', value: 'Germany' },
        { label: 'Switzerland', value: 'Switzerland' },
        { label: 'Taiwan', value: 'Taiwan' },
        { label: 'Other', value: 'Other' },
      ],
      span: 12,
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
      initialValue: 'active',
      span: 12,
    },
    {
      name: 'featured',
      label: 'Featured Brand',
      type: 'switch',
      span: 24,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Product Brands"
        subtitle={`${totalBrands} brands registered`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'Products', path: '/products' },
          { title: 'Brands', path: '/products/brands' },
        ]}
        actions={[
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={handleAddBrand}>
            Add Brand
          </Button>,
        ]}
      />

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Brands"
            value={totalBrands}
            icon={<ShopOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Active Brands"
            value={activeBrands}
            icon={<ShopOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Featured"
            value={featuredBrands}
            icon={<ShopOutlined style={{ fontSize: 24, color: '#faad14' }} />}
            color="#faad14"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Products"
            value={totalProducts}
            icon={<ShopOutlined style={{ fontSize: 24, color: '#722ed1' }} />}
            color="#722ed1"
          />
        </Col>
      </Row>

      {/* Brands Table */}
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="Search brands..."
            allowClear
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredBrands}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} brands`,
          }}
        />
      </Card>

      {/* Add/Edit Brand Drawer */}
      <FormDrawer
        title={editingBrand ? 'Edit Brand' : 'Add New Brand'}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onSubmit={handleSaveBrand}
        form={form}
        fields={formFields}
        width={500}
      />
    </div>
  );
};

export default ProductBrands;
