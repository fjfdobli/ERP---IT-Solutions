import { useState } from 'react';
import { Row, Col, Card, Table, Button, Space, Input, Select, Tag, Typography, Drawer, Descriptions, Switch, Form } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EditOutlined, ShopOutlined, DollarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockRegisters = [
  { id: 1, name: 'Register 1', branch: 'Main Branch', status: 'active', openingBalance: 1000, currentBalance: 2500, lastTransaction: '2024-01-15 10:30 AM' },
  { id: 2, name: 'Register 2', branch: 'Downtown Store', status: 'active', openingBalance: 500, currentBalance: 1200, lastTransaction: '2024-01-15 09:15 AM' },
];

const CashRegisters = () => {
  const [registers] = useState(mockRegisters);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const totalRegisters = registers.length;
  const activeRegisters = registers.filter(r => r.status === 'active').length;
  const totalBalance = registers.reduce((sum, r) => sum + r.currentBalance, 0);

  const columns = [
    { title: 'Register Name', dataIndex: 'name', key: 'name', width: 150 },
    { title: 'Branch', dataIndex: 'branch', key: 'branch', width: 150 },
    { title: 'Opening Balance', dataIndex: 'openingBalance', key: 'openingBalance', width: 150, render: (b) => `$${b.toFixed(2)}` },
    { title: 'Current Balance', dataIndex: 'currentBalance', key: 'currentBalance', width: 150, render: (b) => <Text strong>${b.toFixed(2)}</Text> },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status) => <Tag color={status === 'active' ? 'success' : 'default'}>{status}</Tag> },
    { title: 'Last Transaction', dataIndex: 'lastTransaction', key: 'lastTransaction', width: 180 },
    { title: 'Actions', key: 'actions', width: 120, render: () => (
      <Space>
        <Button type="text" icon={<EditOutlined />} />
      </Space>
    ) },
  ];

  return (
    <div>
      <PageHeader title="Cash Registers" subtitle={`${registers.length} registers`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Branches', path: '/branches' }, { title: 'Cash Registers', path: '/branches/registers' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>New Register</Button>]} />
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}><StatCard title="Total Registers" value={totalRegisters} icon={<ShopOutlined style={{ fontSize: 24, color: '#1890ff' }} />} color="#1890ff" /></Col>
        <Col xs={24} sm={12} md={8}><StatCard title="Active" value={activeRegisters} icon={<CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />} color="#52c41a" /></Col>
        <Col xs={24} sm={12} md={8}><StatCard title="Total Balance" value={`$${totalBalance.toFixed(2)}`} icon={<DollarOutlined style={{ fontSize: 24, color: '#722ed1' }} />} color="#722ed1" /></Col>
      </Row>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search placeholder="Search registers..." allowClear style={{ width: 300 }} />
        </div>
        <Table columns={columns} dataSource={registers} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
      <FormDrawer title="Create Cash Register" open={drawerVisible} onClose={() => { setDrawerVisible(false); form.resetFields(); }} form={form} fields={[{ name: 'name', label: 'Register Name', type: 'text', required: true, span: 24 }, { name: 'branch', label: 'Branch', type: 'select', options: [], required: true, span: 24 }, { name: 'openingBalance', label: 'Opening Balance', type: 'currency', required: true, span: 24 }]} onSubmit={() => { setDrawerVisible(false); }} />
    </div>
  );
};

export default CashRegisters;

