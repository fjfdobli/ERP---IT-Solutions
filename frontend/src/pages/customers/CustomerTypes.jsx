import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Input, Tag, 
  Tooltip, message, Typography, Form, InputNumber, Switch,
  Popconfirm, Badge
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  CrownOutlined,
  ShopOutlined,
  BankOutlined,
  GiftOutlined,
  PercentageOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer, ConfirmModal } from '../../components/Common';

const { Search, TextArea } = Input;
const { Text } = Typography;

// Mock customer types data
const mockCustomerTypes = [
  {
    id: 1,
    name: 'Regular',
    code: 'REG',
    description: 'Standard customers with basic privileges',
    discount: 0,
    loyaltyMultiplier: 1,
    creditEligible: false,
    minPurchaseAmount: 0,
    customerCount: 245,
    color: '#52c41a',
    icon: 'user',
    benefits: ['Standard pricing', 'Loyalty points (1x)', 'Email notifications'],
  },
  {
    id: 2,
    name: 'VIP',
    code: 'VIP',
    description: 'Valued customers with exclusive benefits and priority service',
    discount: 5,
    loyaltyMultiplier: 2,
    creditEligible: true,
    minPurchaseAmount: 50000,
    customerCount: 48,
    color: '#faad14',
    icon: 'crown',
    benefits: ['5% discount on all items', 'Double loyalty points (2x)', 'Priority support', 'Credit account eligible', 'Exclusive promotions'],
  },
  {
    id: 3,
    name: 'Wholesale',
    code: 'WHL',
    description: 'Bulk buyers and resellers with special wholesale pricing',
    discount: 15,
    loyaltyMultiplier: 1.5,
    creditEligible: true,
    minPurchaseAmount: 100000,
    customerCount: 32,
    color: '#1890ff',
    icon: 'shop',
    benefits: ['15% wholesale discount', 'Bulk pricing tiers', '1.5x loyalty points', 'Extended credit terms', 'Dedicated account manager'],
  },
  {
    id: 4,
    name: 'Corporate',
    code: 'CORP',
    description: 'Business accounts with corporate billing and volume discounts',
    discount: 10,
    loyaltyMultiplier: 2.5,
    creditEligible: true,
    minPurchaseAmount: 200000,
    customerCount: 18,
    color: '#722ed1',
    icon: 'bank',
    benefits: ['10% corporate discount', '2.5x loyalty points', 'Monthly invoicing', 'Purchase order processing', 'Annual contracts', 'Tax exemption support'],
  },
];

