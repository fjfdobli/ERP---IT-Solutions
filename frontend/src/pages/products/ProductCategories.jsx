import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Input, Tag, 
  Tooltip, Badge, Modal, Form, message, Tree, Typography,
  Empty, Popconfirm, Avatar
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  AppstoreOutlined,
  SearchOutlined,
  MoreOutlined,
} from '@ant-design/icons';
import { PageHeader, FormDrawer, ConfirmModal } from '../../components/Common';

const { Search } = Input;
const { Text, Title } = Typography;

// Mock categories with hierarchy
const mockCategories = [
  {
    id: 1,
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices and gadgets',
    parent: null,
    productCount: 156,
    status: 'active',
    icon: '📱',
    children: [
      {
        id: 2,
        name: 'Smartphones',
        slug: 'smartphones',
        description: 'Mobile phones and smartphones',
        parent: 1,
        productCount: 45,
        status: 'active',
        icon: '📱',
      },
      {
        id: 3,
        name: 'Laptops',
        slug: 'laptops',
        description: 'Portable computers',
        parent: 1,
        productCount: 32,
        status: 'active',
        icon: '💻',
      },
      {
        id: 4,
        name: 'Tablets',
        slug: 'tablets',
        description: 'Tablet devices',
        parent: 1,
        productCount: 18,
        status: 'active',
        icon: '📟',
      },
      {
        id: 5,
        name: 'Audio',
        slug: 'audio',
        description: 'Audio equipment and accessories',
        parent: 1,
        productCount: 28,
        status: 'active',
        icon: '🎧',
      },
      {
        id: 6,
        name: 'Television',
        slug: 'television',
        description: 'TVs and displays',
        parent: 1,
        productCount: 15,
        status: 'active',
        icon: '📺',
      },
    ],
  },
  {
    id: 7,
    name: 'Accessories',
    slug: 'accessories',
    description: 'Device accessories and peripherals',
    parent: null,
    productCount: 89,
    status: 'active',
    icon: '🔌',
    children: [
      {
        id: 8,
        name: 'Cases & Covers',
        slug: 'cases-covers',
        description: 'Protective cases and covers',
        parent: 7,
        productCount: 34,
        status: 'active',
        icon: '📦',
      },
      {
        id: 9,
        name: 'Cables & Chargers',
        slug: 'cables-chargers',
        description: 'Charging cables and adapters',
        parent: 7,
        productCount: 42,
        status: 'active',
        icon: '🔋',
      },
      {
        id: 10,
        name: 'Screen Protectors',
        slug: 'screen-protectors',
        description: 'Display protection',
        parent: 7,
        productCount: 13,
        status: 'active',
        icon: '🛡️',
      },
    ],
  },
  {
    id: 11,
    name: 'Wearables',
    slug: 'wearables',
    description: 'Smart wearable devices',
    parent: null,
    productCount: 34,
    status: 'active',
    icon: '⌚',
    children: [
      {
        id: 12,
        name: 'Smartwatches',
        slug: 'smartwatches',
        description: 'Smart watches',
        parent: 11,
        productCount: 22,
        status: 'active',
        icon: '⌚',
      },
      {
        id: 13,
        name: 'Fitness Trackers',
        slug: 'fitness-trackers',
        description: 'Activity and fitness bands',
        parent: 11,
        productCount: 12,
        status: 'active',
        icon: '💪',
      },
    ],
  },
  {
    id: 14,
    name: 'Gaming',
    slug: 'gaming',
    description: 'Gaming consoles and accessories',
    parent: null,
    productCount: 67,
    status: 'active',
    icon: '🎮',
    children: [],
  },
  {
    id: 15,
    name: 'Home & Office',
    slug: 'home-office',
    description: 'Home and office equipment',
    parent: null,
    productCount: 45,
    status: 'inactive',
    icon: '🏠',
    children: [],
  },
];

// Flatten categories for table view
const flattenCategories = (categories, level = 0) => {
  let result = [];
  categories.forEach(cat => {
    result.push({ ...cat, level, children: undefined, hasChildren: cat.children?.length > 0 });
    if (cat.children && cat.children.length > 0) {
      result = result.concat(flattenCategories(cat.children, level + 1));
    }
  });
  return result;
};

