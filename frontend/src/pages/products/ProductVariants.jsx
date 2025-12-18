import { useState } from 'react';
import { 
  Card, Table, Button, Space, Input, Select, Tag, 
  Tooltip, message, Typography, Modal, Form, InputNumber
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ExportOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockVariants = [
  {
    id: 1,
    productName: 'iPhone 15 Pro Max',
    attribute: 'Color',
    value: 'Natural Titanium',
    sku: 'APL-IP15PM-256-NT',
    price: 1499.00,
    stock: 15,
    status: 'active',
  },
  {
    id: 2,
    productName: 'iPhone 15 Pro Max',
    attribute: 'Color',
    value: 'Blue Titanium',
    sku: 'APL-IP15PM-256-BT',
    price: 1499.00,
    stock: 20,
    status: 'active',
  },
];

const ProductVariants = () => {
  const [variants, setVariants] = useState(mockVariants);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const totalVariants = variants.length;
  const activeVariants = variants.filter(v => v.status === 'active').length;

  const columns = [
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      width: 200,
    },
    {
      title: 'Attribute',
      dataIndex: 'attribute',
      key: 'attribute',
      width: 120,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      width: 150,
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      width: 180,
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
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button type="text" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Product Variants & Attributes"
        subtitle={`${variants.length} variants`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'Products', path: '/products' },
          { title: 'Variants', path: '/products/variants' },
        ]}
        actions={[
          <Button key="export" icon={<ExportOutlined />}>Export</Button>,
          <Button key="create" type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>
            New Variant
          </Button>,
        ]}
      />

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="Search variants..."
            allowClear
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <Table
          columns={columns}
          dataSource={variants}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
          }}
        />
      </Card>

      <FormDrawer
        title="Create Variant"
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          form.resetFields();
        }}
        form={form}
        fields={[
          { name: 'product', label: 'Product', type: 'select', options: [], required: true, span: 24 },
          { name: 'attribute', label: 'Attribute', type: 'text', required: true, span: 12 },
          { name: 'value', label: 'Value', type: 'text', required: true, span: 12 },
          { name: 'sku', label: 'SKU', type: 'text', required: true, span: 12 },
          { name: 'price', label: 'Price', type: 'currency', required: true, span: 12 },
          { name: 'stock', label: 'Stock', type: 'number', required: true, span: 12 },
        ]}
        onSubmit={(values) => {
          message.success('Variant created successfully');
          setDrawerVisible(false);
        }}
      />
    </div>
  );
};

export default ProductVariants;

