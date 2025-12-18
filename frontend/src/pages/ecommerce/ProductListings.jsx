import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Input, Select, Tag, 
  Tooltip, message, Typography, Switch, Image
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ExportOutlined,
  EditOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockListings = [
  {
    id: 1,
    productName: 'iPhone 15 Pro Max',
    sku: 'APL-IP15PM-256',
    price: 1499.00,
    stock: 45,
    status: 'active',
    views: 1250,
    sales: 23,
    image: 'https://via.placeholder.com/50',
  },
];

const ProductListings = () => {
  const [listings, setListings] = useState(mockListings);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');

  const totalListings = listings.length;
  const activeListings = listings.filter(l => l.status === 'active').length;
  const totalSales = listings.reduce((sum, l) => sum + l.sales, 0);

  const columns = [
    {
      title: 'Product',
      key: 'product',
      width: 200,
      render: (_, record) => (
        <Space>
          <Image width={50} height={50} src={record.image} fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKCO7DkgDqOhDuDmQgyExIATCs6A1hKEjHgNSJ2STC16
      h2cB/4yA8BH3Uy8MLxKzTmEMCuKLZxSSgE5fUFNTU9OpNL6wsVQzCRggDl4pBgcgeSQUlqRYmOp4ysh1jVFdPesrLCiUlvUXA4L1cRpcjp1VEFHEEcrK4nwgzEeAFuZktjSkTDLliDDZcbuwuMDQEFGxB0h1T9NDI8H0HEMdikGBwSwwqGDXhTkYXHgkBzb4dBxXhFAKMfRcHhwaU8xKE4hVHAeISdSQgQ9g5gWDAyaCxhYgP0jQ6ZGRhYgPDDgWN6BYlEi3AGM31iBM04DMGBggF3jy6DgdCLFUAYRYgdN8N8A4NRkYOLoYUQxMhhgPDgQYF6QQElcRYdN4YQcQYgB0zhBoa+BUxTBYeDxH0fwsCAgZF7ImkyC44eIMzCjT3cSgyJmOJgO3caxsDAoB6h4jvE6ZGRgYExDzGmBhQCBOQSkseSxIDgdkGC2CspjaG2CgYH2xFmpXkLAhL2MgeHgtuKjm5uKgYH1yrrqyBlpGBgYH7C//9L4jVHcTAR9MDv9k8GAE8DFv0Aes8jIAAAAAElFTkSuQmCC" />
          <div>
            <div>{record.productName}</div>
            <Text type="secondary" style={{ fontSize: 11 }}>{record.sku}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      width: 80,
    },
    {
      title: 'Views',
      dataIndex: 'views',
      key: 'views',
      width: 80,
    },
    {
      title: 'Sales',
      dataIndex: 'sales',
      key: 'sales',
      width: 80,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space>
          <Tooltip title="View">
            <Button type="text" icon={<EyeOutlined />} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button type="text" icon={<EditOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Product Listings"
        subtitle={`${listings.length} listings`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'E-Commerce', path: '/ecommerce' },
          { title: 'Product Listings', path: '/ecommerce/products' },
        ]}
        actions={[
          <Button key="export" icon={<ExportOutlined />}>Export</Button>,
          <Button key="create" type="primary" icon={<PlusOutlined />}>Add Listing</Button>,
        ]}
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}>
          <StatCard
            title="Total Listings"
            value={totalListings}
            icon={<CheckCircleOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <StatCard
            title="Active"
            value={activeListings}
            icon={<CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} md={8}>
          <StatCard
            title="Total Sales"
            value={totalSales}
            icon={<CheckCircleOutlined style={{ fontSize: 24, color: '#722ed1' }} />}
            color="#722ed1"
          />
        </Col>
      </Row>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="Search listings..."
            allowClear
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <Table
          columns={columns}
          dataSource={listings}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
          }}
        />
      </Card>
    </div>
  );
};

export default ProductListings;

