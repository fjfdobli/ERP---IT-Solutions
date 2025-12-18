import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Input, Select, Tag, 
  Tooltip, Badge, message, Typography, DatePicker, Drawer,
  Descriptions, Avatar, Divider, Steps, Form, InputNumber, Alert, Modal
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ExportOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PrinterOutlined,
  CheckOutlined,
  CloseOutlined,
  SendOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  UserOutlined,
  ShopOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  MailOutlined,
  CopyOutlined,
  ReloadOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer } from '../../components/Common';
import dayjs from 'dayjs';

const { Search, TextArea } = Input;
const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

// Mock quotation data
const mockQuotations = [
  {
    id: 'QT-2024-00025',
    date: '2024-01-15T10:00:00',
    expiryDate: '2024-02-15',
    customer: { id: 'C005', name: 'Robert Chen', type: 'Corporate', email: 'robert@company.com', phone: '+1 234 567 890' },
    branch: 'Main Branch',
    salesPerson: 'Sarah Wilson',
    items: [
      { name: 'MacBook Pro 14" M3 Pro', sku: 'APL-MBP14-M3P', qty: 10, price: 1899.00, discount: 100 },
      { name: 'Magic Mouse', sku: 'APL-MM', qty: 10, price: 79.00, discount: 0 },
    ],
    subtotal: 19780.00,
    discount: 1000.00,
    tax: 1502.40,
    total: 20282.40,
    status: 'sent',
    priority: 'high',
    validUntil: '2024-02-15',
    sentDate: '2024-01-15T10:30:00',
    notes: 'Corporate bulk order - awaiting approval',
    terms: 'Net 30',
  },
  {
    id: 'QT-2024-00024',
    date: '2024-01-14T14:30:00',
    expiryDate: '2024-02-14',
    customer: { id: 'C002', name: 'Jane Doe', type: 'VIP', email: 'jane@email.com', phone: '+1 345 678 901' },
    branch: 'Downtown Store',
    salesPerson: 'Mike Johnson',
    items: [
      { name: 'iPhone 15 Pro Max 256GB', sku: 'APL-IP15PM-256', qty: 2, price: 1099.00, discount: 50 },
      { name: 'AirPods Pro 2nd Generation', sku: 'APL-APP2', qty: 2, price: 180.00, discount: 0 },
    ],
    subtotal: 2558.00,
    discount: 100.00,
    tax: 196.64,
    total: 2654.64,
    status: 'accepted',
    priority: 'normal',
    validUntil: '2024-02-14',
    sentDate: '2024-01-14T15:00:00',
    acceptedDate: '2024-01-16T09:00:00',
    notes: 'VIP customer - ready to convert',
    terms: 'COD',
  },
  {
    id: 'QT-2024-00023',
    date: '2024-01-13T11:00:00',
    expiryDate: '2024-02-13',
    customer: { id: 'C006', name: 'Tech Solutions Inc', type: 'Corporate', email: 'orders@techsolutions.com', phone: '+1 456 789 012' },
    branch: 'Main Branch',
    salesPerson: 'Tom Brown',
    items: [
      { name: 'Dell Monitor 27" 4K', sku: 'DEL-MON27-4K', qty: 20, price: 450.00, discount: 50 },
      { name: 'Logitech MX Master 3S Mouse', sku: 'LOG-MX-MASTER3S', qty: 20, price: 75.00, discount: 5 },
    ],
    subtotal: 10500.00,
    discount: 1100.00,
    tax: 752.00,
    total: 10152.00,
    status: 'draft',
    priority: 'normal',
    validUntil: '2024-02-13',
    notes: 'Draft quotation - needs review',
    terms: 'Net 15',
  },
  {
    id: 'QT-2024-00022',
    date: '2024-01-12T09:30:00',
    expiryDate: '2024-02-12',
    customer: { id: 'C007', name: 'Maria Santos', type: 'Regular', email: 'maria@email.com', phone: '+1 567 890 123' },
    branch: 'Downtown Store',
    salesPerson: 'Sarah Wilson',
    items: [
      { name: 'Samsung Galaxy S24 Ultra 512GB', sku: 'SAM-GS24U-512', qty: 1, price: 899.00, discount: 0 },
      { name: 'Samsung Galaxy Buds3 Pro', sku: 'SAM-GB3P', qty: 1, price: 159.00, discount: 0 },
    ],
    subtotal: 1058.00,
    discount: 0,
    tax: 84.64,
    total: 1142.64,
    status: 'rejected',
    priority: 'normal',
    validUntil: '2024-02-12',
    sentDate: '2024-01-12T10:00:00',
    rejectedDate: '2024-01-13T14:00:00',
    rejectReason: 'Found better price elsewhere',
    notes: '',
    terms: 'COD',
  },
  {
    id: 'QT-2024-00021',
    date: '2024-01-11T16:00:00',
    expiryDate: '2024-01-25',
    customer: { id: 'C008', name: 'Global Enterprises', type: 'Corporate', email: 'purchasing@global.com', phone: '+1 678 901 234' },
    branch: 'Main Branch',
    salesPerson: 'Mike Johnson',
    items: [
      { name: 'HP LaserJet Pro MFP', sku: 'HP-LJ-MFP', qty: 5, price: 599.00, discount: 30 },
    ],
    subtotal: 2995.00,
    discount: 150.00,
    tax: 227.60,
    total: 3072.60,
    status: 'expired',
    priority: 'low',
    validUntil: '2024-01-25',
    sentDate: '2024-01-11T16:30:00',
    notes: 'Expired quotation - follow up needed',
    terms: 'Net 30',
  },
  {
    id: 'QT-2024-00020',
    date: '2024-01-10T13:45:00',
    expiryDate: '2024-02-10',
    customer: { id: 'C001', name: 'John Smith', type: 'Regular', email: 'john@email.com', phone: '+1 789 012 345' },
    branch: 'Downtown Store',
    salesPerson: 'Tom Brown',
    items: [
      { name: 'Sony WH-1000XM5 Headphones', sku: 'SON-WH1000XM5', qty: 1, price: 299.00, discount: 0 },
    ],
    subtotal: 299.00,
    discount: 0,
    tax: 23.92,
    total: 322.92,
    status: 'converted',
    priority: 'normal',
    validUntil: '2024-02-10',
    sentDate: '2024-01-10T14:00:00',
    acceptedDate: '2024-01-12T10:00:00',
    convertedDate: '2024-01-12T11:00:00',
    convertedTo: 'SO-2024-00040',
    notes: 'Converted to sales order',
    terms: 'COD',
  },
];

