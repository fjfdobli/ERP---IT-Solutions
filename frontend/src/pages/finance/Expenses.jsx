import { useState } from 'react';
import { Row, Col, Card, Table, Button, Space, Input, Select, Tag, Typography, DatePicker, Drawer, Descriptions, Form } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EyeOutlined, EditOutlined, DollarOutlined, FileTextOutlined } from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;
const { RangePicker } = DatePicker;

const mockExpenses = [
  { id: 'EXP-2024-00025', date: '2024-01-15', category: 'Office Supplies', description: 'Stationery items', amount: 500, vendor: 'Office Depot', status: 'approved', paidBy: 'John Doe' },
  { id: 'EXP-2024-00024', date: '2024-01-14', category: 'Travel', description: 'Business trip', amount: 1200, vendor: 'Airline Co', status: 'pending', paidBy: 'Jane Smith' },
];

const expenseStatuses = [
  { value: 'pending', label: 'Pending', color: 'default' },
  { value: 'approved', label: 'Approved', color: 'success' },
  { value: 'rejected', label: 'Rejected', color: 'error' },
  { value: 'paid', label: 'Paid', color: 'cyan' },
];

const Expenses = () => {
  const [expenses] = useState(mockExpenses);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [form] = Form.useForm();

  const totalExpenses = expenses.length;
  const pendingExpenses = expenses.filter(e => e.status === 'pending').length;
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = !searchText || expense.id.toLowerCase().includes(searchText.toLowerCase()) || expense.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !filterStatus || expense.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status) => expenseStatuses.find(s => s.value === status) || expenseStatuses[0];

  const columns = [
    { title: 'Expense ID', dataIndex: 'id', key: 'id', width: 140, render: (id) => <Text strong style={{ color: '#1890ff' }}>{id}</Text> },
    { title: 'Date', dataIndex: 'date', key: 'date', width: 110, render: (date) => dayjs(date).format('MMM D, YYYY') },
    { title: 'Category', dataIndex: 'category', key: 'category', width: 150 },
    { title: 'Description', dataIndex: 'description', key: 'description', width: 200 },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', width: 120, align: 'right', render: (amount) => <Text strong>${amount.toLocaleString()}</Text> },
    { title: 'Vendor', dataIndex: 'vendor', key: 'vendor', width: 150 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 120, render: (status) => { const config = getStatusConfig(status); return <Tag color={config.color}>{config.label}</Tag>; } },
    { title: 'Actions', key: 'actions', width: 100, render: (_, record) => (
      <Space>
        <Button type="text" icon={<EyeOutlined />} onClick={() => { setSelectedExpense(record); setDetailDrawerVisible(true); }} />
        <Button type="text" icon={<EditOutlined />} />
      </Space>
    ) },
  ];

  return (
    <div>
      <PageHeader title="Expenses" subtitle={`${filteredExpenses.length} expenses`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Finance', path: '/finance' }, { title: 'Expenses', path: '/finance/expenses' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>New Expense</Button>]} />
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}><StatCard title="Total Expenses" value={totalExpenses} icon={<FileTextOutlined style={{ fontSize: 24, color: '#1890ff' }} />} color="#1890ff" /></Col>
        <Col xs={24} sm={12} md={8}><StatCard title="Pending" value={pendingExpenses} icon={<FileTextOutlined style={{ fontSize: 24, color: '#faad14' }} />} color="#faad14" /></Col>
        <Col xs={24} sm={12} md={8}><StatCard title="Total Amount" value={`$${totalAmount.toLocaleString()}`} icon={<DollarOutlined style={{ fontSize: 24, color: '#52c41a' }} />} color="#52c41a" /></Col>
      </Row>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Search placeholder="Search expenses..." allowClear style={{ width: 220 }} value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            <RangePicker />
            <Select placeholder="Status" allowClear style={{ width: 130 }} value={filterStatus} onChange={setFilterStatus} options={expenseStatuses.map(s => ({ label: s.label, value: s.value }))} />
          </Space>
        </div>
        <Table columns={columns} dataSource={filteredExpenses} rowKey="id" loading={loading} pagination={{ pageSize: 10, showSizeChanger: true }} />
      </Card>
      <Drawer title="Expense Details" placement="right" width={700} open={detailDrawerVisible} onClose={() => setDetailDrawerVisible(false)}>
        {selectedExpense && (
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Expense ID">{selectedExpense.id}</Descriptions.Item>
            <Descriptions.Item label="Date">{dayjs(selectedExpense.date).format('MMMM D, YYYY')}</Descriptions.Item>
            <Descriptions.Item label="Category">{selectedExpense.category}</Descriptions.Item>
            <Descriptions.Item label="Description">{selectedExpense.description}</Descriptions.Item>
            <Descriptions.Item label="Amount">${selectedExpense.amount.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Vendor">{selectedExpense.vendor}</Descriptions.Item>
            <Descriptions.Item label="Paid By">{selectedExpense.paidBy}</Descriptions.Item>
            <Descriptions.Item label="Status"><Tag color={getStatusConfig(selectedExpense.status).color}>{getStatusConfig(selectedExpense.status).label}</Tag></Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
      <FormDrawer title="Create Expense" open={drawerVisible} onClose={() => { setDrawerVisible(false); form.resetFields(); }} form={form} fields={[{ name: 'category', label: 'Category', type: 'select', options: [], required: true, span: 24 }, { name: 'description', label: 'Description', type: 'textarea', required: true, span: 24 }, { name: 'amount', label: 'Amount', type: 'currency', required: true, span: 24 }, { name: 'vendor', label: 'Vendor', type: 'text', span: 24 }, { name: 'date', label: 'Date', type: 'date', required: true, span: 24 }]} onSubmit={() => { setDrawerVisible(false); }} />
    </div>
  );
};

export default Expenses;

