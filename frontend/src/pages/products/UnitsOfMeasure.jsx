import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Input, Tag, 
  Tooltip, Form, message, Typography, Avatar, Popconfirm
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ScissorOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { PageHeader, FormDrawer, StatCard } from '../../components/Common';

const { Search } = Input;
const { Text, Title } = Typography;

// Mock units data
const mockUnits = [
  {
    id: 1,
    name: 'Piece',
    abbreviation: 'pc',
    description: 'Individual item unit',
    baseUnit: null,
    conversionFactor: 1,
    category: 'Count',
    productCount: 156,
    status: 'active',
  },
  {
    id: 2,
    name: 'Box',
    abbreviation: 'box',
    description: 'Box containing multiple pieces',
    baseUnit: 'Piece',
    conversionFactor: 12,
    category: 'Count',
    productCount: 45,
    status: 'active',
  },
  {
    id: 3,
    name: 'Carton',
    abbreviation: 'ctn',
    description: 'Large carton containing boxes',
    baseUnit: 'Box',
    conversionFactor: 6,
    category: 'Count',
    productCount: 23,
    status: 'active',
  },
  {
    id: 4,
    name: 'Kilogram',
    abbreviation: 'kg',
    description: 'Weight unit in kilograms',
    baseUnit: null,
    conversionFactor: 1,
    category: 'Weight',
    productCount: 34,
    status: 'active',
  },
  {
    id: 5,
    name: 'Gram',
    abbreviation: 'g',
    description: 'Weight unit in grams',
    baseUnit: 'Kilogram',
    conversionFactor: 0.001,
    category: 'Weight',
    productCount: 18,
    status: 'active',
  },
  {
    id: 6,
    name: 'Pound',
    abbreviation: 'lb',
    description: 'Weight unit in pounds',
    baseUnit: 'Kilogram',
    conversionFactor: 0.453592,
    category: 'Weight',
    productCount: 5,
    status: 'inactive',
  },
  {
    id: 7,
    name: 'Liter',
    abbreviation: 'L',
    description: 'Volume unit in liters',
    baseUnit: null,
    conversionFactor: 1,
    category: 'Volume',
    productCount: 28,
    status: 'active',
  },
  {
    id: 8,
    name: 'Milliliter',
    abbreviation: 'mL',
    description: 'Volume unit in milliliters',
    baseUnit: 'Liter',
    conversionFactor: 0.001,
    category: 'Volume',
    productCount: 12,
    status: 'active',
  },
  {
    id: 9,
    name: 'Meter',
    abbreviation: 'm',
    description: 'Length unit in meters',
    baseUnit: null,
    conversionFactor: 1,
    category: 'Length',
    productCount: 8,
    status: 'active',
  },
  {
    id: 10,
    name: 'Centimeter',
    abbreviation: 'cm',
    description: 'Length unit in centimeters',
    baseUnit: 'Meter',
    conversionFactor: 0.01,
    category: 'Length',
    productCount: 3,
    status: 'active',
  },
  {
    id: 11,
    name: 'Pair',
    abbreviation: 'pr',
    description: 'Two items sold together',
    baseUnit: 'Piece',
    conversionFactor: 2,
    category: 'Count',
    productCount: 15,
    status: 'active',
  },
  {
    id: 12,
    name: 'Dozen',
    abbreviation: 'dz',
    description: 'Twelve items',
    baseUnit: 'Piece',
    conversionFactor: 12,
    category: 'Count',
    productCount: 7,
    status: 'active',
  },
  {
    id: 13,
    name: 'Set',
    abbreviation: 'set',
    description: 'Collection of items sold together',
    baseUnit: null,
    conversionFactor: 1,
    category: 'Count',
    productCount: 22,
    status: 'active',
  },
  {
    id: 14,
    name: 'Roll',
    abbreviation: 'roll',
    description: 'Roll of material',
    baseUnit: null,
    conversionFactor: 1,
    category: 'Count',
    productCount: 6,
    status: 'active',
  },
];

const categories = ['Count', 'Weight', 'Volume', 'Length', 'Area', 'Time'];