const quotationStatuses = [
  { value: 'draft', label: 'Draft', color: 'default' },
  { value: 'sent', label: 'Sent', color: 'blue' },
  { value: 'accepted', label: 'Accepted', color: 'success' },
  { value: 'rejected', label: 'Rejected', color: 'error' },
  { value: 'expired', label: 'Expired', color: 'warning' },
  { value: 'converted', label: 'Converted', color: 'cyan' },
];

const branches = ['Main Branch', 'Downtown Store', 'Warehouse'];

const Quotations = () => {
  const [quotations, setQuotations] = useState(mockQuotations);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterBranch, setFilterBranch] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [form] = Form.useForm();

  // Calculate stats
  const totalQuotations = quotations.length;
  const draftQuotations = quotations.filter(q => q.status === 'draft').length;
  const sentQuotations = quotations.filter(q => q.status === 'sent').length;
  const acceptedQuotations = quotations.filter(q => q.status === 'accepted').length;
  const expiredQuotations = quotations.filter(q => q.status === 'expired').length;
  const totalValue = quotations
    .filter(q => !['rejected', 'expired'].includes(q.status))
    .reduce((sum, q) => sum + q.total, 0);
  const conversionRate = quotations.filter(q => q.status === 'converted').length / totalQuotations * 100;

  // Filter quotations
  const filteredQuotations = quotations.filter(quotation => {
    const matchesSearch = !searchText || 
      quotation.id.toLowerCase().includes(searchText.toLowerCase()) ||
      quotation.customer.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !filterStatus || quotation.status === filterStatus;
    const matchesBranch = !filterBranch || quotation.branch === filterBranch;
    const matchesDate = !dateRange || (
      dayjs(quotation.date).isAfter(dateRange[0].startOf('day')) &&
      dayjs(quotation.date).isBefore(dateRange[1].endOf('day'))
    );
    return matchesSearch && matchesStatus && matchesBranch && matchesDate;
  });

  // Get status config
  const getStatusConfig = (status) => {
    return quotationStatuses.find(s => s.value === status) || quotationStatuses[0];
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    const colors = {
      high: 'red',
      normal: 'blue',
      low: 'default',
    };
    return colors[priority] || 'default';
  };

  // Check if quotation is expiring soon (within 7 days)
  const isExpiringSoon = (expiryDate) => {
    const daysUntilExpiry = dayjs(expiryDate).diff(dayjs(), 'day');
    return daysUntilExpiry >= 0 && daysUntilExpiry <= 7;
  };

  // Check if quotation is expired
  const isExpired = (expiryDate) => {
    return dayjs(expiryDate).isBefore(dayjs(), 'day');
  };

  // Table columns
  const columns = [
    {
      title: 'Quotation ID',
      dataIndex: 'id',
      key: 'id',
      width: 140,
      fixed: 'left',
      render: (id, record) => (
        <div>
          <Text strong style={{ color: '#1890ff' }}>{id}</Text>
          {record.priority === 'high' && (
            <Tag color="red" style={{ marginLeft: 4 }}>HIGH</Tag>
          )}
          {isExpiringSoon(record.validUntil) && record.status === 'sent' && (
            <Tag color="orange" style={{ marginLeft: 4 }}>EXPIRING</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 110,
      render: (date) => dayjs(date).format('MMM D, YYYY'),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Customer',
      key: 'customer',
      width: 180,
      render: (_, record) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <div>
            <div>{record.customer.name}</div>
            <Tag size="small">{record.customer.type}</Tag>
          </div>
        </Space>
      ),
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
      key: 'branch',
      width: 130,
      render: (branch) => (
        <Space>
          <ShopOutlined />
          {branch}
        </Space>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: 120,
      align: 'right',
      render: (total) => <Text strong>${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>,
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: 'Valid Until',
      dataIndex: 'validUntil',
      key: 'validUntil',
      width: 120,
      render: (date, record) => {
        if (isExpired(date) && record.status !== 'expired') {
          return <Text type="danger">Expired</Text>;
        }
        if (isExpiringSoon(date) && record.status === 'sent') {
          return <Text type="warning">{dayjs(date).format('MMM D')}</Text>;
        }
        return <Text>{dayjs(date).format('MMM D, YYYY')}</Text>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
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
          {record.status === 'draft' && (
            <>
              <Tooltip title="Edit">
                <Button 
                  type="text" 
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(record)}
                />
              </Tooltip>
              <Tooltip title="Send to Customer">
                <Button 
                  type="text" 
                  icon={<SendOutlined style={{ color: '#1890ff' }} />}
                  onClick={() => handleSend(record)}
                />
              </Tooltip>
            </>
          )}
          {record.status === 'sent' && (
            <Tooltip title="Resend">
              <Button 
                type="text" 
                icon={<MailOutlined />}
                onClick={() => handleResend(record)}
              />
            </Tooltip>
          )}
          {record.status === 'accepted' && (
            <Tooltip title="Convert to Order">
              <Button 
                type="text" 
                icon={<ShoppingCartOutlined style={{ color: '#52c41a' }} />}
                onClick={() => handleConvert(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  // Item columns
  const itemColumns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div>
          <div>{name}</div>
          <Text type="secondary" style={{ fontSize: 11 }}>{record.sku}</Text>
        </div>
      ),
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      width: 60,
      align: 'center',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      align: 'right',
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Discount',
      dataIndex: 'discount',
      key: 'discount',
      width: 80,
      align: 'right',
      render: (discount) => discount > 0 ? <Text type="danger">-${discount.toFixed(2)}</Text> : '—',
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      width: 100,
      align: 'right',
      render: (_, record) => {
        const subtotal = (record.price * record.qty) - record.discount;
        return <Text strong>${subtotal.toFixed(2)}</Text>;
      },
    },
  ];

  // Handlers
  const handleCreateQuotation = () => {
    form.resetFields();
    setSelectedQuotation(null);
    setDrawerVisible(true);
  };

  const handleViewDetails = (quotation) => {
    setSelectedQuotation(quotation);
    setDetailDrawerVisible(true);
  };

  const handleEdit = (quotation) => {
    setSelectedQuotation(quotation);
    form.setFieldsValue({
      ...quotation,
      customer: quotation.customer.id,
      validUntil: dayjs(quotation.validUntil),
    });
    setDrawerVisible(true);
  };

  const handleSend = (quotation) => {
    setQuotations(quotations.map(q => q.id === quotation.id ? { 
      ...q, 
      status: 'sent',
      sentDate: new Date().toISOString()
    } : q));
    message.success(`Quotation ${quotation.id} sent to customer`);
  };

  const handleResend = (quotation) => {
    message.success(`Quotation ${quotation.id} resent to customer`);
  };

  const handleConvert = (quotation) => {
    Modal.confirm({
      title: 'Convert to Sales Order',
      content: `Are you sure you want to convert quotation ${quotation.id} to a sales order?`,
      okText: 'Convert',
      cancelText: 'Cancel',
      onOk: () => {
        setQuotations(quotations.map(q => q.id === quotation.id ? { 
          ...q, 
          status: 'converted',
          convertedDate: new Date().toISOString(),
          convertedTo: `SO-2024-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`
        } : q));
        message.success(`Quotation ${quotation.id} converted to sales order`);
        setDetailDrawerVisible(false);
      },
    });
  };

  const handleSaveQuotation = () => {
    form.validateFields().then(values => {
      if (selectedQuotation) {
        // Update existing
        setQuotations(quotations.map(q => q.id === selectedQuotation.id ? {
          ...q,
          ...values,
          validUntil: values.validUntil.format('YYYY-MM-DD'),
        } : q));
        message.success('Quotation updated successfully');
      } else {
        // Create new
        const newQuotation = {
          id: `QT-2024-${String(quotations.length + 26).padStart(5, '0')}`,
          date: new Date().toISOString(),
          ...values,
          status: 'draft',
          validUntil: values.validUntil.format('YYYY-MM-DD'),
          expiryDate: values.validUntil.format('YYYY-MM-DD'),
          items: [],
          subtotal: 0,
          discount: 0,
          tax: 0,
          total: 0,
        };
        setQuotations([newQuotation, ...quotations]);
        message.success('Quotation created successfully');
      }
      setDrawerVisible(false);
    });
  };

  // Form fields
  const formFields = [
    {
      name: 'customer',
      label: 'Customer',
      type: 'select',
      options: [
        { label: 'John Smith - Regular', value: 'C001' },
        { label: 'Jane Doe - VIP', value: 'C002' },
        { label: 'Robert Chen - Corporate', value: 'C005' },
        { label: 'Tech Solutions Inc - Corporate', value: 'C006' },
        { label: 'Maria Santos - Regular', value: 'C007' },
        { label: 'Global Enterprises - Corporate', value: 'C008' },
      ],
      rules: [{ required: true, message: 'Please select customer' }],
      span: 24,
    },
    {
      name: 'branch',
      label: 'Branch',
      type: 'select',
      options: branches.map(b => ({ label: b, value: b })),
      rules: [{ required: true, message: 'Please select branch' }],
      span: 12,
    },
    {
      name: 'priority',
      label: 'Priority',
      type: 'select',
      options: [
        { label: 'High', value: 'high' },
        { label: 'Normal', value: 'normal' },
        { label: 'Low', value: 'low' },
      ],
      rules: [{ required: true, message: 'Please select priority' }],
      span: 12,
    },
    {
      name: 'validUntil',
      label: 'Valid Until',
      type: 'date',
      rules: [{ required: true, message: 'Please select expiry date' }],
      span: 12,
    },
    {
      name: 'terms',
      label: 'Payment Terms',
      type: 'select',
      options: [
        { label: 'COD', value: 'COD' },
        { label: 'Net 15', value: 'Net 15' },
        { label: 'Net 30', value: 'Net 30' },
        { label: 'Net 45', value: 'Net 45' },
        { label: 'Net 60', value: 'Net 60' },
      ],
      rules: [{ required: true, message: 'Please select payment terms' }],
      span: 12,
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea',
      span: 24,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Quotations"
        subtitle={`${filteredQuotations.length} quotations`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'Sales', path: '/sales' },
          { title: 'Quotations', path: '/sales/quotations' },
        ]}
        actions={[
          <Button key="export" icon={<ExportOutlined />}>Export</Button>,
          <Button key="create" type="primary" icon={<PlusOutlined />} onClick={handleCreateQuotation}>
            New Quotation
          </Button>,
        ]}
      />

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Quotations"
            value={totalQuotations}
            icon={<FileTextOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Draft"
            value={draftQuotations}
            icon={<EditOutlined style={{ fontSize: 24, color: '#8c8c8c' }} />}
            color="#8c8c8c"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Sent"
            value={sentQuotations}
            icon={<SendOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Accepted"
            value={acceptedQuotations}
            icon={<CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
            color="#52c41a"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Expired"
            value={expiredQuotations}
            icon={<WarningOutlined style={{ fontSize: 24, color: '#faad14' }} />}
            color="#faad14"
            warning={expiredQuotations > 0}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Value"
            value={`$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            icon={<DollarOutlined style={{ fontSize: 24, color: '#722ed1' }} />}
            color="#722ed1"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Conversion Rate"
            value={conversionRate.toFixed(1)}
            suffix="%"
            icon={<ShoppingCartOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Pending Response"
            value={sentQuotations}
            icon={<ClockCircleOutlined style={{ fontSize: 24, color: '#faad14' }} />}
            color="#faad14"
          />
        </Col>
      </Row>

      {/* Filters and Table */}
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Space wrap>
            <Search
              placeholder="Search quotations..."
              allowClear
              style={{ width: 220 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <RangePicker 
              value={dateRange}
              onChange={setDateRange}
            />
            <Select
              placeholder="Status"
              allowClear
              style={{ width: 130 }}
              value={filterStatus}
              onChange={setFilterStatus}
              options={quotationStatuses.map(s => ({ label: s.label, value: s.value }))}
            />
            <Select
              placeholder="Branch"
              allowClear
              style={{ width: 140 }}
              value={filterBranch}
              onChange={setFilterBranch}
              options={branches.map(b => ({ label: b, value: b }))}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredQuotations}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1300 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} quotations`,
          }}
        />
      </Card>

      {/* Create/Edit Quotation Drawer */}
      <FormDrawer
        title={selectedQuotation ? "Edit Quotation" : "Create Quotation"}
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          setSelectedQuotation(null);
        }}
        onSubmit={handleSaveQuotation}
        form={form}
        fields={formFields}
        width={600}
      />

      {/* Quotation Details Drawer */}
      <Drawer
        title="Quotation Details"
        placement="right"
        width={700}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        extra={
          selectedQuotation && (
            <Space>
              <Button icon={<PrinterOutlined />}>Print</Button>
              <Button icon={<CopyOutlined />}>Duplicate</Button>
              {selectedQuotation.status === 'draft' && (
                <>
                  <Button icon={<EditOutlined />} onClick={() => {
                    setDetailDrawerVisible(false);
                    handleEdit(selectedQuotation);
                  }}>
                    Edit
                  </Button>
                  <Button type="primary" icon={<SendOutlined />} onClick={() => {
                    handleSend(selectedQuotation);
                    setDetailDrawerVisible(false);
                  }}>
                    Send to Customer
                  </Button>
                </>
              )}
              {selectedQuotation.status === 'sent' && (
                <Button icon={<MailOutlined />} onClick={() => handleResend(selectedQuotation)}>
                  Resend
                </Button>
              )}
              {selectedQuotation.status === 'accepted' && (
                <Button 
                  type="primary" 
                  icon={<ShoppingCartOutlined />} 
                  onClick={() => handleConvert(selectedQuotation)}
                >
                  Convert to Order
                </Button>
              )}
            </Space>
          )
        }
      >
        {selectedQuotation && (
          <>
            <div style={{ marginBottom: 24 }}>
              <Space>
                <Text strong style={{ fontSize: 20 }}>{selectedQuotation.id}</Text>
                <Tag color={getStatusConfig(selectedQuotation.status).color}>
                  {getStatusConfig(selectedQuotation.status).label}
                </Tag>
                <Tag color={getPriorityColor(selectedQuotation.priority)}>
                  {selectedQuotation.priority.toUpperCase()} PRIORITY
                </Tag>
              </Space>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">
                  <CalendarOutlined /> Created: {dayjs(selectedQuotation.date).format('MMMM D, YYYY h:mm A')}
                </Text>
              </div>
            </div>

            {/* Expiry Warning */}
            {isExpiringSoon(selectedQuotation.validUntil) && selectedQuotation.status === 'sent' && (
              <Alert
                message="Quotation Expiring Soon"
                description={`This quotation expires on ${dayjs(selectedQuotation.validUntil).format('MMMM D, YYYY')}. Consider following up with the customer.`}
                type="warning"
                showIcon
                style={{ marginBottom: 24 }}
              />
            )}

            {isExpired(selectedQuotation.validUntil) && selectedQuotation.status === 'sent' && (
              <Alert
                message="Quotation Expired"
                description={`This quotation expired on ${dayjs(selectedQuotation.validUntil).format('MMMM D, YYYY')}. You may need to create a new quotation.`}
                type="error"
                showIcon
                style={{ marginBottom: 24 }}
              />
            )}

            {/* Quotation Workflow */}
            {selectedQuotation.status !== 'draft' && selectedQuotation.status !== 'rejected' && (
              <Card size="small" style={{ marginBottom: 24 }}>
                <Steps 
                  current={
                    selectedQuotation.status === 'sent' ? 1 :
                    selectedQuotation.status === 'accepted' ? 2 :
                    selectedQuotation.status === 'converted' ? 3 : 0
                  }
                  size="small"
                  items={[
                    { title: 'Draft', icon: <EditOutlined /> },
                    { title: 'Sent', icon: <SendOutlined /> },
                    { title: 'Accepted', icon: <CheckCircleOutlined /> },
                    { title: 'Converted', icon: <ShoppingCartOutlined /> },
                  ]}
                />
              </Card>
            )}

            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={12}>
                <Card size="small" title="Customer Information">
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Space>
                      <Avatar icon={<UserOutlined />} />
                      <div>
                        <Text strong>{selectedQuotation.customer.name}</Text>
                        <br />
                        <Tag size="small">{selectedQuotation.customer.type}</Tag>
                      </div>
                    </Space>
                    <Text><MailOutlined /> {selectedQuotation.customer.email}</Text>
                    <Text>{selectedQuotation.customer.phone}</Text>
                  </Space>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" title="Quotation Information">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Branch">
                      <ShopOutlined /> {selectedQuotation.branch}
                    </Descriptions.Item>
                    <Descriptions.Item label="Sales Person">
                      {selectedQuotation.salesPerson}
                    </Descriptions.Item>
                    <Descriptions.Item label="Payment Terms">
                      {selectedQuotation.terms}
                    </Descriptions.Item>
                    <Descriptions.Item label="Valid Until">
                      {dayjs(selectedQuotation.validUntil).format('MMM D, YYYY')}
                    </Descriptions.Item>
                    {selectedQuotation.sentDate && (
                      <Descriptions.Item label="Sent Date">
                        {dayjs(selectedQuotation.sentDate).format('MMM D, YYYY h:mm A')}
                      </Descriptions.Item>
                    )}
                    {selectedQuotation.acceptedDate && (
                      <Descriptions.Item label="Accepted Date">
                        {dayjs(selectedQuotation.acceptedDate).format('MMM D, YYYY h:mm A')}
                      </Descriptions.Item>
                    )}
                    {selectedQuotation.convertedTo && (
                      <Descriptions.Item label="Converted To">
                        <Text type="success" style={{ cursor: 'pointer' }}>
                          {selectedQuotation.convertedTo}
                        </Text>
                      </Descriptions.Item>
                    )}
                  </Descriptions>
                </Card>
              </Col>
            </Row>

            <Divider orientation="left">Quotation Items</Divider>
            <Table
              columns={itemColumns}
              dataSource={selectedQuotation.items}
              rowKey="sku"
              pagination={false}
              size="small"
              style={{ marginBottom: 24 }}
            />

            <Card size="small">
              <Row justify="space-between" style={{ marginBottom: 8 }}>
                <Text>Subtotal</Text>
                <Text>${selectedQuotation.subtotal.toFixed(2)}</Text>
              </Row>
              {selectedQuotation.discount > 0 && (
                <Row justify="space-between" style={{ marginBottom: 8 }}>
                  <Text>Discount</Text>
                  <Text type="danger">-${selectedQuotation.discount.toFixed(2)}</Text>
                </Row>
              )}
              <Row justify="space-between" style={{ marginBottom: 8 }}>
                <Text>Tax (8%)</Text>
                <Text>${selectedQuotation.tax.toFixed(2)}</Text>
              </Row>
              <Divider style={{ margin: '12px 0' }} />
              <Row justify="space-between">
                <Title level={4} style={{ margin: 0 }}>Total</Title>
                <Title level={4} style={{ margin: 0, color: '#52c41a' }}>
                  ${selectedQuotation.total.toFixed(2)}
                </Title>
              </Row>
            </Card>

            {selectedQuotation.notes && (
              <>
                <Divider orientation="left">Notes</Divider>
                <Card size="small" style={{ backgroundColor: '#fafafa' }}>
                  <Text>{selectedQuotation.notes}</Text>
                </Card>
              </>
            )}

            {selectedQuotation.rejectReason && (
              <>
                <Divider orientation="left">Rejection Reason</Divider>
                <Card size="small" style={{ backgroundColor: '#fff2f0', borderColor: '#ffccc7' }}>
                  <Text type="danger">{selectedQuotation.rejectReason}</Text>
    </Card>
              </>
            )}
          </>
        )}
      </Drawer>
    </div>
  );
};

export default Quotations;
