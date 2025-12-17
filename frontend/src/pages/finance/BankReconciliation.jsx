import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Input, Select, Tag, 
  Tooltip, message, Typography, DatePicker, Statistic, Drawer,
  Descriptions, Timeline, Progress, Tabs, Form, InputNumber, Alert,
  Checkbox, Badge
} from 'antd';
import {
  PlusOutlined,
  ExportOutlined,
  CheckOutlined,
  SyncOutlined,
  BankOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  LinkOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

// Mock bank transactions
const mockBankTransactions = [
  {
    id: 'BTR001',
    date: '2024-01-15',
    description: 'Deposit - Sales Revenue',
    reference: 'DEP-001234',
    type: 'credit',
    amount: 125000.00,
    balance: 581780.00,
    status: 'matched',
    matchedTo: 'INV-2024-0001',
    matchedType: 'Invoice Payment',
  },
  {
    id: 'BTR002',
    date: '2024-01-15',
    description: 'Online Transfer - ABC Electronics',
    reference: 'OBT-005678',
    type: 'debit',
    amount: 100000.00,
    balance: 456780.00,
    status: 'matched',
    matchedTo: 'BILL-2024-0001',
    matchedType: 'Bill Payment',
  },
  {
    id: 'BTR003',
    date: '2024-01-14',
    description: 'Check Deposit #1234',
    reference: 'CHK-DEP-1234',
    type: 'credit',
    amount: 75000.00,
    balance: 531780.00,
    status: 'matched',
    matchedTo: 'INV-2024-0004',
    matchedType: 'Invoice Payment',
  },
  {
    id: 'BTR004',
    date: '2024-01-14',
    description: 'ATM Withdrawal',
    reference: 'ATM-WD-9012',
    type: 'debit',
    amount: 50000.00,
    balance: 456780.00,
    status: 'unmatched',
    matchedTo: null,
    matchedType: null,
  },
  {
    id: 'BTR005',
    date: '2024-01-13',
    description: 'Online Transfer - Utility Payment',
    reference: 'OBT-003456',
    type: 'debit',
    amount: 35000.00,
    balance: 506780.00,
    status: 'matched',
    matchedTo: 'BILL-2024-0004',
    matchedType: 'Bill Payment',
  },
  {
    id: 'BTR006',
    date: '2024-01-13',
    description: 'Cash Deposit',
    reference: 'CASH-DEP-002',
    type: 'credit',
    amount: 45000.00,
    balance: 541780.00,
    status: 'unmatched',
    matchedTo: null,
    matchedType: null,
  },
  {
    id: 'BTR007',
    date: '2024-01-12',
    description: 'Bank Service Charge',
    reference: 'BSC-JAN-2024',
    type: 'debit',
    amount: 500.00,
    balance: 496780.00,
    status: 'unmatched',
    matchedTo: null,
    matchedType: null,
  },
  {
    id: 'BTR008',
    date: '2024-01-12',
    description: 'Interest Credit',
    reference: 'INT-JAN-2024',
    type: 'credit',
    amount: 1280.00,
    balance: 497280.00,
    status: 'unmatched',
    matchedTo: null,
    matchedType: null,
  },
  {
    id: 'BTR009',
    date: '2024-01-11',
    description: 'Payroll Transfer',
    reference: 'PAY-2024-01A',
    type: 'debit',
    amount: 350000.00,
    balance: 496000.00,
    status: 'matched',
    matchedTo: 'PAY-2024-01',
    matchedType: 'Payroll',
  },
  {
    id: 'BTR010',
    date: '2024-01-10',
    description: 'Unknown Transfer',
    reference: 'UNK-001',
    type: 'credit',
    amount: 25000.00,
    balance: 846000.00,
    status: 'unmatched',
    matchedTo: null,
    matchedType: null,
  },
];

const bankAccounts = [
  { id: 1, bank: 'BDO', name: 'Main Operating Account', number: '****1234', balance: 456780.00 },
  { id: 2, bank: 'BPI', name: 'Savings Account', number: '****5678', balance: 285640.00 },
  { id: 3, bank: 'Metrobank', name: 'Payroll Account', number: '****9012', balance: 114000.00 },
];

const BankReconciliation = () => {
  const [transactions] = useState(mockBankTransactions);
  const [loading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(bankAccounts[0]);
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [dateRange, setDateRange] = useState([dayjs().subtract(7, 'day'), dayjs()]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [matchDrawerVisible, setMatchDrawerVisible] = useState(false);

  // Calculate statistics
  const bankBalance = selectedAccount.balance;
  const bookBalance = 458060.00; // This would come from your GL
  const difference = bankBalance - bookBalance;
  const unmatchedCount = transactions.filter(t => t.status === 'unmatched').length;
  const matchedCount = transactions.filter(t => t.status === 'matched').length;
  const totalCredits = transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
  const totalDebits = transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0);

  // Filter records
  const filteredRecords = transactions.filter(record => {
    const matchesStatus = !filterStatus || record.status === filterStatus;
    const matchesType = !filterType || record.type === filterType;
    return matchesStatus && matchesType;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  // Table columns
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 100,
      render: (date) => dayjs(date).format('MMM D'),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference',
      width: 130,
      render: (ref) => <Text code style={{ fontSize: 11 }}>{ref}</Text>,
    },
    {
      title: 'Debit',
      key: 'debit',
      width: 120,
      align: 'right',
      render: (_, record) => record.type === 'debit' ? (
        <Text type="danger">{formatCurrency(record.amount)}</Text>
      ) : '-',
    },
    {
      title: 'Credit',
      key: 'credit',
      width: 120,
      align: 'right',
      render: (_, record) => record.type === 'credit' ? (
        <Text type="success">{formatCurrency(record.amount)}</Text>
      ) : '-',
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      width: 130,
      align: 'right',
      render: (balance) => <Text strong>{formatCurrency(balance)}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status, record) => (
        <Tooltip title={record.matchedTo ? `Matched to: ${record.matchedTo}` : 'Not matched'}>
          <Tag 
            color={status === 'matched' ? 'success' : 'warning'}
            icon={status === 'matched' ? <CheckCircleOutlined /> : <ClockCircleOutlined />}
          >
            {status === 'matched' ? 'Matched' : 'Unmatched'}
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        record.status === 'unmatched' && (
          <Tooltip title="Match Transaction">
            <Button 
              type="text" 
              icon={<LinkOutlined />}
              onClick={() => handleMatchTransaction(record)}
            />
          </Tooltip>
        )
      ),
    },
  ];

  // Handlers
  const handleMatchTransaction = (record) => {
    setSelectedRows([record]);
    setMatchDrawerVisible(true);
  };

  const handleBulkMatch = () => {
    const unmatchedSelected = selectedRows.filter(r => r.status === 'unmatched');
    if (unmatchedSelected.length === 0) {
      message.warning('Please select unmatched transactions');
      return;
    }
    setMatchDrawerVisible(true);
  };

  const rowSelection = {
    selectedRowKeys: selectedRows.map(r => r.id),
    onChange: (_, rows) => setSelectedRows(rows),
    getCheckboxProps: (record) => ({
      disabled: record.status === 'matched',
    }),
  };

  return (
    <div>
      <PageHeader
        title="Bank Reconciliation"
        subtitle={`${selectedAccount.bank} - ${selectedAccount.name}`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'Finance', path: '/finance' },
          { title: 'Bank Reconciliation', path: '/finance/bank' },
        ]}
        actions={[
          <Button key="import" icon={<UploadOutlined />}>
            Import Statement
          </Button>,
          <Button key="sync" icon={<SyncOutlined />}>
            Sync
          </Button>,
          <Button key="export" icon={<ExportOutlined />}>Export</Button>,
        ]}
      />

      {/* Bank Account Selection */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {bankAccounts.map(account => (
          <Col xs={24} sm={8} key={account.id}>
            <Card 
              size="small"
              style={{ 
                cursor: 'pointer',
                borderColor: selectedAccount.id === account.id ? '#1890ff' : undefined,
                background: selectedAccount.id === account.id ? '#e6f7ff' : undefined,
              }}
              onClick={() => setSelectedAccount(account)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong>{account.bank}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {account.name} • {account.number}
                  </Text>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Text strong style={{ fontSize: 16 }}>
                    {formatCurrency(account.balance)}
                  </Text>
                  {selectedAccount.id === account.id && (
                    <Badge status="processing" style={{ marginLeft: 8 }} />
                  )}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Reconciliation Status */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Reconciliation Status" size="small">
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Statistic 
                  title="Bank Balance"
                  value={bankBalance}
                  prefix="₱"
                  precision={2}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col span={8}>
                <Statistic 
                  title="Book Balance"
                  value={bookBalance}
                  prefix="₱"
                  precision={2}
                />
              </Col>
              <Col span={8}>
                <Statistic 
                  title="Difference"
                  value={Math.abs(difference)}
                  prefix={difference >= 0 ? '+₱' : '-₱'}
                  precision={2}
                  valueStyle={{ color: difference === 0 ? '#52c41a' : '#faad14' }}
                />
              </Col>
            </Row>
            {difference !== 0 && (
              <Alert
                message="Reconciliation Pending"
                description={`There's a ${formatCurrency(Math.abs(difference))} difference between bank and book balance. Please review unmatched transactions.`}
                type="warning"
                showIcon
                icon={<WarningOutlined />}
                style={{ marginTop: 16 }}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Transaction Summary" size="small" style={{ height: '100%' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Total Credits</Text>
                <Text type="success" strong>{formatCurrency(totalCredits)}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Total Debits</Text>
                <Text type="danger" strong>{formatCurrency(totalDebits)}</Text>
              </div>
              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 8, marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>Matched</Text>
                  <Tag color="success">{matchedCount}</Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <Text>Unmatched</Text>
                  <Tag color="warning">{unmatchedCount}</Tag>
                </div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Progress */}
      <Card size="small" style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Text type="secondary">Reconciliation Progress</Text>
            <Progress 
              percent={Math.round((matchedCount / transactions.length) * 100)}
              status={matchedCount === transactions.length ? 'success' : 'active'}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
          </Col>
          <Col>
            <Text type="secondary">
              {matchedCount} of {transactions.length} transactions matched
            </Text>
          </Col>
        </Row>
      </Card>

      {/* Filters and Table */}
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Space wrap>
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
                { label: 'Matched', value: 'matched' },
                { label: 'Unmatched', value: 'unmatched' },
              ]}
            />
            <Select
              placeholder="Type"
              allowClear
              style={{ width: 120 }}
              value={filterType}
              onChange={setFilterType}
              options={[
                { label: 'Credit', value: 'credit' },
                { label: 'Debit', value: 'debit' },
              ]}
            />
          </Space>
          <Space>
            {selectedRows.filter(r => r.status === 'unmatched').length > 0 && (
              <Button 
                type="primary"
                icon={<LinkOutlined />}
                onClick={handleBulkMatch}
              >
                Match Selected ({selectedRows.filter(r => r.status === 'unmatched').length})
              </Button>
            )}
          </Space>
        </div>

        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredRecords}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} transactions`,
          }}
          rowClassName={(record) => record.status === 'unmatched' ? 'unmatched-row' : ''}
        />
      </Card>

      {/* Match Transaction Drawer */}
      <Drawer
        title="Match Transaction"
        placement="right"
        width={500}
        open={matchDrawerVisible}
        onClose={() => setMatchDrawerVisible(false)}
      >
        <Alert
          message="Select matching entry"
          description="Choose the corresponding transaction from your books to match with this bank transaction."
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />

        {selectedRows.length > 0 && (
          <Card size="small" style={{ marginBottom: 24 }}>
            <Text type="secondary">Bank Transaction</Text>
            <br />
            <Text strong>{selectedRows[0].description}</Text>
            <br />
            <Text type={selectedRows[0].type === 'credit' ? 'success' : 'danger'}>
              {selectedRows[0].type === 'credit' ? '+' : '-'}{formatCurrency(selectedRows[0].amount)}
            </Text>
          </Card>
        )}

        <Card title="Suggested Matches" size="small">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Card 
              size="small" 
              hoverable
              style={{ cursor: 'pointer' }}
              onClick={() => {
                message.success('Transaction matched successfully');
                setMatchDrawerVisible(false);
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <Text strong>INV-2024-0005</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Customer Payment - Makati Business Center
                  </Text>
                </div>
                <Text type="success">{formatCurrency(25000)}</Text>
              </div>
            </Card>
            <Card 
              size="small" 
              hoverable
              style={{ cursor: 'pointer' }}
              onClick={() => {
                message.success('Transaction matched successfully');
                setMatchDrawerVisible(false);
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <Text strong>Manual Entry</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Cash Sales Deposit
                  </Text>
                </div>
                <Text type="success">{formatCurrency(25000)}</Text>
              </div>
            </Card>
          </Space>
        </Card>

        <div style={{ marginTop: 24 }}>
          <Button block>
            Create New Entry
          </Button>
          <Button block type="text" style={{ marginTop: 8 }}>
            Mark as Reconciling Item
          </Button>
        </div>
      </Drawer>
    </div>
  );
};

export default BankReconciliation;
