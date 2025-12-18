import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, Modal, Form } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EditOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockGroups = [
  { id: 1, name: 'VIP Customers', description: 'High-value customers', customerCount: 25, discount: 15, status: 'active' },
  { id: 2, name: 'Corporate', description: 'Corporate accounts', customerCount: 50, discount: 10, status: 'active' },
  { id: 3, name: 'Regular', description: 'Regular customers', customerCount: 200, discount: 5, status: 'active' },
];

const CustomerGroups = () => {
  const [groups, setGroups] = useState(mockGroups);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const totalGroups = groups.length;
  const totalCustomers = groups.reduce((sum, g) => sum + g.customerCount, 0);

  const columns = [
    { title: 'Group Name', dataIndex: 'name', key: 'name', width: 200 },
    { title: 'Description', dataIndex: 'description', key: 'description', width: 250 },
    { title: 'Customers', dataIndex: 'customerCount', key: 'customerCount', width: 100, align: 'center' },
    { title: 'Discount %', dataIndex: 'discount', key: 'discount', width: 120, render: (discount) => `${discount}%` },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status) => <Tag color={status === 'active' ? 'success' : 'default'}>{status}</Tag> },
    { title: 'Actions', key: 'actions', width: 120, render: (_, record) => (
      <Space>
        <Button type="text" icon={<EditOutlined />} />
        <Button type="text" danger icon={<DeleteOutlined />} />
      </Space>
    ) },
  ];

  return (
    <div>
      <PageHeader title="Customer Groups" subtitle={`${groups.length} groups`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Customers', path: '/customers' }, { title: 'Groups', path: '/customers/groups' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>New Group</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search placeholder="Search groups..." allowClear style={{ width: 300 }} value={searchText} onChange={(e) => setSearchText(e.target.value)} />
        </div>
        <Table columns={columns} dataSource={groups} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      </Card>
      <FormDrawer title="Create Customer Group" open={drawerVisible} onClose={() => { setDrawerVisible(false); form.resetFields(); }} form={form} fields={[{ name: 'name', label: 'Group Name', type: 'text', required: true, span: 24 }, { name: 'description', label: 'Description', type: 'textarea', span: 24 }, { name: 'discount', label: 'Discount %', type: 'number', span: 12 }]} onSubmit={() => { setDrawerVisible(false); }} />
    </div>
  );
};

export default CustomerGroups;

