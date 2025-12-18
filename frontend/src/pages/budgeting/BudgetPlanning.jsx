import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, Form } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EditOutlined, FundOutlined } from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockBudgets = [
  { id: 1, name: '2024 Annual Budget', period: '2024', department: 'Sales', allocated: 500000, spent: 350000, remaining: 150000, status: 'active' },
];

const BudgetPlanning = () => {
  const [budgets] = useState(mockBudgets);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Budget Name', dataIndex: 'name', key: 'name', width: 200 },
    { title: 'Period', dataIndex: 'period', key: 'period', width: 100 },
    { title: 'Department', dataIndex: 'department', key: 'department', width: 150 },
    { title: 'Allocated', dataIndex: 'allocated', key: 'allocated', width: 120, align: 'right', render: (a) => `$${a.toLocaleString()}` },
    { title: 'Spent', dataIndex: 'spent', key: 'spent', width: 120, align: 'right', render: (s) => `$${s.toLocaleString()}` },
    { title: 'Remaining', dataIndex: 'remaining', key: 'remaining', width: 120, align: 'right', render: (r) => <Text strong>${r.toLocaleString()}</Text> },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status) => <Tag color={status === 'active' ? 'success' : 'default'}>{status}</Tag> },
    { title: 'Actions', key: 'actions', width: 120, render: () => <Button type="text" icon={<EditOutlined />} /> },
  ];

  return (
    <div>
      <PageHeader title="Budget Planning" subtitle={`${budgets.length} budgets`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Budgeting', path: '/budgeting' }, { title: 'Budget Planning', path: '/budgeting/plans' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>New Budget</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search placeholder="Search budgets..." allowClear style={{ width: 300 }} />
        </div>
        <Table columns={columns} dataSource={budgets} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
      <FormDrawer title="Create Budget" open={drawerVisible} onClose={() => { setDrawerVisible(false); form.resetFields(); }} form={form} fields={[{ name: 'name', label: 'Budget Name', type: 'text', required: true, span: 24 }, { name: 'period', label: 'Period', type: 'text', required: true, span: 24 }, { name: 'allocated', label: 'Allocated Amount', type: 'currency', required: true, span: 24 }]} onSubmit={() => { setDrawerVisible(false); }} />
    </div>
  );
};

export default BudgetPlanning;

