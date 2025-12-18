import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, Form } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EditOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { PageHeader, FormDrawer } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockStandards = [
  { id: 1, name: 'ISO 9001', category: 'Quality Management', description: 'Quality management system standard', status: 'active' },
];

const QualityStandards = () => {
  const [standards] = useState(mockStandards);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Standard Name', dataIndex: 'name', key: 'name', width: 200 },
    { title: 'Category', dataIndex: 'category', key: 'category', width: 200 },
    { title: 'Description', dataIndex: 'description', key: 'description', width: 300 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status) => <Tag color={status === 'active' ? 'success' : 'default'}>{status}</Tag> },
    { title: 'Actions', key: 'actions', width: 120, render: () => <Button type="text" icon={<EditOutlined />} /> },
  ];

  return (
    <div>
      <PageHeader title="Quality Standards" subtitle={`${standards.length} standards`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Quality Control', path: '/quality' }, { title: 'Quality Standards', path: '/quality/standards' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>New Standard</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search placeholder="Search standards..." allowClear style={{ width: 300 }} />
        </div>
        <Table columns={columns} dataSource={standards} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
      <FormDrawer title="Create Standard" open={drawerVisible} onClose={() => { setDrawerVisible(false); form.resetFields(); }} form={form} fields={[{ name: 'name', label: 'Standard Name', type: 'text', required: true, span: 24 }, { name: 'category', label: 'Category', type: 'text', required: true, span: 24 }, { name: 'description', label: 'Description', type: 'textarea', span: 24 }]} onSubmit={() => { setDrawerVisible(false); }} />
    </div>
  );
};

export default QualityStandards;

