import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Input, Select, Tag, 
  Tooltip, Badge, message, Typography, DatePicker, Drawer,
  Descriptions, Avatar, Divider, Form, InputNumber, Modal
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ExportOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  RollbackOutlined,
  DollarOutlined,
  UserOutlined,
  ShopOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SwapOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer } from '../../components/Common';
import dayjs from 'dayjs';

const { Search, TextArea } = Input;
const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

// Mock returns data
const mockReturns = [
  {
    id: 'RTN-2024-0012',
    date: '2024-01-15T11:30:00',
    originalTransaction: 'TXN-2024-00121',
    customer: { id: 'C003', name: 'Emily Wang', type: 'Regular' },
    branch: 'Downtown Store',
    processedBy: 'Mike Johnson',
    type: 'full_refund',
    reason: 'defective',
    items: [
      { name: 'Sony WH-1000XM5 Headphones', sku: 'SON-WH1000XM5', qty: 1, price: 299.00, refundAmount: 322.92 },
    ],
    subtotal: 299.00,
    tax: 23.92,
    totalRefund: 322.92,
    refundMethod: 'original_payment',
    status: 'completed',
    notes: 'Left earphone not working, customer verified',
  },
  {
    id: 'RTN-2024-0011',
    date: '2024-01-14T15:00:00',
    originalTransaction: 'TXN-2024-00120',
    customer: { id: 'C004', name: 'Michael Lee', type: 'VIP' },
    branch: 'Main Branch',
    processedBy: 'Tom Brown',
    type: 'partial_refund',
    reason: 'wrong_item',
    items: [
      { name: 'Apple Pencil 2nd Gen', sku: 'APL-PENCIL2', qty: 1, price: 99.00, refundAmount: 99.00 },
    ],
    subtotal: 99.00,
    tax: 0,
    totalRefund: 99.00,
    refundMethod: 'store_credit',
    status: 'completed',
    notes: 'Ordered wrong generation pencil',
  },
  {
    id: 'RTN-2024-0010',
    date: '2024-01-13T10:00:00',
    originalTransaction: 'TXN-2024-00115',
    customer: { id: 'C001', name: 'John Smith', type: 'Regular' },
    branch: 'Main Branch',
    processedBy: 'Sarah Wilson',
    type: 'exchange',
    reason: 'changed_mind',
    items: [
      { name: 'Samsung Galaxy Buds3 Pro', sku: 'SAM-GB3P', qty: 1, price: 159.00, refundAmount: 0 },
    ],
    exchangeItem: { name: 'AirPods Pro 2nd Generation', sku: 'APL-APP2', price: 180.00 },
    subtotal: 0,
    tax: 0,
    totalRefund: 0,
    additionalPayment: 21.00,
    refundMethod: 'exchange',
    status: 'completed',
    notes: 'Exchanged for AirPods - customer paid difference',
  },
  {
    id: 'RTN-2024-0009',
    date: '2024-01-12T16:30:00',
    originalTransaction: 'TXN-2024-00110',
    customer: { id: 'C002', name: 'Jane Doe', type: 'VIP' },
    branch: 'Downtown Store',
    processedBy: 'Mike Johnson',
    type: 'full_refund',
    reason: 'not_as_described',
    items: [
      { name: 'USB-C Hub 7-in-1', sku: 'ACC-USBC-HUB7', qty: 1, price: 45.00, refundAmount: 48.60 },
    ],
    subtotal: 45.00,
    tax: 3.60,
    totalRefund: 48.60,
    refundMethod: 'cash',
    status: 'pending',
    notes: 'Product not compatible with MacBook as advertised',
  },
  {
    id: 'RTN-2024-0008',
    date: '2024-01-11T09:00:00',
    originalTransaction: 'TXN-2024-00105',
    customer: { id: null, name: 'Walk-in Customer', type: 'Walk-in' },
    branch: 'Main Branch',
    processedBy: 'Tom Brown',
    type: 'full_refund',
    reason: 'damaged_in_transit',
    items: [
      { name: 'Logitech MX Keys', sku: 'LOG-MX-KEYS', qty: 1, price: 99.00, refundAmount: 106.92 },
    ],
    subtotal: 99.00,
    tax: 7.92,
    totalRefund: 106.92,
    refundMethod: 'original_payment',
    status: 'rejected',
    rejectionReason: 'No proof of purchase provided',
    notes: 'Customer claims damage but no receipt',
  },
];

const returnReasons = [
  { value: 'defective', label: 'Defective Product' },
  { value: 'wrong_item', label: 'Wrong Item Received' },
  { value: 'changed_mind', label: 'Changed Mind' },
  { value: 'not_as_described', label: 'Not As Described' },
  { value: 'damaged_in_transit', label: 'Damaged in Transit' },
  { value: 'other', label: 'Other' },
];

