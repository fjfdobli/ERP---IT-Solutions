import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Input, Select, Tag, 
  Tooltip, message, Typography, DatePicker, Statistic, Drawer,
  Descriptions, Timeline, Progress, Tabs, Form, InputNumber
} from 'antd';
import {
  PlusOutlined,
  ExportOutlined,
  EyeOutlined,
  DollarOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  ShopOutlined,
  PrinterOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text, Title } = Typography;

// Mock payables data
const mockPayables = [
  {
    id: 'BILL001',
    billNumber: 'BILL-2024-0001',
    vendorId: 'VEND001',
    vendorName: 'ABC Electronics Supply',
    vendorEmail: 'accounts@abcelectronics.ph',
    vendorPhone: '+63 917 111 2222',
    billDate: '2024-01-05',
    dueDate: '2024-01-20',
    amount: 185000.00,
    paidAmount: 100000.00,
    balance: 85000.00,
    status: 'partial',
    terms: 'Net 15',
    category: 'Inventory',
    items: [
      { description: 'Electronic Components Lot A', quantity: 100, unitPrice: 1500, total: 150000 },
      { description: 'Packaging Materials', quantity: 500, unitPrice: 70, total: 35000 },
    ],
    payments: [
      { date: '2024-01-10', amount: 100000, method: 'Bank Transfer', reference: 'BTR-OUT-001' },
    ],
  },
  {
    id: 'BILL002',
    billNumber: 'BILL-2024-0002',
    vendorId: 'VEND002',
    vendorName: 'Manila Office Supplies',
    vendorEmail: 'billing@manilaoffice.ph',
    vendorPhone: '+63 918 222 3333',
    billDate: '2024-01-08',
    dueDate: '2024-01-23',
    amount: 45000.00,
    paidAmount: 0,
    balance: 45000.00,
    status: 'pending',
    terms: 'Net 15',
    category: 'Operations',
    items: [
      { description: 'Office Supplies Q1', quantity: 1, unitPrice: 30000, total: 30000 },
      { description: 'Printer Consumables', quantity: 10, unitPrice: 1500, total: 15000 },
    ],
    payments: [],
  },
  {
    id: 'BILL003',
    billNumber: 'BILL-2024-0003',
    vendorId: 'VEND003',
    vendorName: 'Meralco',
    vendorEmail: 'billing@meralco.com.ph',
    vendorPhone: '+63 16211',
    billDate: '2024-01-01',
    dueDate: '2024-01-15',
    amount: 125000.00,
    paidAmount: 0,
    balance: 125000.00,
    status: 'overdue',
    terms: 'Net 15',
    category: 'Utilities',
    items: [
      { description: 'Electricity - December 2023', quantity: 1, unitPrice: 125000, total: 125000 },
    ],
    payments: [],
    daysOverdue: 1,
  },
  {
    id: 'BILL004',
    billNumber: 'BILL-2024-0004',
    vendorId: 'VEND004',
    vendorName: 'Globe Business',
    vendorEmail: 'enterprise@globe.com.ph',
    vendorPhone: '+63 917 888 9999',
    billDate: '2024-01-05',
    dueDate: '2024-01-20',
    amount: 35000.00,
    paidAmount: 35000.00,
    balance: 0,
    status: 'paid',
    terms: 'Net 15',
    category: 'Utilities',
    items: [
      { description: 'Internet Service - January', quantity: 1, unitPrice: 25000, total: 25000 },
      { description: 'Mobile Plans', quantity: 10, unitPrice: 1000, total: 10000 },
    ],
    payments: [
      { date: '2024-01-15', amount: 35000, method: 'Auto-Debit', reference: 'AD-001234' },
    ],
  },
  {
    id: 'BILL005',
    billNumber: 'BILL-2024-0005',
    vendorId: 'VEND005',
    vendorName: 'SM Prime Holdings',
    vendorEmail: 'leasing@smprime.ph',
    vendorPhone: '+63 918 333 4444',
    billDate: '2024-01-01',
    dueDate: '2024-01-05',
    amount: 150000.00,
    paidAmount: 150000.00,
    balance: 0,
    status: 'paid',
    terms: 'Due on Receipt',
    category: 'Rent',
    items: [
      { description: 'Office Rent - January 2024', quantity: 1, unitPrice: 150000, total: 150000 },
    ],
    payments: [
      { date: '2024-01-03', amount: 150000, method: 'Check', reference: 'CHK-OUT-001' },
    ],
  },
  {
    id: 'BILL006',
    billNumber: 'BILL-2024-0006',
    vendorId: 'VEND006',
    vendorName: 'Tech Components Inc',
    vendorEmail: 'ar@techcomponents.ph',
    vendorPhone: '+63 919 444 5555',
    billDate: '2023-12-15',
    dueDate: '2024-01-14',
    amount: 320000.00,
    paidAmount: 0,
    balance: 320000.00,
    status: 'overdue',
    terms: 'Net 30',
    category: 'Inventory',
    items: [
      { description: 'Computer Parts Bulk Order', quantity: 50, unitPrice: 5000, total: 250000 },
      { description: 'Network Equipment', quantity: 10, unitPrice: 7000, total: 70000 },
    ],
    payments: [],
    daysOverdue: 2,
  },
];

