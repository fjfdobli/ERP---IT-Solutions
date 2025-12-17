import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Input, Select, Tag, 
  Tooltip, message, Typography, DatePicker, Statistic, Drawer,
  Descriptions, Avatar, Timeline, Progress, Badge, Tabs, Form,
  InputNumber
} from 'antd';
import {
  PlusOutlined,
  ExportOutlined,
  EyeOutlined,
  EditOutlined,
  DollarOutlined,
  SendOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer, ConfirmModal } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

// Mock receivables data
const mockReceivables = [
  {
    id: 'INV001',
    invoiceNumber: 'INV-2024-0001',
    customerId: 'CUST001',
    customerName: 'Tech Solutions Corp',
    customerEmail: 'accounts@techsolutions.ph',
    customerPhone: '+63 917 123 4567',
    issueDate: '2024-01-05',
    dueDate: '2024-01-20',
    amount: 125000.00,
    paidAmount: 50000.00,
    balance: 75000.00,
    status: 'partial',
    terms: 'Net 15',
    items: [
      { description: 'IT Equipment', quantity: 5, unitPrice: 20000, total: 100000 },
      { description: 'Installation Service', quantity: 1, unitPrice: 25000, total: 25000 },
    ],
    payments: [
      { date: '2024-01-10', amount: 50000, method: 'Bank Transfer', reference: 'BTR-001' },
    ],
  },
  {
    id: 'INV002',
    invoiceNumber: 'INV-2024-0002',
    customerId: 'CUST002',
    customerName: 'Manila Trading Co',
    customerEmail: 'finance@manilatrading.com',
    customerPhone: '+63 918 234 5678',
    issueDate: '2024-01-08',
    dueDate: '2024-01-23',
    amount: 85000.00,
    paidAmount: 0,
    balance: 85000.00,
    status: 'pending',
    terms: 'Net 15',
    items: [
      { description: 'Office Supplies', quantity: 100, unitPrice: 500, total: 50000 },
      { description: 'Computer Accessories', quantity: 50, unitPrice: 700, total: 35000 },
    ],
    payments: [],
  },
  {
    id: 'INV003',
    invoiceNumber: 'INV-2024-0003',
    customerId: 'CUST003',
    customerName: 'Cebu Electronics Hub',
    customerEmail: 'ap@cebuelectronics.ph',
    customerPhone: '+63 919 345 6789',
    issueDate: '2023-12-15',
    dueDate: '2024-01-14',
    amount: 250000.00,
    paidAmount: 0,
    balance: 250000.00,
    status: 'overdue',
    terms: 'Net 30',
    items: [
      { description: 'Electronic Components', quantity: 200, unitPrice: 1000, total: 200000 },
      { description: 'Testing Equipment', quantity: 2, unitPrice: 25000, total: 50000 },
    ],
    payments: [],
    daysOverdue: 1,
  },
  {
    id: 'INV004',
    invoiceNumber: 'INV-2024-0004',
    customerId: 'CUST004',
    customerName: 'Davao Retail Group',
    customerEmail: 'payments@davaoretail.ph',
    customerPhone: '+63 920 456 7890',
    issueDate: '2024-01-02',
    dueDate: '2024-01-17',
    amount: 175000.00,
    paidAmount: 175000.00,
    balance: 0,
    status: 'paid',
    terms: 'Net 15',
    items: [
      { description: 'Retail Display Units', quantity: 10, unitPrice: 15000, total: 150000 },
      { description: 'POS Terminals', quantity: 5, unitPrice: 5000, total: 25000 },
    ],
    payments: [
      { date: '2024-01-15', amount: 175000, method: 'Check', reference: 'CHK-001234' },
    ],
  },
  {
    id: 'INV005',
    invoiceNumber: 'INV-2024-0005',
    customerId: 'CUST005',
    customerName: 'Makati Business Center',
    customerEmail: 'accounting@makatibiz.ph',
    customerPhone: '+63 921 567 8901',
    issueDate: '2024-01-10',
    dueDate: '2024-01-25',
    amount: 320000.00,
    paidAmount: 100000.00,
    balance: 220000.00,
    status: 'partial',
    terms: 'Net 15',
    items: [
      { description: 'Server Equipment', quantity: 2, unitPrice: 150000, total: 300000 },
      { description: 'Setup Service', quantity: 1, unitPrice: 20000, total: 20000 },
    ],
    payments: [
      { date: '2024-01-12', amount: 100000, method: 'Bank Transfer', reference: 'BTR-002' },
    ],
  },
  {
    id: 'INV006',
    invoiceNumber: 'INV-2024-0006',
    customerId: 'CUST006',
    customerName: 'QC Hardware Store',
    customerEmail: 'finance@qchardware.ph',
    customerPhone: '+63 922 678 9012',
    issueDate: '2023-12-01',
    dueDate: '2023-12-31',
    amount: 95000.00,
    paidAmount: 0,
    balance: 95000.00,
    status: 'overdue',
    terms: 'Net 30',
    items: [
      { description: 'Hardware Tools', quantity: 50, unitPrice: 1500, total: 75000 },
      { description: 'Safety Equipment', quantity: 40, unitPrice: 500, total: 20000 },
    ],
    payments: [],
    daysOverdue: 15,
  },
];