const returnTypes = [
  { value: 'full_refund', label: 'Full Refund', color: 'red' },
  { value: 'partial_refund', label: 'Partial Refund', color: 'orange' },
  { value: 'exchange', label: 'Exchange', color: 'blue' },
];

const refundMethods = [
  { value: 'original_payment', label: 'Original Payment Method' },
  { value: 'cash', label: 'Cash' },
  { value: 'store_credit', label: 'Store Credit' },
  { value: 'exchange', label: 'Exchange' },
];

const branches = ['Main Branch', 'Downtown Store', 'Warehouse'];

const SalesReturns = () => {
  const [returns, setReturns] = useState(mockReturns);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [form] = Form.useForm();

  // Calculate stats
  const totalReturns = returns.length;
  const pendingReturns = returns.filter(r => r.status === 'pending').length;
  const totalRefunded = returns.filter(r => r.status === 'completed')
    .reduce((sum, r) => sum + r.totalRefund, 0);
  const exchangeCount = returns.filter(r => r.type === 'exchange').length;

  // Filter returns
  const filteredReturns = returns.filter(returnItem => {
    const matchesSearch = !searchText || 
      returnItem.id.toLowerCase().includes(searchText.toLowerCase()) ||
      returnItem.customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
      returnItem.originalTransaction.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !filterStatus || returnItem.status === filterStatus;
    const matchesType = !filterType || returnItem.type === filterType;
    const matchesDate = !dateRange || (
      dayjs(returnItem.date).isAfter(dateRange[0].startOf('day')) &&
      dayjs(returnItem.date).isBefore(dateRange[1].endOf('day'))
    );
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  // Get status config
  const getStatusConfig = (status) => {
    const config = {
      pending: { color: 'warning', text: 'Pending', icon: <ClockCircleOutlined /> },
      completed: { color: 'success', text: 'Completed', icon: <CheckCircleOutlined /> },
      rejected: { color: 'error', text: 'Rejected', icon: <CloseOutlined /> },
    };
    return config[status] || config.pending;
  };

  // Get type config
  const getTypeConfig = (type) => {
    return returnTypes.find(t => t.value === type) || returnTypes[0];
  };

  // Table columns
  const columns = [
    {
      title: 'Return ID',
      dataIndex: 'id',
      key: 'id',
      width: 140,
      fixed: 'left',
      render: (id) => <Text strong style={{ color: '#1890ff' }}>{id}</Text>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (date) => dayjs(date).format('MMM D, YYYY'),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Original Transaction',
      dataIndex: 'originalTransaction',
      key: 'originalTransaction',
      width: 160,
      render: (txn) => <Text code>{txn}</Text>,
    },
    {
      title: 'Customer',
      key: 'customer',
      width: 160,
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
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type) => {
        const config = getTypeConfig(type);
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      width: 150,
      render: (reason) => {
        const reasonConfig = returnReasons.find(r => r.value === reason);
        return <Text>{reasonConfig?.label || reason}</Text>;
      },
    },
    {
      title: 'Refund Amount',
      dataIndex: 'totalRefund',
      key: 'totalRefund',
      width: 130,
      align: 'right',
      render: (amount, record) => (
        <div>
          {amount > 0 ? (
            <Text strong style={{ color: '#ff4d4f' }}>${amount.toFixed(2)}</Text>
          ) : (
            <Text type="secondary">—</Text>
          )}
          {record.additionalPayment > 0 && (
            <div>
              <Text type="success" style={{ fontSize: 11 }}>
                +${record.additionalPayment.toFixed(2)} paid
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color} icon={config.icon}>{config.text}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 140,
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
          {record.status === 'pending' && (
            <>
              <Tooltip title="Approve">
                <Button 
                  type="text" 
                  icon={<CheckOutlined style={{ color: '#52c41a' }} />}
                  onClick={() => handleApprove(record)}
                />
              </Tooltip>
              <Tooltip title="Reject">
                <Button 
                  type="text" 
                  icon={<CloseOutlined style={{ color: '#ff4d4f' }} />}
                  onClick={() => handleReject(record)}
                />
              </Tooltip>
            </>
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
      title: 'Refund',
      dataIndex: 'refundAmount',
      key: 'refundAmount',
      width: 100,
      align: 'right',
      render: (amount) => <Text strong style={{ color: '#ff4d4f' }}>${amount.toFixed(2)}</Text>,
    },
  ];

  // Handlers
  const handleCreateReturn = () => {
    form.resetFields();
    setDrawerVisible(true);
  };

  const handleViewDetails = (returnItem) => {
    setSelectedReturn(returnItem);
    setDetailDrawerVisible(true);
  };

  const handleApprove = (returnItem) => {
    setReturns(returns.map(r => r.id === returnItem.id ? { ...r, status: 'completed' } : r));
    message.success(`Return ${returnItem.id} approved and processed`);
  };

  const handleReject = (returnItem) => {
    Modal.confirm({
      title: 'Reject Return',
      content: 'Are you sure you want to reject this return request?',
      okText: 'Reject',
      okType: 'danger',
      onOk: () => {
        setReturns(returns.map(r => r.id === returnItem.id ? { 
          ...r, 
          status: 'rejected',
          rejectionReason: 'Return request did not meet policy requirements'
        } : r));
        message.warning(`Return ${returnItem.id} rejected`);
      },
    });
  };

  const handleSaveReturn = () => {
    form.validateFields().then(values => {
      const newReturn = {
        id: `RTN-2024-${String(returns.length + 13).padStart(4, '0')}`,
        date: new Date().toISOString(),
        ...values,
        status: 'pending',
        items: [],
        subtotal: 0,
        tax: 0,
        totalRefund: 0,
        processedBy: 'Current User',
      };
      setReturns([newReturn, ...returns]);
      message.success('Return request created');
      setDrawerVisible(false);
    });
  };

  // Form fields
  const formFields = [
    {
      name: 'originalTransaction',
      label: 'Original Transaction ID',
      type: 'input',
      placeholder: 'e.g., TXN-2024-00125',
      rules: [{ required: true, message: 'Please enter transaction ID' }],
      span: 24,
    },
    {
      name: 'type',
      label: 'Return Type',
      type: 'select',
      options: returnTypes.map(t => ({ label: t.label, value: t.value })),
      rules: [{ required: true, message: 'Please select return type' }],
      span: 12,
    },
    {
      name: 'reason',
      label: 'Reason',
      type: 'select',
      options: returnReasons.map(r => ({ label: r.label, value: r.value })),
      rules: [{ required: true, message: 'Please select reason' }],
      span: 12,
    },
    {
      name: 'refundMethod',
      label: 'Refund Method',
      type: 'select',
      options: refundMethods.map(m => ({ label: m.label, value: m.value })),
      rules: [{ required: true, message: 'Please select refund method' }],
      span: 12,
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
      name: 'notes',
      label: 'Notes',
      type: 'textarea',
      placeholder: 'Enter reason details and additional notes...',
      rules: [{ required: true, message: 'Please provide details' }],
      span: 24,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Returns & Refunds"
        subtitle={`${filteredReturns.length} returns`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'Sales', path: '/sales' },
          { title: 'Returns', path: '/sales/returns' },
        ]}
        actions={[
          <Button key="export" icon={<ExportOutlined />}>Export</Button>,
          <Button key="create" type="primary" icon={<PlusOutlined />} onClick={handleCreateReturn}>
            New Return
          </Button>,
        ]}
      />

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Returns"
            value={totalReturns}
            icon={<RollbackOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Pending"
            value={pendingReturns}
            icon={<ClockCircleOutlined style={{ fontSize: 24, color: '#faad14' }} />}
            color="#faad14"
            warning={pendingReturns > 0}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Refunded"
            value={`$${totalRefunded.toFixed(2)}`}
            icon={<DollarOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />}
            color="#ff4d4f"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Exchanges"
            value={exchangeCount}
            icon={<SwapOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
            color="#52c41a"
          />
        </Col>
      </Row>

      {/* Filters and Table */}
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Space wrap>
            <Search
              placeholder="Search returns..."
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
              options={[
                { label: 'Pending', value: 'pending' },
                { label: 'Completed', value: 'completed' },
                { label: 'Rejected', value: 'rejected' },
              ]}
            />
            <Select
              placeholder="Type"
              allowClear
              style={{ width: 140 }}
              value={filterType}
              onChange={setFilterType}
              options={returnTypes.map(t => ({ label: t.label, value: t.value }))}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredReturns}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1300 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} returns`,
          }}
        />
      </Card>

      {/* Create Return Drawer */}
      <FormDrawer
        title="Create Return Request"
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onSubmit={handleSaveReturn}
        form={form}
        fields={formFields}
        width={600}
      />

      {/* Return Details Drawer */}
      <Drawer
        title="Return Details"
        placement="right"
        width={600}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        extra={
          selectedReturn?.status === 'pending' && (
            <Space>
              <Button onClick={() => handleReject(selectedReturn)}>Reject</Button>
              <Button type="primary" onClick={() => {
                handleApprove(selectedReturn);
                setDetailDrawerVisible(false);
              }}>
                Approve & Process
              </Button>
            </Space>
          )
        }
      >
        {selectedReturn && (
          <>
            <div style={{ marginBottom: 24 }}>
              <Space>
                <Text strong style={{ fontSize: 20 }}>{selectedReturn.id}</Text>
                <Tag color={getStatusConfig(selectedReturn.status).color}>
                  {getStatusConfig(selectedReturn.status).text}
                </Tag>
                <Tag color={getTypeConfig(selectedReturn.type).color}>
                  {getTypeConfig(selectedReturn.type).label}
                </Tag>
              </Space>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">
                  <CalendarOutlined /> {dayjs(selectedReturn.date).format('MMMM D, YYYY h:mm A')}
                </Text>
              </div>
            </div>

            <Descriptions column={2} bordered size="small" style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Original Transaction" span={2}>
                <Text code>{selectedReturn.originalTransaction}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Customer">
                <Space>
                  <Avatar size="small" icon={<UserOutlined />} />
                  {selectedReturn.customer.name}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Type">
                <Tag>{selectedReturn.customer.type}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Branch">
                <ShopOutlined /> {selectedReturn.branch}
              </Descriptions.Item>
              <Descriptions.Item label="Processed By">
                {selectedReturn.processedBy}
              </Descriptions.Item>
              <Descriptions.Item label="Reason" span={2}>
                {returnReasons.find(r => r.value === selectedReturn.reason)?.label}
              </Descriptions.Item>
              <Descriptions.Item label="Refund Method" span={2}>
                {refundMethods.find(m => m.value === selectedReturn.refundMethod)?.label}
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">Returned Items</Divider>
            <Table
              columns={itemColumns}
              dataSource={selectedReturn.items}
              rowKey="sku"
              pagination={false}
              size="small"
              style={{ marginBottom: 24 }}
            />

            {selectedReturn.exchangeItem && (
              <>
                <Divider orientation="left">Exchange Item</Divider>
                <Card size="small" style={{ marginBottom: 24, backgroundColor: '#f6ffed' }}>
                  <Space>
                    <SwapOutlined style={{ color: '#52c41a' }} />
                    <div>
                      <Text strong>{selectedReturn.exchangeItem.name}</Text>
                      <br />
                      <Text type="secondary">{selectedReturn.exchangeItem.sku}</Text>
                      <br />
                      <Text style={{ color: '#52c41a' }}>
                        ${selectedReturn.exchangeItem.price.toFixed(2)}
                      </Text>
                    </div>
                  </Space>
                </Card>
              </>
            )}

            <Card size="small" style={{ marginBottom: 24 }}>
              <Row justify="space-between" style={{ marginBottom: 8 }}>
                <Text>Subtotal</Text>
                <Text>${selectedReturn.subtotal.toFixed(2)}</Text>
              </Row>
              <Row justify="space-between" style={{ marginBottom: 8 }}>
                <Text>Tax</Text>
                <Text>${selectedReturn.tax.toFixed(2)}</Text>
              </Row>
              <Divider style={{ margin: '12px 0' }} />
              <Row justify="space-between">
                <Title level={4} style={{ margin: 0 }}>Total Refund</Title>
                <Title level={4} style={{ margin: 0, color: '#ff4d4f' }}>
                  ${selectedReturn.totalRefund.toFixed(2)}
                </Title>
              </Row>
              {selectedReturn.additionalPayment > 0 && (
                <Row justify="space-between" style={{ marginTop: 8 }}>
                  <Text type="success">Additional Payment Collected</Text>
                  <Text type="success">+${selectedReturn.additionalPayment.toFixed(2)}</Text>
                </Row>
              )}
            </Card>

            {selectedReturn.notes && (
              <>
                <Divider orientation="left">Notes</Divider>
                <Card size="small" style={{ backgroundColor: '#fafafa' }}>
                  <Space>
                    <FileTextOutlined />
                    <Text>{selectedReturn.notes}</Text>
                  </Space>
                </Card>
              </>
            )}

            {selectedReturn.rejectionReason && (
              <>
                <Divider orientation="left">Rejection Reason</Divider>
                <Card size="small" style={{ backgroundColor: '#fff2f0', borderColor: '#ffccc7' }}>
                  <Space>
                    <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                    <Text type="danger">{selectedReturn.rejectionReason}</Text>
                  </Space>
                </Card>
              </>
            )}
          </>
        )}
      </Drawer>
    </div>
  );
};

export default SalesReturns;
