import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, Form } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EditOutlined, BankOutlined } from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockAssets = [
  { id: 1, code: 'AST-001', name: 'Office Building', category: 'Property', purchaseDate: '2020-01-15', purchasePrice: 500000, currentValue: 450000, status: 'active' },
];

const FixedAssets = () => {
  const [assets] = useState(mockAssets);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Asset Code', dataIndex: 'code', key: 'code', width: 120 },
    { title: 'Asset Name', dataIndex: 'name', key: 'name', width: 200 },
    { title: 'Category', dataIndex: 'category', key: 'category', width: 150 },
    { title: 'Purchase Date', dataIndex: 'purchaseDate', key: 'purchaseDate', width: 120 },
    { title: 'Purchase Price', dataIndex: 'purchasePrice', key: 'purchasePrice', width: 150, align: 'right', render: (p) => `$${p.toLocaleString()}` },
    { title: 'Current Value', dataIndex: 'currentValue', key: 'currentValue', width: 150, align: 'right', render: (v) => <Text strong>${v.toLocaleString()}</Text> },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status) => <Tag color={status === 'active' ? 'success' : 'default'}>{status}</Tag> },
    { title: 'Actions', key: 'actions', width: 120, render: () => <Button type="text" icon={<EditOutlined />} /> },
  ];

  return (
    <div>
      <PageHeader title="Fixed Assets" subtitle={`${assets.length} assets`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Fixed Assets', path: '/assets' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>New Asset</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search placeholder="Search assets..." allowClear style={{ width: 300 }} />
        </div>
        <Table columns={columns} dataSource={assets} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
      <FormDrawer title="Create Asset" open={drawerVisible} onClose={() => { setDrawerVisible(false); form.resetFields(); }} form={form} fields={[{ name: 'code', label: 'Asset Code', type: 'text', required: true, span: 24 }, { name: 'name', label: 'Asset Name', type: 'text', required: true, span: 24 }, { name: 'category', label: 'Category', type: 'select', options: [], required: true, span: 24 }, { name: 'purchasePrice', label: 'Purchase Price', type: 'currency', required: true, span: 24 }]} onSubmit={() => { setDrawerVisible(false); }} />
    </div>
  );
};

export default FixedAssets;