const AccountsReceivable = () => {
  const [receivables] = useState(mockReceivables);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [paymentDrawerVisible, setPaymentDrawerVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();

  // Calculate statistics
  const totalReceivable = receivables.reduce((sum, r) => sum + r.balance, 0);
  const overdueAmount = receivables.filter(r => r.status === 'overdue').reduce((sum, r) => sum + r.balance, 0);
  const pendingCount = receivables.filter(r => r.status === 'pending' || r.status === 'partial').length;
  const overdueCount = receivables.filter(r => r.status === 'overdue').length;

  // Filter records
  const filteredRecords = receivables.filter(record => {
    const matchesSearch = !searchText || 
      record.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
      record.invoiceNumber.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !filterStatus || record.status === filterStatus;
    return matchesSearch && matchesStatus;
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  // Table columns
  const columns = [
    {
      title: 'Invoice',
      key: 'invoice',
      width: 150,
      fixed: 'left',
      render: (_, record) => (
        <div>
          <Text strong style={{ color: '#1890ff' }}>{record.invoiceNumber}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 11 }}>
            {dayjs(record.issueDate).format('MMM D, YYYY')}
          </Text>
        </div>
      ),
    },
    {
      title: 'Customer',
      key: 'customer',
      width: 200,
      render: (_, record) => (
        <div>
          <Text strong>{record.customerName}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 11 }}>{record.customerId}</Text>
        </div>
      ),
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
      width: 130,
      align: 'right',
      render: (amount) => formatCurrency(amount),
    },
    {
      title: 'Paid',
      dataIndex: 'paidAmount',
      key: 'paidAmount',
      width: 120,
      align: 'right',
      render: (paid) => paid > 0 ? <Text type="success">{formatCurrency(paid)}</Text> : '-',
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      width: 130,
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
      width: 150,
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
            <Tooltip title="Record Payment">
              <Button 
                type="text" 
                icon={<DollarOutlined />}
                onClick={() => handleRecordPayment(record)}
              />
            </Tooltip>
          )}
          <Tooltip title="Send Reminder">
            <Button 
              type="text" 
              icon={<SendOutlined />}
              onClick={() => message.info('Sending reminder...')}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Handlers
  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setDetailDrawerVisible(true);
  };

  const handleRecordPayment = (record) => {
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
        title="Accounts Receivable"
        subtitle="Manage customer invoices and payments"
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'Finance', path: '/finance' },
          { title: 'Receivables', path: '/finance/receivables' },
        ]}
        actions={[
          <Button key="create" type="primary" icon={<PlusOutlined />}>
            New Invoice
          </Button>,
          <Button key="export" icon={<ExportOutlined />}>Export</Button>,
        ]}
      />

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Total Receivable"
            value={formatCurrency(totalReceivable)}
            icon={<DollarOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Overdue Amount"
            value={formatCurrency(overdueAmount)}
            icon={<ExclamationCircleOutlined />}
            color="#f5222d"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Pending Invoices"
            value={pendingCount}
            icon={<FileTextOutlined />}
            color="#faad14"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Overdue Invoices"
            value={overdueCount}
            icon={<ClockCircleOutlined />}
            color="#f5222d"
          />
        </Col>
      </Row>

      {/* Aging Summary */}
      <Card title="Aging Summary" size="small" style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6}>
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">Current</Text>
              <Title level={4} style={{ margin: '8px 0', color: '#52c41a' }}>
                {formatCurrency(305000)}
              </Title>
              <Progress percent={100} strokeColor="#52c41a" showInfo={false} />
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">1-30 Days</Text>
              <Title level={4} style={{ margin: '8px 0', color: '#1890ff' }}>
                {formatCurrency(0)}
              </Title>
              <Progress percent={0} strokeColor="#1890ff" showInfo={false} />
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">31-60 Days</Text>
              <Title level={4} style={{ margin: '8px 0', color: '#faad14' }}>
                {formatCurrency(250000)}
              </Title>
              <Progress percent={72} strokeColor="#faad14" showInfo={false} />
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">60+ Days</Text>
              <Title level={4} style={{ margin: '8px 0', color: '#f5222d' }}>
                {formatCurrency(95000)}
              </Title>
              <Progress percent={28} strokeColor="#f5222d" showInfo={false} />
            </div>
          </Col>
        </Row>
      </Card>

      {/* Filters and Table */}
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Space wrap>
            <Search
              placeholder="Search invoices..."
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
            showTotal: (total) => `Total ${total} invoices`,
          }}
          rowClassName={(record) => record.status === 'overdue' ? 'overdue-row' : ''}
        />
      </Card>

      {/* Detail Drawer */}
      <Drawer
        title={
          <Space>
            <FileTextOutlined />
            Invoice Details
          </Space>
        }
        placement="right"
        width={600}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        extra={
          <Space>
            <Button icon={<PrinterOutlined />}>Print</Button>
            <Button icon={<SendOutlined />}>Send</Button>
          </Space>
        }
      >
        {selectedRecord && (
          <Tabs
            items={[
              {
                key: 'details',
                label: 'Invoice Details',
                children: (
                  <>
                    <Card 
                      size="small" 
                      style={{ marginBottom: 16, background: '#fafafa' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <Title level={4} style={{ margin: 0 }}>
                            {selectedRecord.invoiceNumber}
                          </Title>
                          <Tag color={getStatusConfig(selectedRecord.status).color}>
                            {getStatusConfig(selectedRecord.status).text}
                          </Tag>
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
                      <Descriptions.Item label="Customer" span={2}>
                        <Text strong>{selectedRecord.customerName}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="Email">
                        <Space>
                          <MailOutlined />
                          {selectedRecord.customerEmail}
                        </Space>
                      </Descriptions.Item>
                      <Descriptions.Item label="Phone">
                        <Space>
                          <PhoneOutlined />
                          {selectedRecord.customerPhone}
                        </Space>
                      </Descriptions.Item>
                      <Descriptions.Item label="Issue Date">
                        {dayjs(selectedRecord.issueDate).format('MMMM D, YYYY')}
                      </Descriptions.Item>
                      <Descriptions.Item label="Due Date">
                        <Text type={selectedRecord.status === 'overdue' ? 'danger' : undefined}>
                          {dayjs(selectedRecord.dueDate).format('MMMM D, YYYY')}
                        </Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="Terms">
                        {selectedRecord.terms}
                      </Descriptions.Item>
                      <Descriptions.Item label="Invoice Total">
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
                    <Card size="small" style={{ marginBottom: 16, background: '#f6ffed', borderColor: '#b7eb8f' }}>
                      <Row gutter={16}>
                        <Col span={8} style={{ textAlign: 'center' }}>
                          <Text type="secondary">Invoice Total</Text>
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
                        <Text type="secondary">No payments recorded yet</Text>
                      </div>
                    )}

                    {selectedRecord.status !== 'paid' && (
                      <Button 
                        type="primary" 
                        icon={<DollarOutlined />}
                        block
                        onClick={() => handleRecordPayment(selectedRecord)}
                      >
                        Record Payment
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
        title="Record Payment"
        open={paymentDrawerVisible}
        onClose={() => setPaymentDrawerVisible(false)}
        onSubmit={handlePaymentSubmit}
        form={form}
        width={400}
      >
        {selectedRecord && (
          <Card size="small" style={{ marginBottom: 16, background: '#fafafa' }}>
            <Text type="secondary">Invoice: </Text>
            <Text strong>{selectedRecord.invoiceNumber}</Text>
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
              { label: 'Credit Card', value: 'credit_card' },
              { label: 'GCash', value: 'gcash' },
              { label: 'Maya', value: 'maya' },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="reference"
          label="Reference Number"
        >
          <Input placeholder="Transaction reference" />
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

export default AccountsReceivable;
