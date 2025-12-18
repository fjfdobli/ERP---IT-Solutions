import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, Tree, Form } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EditOutlined, CalculatorOutlined } from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockAccounts = [
  { id: 1, code: '1000', name: 'Assets', type: 'Asset', parent: null, balance: 500000, status: 'active' },
  { id: 2, code: '2000', name: 'Liabilities', type: 'Liability', parent: null, balance: 200000, status: 'active' },
  { id: 3, code: '3000', name: 'Equity', type: 'Equity', parent: null, balance: 300000, status: 'active' },
];

const ChartOfAccounts = () => {
  const [accounts] = useState(mockAccounts);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Account Code', dataIndex: 'code', key: 'code', width: 120 },
    { title: 'Account Name', dataIndex: 'name', key: 'name', width: 250 },
    { title: 'Type', dataIndex: 'type', key: 'type', width: 120, render: (type) => <Tag color="blue">{type}</Tag> },
    { title: 'Balance', dataIndex: 'balance', key: 'balance', width: 150, align: 'right', render: (b) => `$${b.toLocaleString()}` },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status) => <Tag color={status === 'active' ? 'success' : 'default'}>{status}</Tag> },
    { title: 'Actions', key: 'actions', width: 120, render: () => (
      <Space>
        <Button type="text" icon={<EditOutlined />} />
      </Space>
    ) },
  ];

  return (
    <div>
      <PageHeader title="Chart of Accounts" subtitle={`${accounts.length} accounts`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Accounting', path: '/accounting' }, { title: 'Chart of Accounts', path: '/accounting/chart' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>New Account</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search placeholder="Search accounts..." allowClear style={{ width: 300 }} />
        </div>
        <Table columns={columns} dataSource={accounts} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
      <FormDrawer title="Create Account" open={drawerVisible} onClose={() => { setDrawerVisible(false); form.resetFields(); }} form={form} fields={[{ name: 'code', label: 'Account Code', type: 'text', required: true, span: 24 }, { name: 'name', label: 'Account Name', type: 'text', required: true, span: 24 }, { name: 'type', label: 'Account Type', type: 'select', options: [{ label: 'Asset', value: 'Asset' }, { label: 'Liability', value: 'Liability' }, { label: 'Equity', value: 'Equity' }, { label: 'Revenue', value: 'Revenue' }, { label: 'Expense', value: 'Expense' }], required: true, span: 24 }]} onSubmit={() => { setDrawerVisible(false); }} />
    </div>
  );
};

export default ChartOfAccounts;

