import { useState } from 'react';
import { Row, Col, Card, Table, Button, Space, Input, Select, Tag, Typography, DatePicker, Drawer, Descriptions, Form } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EyeOutlined, BankOutlined, DollarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;
const { RangePicker } = DatePicker;

const mockDeposits = [
  { id: 'DEP-2024-00015', date: '2024-01-15', branch: 'Main Branch', bank: 'Bank of America', account: '****1234', amount: 5000, status: 'completed', reference: 'REF123456' },
  { id: 'DEP-2024-00014', date: '2024-01-14', branch: 'Downtown Store', bank: 'Chase Bank', account: '****5678', amount: 3000, status: 'pending', reference: 'REF123455' },
];

const depositStatuses = [
  { value: 'pending', label: 'Pending', color: 'default' },
  { value: 'completed', label: 'Completed', color: 'success' },
  { value: 'cancelled', label: 'Cancelled', color: 'error' },
];

const BankDeposits = () => {
  const [deposits, setDeposits] = useState(mockDeposits);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [form] = Form.useForm();

  const totalDeposits = deposits.length;
  const pendingDeposits = deposits.filter(d => d.status === 'pending').length;
  const totalAmount = deposits.reduce((sum, d) => sum + d.amount, 0);

  const filteredDeposits = deposits.filter(deposit => {
    const matchesSearch = !searchText || deposit.id.toLowerCase().includes(searchText.toLowerCase()) || deposit.bank.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !filterStatus || deposit.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status) => depositStatuses.find(s => s.value === status) || depositStatuses[0];

  const columns = [
    { title: 'Deposit ID', dataIndex: 'id', key: 'id', width: 140, render: (id) => <Text strong style={{ color: '#1890ff' }}>{id}</Text> },
    { title: 'Date', dataIndex: 'date', key: 'date', width: 110, render: (date) => dayjs(date).format('MMM D, YYYY') },
    { title: 'Branch', dataIndex: 'branch', key: 'branch', width: 150 },
    { title: 'Bank', dataIndex: 'bank', key: 'bank', width: 150 },
    { title: 'Account', dataIndex: 'account', key: 'account', width: 120 },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', width: 120, align: 'right', render: (amount) => <Text strong>${amount.toLocaleString()}</Text> },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 120, render: (status) => { const config = getStatusConfig(status); return <Tag color={config.color}>{config.label}</Tag>; } },
    { title: 'Actions', key: 'actions', width: 100, render: (_, record) => (
      <Space>
        <Button type="text" icon={<EyeOutlined />} onClick={() => { setSelectedDeposit(record); setDetailDrawerVisible(true); }} />
      </Space>
    ) },
  ];

  return (
    <div>
      <PageHeader title="Bank Deposits" subtitle={`${filteredDeposits.length} deposits`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Cash Management', path: '/cash' }, { title: 'Bank Deposits', path: '/cash/deposits' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>New Deposit</Button>]} />
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}><StatCard title="Total Deposits" value={totalDeposits} icon={<BankOutlined style={{ fontSize: 24, color: '#1890ff' }} />} color="#1890ff" /></Col>
        <Col xs={24} sm={12} md={8}><StatCard title="Pending" value={pendingDeposits} icon={<CheckCircleOutlined style={{ fontSize: 24, color: '#faad14' }} />} color="#faad14" /></Col>
        <Col xs={24} sm={12} md={8}><StatCard title="Total Amount" value={`$${totalAmount.toLocaleString()}`} icon={<DollarOutlined style={{ fontSize: 24, color: '#52c41a' }} />} color="#52c41a" /></Col>
      </Row>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Search placeholder="Search deposits..." allowClear style={{ width: 220 }} value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            <RangePicker />
            <Select placeholder="Status" allowClear style={{ width: 130 }} value={filterStatus} onChange={setFilterStatus} options={depositStatuses.map(s => ({ label: s.label, value: s.value }))} />
          </Space>
        </div>
        <Table columns={columns} dataSource={filteredDeposits} rowKey="id" loading={loading} pagination={{ pageSize: 10, showSizeChanger: true }} />
      </Card>
      <Drawer title="Deposit Details" placement="right" width={700} open={detailDrawerVisible} onClose={() => setDetailDrawerVisible(false)}>
        {selectedDeposit && (
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Deposit ID">{selectedDeposit.id}</Descriptions.Item>
            <Descriptions.Item label="Date">{dayjs(selectedDeposit.date).format('MMMM D, YYYY')}</Descriptions.Item>
            <Descriptions.Item label="Branch">{selectedDeposit.branch}</Descriptions.Item>
            <Descriptions.Item label="Bank">{selectedDeposit.bank}</Descriptions.Item>
            <Descriptions.Item label="Account">{selectedDeposit.account}</Descriptions.Item>
            <Descriptions.Item label="Amount">${selectedDeposit.amount.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Status"><Tag color={getStatusConfig(selectedDeposit.status).color}>{getStatusConfig(selectedDeposit.status).label}</Tag></Descriptions.Item>
            <Descriptions.Item label="Reference">{selectedDeposit.reference}</Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
      <FormDrawer title="Create Bank Deposit" open={drawerVisible} onClose={() => { setDrawerVisible(false); form.resetFields(); }} form={form} fields={[{ name: 'branch', label: 'Branch', type: 'select', options: [], required: true, span: 24 }, { name: 'bank', label: 'Bank', type: 'select', options: [], required: true, span: 24 }, { name: 'account', label: 'Account', type: 'text', required: true, span: 24 }, { name: 'amount', label: 'Amount', type: 'currency', required: true, span: 24 }, { name: 'date', label: 'Date', type: 'date', required: true, span: 24 }]} onSubmit={() => { setDrawerVisible(false); }} />
    </div>
  );
};

export default BankDeposits;

