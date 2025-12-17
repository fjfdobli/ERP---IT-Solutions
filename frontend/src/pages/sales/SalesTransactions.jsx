import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Input, Select, Tag, 
  Tooltip, Badge, message, Typography, DatePicker, Drawer,
  Descriptions, Avatar, Divider, Timeline, Statistic
} from 'antd';
import {
  SearchOutlined,
  ExportOutlined,
  EyeOutlined,
  PrinterOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  UserOutlined,
  ShopOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  BankOutlined,
  WalletOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  FileTextOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

// Mock transaction data
const mockTransactions = [
  {
    id: 'TXN-2024-00125',
    date: '2024-01-15T14:30:00',
    customer: { id: 'C001', name: 'John Smith', type: 'Regular' },
    branch: 'Main Branch',
    cashier: 'Sarah Wilson',
    items: [
      { name: 'iPhone 15 Pro Max 256GB', sku: 'APL-IP15PM-256', qty: 1, price: 1099.00, discount: 0 },
      { name: 'AirPods Pro 2nd Generation', sku: 'APL-APP2', qty: 1, price: 180.00, discount: 10 },
    ],
    subtotal: 1279.00,
    discount: 10.00,
    tax: 101.52,
    total: 1370.52,
    paymentMethod: 'credit_card',
    paymentDetails: { cardLast4: '4242', cardBrand: 'Visa' },
    status: 'completed',
    refundAmount: 0,
  },
  {
    id: 'TXN-2024-00124',
    date: '2024-01-15T13:15:00',
    customer: { id: 'C002', name: 'Jane Doe', type: 'VIP' },
    branch: 'Downtown Store',
    cashier: 'Mike Johnson',
    items: [
      { name: 'Samsung Galaxy S24 Ultra 512GB', sku: 'SAM-GS24U-512', qty: 1, price: 899.00, discount: 50 },
      { name: 'Samsung Galaxy Buds3 Pro', sku: 'SAM-GB3P', qty: 1, price: 159.00, discount: 0 },
    ],
    subtotal: 1058.00,
    discount: 50.00,
    tax: 80.64,
    total: 1088.64,
    paymentMethod: 'cash',
    paymentDetails: { amountTendered: 1100.00, change: 11.36 },
    status: 'completed',
    refundAmount: 0,
  },
  {
    id: 'TXN-2024-00123',
    date: '2024-01-15T11:45:00',
    customer: { id: null, name: 'Walk-in Customer', type: 'Walk-in' },
    branch: 'Main Branch',
    cashier: 'Tom Brown',
    items: [
      { name: 'USB-C to Lightning Cable 2m', sku: 'ACC-USBC-LTN-2M', qty: 3, price: 15.99, discount: 0 },
    ],
    subtotal: 47.97,
    discount: 0,
    tax: 3.84,
    total: 51.81,
    paymentMethod: 'e_wallet',
    paymentDetails: { provider: 'GCash' },
    status: 'completed',
    refundAmount: 0,
  },
  {
    id: 'TXN-2024-00122',
    date: '2024-01-15T10:30:00',
    customer: { id: 'C005', name: 'Robert Chen', type: 'Corporate' },
    branch: 'Main Branch',
    cashier: 'Sarah Wilson',
    items: [
      { name: 'MacBook Pro 14" M3 Pro', sku: 'APL-MBP14-M3P', qty: 5, price: 1899.00, discount: 100 },
      { name: 'Magic Mouse', sku: 'APL-MM', qty: 5, price: 79.00, discount: 0 },
    ],
    subtotal: 9890.00,
    discount: 500.00,
    tax: 751.20,
    total: 10141.20,
    paymentMethod: 'bank_transfer',
    paymentDetails: { bank: 'BDO', refNumber: 'BDO-2024011500123' },
    status: 'completed',
    refundAmount: 0,
  },
  {
    id: 'TXN-2024-00121',
    date: '2024-01-15T09:00:00',
    customer: { id: 'C003', name: 'Emily Wang', type: 'Regular' },
    branch: 'Downtown Store',
    cashier: 'Mike Johnson',
    items: [
      { name: 'Sony WH-1000XM5 Headphones', sku: 'SON-WH1000XM5', qty: 1, price: 299.00, discount: 0 },
    ],
    subtotal: 299.00,
    discount: 0,
    tax: 23.92,
    total: 322.92,
    paymentMethod: 'credit_card',
    paymentDetails: { cardLast4: '5678', cardBrand: 'Mastercard' },
    status: 'refunded',
    refundAmount: 322.92,
  },
  {
    id: 'TXN-2024-00120',
    date: '2024-01-14T16:45:00',
    customer: { id: 'C004', name: 'Michael Lee', type: 'VIP' },
    branch: 'Main Branch',
    cashier: 'Tom Brown',
    items: [
      { name: 'iPad Pro 12.9" M2 256GB', sku: 'APL-IPADP-129-M2', qty: 1, price: 1199.00, discount: 60 },
      { name: 'Apple Pencil 2nd Gen', sku: 'APL-PENCIL2', qty: 1, price: 99.00, discount: 0 },
    ],
    subtotal: 1298.00,
    discount: 60.00,
    tax: 99.04,
    total: 1337.04,
    paymentMethod: 'credit_card',
    paymentDetails: { cardLast4: '1234', cardBrand: 'Visa' },
    status: 'partial_refund',
    refundAmount: 99.00,
  },
  {
    id: 'TXN-2024-00119',
    date: '2024-01-14T14:20:00',
    customer: { id: null, name: 'Walk-in Customer', type: 'Walk-in' },
    branch: 'Main Branch',
    cashier: 'Sarah Wilson',
    items: [
      { name: 'Logitech MX Master 3S Mouse', sku: 'LOG-MX-MASTER3S', qty: 1, price: 75.00, discount: 0 },
    ],
    subtotal: 75.00,
    discount: 0,
    tax: 6.00,
    total: 81.00,
    paymentMethod: 'cash',
    paymentDetails: { amountTendered: 100.00, change: 19.00 },
    status: 'voided',
    refundAmount: 0,
    voidReason: 'Customer changed mind',
  },
];

const paymentMethods = [
  { value: 'cash', label: 'Cash', icon: <WalletOutlined /> },
  { value: 'credit_card', label: 'Credit/Debit Card', icon: <CreditCardOutlined /> },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: <BankOutlined /> },
  { value: 'e_wallet', label: 'E-Wallet', icon: <WalletOutlined /> },
];