const CustomerTypes = () => {
  const [customerTypes, setCustomerTypes] = useState(mockCustomerTypes);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [form] = Form.useForm();

  // Calculate stats
  const totalTypes = customerTypes.length;
  const totalCustomers = customerTypes.reduce((sum, t) => sum + t.customerCount, 0);
  const creditEligibleTypes = customerTypes.filter(t => t.creditEligible).length;

  // Filter types
  const filteredTypes = customerTypes.filter(type =>
    !searchText || 
    type.name.toLowerCase().includes(searchText.toLowerCase()) ||
    type.code.toLowerCase().includes(searchText.toLowerCase())
  );

  const getIcon = (iconName) => {
    const icons = {
      'user': <UserOutlined />,
      'crown': <CrownOutlined />,
      'shop': <ShopOutlined />,
      'bank': <BankOutlined />,
    };
    return icons[iconName] || <UserOutlined />;
  };

  // Table columns
  const columns = [
    {
      title: 'Type',
      key: 'type',
      width: 200,
      render: (_, record) => (
        <Space>
          <div style={{ 
            width: 40, 
            height: 40, 
            borderRadius: 8, 
            backgroundColor: `${record.color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: record.color,
            fontSize: 18,
          }}>
            {getIcon(record.icon)}
          </div>
          <div>
            <Text strong>{record.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 11 }}>{record.code}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 280,
      ellipsis: true,
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      width: 100,
      align: 'center',
      render: (discount) => (
        <Tag color={discount > 0 ? 'green' : 'default'}>
          {discount}%
        </Tag>
      ),
    },
    {
      title: 'Loyalty Multiplier',
      dataIndex: 'loyaltyMultiplier',
      key: 'loyaltyMultiplier',
      width: 140,
      align: 'center',
      render: (multiplier) => (
        <Tag color="blue">{multiplier}x</Tag>
      ),
    },
    {
      title: 'Credit Eligible',
      dataIndex: 'creditEligible',
      key: 'creditEligible',
      width: 120,
      align: 'center',
      render: (eligible) => (
        <Tag color={eligible ? 'success' : 'default'}>
          {eligible ? 'Yes' : 'No'}
        </Tag>
      ),
    },
    {
      title: 'Min Purchase',
      dataIndex: 'minPurchaseAmount',
      key: 'minPurchaseAmount',
      width: 130,
      align: 'right',
      render: (amount) => amount > 0 ? `₱${amount.toLocaleString()}` : '-',
    },
    {
      title: 'Customers',
      dataIndex: 'customerCount',
      key: 'customerCount',
      width: 100,
      align: 'center',
      render: (count) => <Badge count={count} style={{ backgroundColor: '#1890ff' }} overflowCount={999} />,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button 
              type="text" 
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete customer type?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(record)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete">
              <Button 
                type="text" 
                danger
                icon={<DeleteOutlined />}
                disabled={record.customerCount > 0}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Handlers
  const handleCreate = () => {
    form.resetFields();
    setSelectedType(null);
    setDrawerVisible(true);
  };

  const handleEdit = (type) => {
    setSelectedType(type);
    form.setFieldsValue(type);
    setDrawerVisible(true);
  };

  const handleDelete = (type) => {
    setCustomerTypes(customerTypes.filter(t => t.id !== type.id));
    message.success('Customer type deleted');
  };

  const handleSave = () => {
    form.validateFields().then(values => {
      if (selectedType) {
        setCustomerTypes(customerTypes.map(t => 
          t.id === selectedType.id ? { ...t, ...values } : t
        ));
        message.success('Customer type updated');
      } else {
        const newType = {
          id: Math.max(...customerTypes.map(t => t.id)) + 1,
          ...values,
          customerCount: 0,
          icon: 'user',
          color: '#1890ff',
          benefits: [],
        };
        setCustomerTypes([...customerTypes, newType]);
        message.success('Customer type created');
      }
      setDrawerVisible(false);
    });
  };

  // Form fields
  const formFields = [
    {
      name: 'name',
      label: 'Type Name',
      type: 'input',
      rules: [{ required: true, message: 'Please enter type name' }],
      span: 12,
    },
    {
      name: 'code',
      label: 'Code',
      type: 'input',
      placeholder: 'e.g., VIP, WHL',
      rules: [{ required: true, message: 'Please enter code' }],
      span: 12,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      rules: [{ required: true, message: 'Please enter description' }],
      span: 24,
    },
    {
      name: 'discount',
      label: 'Discount (%)',
      type: 'number',
      placeholder: '0',
      span: 12,
    },
    {
      name: 'loyaltyMultiplier',
      label: 'Loyalty Multiplier',
      type: 'number',
      placeholder: '1',
      span: 12,
    },
    {
      name: 'minPurchaseAmount',
      label: 'Min Purchase Requirement',
      type: 'number',
      placeholder: '0',
      span: 12,
    },
    {
      name: 'creditEligible',
      label: 'Credit Eligible',
      type: 'switch',
      span: 12,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Customer Types"
        subtitle={`${totalTypes} types configured`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'Customers', path: '/customers' },
          { title: 'Customer Types', path: '/customers/types' },
        ]}
        actions={[
          <Button key="create" type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Add Type
          </Button>,
        ]}
      />

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <StatCard
            title="Customer Types"
            value={totalTypes}
            icon={<UserOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={8}>
          <StatCard
            title="Total Customers"
            value={totalCustomers}
            icon={<UserOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={8}>
          <StatCard
            title="Credit Eligible Types"
            value={creditEligibleTypes}
            icon={<BankOutlined style={{ fontSize: 24, color: '#722ed1' }} />}
            color="#722ed1"
          />
        </Col>
      </Row>

      {/* Type Cards Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {customerTypes.map(type => (
          <Col xs={24} sm={12} lg={6} key={type.id}>
            <Card 
              size="small" 
              hoverable
              style={{ borderTop: `3px solid ${type.color}` }}
            >
              <div style={{ textAlign: 'center', marginBottom: 12 }}>
                <div style={{ 
                  width: 50, 
                  height: 50, 
                  borderRadius: '50%', 
                  backgroundColor: `${type.color}20`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: type.color,
                  fontSize: 24,
                  marginBottom: 8,
                }}>
                  {getIcon(type.icon)}
                </div>
                <div>
                  <Text strong style={{ fontSize: 16 }}>{type.name}</Text>
                </div>
              </div>
              <div style={{ fontSize: 12 }}>
                <Space direction="vertical" size={4} style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">Discount:</Text>
                    <Tag color="green" style={{ margin: 0 }}>{type.discount}%</Tag>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">Loyalty:</Text>
                    <Tag color="blue" style={{ margin: 0 }}>{type.loyaltyMultiplier}x</Tag>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">Customers:</Text>
                    <Text strong>{type.customerCount}</Text>
                  </div>
                </Space>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Table */}
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="Search types..."
            allowClear
            style={{ width: 250 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredTypes}
          rowKey="id"
          loading={loading}
          pagination={false}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ padding: '12px 0' }}>
                <Text strong>Benefits:</Text>
                <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
                  {record.benefits.map((benefit, idx) => (
                    <li key={idx}><Text type="secondary">{benefit}</Text></li>
                  ))}
                </ul>
              </div>
            ),
          }}
        />
      </Card>

      {/* Create/Edit Drawer */}
      <FormDrawer
        title={selectedType ? 'Edit Customer Type' : 'Add Customer Type'}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onSubmit={handleSave}
        form={form}
        fields={formFields}
        width={500}
      />
    </div>
  );
};

export default CustomerTypes;
