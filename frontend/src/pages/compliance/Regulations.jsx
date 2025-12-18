import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, Form } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EditOutlined, FileDoneOutlined } from '@ant-design/icons';
import { PageHeader, FormDrawer } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockRegulations = [
  { id: 1, name: 'GDPR Compliance', category: 'Data Protection', effectiveDate: '2024-01-01', status: 'active', description: 'General Data Protection Regulation' },
];

const Regulations = () => {
  const [regulations] = useState(mockRegulations);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Regulation Name', dataIndex: 'name', key: 'name', width: 250 },
    { title: 'Category', dataIndex: 'category', key: 'category', width: 180 },
    { title: 'Effective Date', dataIndex: 'effectiveDate', key: 'effectiveDate', width: 130 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status) => <Tag color={status === 'active' ? 'success' : 'default'}>{status}</Tag> },
    { title: 'Actions', key: 'actions', width: 120, render: () => <Button type="text" icon={<EditOutlined />} /> },
  ];

  return (
    <div>
      <PageHeader title="Regulations" subtitle={`${regulations.length} regulations`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Compliance', path: '/compliance' }, { title: 'Regulations', path: '/compliance/regulations' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>New Regulation</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search placeholder="Search regulations..." allowClear style={{ width: 300 }} />
        </div>
        <Table columns={columns} dataSource={regulations} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
      <FormDrawer title="Create Regulation" open={drawerVisible} onClose={() => { setDrawerVisible(false); form.resetFields(); }} form={form} fields={[{ name: 'name', label: 'Regulation Name', type: 'text', required: true, span: 24 }, { name: 'category', label: 'Category', type: 'text', required: true, span: 24 }, { name: 'effectiveDate', label: 'Effective Date', type: 'date', required: true, span: 24 }, { name: 'description', label: 'Description', type: 'textarea', span: 24 }]} onSubmit={() => { setDrawerVisible(false); }} />
    </div>
  );
};

export default Regulations;