const branches = ['Main Branch', 'Downtown Store', 'Warehouse'];

const SalesTransactions = () => {
  const [transactions] = useState(mockTransactions);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterPayment, setFilterPayment] = useState(null);
  const [filterBranch, setFilterBranch] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Calculate stats
  const todayTransactions = transactions.filter(t => 
    dayjs(t.date).isSame(dayjs(), 'day') && t.status === 'completed'
  );
  const totalSales = todayTransactions.reduce((sum, t) => sum + t.total, 0);
  const transactionCount = todayTransactions.length;
  const averageTransaction = transactionCount > 0 ? totalSales / transactionCount : 0;
  const refundedAmount = transactions.filter(t => t.status === 'refunded' || t.status === 'partial_refund')
    .reduce((sum, t) => sum + t.refundAmount, 0);

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = !searchText || 
      transaction.id.toLowerCase().includes(searchText.toLowerCase()) ||
      transaction.customer.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !filterStatus || transaction.status === filterStatus;
    const matchesPayment = !filterPayment || transaction.paymentMethod === filterPayment;
    const matchesBranch = !filterBranch || transaction.branch === filterBranch;
    const matchesDate = !dateRange || (
      dayjs(transaction.date).isAfter(dateRange[0].startOf('day')) &&
      dayjs(transaction.date).isBefore(dateRange[1].endOf('day'))
    );
    return matchesSearch && matchesStatus && matchesPayment && matchesBranch && matchesDate;
  });

  // Get status config
  const getStatusConfig = (status) => {
    const config = {
      completed: { color: 'success', text: 'Completed', icon: <CheckCircleOutlined /> },
      refunded: { color: 'error', text: 'Refunded', icon: <CloseCircleOutlined /> },
      partial_refund: { color: 'warning', text: 'Partial Refund', icon: <SyncOutlined /> },
      voided: { color: 'default', text: 'Voided', icon: <CloseCircleOutlined /> },
    };
    return config[status] || config.completed;
  };

  // Get payment icon
  const getPaymentIcon = (method) => {
    const icons = {
      cash: <WalletOutlined style={{ color: '#52c41a' }} />,
      credit_card: <CreditCardOutlined style={{ color: '#1890ff' }} />,
      bank_transfer: <BankOutlined style={{ color: '#722ed1' }} />,
      e_wallet: <WalletOutlined style={{ color: '#fa541c' }} />,
    };
    return icons[method] || <DollarOutlined />;
  };

  // Table columns
  const columns = [
    {
      title: 'Transaction ID',
      dataIndex: 'id',
      key: 'id',
      width: 150,
      fixed: 'left',
      render: (id) => <Text strong style={{ color: '#1890ff' }}>{id}</Text>,
    },
    {
      title: 'Date & Time',
      dataIndex: 'date',
      key: 'date',
      width: 160,
      render: (date) => (
        <div>
          <div>{dayjs(date).format('MMM D, YYYY')}</div>
          <Text type="secondary" style={{ fontSize: 12 }}>{dayjs(date).format('h:mm A')}</Text>
        </div>
      ),
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
      width: 140,
      render: (branch) => (
        <Space>
          <ShopOutlined />
          {branch}
        </Space>
      ),
    },
    {
      title: 'Items',
      key: 'items',
      width: 80,
      align: 'center',
      render: (_, record) => (
        <Badge count={record.items.reduce((sum, i) => sum + i.qty, 0)} showZero color="#1890ff" />
      ),
    },
    {
      title: 'Payment',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 150,
      render: (method, record) => (
        <Space>
          {getPaymentIcon(method)}
          <div>
            <div style={{ textTransform: 'capitalize' }}>{method.replace('_', ' ')}</div>
            {method === 'credit_card' && (
              <Text type="secondary" style={{ fontSize: 11 }}>
                •••• {record.paymentDetails.cardLast4}
              </Text>
            )}
          </div>
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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color} icon={config.icon}>{config.text}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
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
          <Tooltip title="Print Receipt">
            <Button 
              type="text" 
              icon={<PrinterOutlined />}
              onClick={() => handlePrint(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Item columns for detail view
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
  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setDetailDrawerVisible(true);
  };

  const handlePrint = (transaction) => {
    message.info(`Printing receipt for ${transaction.id}...`);
  };

  return (
    <div>
      <PageHeader
        title="Sales Transactions"
        subtitle={`${filteredTransactions.length} transactions`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'Sales', path: '/sales' },
          { title: 'Transactions', path: '/sales/transactions' },
        ]}
        actions={[
          <Button key="export" icon={<ExportOutlined />}>Export</Button>,
        ]}
      />

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Today's Sales"
            value={`$${totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            icon={<DollarOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Transactions"
            value={transactionCount}
            icon={<ShoppingCartOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Avg. Transaction"
            value={`$${averageTransaction.toFixed(2)}`}
            icon={<TagOutlined style={{ fontSize: 24, color: '#722ed1' }} />}
            color="#722ed1"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Refunded"
            value={`$${refundedAmount.toFixed(2)}`}
            icon={<SyncOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />}
            color="#ff4d4f"
          />
        </Col>
      </Row>

      {/* Filters and Table */}
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Space wrap>
            <Search
              placeholder="Search transactions..."
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
              style={{ width: 140 }}
              value={filterStatus}
              onChange={setFilterStatus}
              options={[
                { label: 'Completed', value: 'completed' },
                { label: 'Refunded', value: 'refunded' },
                { label: 'Partial Refund', value: 'partial_refund' },
                { label: 'Voided', value: 'voided' },
              ]}
            />
            <Select
              placeholder="Payment"
              allowClear
              style={{ width: 160 }}
              value={filterPayment}
              onChange={setFilterPayment}
              options={paymentMethods.map(p => ({ label: p.label, value: p.value }))}
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
          dataSource={filteredTransactions}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1400 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} transactions`,
          }}
        />
      </Card>

      {/* Transaction Details Drawer */}
      <Drawer
        title="Transaction Details"
        placement="right"
        width={650}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        extra={
          <Space>
            <Button icon={<PrinterOutlined />} onClick={() => handlePrint(selectedTransaction)}>
              Print Receipt
            </Button>
          </Space>
        }
      >
        {selectedTransaction && (
          <>
            <div style={{ marginBottom: 24 }}>
              <Space align="start">
                <div>
                  <Text strong style={{ fontSize: 20 }}>{selectedTransaction.id}</Text>
                  <Tag 
                    color={getStatusConfig(selectedTransaction.status).color}
                    style={{ marginLeft: 12 }}
                  >
                    {getStatusConfig(selectedTransaction.status).text}
                  </Tag>
                </div>
              </Space>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">
                  <CalendarOutlined /> {dayjs(selectedTransaction.date).format('MMMM D, YYYY h:mm A')}
                </Text>
              </div>
            </div>

            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={12}>
                <Card size="small" style={{ backgroundColor: '#f5f5f5' }}>
                  <div style={{ marginBottom: 8 }}>
                    <Text type="secondary">Customer</Text>
                  </div>
                  <Space>
                    <Avatar icon={<UserOutlined />} />
                    <div>
                      <div><Text strong>{selectedTransaction.customer.name}</Text></div>
                      <Tag size="small">{selectedTransaction.customer.type}</Tag>
                    </div>
                  </Space>
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" style={{ backgroundColor: '#f5f5f5' }}>
                  <div style={{ marginBottom: 8 }}>
                    <Text type="secondary">Branch & Cashier</Text>
                  </div>
                  <Space direction="vertical" size={0}>
                    <Text><ShopOutlined /> {selectedTransaction.branch}</Text>
                    <Text type="secondary"><UserOutlined /> {selectedTransaction.cashier}</Text>
                  </Space>
                </Card>
              </Col>
            </Row>

            <Divider orientation="left">Items</Divider>
            <Table
              columns={itemColumns}
              dataSource={selectedTransaction.items}
              rowKey="sku"
              pagination={false}
              size="small"
              style={{ marginBottom: 24 }}
            />

            <Card size="small" style={{ marginBottom: 24 }}>
              <Row justify="space-between" style={{ marginBottom: 8 }}>
                <Text>Subtotal</Text>
                <Text>${selectedTransaction.subtotal.toFixed(2)}</Text>
              </Row>
              {selectedTransaction.discount > 0 && (
                <Row justify="space-between" style={{ marginBottom: 8 }}>
                  <Text>Discount</Text>
                  <Text type="danger">-${selectedTransaction.discount.toFixed(2)}</Text>
                </Row>
              )}
              <Row justify="space-between" style={{ marginBottom: 8 }}>
                <Text>Tax (8%)</Text>
                <Text>${selectedTransaction.tax.toFixed(2)}</Text>
              </Row>
              <Divider style={{ margin: '12px 0' }} />
              <Row justify="space-between">
                <Title level={4} style={{ margin: 0 }}>Total</Title>
                <Title level={4} style={{ margin: 0, color: '#52c41a' }}>
                  ${selectedTransaction.total.toFixed(2)}
                </Title>
              </Row>
              {selectedTransaction.refundAmount > 0 && (
                <Row justify="space-between" style={{ marginTop: 8 }}>
                  <Text type="danger">Refunded</Text>
                  <Text type="danger">-${selectedTransaction.refundAmount.toFixed(2)}</Text>
                </Row>
              )}
            </Card>

            <Divider orientation="left">Payment Details</Divider>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Method">
                <Space>
                  {getPaymentIcon(selectedTransaction.paymentMethod)}
                  <span style={{ textTransform: 'capitalize' }}>
                    {selectedTransaction.paymentMethod.replace('_', ' ')}
                  </span>
                </Space>
              </Descriptions.Item>
              {selectedTransaction.paymentMethod === 'cash' && (
                <>
                  <Descriptions.Item label="Amount Tendered">
                    ${selectedTransaction.paymentDetails.amountTendered.toFixed(2)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Change">
                    ${selectedTransaction.paymentDetails.change.toFixed(2)}
                  </Descriptions.Item>
                </>
              )}
              {selectedTransaction.paymentMethod === 'credit_card' && (
                <>
                  <Descriptions.Item label="Card">
                    {selectedTransaction.paymentDetails.cardBrand} •••• {selectedTransaction.paymentDetails.cardLast4}
                  </Descriptions.Item>
                </>
              )}
              {selectedTransaction.paymentMethod === 'bank_transfer' && (
                <>
                  <Descriptions.Item label="Bank">
                    {selectedTransaction.paymentDetails.bank}
                  </Descriptions.Item>
                  <Descriptions.Item label="Reference">
                    {selectedTransaction.paymentDetails.refNumber}
                  </Descriptions.Item>
                </>
              )}
              {selectedTransaction.paymentMethod === 'e_wallet' && (
                <Descriptions.Item label="Provider">
                  {selectedTransaction.paymentDetails.provider}
                </Descriptions.Item>
              )}
            </Descriptions>

            {selectedTransaction.voidReason && (
              <>
                <Divider orientation="left">Void Information</Divider>
                <Card size="small" style={{ backgroundColor: '#fff2f0', borderColor: '#ffccc7' }}>
                  <Text type="danger"><FileTextOutlined /> {selectedTransaction.voidReason}</Text>
                </Card>
              </>
            )}
          </>
        )}
      </Drawer>
    </div>
  );
};

export default SalesTransactions;
