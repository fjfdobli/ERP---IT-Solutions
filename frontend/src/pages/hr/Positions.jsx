import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, Form } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EditOutlined, DeleteOutlined, IdcardOutlined } from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockPositions = [
  { id: 1, title: 'Sales Manager', department: 'Sales', level: 'Manager', status: 'active', employees: 5 },
  { id: 2, title: 'Accountant', department: 'Finance', level: 'Staff', status: 'active', employees: 3 },
];

const Positions = () => {
  const [positions] = useState(mockPositions);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Position Title', dataIndex: 'title', key: 'title', width: 200 },
    { title: 'Department', dataIndex: 'department', key: 'department', width: 150 },
    { title: 'Level', dataIndex: 'level', key: 'level', width: 120 },
    { title: 'Employees', dataIndex: 'employees', key: 'employees', width: 100, align: 'center' },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status) => <Tag color={status === 'active' ? 'success' : 'default'}>{status}</Tag> },
    { title: 'Actions', key: 'actions', width: 120, render: () => (
      <Space>
        <Button type="text" icon={<EditOutlined />} />
        <Button type="text" danger icon={<DeleteOutlined />} />
      </Space>
    ) },
  ];

  return (
    <div>
      <PageHeader title="Positions" subtitle={`${positions.length} positions`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'HR', path: '/hr' }, { title: 'Positions', path: '/hr/positions' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>New Position</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search placeholder="Search positions..." allowClear style={{ width: 300 }} />
        </div>
        <Table columns={columns} dataSource={positions} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
      <FormDrawer title="Create Position" open={drawerVisible} onClose={() => { setDrawerVisible(false); form.resetFields(); }} form={form} fields={[{ name: 'title', label: 'Position Title', type: 'text', required: true, span: 24 }, { name: 'department', label: 'Department', type: 'select', options: [], required: true, span: 24 }, { name: 'level', label: 'Level', type: 'select', options: [{ label: 'Staff', value: 'Staff' }, { label: 'Manager', value: 'Manager' }, { label: 'Director', value: 'Director' }], required: true, span: 24 }]} onSubmit={() => { setDrawerVisible(false); }} />
    </div>
  );
};

export default Positions;