const categories = ['Inventory', 'Operations', 'Utilities', 'Rent', 'Payroll', 'Marketing', 'Other'];

const AccountsPayable = () => {
  const [payables] = useState(mockPayables);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [paymentDrawerVisible, setPaymentDrawerVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();

  // Calculate statistics
  const totalPayable = payables.reduce((sum, r) => sum + r.balance, 0);
  const overdueAmount = payables.filter(r => r.status === 'overdue').reduce((sum, r) => sum + r.balance, 0);
  const dueThisWeek = payables.filter(r => {
    const dueDate = dayjs(r.dueDate);
    const today = dayjs();
    return r.status !== 'paid' && dueDate.diff(today, 'day') <= 7 && dueDate.diff(today, 'day') >= 0;
  }).reduce((sum, r) => sum + r.balance, 0);
  const pendingCount = payables.filter(r => r.status === 'pending' || r.status === 'partial').length;

  // Filter records
  const filteredRecords = payables.filter(record => {
    const matchesSearch = !searchText || 
      record.vendorName.toLowerCase().includes(searchText.toLowerCase()) ||
      record.billNumber.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !filterStatus || record.status === filterStatus;
    const matchesCategory = !filterCategory || record.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusConfig = (status) => {
    const configs = {
      'paid': { color: 'success', text: 'Paid', icon: <CheckCircleOutlined /> },
      'partial': { color: 'processing', text: 'Partial', icon: <ClockCircleOutlined /> },
      'pending': { color: 'warning', text: 'Pending', icon: <ClockCircleOutlined /> },
      'overdue': { color: 'error', text: 'Overdue', icon: <ExclamationCircleOutlined /> },
    };
    return configs[status] || configs['pending'];
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Inventory': 'blue',
      'Operations': 'cyan',
      'Utilities': 'purple',
      'Rent': 'gold',
      'Payroll': 'green',
      'Marketing': 'magenta',
      'Other': 'default',
    };
    return colors[category] || 'default';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  // Table columns
  const columns = [
    {
      title: 'Bill',
      key: 'bill',
      width: 150,
      fixed: 'left',
      render: (_, record) => (
        <div>
          <Text strong style={{ color: '#1890ff' }}>{record.billNumber}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 11 }}>
            {dayjs(record.billDate).format('MMM D, YYYY')}
          </Text>
        </div>
      ),
    },
    {
      title: 'Vendor',
      key: 'vendor',
      width: 200,
      render: (_, record) => (
        <Space>
          <ShopOutlined />
          <div>
            <Text strong>{record.vendorName}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 11 }}>{record.vendorId}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 110,
      render: (cat) => <Tag color={getCategoryColor(cat)}>{cat}</Tag>,
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 120,
      render: (date, record) => (
        <div>
          <Text type={record.status === 'overdue' ? 'danger' : 'secondary'}>
            {dayjs(date).format('MMM D, YYYY')}
          </Text>
          {record.daysOverdue && (
            <>
              <br />
              <Text type="danger" style={{ fontSize: 11 }}>
                {record.daysOverdue} days overdue
              </Text>
            </>
          )}
        </div>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      align: 'right',
      render: (amount) => formatCurrency(amount),
    },
    {
      title: 'Paid',
      dataIndex: 'paidAmount',
      key: 'paidAmount',
      width: 110,
      align: 'right',
      render: (paid) => paid > 0 ? <Text type="success">{formatCurrency(paid)}</Text> : '-',
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      width: 120,
      align: 'right',
      render: (balance, record) => (
        <Text strong type={record.status === 'overdue' ? 'danger' : undefined}>
          {formatCurrency(balance)}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status) => {
        const config = getStatusConfig(status);
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
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
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          {record.status !== 'paid' && (
            <Tooltip title="Pay Bill">
              <Button 
                type="text" 
                icon={<DollarOutlined />}
                onClick={() => handlePayBill(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  // Handlers
  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setDetailDrawerVisible(true);
  };

  const handlePayBill = (record) => {
    setSelectedRecord(record);
    form.resetFields();
    form.setFieldsValue({
      paymentDate: dayjs(),
      amount: record.balance,
    });
    setPaymentDrawerVisible(true);
  };

  const handlePaymentSubmit = () => {
    message.success('Payment recorded successfully');
    setPaymentDrawerVisible(false);
  };

  return (
    <div>
      <PageHeader
        title="Accounts Payable"
        subtitle="Manage vendor bills and payments"
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'Finance', path: '/finance' },
          { title: 'Payables', path: '/finance/payables' },
        ]}
        actions={[
          <Button key="create" type="primary" icon={<PlusOutlined />}>
            New Bill
          </Button>,
          <Button key="export" icon={<ExportOutlined />}>Export</Button>,
        ]}
      />

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Payable"
            value={formatCurrency(totalPayable)}
            icon={<DollarOutlined />}
            color="#f5222d"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Overdue"
            value={formatCurrency(overdueAmount)}
            icon={<ExclamationCircleOutlined />}
            color="#ff4d4f"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Due This Week"
            value={formatCurrency(dueThisWeek)}
            icon={<CalendarOutlined />}
            color="#faad14"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Pending Bills"
            value={pendingCount}
            icon={<FileTextOutlined />}
            color="#1890ff"
          />
        </Col>
      </Row>

      {/* Category Summary */}
      <Card title="Payables by Category" size="small" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          {categories.slice(0, 6).map(cat => {
            const catTotal = payables.filter(p => p.category === cat).reduce((sum, p) => sum + p.balance, 0);
            const catCount = payables.filter(p => p.category === cat && p.status !== 'paid').length;
            return (
              <Col xs={12} sm={8} md={4} key={cat}>
                <div style={{ textAlign: 'center', padding: '8px 0' }}>
                  <Tag color={getCategoryColor(cat)}>{cat}</Tag>
                  <Title level={5} style={{ margin: '8px 0 4px' }}>
                    {formatCurrency(catTotal)}
                  </Title>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    {catCount} pending
                  </Text>
                </div>
              </Col>
            );
          })}
        </Row>
      </Card>

      {/* Filters and Table */}
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Space wrap>
            <Search
              placeholder="Search bills..."
              allowClear
              style={{ width: 250 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              placeholder="Status"
              allowClear
              style={{ width: 130 }}
              value={filterStatus}
              onChange={setFilterStatus}
              options={[
                { label: 'Paid', value: 'paid' },
                { label: 'Partial', value: 'partial' },
                { label: 'Pending', value: 'pending' },
                { label: 'Overdue', value: 'overdue' },
              ]}
            />
            <Select
              placeholder="Category"
              allowClear
              style={{ width: 130 }}
              value={filterCategory}
              onChange={setFilterCategory}
              options={categories.map(c => ({ label: c, value: c }))}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredRecords}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} bills`,
          }}
        />
      </Card>

      {/* Detail Drawer */}
      <Drawer
        title={
          <Space>
            <FileTextOutlined />
            Bill Details
          </Space>
        }
        placement="right"
        width={600}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        extra={
          <Space>
            <Button icon={<PrinterOutlined />}>Print</Button>
          </Space>
        }
      >
        {selectedRecord && (
          <Tabs
            items={[
              {
                key: 'details',
                label: 'Bill Details',
                children: (
                  <>
                    <Card 
                      size="small" 
                      style={{ marginBottom: 16, background: '#fafafa' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <Title level={4} style={{ margin: 0 }}>
                            {selectedRecord.billNumber}
                          </Title>
                          <Space style={{ marginTop: 8 }}>
                            <Tag color={getStatusConfig(selectedRecord.status).color}>
                              {getStatusConfig(selectedRecord.status).text}
                            </Tag>
                            <Tag color={getCategoryColor(selectedRecord.category)}>
                              {selectedRecord.category}
                            </Tag>
                          </Space>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <Text type="secondary">Balance Due</Text>
                          <Title level={3} style={{ margin: 0, color: selectedRecord.status === 'overdue' ? '#f5222d' : '#1890ff' }}>
                            {formatCurrency(selectedRecord.balance)}
                          </Title>
                        </div>
                      </div>
                    </Card>

                    <Descriptions bordered size="small" column={2} style={{ marginBottom: 24 }}>
                      <Descriptions.Item label="Vendor" span={2}>
                        <Text strong>{selectedRecord.vendorName}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="Email">
                        {selectedRecord.vendorEmail}
                      </Descriptions.Item>
                      <Descriptions.Item label="Phone">
                        {selectedRecord.vendorPhone}
                      </Descriptions.Item>
                      <Descriptions.Item label="Bill Date">
                        {dayjs(selectedRecord.billDate).format('MMMM D, YYYY')}
                      </Descriptions.Item>
                      <Descriptions.Item label="Due Date">
                        <Text type={selectedRecord.status === 'overdue' ? 'danger' : undefined}>
                          {dayjs(selectedRecord.dueDate).format('MMMM D, YYYY')}
                        </Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="Terms">
                        {selectedRecord.terms}
                      </Descriptions.Item>
                      <Descriptions.Item label="Bill Total">
                        <Text strong>{formatCurrency(selectedRecord.amount)}</Text>
                      </Descriptions.Item>
                    </Descriptions>

                    <Card title="Line Items" size="small">
                      <Table
                        size="small"
                        dataSource={selectedRecord.items}
                        pagination={false}
                        columns={[
                          { title: 'Description', dataIndex: 'description', key: 'description' },
                          { title: 'Qty', dataIndex: 'quantity', key: 'quantity', width: 60, align: 'center' },
                          { title: 'Price', dataIndex: 'unitPrice', key: 'unitPrice', width: 100, align: 'right', render: (v) => formatCurrency(v) },
                          { title: 'Total', dataIndex: 'total', key: 'total', width: 100, align: 'right', render: (v) => formatCurrency(v) },
                        ]}
                        summary={() => (
                          <Table.Summary.Row>
                            <Table.Summary.Cell colSpan={3}><Text strong>Total</Text></Table.Summary.Cell>
                            <Table.Summary.Cell align="right">
                              <Text strong>{formatCurrency(selectedRecord.amount)}</Text>
                            </Table.Summary.Cell>
                          </Table.Summary.Row>
                        )}
                      />
                    </Card>
                  </>
                ),
              },
              {
                key: 'payments',
                label: `Payments (${selectedRecord.payments.length})`,
                children: (
                  <>
                    <Card size="small" style={{ marginBottom: 16, background: '#fff2f0', borderColor: '#ffccc7' }}>
                      <Row gutter={16}>
                        <Col span={8} style={{ textAlign: 'center' }}>
                          <Text type="secondary">Bill Total</Text>
                          <Title level={5} style={{ margin: 0 }}>{formatCurrency(selectedRecord.amount)}</Title>
                        </Col>
                        <Col span={8} style={{ textAlign: 'center' }}>
                          <Text type="secondary">Paid</Text>
                          <Title level={5} style={{ margin: 0, color: '#52c41a' }}>{formatCurrency(selectedRecord.paidAmount)}</Title>
                        </Col>
                        <Col span={8} style={{ textAlign: 'center' }}>
                          <Text type="secondary">Balance</Text>
                          <Title level={5} style={{ margin: 0, color: '#f5222d' }}>{formatCurrency(selectedRecord.balance)}</Title>
                        </Col>
                      </Row>
                    </Card>

                    {selectedRecord.payments.length > 0 ? (
                      <Timeline
                        items={selectedRecord.payments.map(p => ({
                          color: 'green',
                          children: (
                            <Card size="small">
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                  <Text type="secondary">{dayjs(p.date).format('MMMM D, YYYY')}</Text>
                                  <br />
                                  <Text>{p.method}</Text>
                                  <br />
                                  <Text type="secondary" style={{ fontSize: 11 }}>Ref: {p.reference}</Text>
                                </div>
                                <Text strong type="success">{formatCurrency(p.amount)}</Text>
                              </div>
                            </Card>
                          ),
                        }))}
                      />
                    ) : (
                      <div style={{ textAlign: 'center', padding: 24 }}>
                        <Text type="secondary">No payments made yet</Text>
                      </div>
                    )}

                    {selectedRecord.status !== 'paid' && (
                      <Button 
                        type="primary" 
                        icon={<DollarOutlined />}
                        block
                        onClick={() => handlePayBill(selectedRecord)}
                      >
                        Pay Bill
                      </Button>
                    )}
                  </>
                ),
              },
            ]}
          />
        )}
      </Drawer>

      {/* Payment Drawer */}
      <FormDrawer
        title="Pay Bill"
        open={paymentDrawerVisible}
        onClose={() => setPaymentDrawerVisible(false)}
        onSubmit={handlePaymentSubmit}
        form={form}
        width={400}
      >
        {selectedRecord && (
          <Card size="small" style={{ marginBottom: 16, background: '#fafafa' }}>
            <Text type="secondary">Bill: </Text>
            <Text strong>{selectedRecord.billNumber}</Text>
            <br />
            <Text type="secondary">Vendor: </Text>
            <Text strong>{selectedRecord.vendorName}</Text>
            <br />
            <Text type="secondary">Balance Due: </Text>
            <Text strong style={{ color: '#f5222d' }}>{formatCurrency(selectedRecord.balance)}</Text>
          </Card>
        )}
        <Form.Item
          name="paymentDate"
          label="Payment Date"
          rules={[{ required: true, message: 'Please select payment date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="amount"
          label="Amount"
          rules={[{ required: true, message: 'Please enter amount' }]}
        >
          <InputNumber 
            style={{ width: '100%' }} 
            formatter={(value) => `₱ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/₱\s?|(,*)/g, '')}
            min={0}
            max={selectedRecord?.balance}
          />
        </Form.Item>
        <Form.Item
          name="paymentMethod"
          label="Payment Method"
          rules={[{ required: true, message: 'Please select payment method' }]}
        >
          <Select
            options={[
              { label: 'Bank Transfer', value: 'bank_transfer' },
              { label: 'Check', value: 'check' },
              { label: 'Cash', value: 'cash' },
              { label: 'Auto-Debit', value: 'auto_debit' },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="bankAccount"
          label="From Account"
          rules={[{ required: true, message: 'Please select account' }]}
        >
          <Select
            options={[
              { label: 'BDO - Main Operating ****1234', value: 'bdo_main' },
              { label: 'BPI - Savings ****5678', value: 'bpi_savings' },
              { label: 'Metrobank - Payroll ****9012', value: 'metro_payroll' },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="reference"
          label="Reference Number"
        >
          <Input placeholder="Check number or transaction reference" />
        </Form.Item>
        <Form.Item
          name="notes"
          label="Notes"
        >
          <Input.TextArea rows={3} />
        </Form.Item>
      </FormDrawer>
    </div>
  );
};

export default AccountsPayable;
