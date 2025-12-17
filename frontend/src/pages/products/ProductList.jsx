import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Input, Select, Tag, 
  Tooltip, Avatar, Badge, Dropdown, Modal, Form, InputNumber,
  Upload, message, Tabs, Typography, Statistic, Drawer, Descriptions,
  Image, Switch, Divider, Popconfirm
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  ExportOutlined,
  ImportOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  BarcodeOutlined,
  DollarOutlined,
  InboxOutlined,
  TagOutlined,
  CopyOutlined,
  PrinterOutlined,
  UploadOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer, FilterPanel, ConfirmModal } from '../../components/Common';

const { Search } = Input;
const { Option } = Select;
const { Text, Title } = Typography;
const { TabPane } = Tabs;

// Mock data
const mockProducts = [
  {
    id: 1,
    sku: 'APL-IP15PM-256',
    barcode: '8901234567890',
    name: 'iPhone 15 Pro Max 256GB',
    description: 'Apple iPhone 15 Pro Max with A17 Pro chip',
    category: 'Smartphones',
    brand: 'Apple',
    unit: 'Piece',
    costPrice: 1099.00,
    sellingPrice: 1499.00,
    wholesalePrice: 1350.00,
    stock: 45,
    minStock: 10,
    maxStock: 100,
    reorderLevel: 20,
    status: 'active',
    taxable: true,
    taxRate: 12,
    image: 'https://via.placeholder.com/100',
    variants: 3,
    supplier: 'Apple Inc.',
    location: 'Warehouse A - Shelf 3',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
  },
  {
    id: 2,
    sku: 'SAM-GS24U-512',
    barcode: '8901234567891',
    name: 'Samsung Galaxy S24 Ultra 512GB',
    description: 'Samsung Galaxy S24 Ultra with Snapdragon 8 Gen 3',
    category: 'Smartphones',
    brand: 'Samsung',
    unit: 'Piece',
    costPrice: 899.00,
    sellingPrice: 1299.00,
    wholesalePrice: 1150.00,
    stock: 32,
    minStock: 10,
    maxStock: 80,
    reorderLevel: 15,
    status: 'active',
    taxable: true,
    taxRate: 12,
    image: 'https://via.placeholder.com/100',
    variants: 4,
    supplier: 'Samsung Electronics',
    location: 'Warehouse A - Shelf 4',
    createdAt: '2024-01-02',
    updatedAt: '2024-01-14',
  },
  {
    id: 3,
    sku: 'APL-MBP-M3-14',
    barcode: '8901234567892',
    name: 'MacBook Pro 14" M3 Pro',
    description: 'Apple MacBook Pro 14-inch with M3 Pro chip',
    category: 'Laptops',
    brand: 'Apple',
    unit: 'Piece',
    costPrice: 1799.00,
    sellingPrice: 2499.00,
    wholesalePrice: 2200.00,
    stock: 12,
    minStock: 5,
    maxStock: 30,
    reorderLevel: 8,
    status: 'active',
    taxable: true,
    taxRate: 12,
    image: 'https://via.placeholder.com/100',
    variants: 2,
    supplier: 'Apple Inc.',
    location: 'Warehouse B - Shelf 1',
    createdAt: '2024-01-03',
    updatedAt: '2024-01-12',
  },
  {
    id: 4,
    sku: 'SNY-WH1000XM5',
    barcode: '8901234567893',
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Sony Premium Noise Cancelling Wireless Headphones',
    category: 'Audio',
    brand: 'Sony',
    unit: 'Piece',
    costPrice: 250.00,
    sellingPrice: 399.00,
    wholesalePrice: 350.00,
    stock: 67,
    minStock: 20,
    maxStock: 150,
    reorderLevel: 30,
    status: 'active',
    taxable: true,
    taxRate: 12,
    image: 'https://via.placeholder.com/100',
    variants: 2,
    supplier: 'Sony Corporation',
    location: 'Warehouse A - Shelf 8',
    createdAt: '2024-01-04',
    updatedAt: '2024-01-10',
  },
  {
    id: 5,
    sku: 'LG-OLED65C3',
    barcode: '8901234567894',
    name: 'LG OLED 65" C3 4K Smart TV',
    description: 'LG 65-inch OLED evo C3 Series 4K Smart TV',
    category: 'Television',
    brand: 'LG',
    unit: 'Piece',
    costPrice: 1200.00,
    sellingPrice: 1799.00,
    wholesalePrice: 1600.00,
    stock: 8,
    minStock: 5,
    maxStock: 20,
    reorderLevel: 5,
    status: 'low_stock',
    taxable: true,
    taxRate: 12,
    image: 'https://via.placeholder.com/100',
    variants: 0,
    supplier: 'LG Electronics',
    location: 'Warehouse C - Floor Display',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-08',
  },
  {
    id: 6,
    sku: 'APL-APP2',
    barcode: '8901234567895',
    name: 'AirPods Pro 2nd Generation',
    description: 'Apple AirPods Pro with USB-C MagSafe Case',
    category: 'Audio',
    brand: 'Apple',
    unit: 'Piece',
    costPrice: 180.00,
    sellingPrice: 249.00,
    wholesalePrice: 220.00,
    stock: 3,
    minStock: 15,
    maxStock: 100,
    reorderLevel: 25,
    status: 'low_stock',
    taxable: true,
    taxRate: 12,
    image: 'https://via.placeholder.com/100',
    variants: 0,
    supplier: 'Apple Inc.',
    location: 'Warehouse A - Shelf 2',
    createdAt: '2024-01-06',
    updatedAt: '2024-01-15',
  },
  {
    id: 7,
    sku: 'DEL-XPS15-9530',
    barcode: '8901234567896',
    name: 'Dell XPS 15 9530',
    description: 'Dell XPS 15 with Intel Core i7-13700H',
    category: 'Laptops',
    brand: 'Dell',
    unit: 'Piece',
    costPrice: 1400.00,
    sellingPrice: 1899.00,
    wholesalePrice: 1700.00,
    stock: 0,
    minStock: 5,
    maxStock: 25,
    reorderLevel: 8,
    status: 'out_of_stock',
    taxable: true,
    taxRate: 12,
    image: 'https://via.placeholder.com/100',
    variants: 3,
    supplier: 'Dell Technologies',
    location: 'Warehouse B - Shelf 2',
    createdAt: '2024-01-07',
    updatedAt: '2024-01-13',
  },
  {
    id: 8,
    sku: 'LOG-MX-MASTER3S',
    barcode: '8901234567897',
    name: 'Logitech MX Master 3S Mouse',
    description: 'Logitech MX Master 3S Wireless Mouse',
    category: 'Accessories',
    brand: 'Logitech',
    unit: 'Piece',
    costPrice: 75.00,
    sellingPrice: 99.00,
    wholesalePrice: 89.00,
    stock: 120,
    minStock: 30,
    maxStock: 200,
    reorderLevel: 50,
    status: 'active',
    taxable: true,
    taxRate: 12,
    image: 'https://via.placeholder.com/100',
    variants: 2,
    supplier: 'Logitech International',
    location: 'Warehouse A - Shelf 12',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-11',
  },
];