const ProductCategories = () => {
  const [categories] = useState(mockCategories);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState('tree'); // 'tree' or 'table'
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedKeys, setExpandedKeys] = useState(['1', '7', '11']);
  const [form] = Form.useForm();

  // Get flat list for table
  const flatCategories = flattenCategories(categories);
  
  // Filter categories
  const filteredCategories = flatCategories.filter(cat =>
    cat.name.toLowerCase().includes(searchText.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchText.toLowerCase())
  );

  // Stats
  const totalCategories = flatCategories.length;
  const activeCategories = flatCategories.filter(c => c.status === 'active').length;
  const totalProducts = flatCategories.reduce((sum, c) => sum + c.productCount, 0);

  // Convert to tree data for Tree component
  const convertToTreeData = (items) => {
    return items.map(item => ({
      key: String(item.id),
      title: (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingRight: 8 }}>
          <Space>
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <Text strong>{item.name}</Text>
            <Badge count={item.productCount} style={{ backgroundColor: '#1890ff' }} />
            {item.status === 'inactive' && <Tag color="default">Inactive</Tag>}
          </Space>
          <Space size={4}>
            <Tooltip title="Edit">
              <Button 
                type="text" 
                size="small" 
                icon={<EditOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditCategory(item);
                }}
              />
            </Tooltip>
            <Tooltip title="Delete">
              <Button 
                type="text" 
                size="small" 
                danger
                icon={<DeleteOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(item);
                }}
              />
            </Tooltip>
          </Space>
        </div>
      ),
      children: item.children ? convertToTreeData(item.children) : undefined,
    }));
  };

  const treeData = convertToTreeData(categories);

  // Table columns
  const columns = [
    {
      title: 'Category',
      key: 'name',
      render: (_, record) => (
        <div style={{ paddingLeft: record.level * 24 }}>
          <Space>
            <span style={{ fontSize: 18 }}>{record.icon}</span>
            <div>
              <Text strong>{record.name}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>{record.slug}</Text>
            </div>
          </Space>
        </div>
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
              onClick={() => handleEditCategory(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this category?"
            description={record.productCount > 0 ? 
              `This category has ${record.productCount} products. They will be unassigned.` : 
              'Are you sure you want to delete this category?'
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
  const handleAddCategory = () => {
    setEditingCategory(null);
    form.resetFields();
    setDrawerVisible(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      ...category,
      parent: category.parent || null,
    });
    setDrawerVisible(true);
  };

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setDeleteModalVisible(true);
  };

  const handleDelete = (category) => {
    const cat = category || selectedCategory;
    // Remove from categories (simplified - would need recursive removal in real app)
    message.success(`Category "${cat.name}" deleted`);
    setDeleteModalVisible(false);
  };

  const handleSaveCategory = () => {
    form.validateFields().then(() => {
      if (editingCategory) {
        message.success('Category updated successfully');
      } else {
        message.success('Category created successfully');
      }
      setDrawerVisible(false);
    });
  };

  // Get parent category options
  const getParentOptions = () => {
    const options = [{ label: 'None (Top Level)', value: null }];
    flatCategories.forEach(cat => {
      if (!editingCategory || cat.id !== editingCategory.id) {
        options.push({
          label: `${'— '.repeat(cat.level)}${cat.name}`,
          value: cat.id,
        });
      }
    });
    return options;
  };

  // Form fields
  const formFields = [
    {
      name: 'name',
      label: 'Category Name',
      type: 'input',
      rules: [{ required: true, message: 'Please enter category name' }],
      span: 24,
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'input',
      rules: [{ required: true, message: 'Please enter slug' }],
      placeholder: 'auto-generated-from-name',
      span: 24,
    },
    {
      name: 'parent',
      label: 'Parent Category',
      type: 'select',
      options: getParentOptions(),
      span: 24,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      span: 24,
    },
    {
      name: 'icon',
      label: 'Icon (Emoji)',
      type: 'input',
      placeholder: '📦',
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
  ];

  return (
    <div>
      <PageHeader
        title="Product Categories"
        subtitle={`${totalCategories} categories managing ${totalProducts} products`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'Products', path: '/products' },
          { title: 'Categories', path: '/products/categories' },
        ]}
        actions={[
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={handleAddCategory}>
            Add Category
          </Button>,
        ]}
      />

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Avatar 
                size={48} 
                style={{ backgroundColor: '#1890ff' }} 
                icon={<FolderOutlined />} 
              />
              <div>
                <Text type="secondary">Total Categories</Text>
                <Title level={3} style={{ margin: 0 }}>{totalCategories}</Title>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Avatar 
                size={48} 
                style={{ backgroundColor: '#52c41a' }} 
                icon={<FolderOpenOutlined />} 
              />
              <div>
                <Text type="secondary">Active Categories</Text>
                <Title level={3} style={{ margin: 0 }}>{activeCategories}</Title>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Avatar 
                size={48} 
                style={{ backgroundColor: '#722ed1' }} 
                icon={<AppstoreOutlined />} 
              />
              <div>
                <Text type="secondary">Total Products</Text>
                <Title level={3} style={{ margin: 0 }}>{totalProducts}</Title>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Categories Display */}
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Search
            placeholder="Search categories..."
            allowClear
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button.Group>
            <Button 
              icon={<FolderOutlined />}
              type={viewMode === 'tree' ? 'primary' : 'default'}
              onClick={() => setViewMode('tree')}
            >
              Tree
            </Button>
            <Button 
              icon={<AppstoreOutlined />}
              type={viewMode === 'table' ? 'primary' : 'default'}
              onClick={() => setViewMode('table')}
            >
              Table
            </Button>
          </Button.Group>
        </div>

        {viewMode === 'tree' ? (
          <Tree
            showLine={{ showLeafIcon: false }}
            showIcon
            expandedKeys={expandedKeys}
            onExpand={setExpandedKeys}
            treeData={treeData}
            blockNode
            style={{ fontSize: 14 }}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredCategories}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 15,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} categories`,
            }}
          />
        )}
      </Card>

      {/* Add/Edit Category Drawer */}
      <FormDrawer
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onSubmit={handleSaveCategory}
        form={form}
        fields={formFields}
        width={500}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={deleteModalVisible}
        type="delete"
        title="Delete Category"
        content={
          selectedCategory?.productCount > 0 
            ? `This category has ${selectedCategory.productCount} products. They will be unassigned. Are you sure?`
            : `Are you sure you want to delete "${selectedCategory?.name}"?`
        }
        onConfirm={() => handleDelete()}
        onCancel={() => setDeleteModalVisible(false)}
      />
    </div>
  );
};

export default ProductCategories;
