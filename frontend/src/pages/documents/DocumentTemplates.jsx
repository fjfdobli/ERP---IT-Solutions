import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, Form } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EditOutlined, FileTextOutlined } from '@ant-design/icons';
import { PageHeader, FormDrawer } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockTemplates = [
  { id: 1, name: 'Invoice Template', type: 'Invoice', category: 'Sales', status: 'active' },
];

const DocumentTemplates = () => {
  const [templates] = useState(mockTemplates);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Template Name', dataIndex: 'name', key: 'name', width: 250 },
    { title: 'Type', dataIndex: 'type', key: 'type', width: 150 },
    { title: 'Category', dataIndex: 'category', key: 'category', width: 150 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status) => <Tag color={status === 'active' ? 'success' : 'default'}>{status}</Tag> },
    { title: 'Actions', key: 'actions', width: 120, render: () => <Button type="text" icon={<EditOutlined />} /> },
  ];

  return (
    <div>
      <PageHeader title="Document Templates" subtitle={`${templates.length} templates`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Documents', path: '/documents' }, { title: 'Templates', path: '/documents/templates' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>New Template</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search placeholder="Search templates..." allowClear style={{ width: 300 }} />
        </div>
        <Table columns={columns} dataSource={templates} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
      <FormDrawer title="Create Template" open={drawerVisible} onClose={() => { setDrawerVisible(false); form.resetFields(); }} form={form} fields={[{ name: 'name', label: 'Template Name', type: 'text', required: true, span: 24 }, { name: 'type', label: 'Type', type: 'select', options: [], required: true, span: 24 }, { name: 'category', label: 'Category', type: 'select', options: [], required: true, span: 24 }]} onSubmit={() => { setDrawerVisible(false); }} />
    </div>
  );
};

export default DocumentTemplates;

