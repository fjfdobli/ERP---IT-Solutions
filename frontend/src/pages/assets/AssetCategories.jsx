import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, Form } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EditOutlined } from '@ant-design/icons';
import { PageHeader, FormDrawer } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockCategories = [
  { id: 1, name: 'Property', description: 'Real estate properties', depreciationMethod: 'Straight Line', usefulLife: 30, status: 'active' },
];

const AssetCategories = () => {
  const [categories] = useState(mockCategories);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Category Name', dataIndex: 'name', key: 'name', width: 200 },
    { title: 'Description', dataIndex: 'description', key: 'description', width: 250 },
    { title: 'Depreciation Method', dataIndex: 'depreciationMethod', key: 'depreciationMethod', width: 180 },
    { title: 'Useful Life (Years)', dataIndex: 'usefulLife', key: 'usefulLife', width: 150 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status) => <Tag color={status === 'active' ? 'success' : 'default'}>{status}</Tag> },
    { title: 'Actions', key: 'actions', width: 120, render: () => <Button type="text" icon={<EditOutlined />} /> },
  ];

  return (
    <div>
      <PageHeader title="Asset Categories" subtitle={`${categories.length} categories`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Fixed Assets', path: '/assets' }, { title: 'Categories', path: '/assets/categories' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>New Category</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search placeholder="Search categories..." allowClear style={{ width: 300 }} />
        </div>
        <Table columns={columns} dataSource={categories} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
      <FormDrawer title="Create Category" open={drawerVisible} onClose={() => { setDrawerVisible(false); form.resetFields(); }} form={form} fields={[{ name: 'name', label: 'Category Name', type: 'text', required: true, span: 24 }, { name: 'description', label: 'Description', type: 'textarea', span: 24 }, { name: 'depreciationMethod', label: 'Depreciation Method', type: 'select', options: [{ label: 'Straight Line', value: 'Straight Line' }, { label: 'Declining Balance', value: 'Declining Balance' }], required: true, span: 24 }, { name: 'usefulLife', label: 'Useful Life (Years)', type: 'number', required: true, span: 24 }]} onSubmit={() => { setDrawerVisible(false); }} />
    </div>
  );
};

export default AssetCategories;