const categories = ['Smartphones', 'Laptops', 'Audio', 'Television', 'Accessories', 'Tablets', 'Wearables'];
const brands = ['Apple', 'Samsung', 'Sony', 'LG', 'Dell', 'Logitech', 'Microsoft', 'Google'];

const ProductList = () => {
  const [products, setProducts] = useState(mockProducts);
  const [loading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState(null);
  const [filterBrand, setFilterBrand] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Stats
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active').length;
  const lowStockProducts = products.filter(p => p.stock <= p.minStock && p.stock > 0).length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;
  const totalValue = products.reduce((sum, p) => sum + (p.stock * p.costPrice), 0);

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchText || 
      product.name.toLowerCase().includes(searchText.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchText.toLowerCase()) ||
      product.barcode.includes(searchText);
    const matchesCategory = !filterCategory || product.category === filterCategory;
    const matchesBrand = !filterBrand || product.brand === filterBrand;
    const matchesStatus = !filterStatus || product.status === filterStatus;
    return matchesSearch && matchesCategory && matchesBrand && matchesStatus;
  });

  // Table columns
  const columns = [
    {
      title: 'Product',
      key: 'product',
      width: 300,
      fixed: 'left',
      render: (_, record) => (
        <Space>
          <Avatar 
            shape="square" 
            size={48} 
            src={record.image}
            icon={<InboxOutlined />}
          />
          <div>
            <Text strong style={{ display: 'block' }}>{record.name}</Text>
            <Space size={4}>
              <Tag icon={<BarcodeOutlined />} color="default">{record.sku}</Tag>
              {record.variants > 0 && (
                <Tag color="blue">{record.variants} variants</Tag>
              )}
            </Space>
          </div>
        </Space>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category) => <Tag color="purple">{category}</Tag>,
      filters: categories.map(c => ({ text: c, value: c })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
      width: 100,
      render: (brand) => <Tag color="cyan">{brand}</Tag>,
      filters: brands.map(b => ({ text: b, value: b })),
      onFilter: (value, record) => record.brand === value,
    },
    {
      title: 'Cost Price',
      dataIndex: 'costPrice',
      key: 'costPrice',
      width: 110,
      align: 'right',
      render: (price) => (
        <Text type="secondary">${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
      ),
      sorter: (a, b) => a.costPrice - b.costPrice,
    },
    {
      title: 'Selling Price',
      dataIndex: 'sellingPrice',
      key: 'sellingPrice',
      width: 120,
      align: 'right',
      render: (price) => (
        <Text strong style={{ color: '#52c41a' }}>
          ${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </Text>
      ),
      sorter: (a, b) => a.sellingPrice - b.sellingPrice,
    },
    {
      title: 'Margin',
      key: 'margin',
      width: 80,
      align: 'center',
      render: (_, record) => {
        const margin = ((record.sellingPrice - record.costPrice) / record.costPrice * 100).toFixed(1);
        return (
          <Tag color={margin >= 30 ? 'green' : margin >= 20 ? 'orange' : 'red'}>
            {margin}%
          </Tag>
        );
      },
    },
    {
      title: 'Stock',
      key: 'stock',
      width: 120,
      align: 'center',
      render: (_, record) => {
        let color = '#52c41a';
        if (record.stock === 0) color = '#ff4d4f';
        else if (record.stock <= record.minStock) color = '#faad14';
        
        return (
          <Tooltip title={`Min: ${record.minStock} | Max: ${record.maxStock}`}>
            <div style={{ textAlign: 'center' }}>
              <Text strong style={{ color }}>{record.stock}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}> / {record.maxStock}</Text>
            </div>
          </Tooltip>
        );
      },
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status) => {
        const config = {
          active: { color: 'success', text: 'Active' },
          low_stock: { color: 'warning', text: 'Low Stock' },
          out_of_stock: { color: 'error', text: 'Out of Stock' },
          discontinued: { color: 'default', text: 'Discontinued' },
        };
        const { color, text } = config[status] || config.active;
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: 'Active', value: 'active' },
        { text: 'Low Stock', value: 'low_stock' },
        { text: 'Out of Stock', value: 'out_of_stock' },
        { text: 'Discontinued', value: 'discontinued' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewProduct(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEditProduct(record)}
            />
          </Tooltip>
          <Dropdown
            menu={{
              items: [
                { key: 'duplicate', icon: <CopyOutlined />, label: 'Duplicate' },
                { key: 'print', icon: <PrinterOutlined />, label: 'Print Barcode' },
                { type: 'divider' },
                { key: 'delete', icon: <DeleteOutlined />, label: 'Delete', danger: true },
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

  // Handlers
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setDetailDrawerVisible(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setDrawerVisible(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    form.resetFields();
    setDrawerVisible(true);
  };

  const handleMenuClick = (key, record) => {
    if (key === 'delete') {
      setSelectedProduct(record);
      setDeleteModalVisible(true);
    } else if (key === 'duplicate') {
      message.success(`Product "${record.name}" duplicated`);
    } else if (key === 'print') {
      message.info(`Printing barcode for ${record.sku}`);
    }
  };

  const handleDelete = () => {
    setProducts(products.filter(p => p.id !== selectedProduct.id));
    setDeleteModalVisible(false);
    message.success('Product deleted successfully');
  };

  const handleBulkDelete = () => {
    setProducts(products.filter(p => !selectedRowKeys.includes(p.id)));
    setSelectedRowKeys([]);
    message.success(`${selectedRowKeys.length} products deleted`);
  };

  const handleSaveProduct = () => {
    form.validateFields().then(values => {
      if (editingProduct) {
        setProducts(products.map(p => 
          p.id === editingProduct.id ? { ...p, ...values } : p
        ));
        message.success('Product updated successfully');
      } else {
        const newProduct = {
          ...values,
          id: Date.now(),
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setProducts([newProduct, ...products]);
        message.success('Product created successfully');
      }
      setDrawerVisible(false);
    });
  };

  // Form fields configuration
  const formFields = [
    {
      name: 'name',
      label: 'Product Name',
      type: 'input',
      rules: [{ required: true, message: 'Please enter product name' }],
      span: 24,
    },
    {
      name: 'sku',
      label: 'SKU',
      type: 'input',
      rules: [{ required: true, message: 'Please enter SKU' }],
      span: 12,
    },
    {
      name: 'barcode',
      label: 'Barcode',
      type: 'input',
      span: 12,
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      options: categories.map(c => ({ label: c, value: c })),
      rules: [{ required: true, message: 'Please select category' }],
      span: 12,
    },
    {
      name: 'brand',
      label: 'Brand',
      type: 'select',
      options: brands.map(b => ({ label: b, value: b })),
      rules: [{ required: true, message: 'Please select brand' }],
      span: 12,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      span: 24,
    },
    {
      name: 'costPrice',
      label: 'Cost Price',
      type: 'number',
      rules: [{ required: true, message: 'Please enter cost price' }],
      prefix: '$',
      span: 8,
    },
    {
      name: 'sellingPrice',
      label: 'Selling Price',
      type: 'number',
      rules: [{ required: true, message: 'Please enter selling price' }],
      prefix: '$',
      span: 8,
    },
    {
      name: 'wholesalePrice',
      label: 'Wholesale Price',
      type: 'number',
      prefix: '$',
      span: 8,
    },
    {
      name: 'minStock',
      label: 'Minimum Stock',
      type: 'number',
      span: 8,
    },
    {
      name: 'maxStock',
      label: 'Maximum Stock',
      type: 'number',
      span: 8,
    },
    {
      name: 'reorderLevel',
      label: 'Reorder Level',
      type: 'number',
      span: 8,
    },
    {
      name: 'taxable',
      label: 'Taxable',
      type: 'switch',
      span: 8,
    },
    {
      name: 'taxRate',
      label: 'Tax Rate (%)',
      type: 'number',
      span: 8,
    },
    {
      name: 'unit',
      label: 'Unit of Measure',
      type: 'select',
      options: [
        { label: 'Piece', value: 'Piece' },
        { label: 'Box', value: 'Box' },
        { label: 'Kilogram', value: 'Kilogram' },
        { label: 'Liter', value: 'Liter' },
        { label: 'Meter', value: 'Meter' },
      ],
      span: 8,
    },
  ];

  // Row selection
  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle={`${filteredProducts.length} products found`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'Products', path: '/products' },
        ]}
        actions={[
          <Button key="import" icon={<ImportOutlined />}>Import</Button>,
          <Button key="export" icon={<ExportOutlined />}>Export</Button>,
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={handleAddProduct}>
            Add Product
          </Button>,
        ]}
      />

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8} lg={4}>
          <StatCard
            title="Total Products"
            value={totalProducts}
            icon={<InboxOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <StatCard
            title="Active"
            value={activeProducts}
            icon={<TagOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <StatCard
            title="Low Stock"
            value={lowStockProducts}
            icon={<InboxOutlined style={{ fontSize: 24, color: '#faad14' }} />}
            color="#faad14"
            warning={lowStockProducts > 0}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={4}>
          <StatCard
            title="Out of Stock"
            value={outOfStockProducts}
            icon={<InboxOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />}
            color="#ff4d4f"
            warning={outOfStockProducts > 0}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={8}>
          <StatCard
            title="Total Inventory Value"
            value={totalValue}
            prefix="$"
            icon={<DollarOutlined style={{ fontSize: 24, color: '#722ed1' }} />}
            color="#722ed1"
          />
        </Col>
      </Row>

      {/* Filters and Table */}
      <Card>
        {/* Toolbar */}
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Space wrap>
            <Search
              placeholder="Search by name, SKU, or barcode..."
              allowClear
              style={{ width: 300 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              placeholder="Category"
              allowClear
              style={{ width: 150 }}
              value={filterCategory}
              onChange={setFilterCategory}
              options={categories.map(c => ({ label: c, value: c }))}
            />
            <Select
              placeholder="Brand"
              allowClear
              style={{ width: 150 }}
              value={filterBrand}
              onChange={setFilterBrand}
              options={brands.map(b => ({ label: b, value: b }))}
            />
            <Select
              placeholder="Status"
              allowClear
              style={{ width: 130 }}
              value={filterStatus}
              onChange={setFilterStatus}
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Low Stock', value: 'low_stock' },
                { label: 'Out of Stock', value: 'out_of_stock' },
              ]}
            />
          </Space>
          <Space>
            {selectedRowKeys.length > 0 && (
              <Popconfirm
                title={`Delete ${selectedRowKeys.length} products?`}
                onConfirm={handleBulkDelete}
              >
                <Button danger icon={<DeleteOutlined />}>
                  Delete ({selectedRowKeys.length})
                </Button>
              </Popconfirm>
            )}
            <Button.Group>
              <Button 
                icon={<UnorderedListOutlined />}
                type={viewMode === 'list' ? 'primary' : 'default'}
                onClick={() => setViewMode('list')}
              />
              <Button 
                icon={<AppstoreOutlined />}
                type={viewMode === 'grid' ? 'primary' : 'default'}
                onClick={() => setViewMode('grid')}
              />
            </Button.Group>
          </Space>
        </div>

        {/* Products Table */}
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1400 }}
          pagination={{
            total: filteredProducts.length,
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} products`,
          }}
        />
      </Card>

      {/* Add/Edit Product Drawer */}
      <FormDrawer
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onSubmit={handleSaveProduct}
        form={form}
        fields={formFields}
        width={720}
      />

      {/* Product Details Drawer */}
      <Drawer
        title="Product Details"
        placement="right"
        width={640}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        extra={
          <Space>
            <Button icon={<EditOutlined />} onClick={() => {
              setDetailDrawerVisible(false);
              handleEditProduct(selectedProduct);
            }}>
              Edit
            </Button>
            <Button icon={<PrinterOutlined />}>Print</Button>
          </Space>
        }
      >
        {selectedProduct && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Image
                src={selectedProduct.image}
                width={200}
                height={200}
                style={{ objectFit: 'cover', borderRadius: 8 }}
                fallback="https://via.placeholder.com/200"
              />
              <Title level={4} style={{ marginTop: 16, marginBottom: 4 }}>
                {selectedProduct.name}
              </Title>
              <Space>
                <Tag icon={<BarcodeOutlined />}>{selectedProduct.sku}</Tag>
                <Tag color="purple">{selectedProduct.category}</Tag>
                <Tag color="cyan">{selectedProduct.brand}</Tag>
              </Space>
            </div>

            <Divider />

            <Descriptions title="Pricing Information" column={2}>
              <Descriptions.Item label="Cost Price">
                ${selectedProduct.costPrice.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="Selling Price">
                <Text strong style={{ color: '#52c41a' }}>
                  ${selectedProduct.sellingPrice.toFixed(2)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Wholesale Price">
                ${selectedProduct.wholesalePrice.toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="Profit Margin">
                <Tag color="green">
                  {((selectedProduct.sellingPrice - selectedProduct.costPrice) / selectedProduct.costPrice * 100).toFixed(1)}%
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions title="Stock Information" column={2}>
              <Descriptions.Item label="Current Stock">
                <Text strong style={{ 
                  color: selectedProduct.stock === 0 ? '#ff4d4f' : 
                    selectedProduct.stock <= selectedProduct.minStock ? '#faad14' : '#52c41a' 
                }}>
                  {selectedProduct.stock} {selectedProduct.unit}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {selectedProduct.status === 'active' && <Tag color="success">Active</Tag>}
                {selectedProduct.status === 'low_stock' && <Tag color="warning">Low Stock</Tag>}
                {selectedProduct.status === 'out_of_stock' && <Tag color="error">Out of Stock</Tag>}
              </Descriptions.Item>
              <Descriptions.Item label="Min Stock">{selectedProduct.minStock}</Descriptions.Item>
              <Descriptions.Item label="Max Stock">{selectedProduct.maxStock}</Descriptions.Item>
              <Descriptions.Item label="Reorder Level">{selectedProduct.reorderLevel}</Descriptions.Item>
              <Descriptions.Item label="Location">{selectedProduct.location}</Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions title="Additional Details" column={1}>
              <Descriptions.Item label="Description">
                {selectedProduct.description}
              </Descriptions.Item>
              <Descriptions.Item label="Supplier">{selectedProduct.supplier}</Descriptions.Item>
              <Descriptions.Item label="Barcode">{selectedProduct.barcode}</Descriptions.Item>
              <Descriptions.Item label="Tax">
                {selectedProduct.taxable ? `${selectedProduct.taxRate}%` : 'Non-taxable'}
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {new Date(selectedProduct.createdAt).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Last Updated">
                {new Date(selectedProduct.updatedAt).toLocaleDateString()}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Drawer>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModalVisible}
        type="delete"
        title="Delete Product"
        content={`Are you sure you want to delete "${selectedProduct?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </div>
  );
};

export default ProductList;