const UnitsOfMeasure = () => {
  const [units, setUnits] = useState(mockUnits);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingUnit, setEditingUnit] = useState(null);
  const [form] = Form.useForm();

  // Stats
  const totalUnits = units.length;
  const activeUnits = units.filter(u => u.status === 'active').length;
  const totalProducts = units.reduce((sum, u) => sum + u.productCount, 0);
  const categoryCount = [...new Set(units.map(u => u.category))].length;

  // Filter units
  const filteredUnits = units.filter(unit =>
    unit.name.toLowerCase().includes(searchText.toLowerCase()) ||
    unit.abbreviation.toLowerCase().includes(searchText.toLowerCase()) ||
    unit.category.toLowerCase().includes(searchText.toLowerCase())
  );

  // Group units by category
  const groupedUnits = filteredUnits.reduce((acc, unit) => {
    if (!acc[unit.category]) {
      acc[unit.category] = [];
    }
    acc[unit.category].push(unit);
    return acc;
  }, {});

  // Table columns
  const columns = [
    {
      title: 'Unit',
      key: 'unit',
      width: 200,
      render: (_, record) => (
        <Space>
          <Avatar 
            style={{ backgroundColor: getCategoryColor(record.category) }}
            size="small"
          >
            {record.abbreviation}
          </Avatar>
          <div>
            <Text strong>{record.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>({record.abbreviation})</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category) => (
        <Tag color={getCategoryColor(category)}>{category}</Tag>
      ),
      filters: categories.map(c => ({ text: c, value: c })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Base Unit',
      dataIndex: 'baseUnit',
      key: 'baseUnit',
      width: 120,
      render: (baseUnit) => baseUnit || <Text type="secondary">Base Unit</Text>,
    },
    {
      title: 'Conversion',
      dataIndex: 'conversionFactor',
      key: 'conversionFactor',
      width: 120,
      render: (factor, record) => {
        if (!record.baseUnit) return <Text type="secondary">—</Text>;
        return (
          <Tooltip title={`1 ${record.name} = ${factor} ${record.baseUnit}`}>
            <Text>×{factor}</Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Products',
      dataIndex: 'productCount',
      key: 'productCount',
      width: 100,
      align: 'center',
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
      width: 100,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button 
              type="text" 
              icon={<EditOutlined />}
              onClick={() => handleEditUnit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete this unit?"
            description={record.productCount > 0 ? 
              `This unit is used by ${record.productCount} products.` : 
              'Are you sure?'
            }
            onConfirm={() => handleDelete(record)}
            disabled={record.productCount > 0}
          >
            <Button 
              type="text" 
              danger 
              icon={<DeleteOutlined />}
              disabled={record.productCount > 0}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Helper function for category colors
  function getCategoryColor(category) {
    const colors = {
      Count: '#1890ff',
      Weight: '#52c41a',
      Volume: '#722ed1',
      Length: '#fa8c16',
      Area: '#eb2f96',
      Time: '#13c2c2',
    };
    return colors[category] || '#666';
  }

  // Handlers
  const handleAddUnit = () => {
    setEditingUnit(null);
    form.resetFields();
    setDrawerVisible(true);
  };

  const handleEditUnit = (unit) => {
    setEditingUnit(unit);
    form.setFieldsValue(unit);
    setDrawerVisible(true);
  };

  const handleDelete = (unit) => {
    setUnits(units.filter(u => u.id !== unit.id));
    message.success(`Unit "${unit.name}" deleted`);
  };

  const handleSaveUnit = () => {
    form.validateFields().then(values => {
      if (editingUnit) {
        setUnits(units.map(u => 
          u.id === editingUnit.id ? { ...u, ...values } : u
        ));
        message.success('Unit updated successfully');
      } else {
        const newUnit = {
          ...values,
          id: Date.now(),
          productCount: 0,
        };
        setUnits([newUnit, ...units]);
        message.success('Unit created successfully');
      }
      setDrawerVisible(false);
    });
  };

  // Get base unit options (only units without base unit in same category)
  const getBaseUnitOptions = () => {
    const options = [{ label: 'None (This is a base unit)', value: null }];
    units
      .filter(u => !u.baseUnit && u.status === 'active')
      .forEach(u => {
        options.push({
          label: `${u.name} (${u.abbreviation})`,
          value: u.name,
        });
      });
    return options;
  };

  // Form fields
  const formFields = [
    {
      name: 'name',
      label: 'Unit Name',
      type: 'input',
      rules: [{ required: true, message: 'Please enter unit name' }],
      placeholder: 'e.g., Kilogram',
      span: 12,
    },
    {
      name: 'abbreviation',
      label: 'Abbreviation',
      type: 'input',
      rules: [{ required: true, message: 'Please enter abbreviation' }],
      placeholder: 'e.g., kg',
      span: 12,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      span: 24,
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
      name: 'baseUnit',
      label: 'Base Unit',
      type: 'select',
      options: getBaseUnitOptions(),
      span: 12,
    },
    {
      name: 'conversionFactor',
      label: 'Conversion Factor',
      type: 'number',
      rules: [{ required: true, message: 'Please enter conversion factor' }],
      placeholder: 'e.g., 0.001 for gram to kg',
      initialValue: 1,
      span: 12,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Units of Measure"
        subtitle={`${totalUnits} units configured`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'Products', path: '/products' },
          { title: 'Units', path: '/products/units' },
        ]}
        actions={[
          <Button key="add" type="primary" icon={<PlusOutlined />} onClick={handleAddUnit}>
            Add Unit
          </Button>,
        ]}
      />

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Units"
            value={totalUnits}
            icon={<ScissorOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Active Units"
            value={activeUnits}
            icon={<ScissorOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Categories"
            value={categoryCount}
            icon={<AppstoreOutlined style={{ fontSize: 24, color: '#722ed1' }} />}
            color="#722ed1"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Products Using"
            value={totalProducts}
            icon={<AppstoreOutlined style={{ fontSize: 24, color: '#fa8c16' }} />}
            color="#fa8c16"
          />
        </Col>
      </Row>

      {/* Category Quick View */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {Object.entries(groupedUnits).map(([category, categoryUnits]) => (
          <Col xs={24} sm={12} md={8} lg={6} key={category}>
            <Card 
              title={
                <Space>
                  <Tag color={getCategoryColor(category)}>{category}</Tag>
                  <Text type="secondary">({categoryUnits.length})</Text>
                </Space>
              }
              size="small"
            >
              <Space wrap>
                {categoryUnits.slice(0, 5).map(unit => (
                  <Tag key={unit.id}>
                    {unit.name} ({unit.abbreviation})
                  </Tag>
                ))}
                {categoryUnits.length > 5 && (
                  <Tag>+{categoryUnits.length - 5} more</Tag>
                )}
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Units Table */}
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="Search units..."
            allowClear
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredUnits}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} units`,
          }}
        />
      </Card>

      {/* Add/Edit Unit Drawer */}
      <FormDrawer
        title={editingUnit ? 'Edit Unit' : 'Add New Unit'}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onSubmit={handleSaveUnit}
        form={form}
        fields={formFields}
        width={500}
      />
    </div>
  );
};

export default UnitsOfMeasure;
