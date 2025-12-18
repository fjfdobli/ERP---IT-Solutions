import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, Form } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EditOutlined, GiftOutlined } from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockBenefits = [
  { id: 1, name: 'Health Insurance', type: 'Insurance', coverage: 'Full', employees: 50, status: 'active' },
  { id: 2, name: 'Retirement Plan', type: 'Retirement', coverage: 'Partial', employees: 30, status: 'active' },
];

const Benefits = () => {
  const [benefits] = useState(mockBenefits);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Benefit Name', dataIndex: 'name', key: 'name', width: 200 },
    { title: 'Type', dataIndex: 'type', key: 'type', width: 150 },
    { title: 'Coverage', dataIndex: 'coverage', key: 'coverage', width: 120 },
    { title: 'Employees', dataIndex: 'employees', key: 'employees', width: 100, align: 'center' },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status) => <Tag color={status === 'active' ? 'success' : 'default'}>{status}</Tag> },
    { title: 'Actions', key: 'actions', width: 120, render: () => (
      <Space>
        <Button type="text" icon={<EditOutlined />} />
      </Space>
    ) },
  ];

  return (
    <div>
      <PageHeader title="Benefits" subtitle={`${benefits.length} benefits`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'HR', path: '/hr' }, { title: 'Benefits', path: '/hr/benefits' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>New Benefit</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search placeholder="Search benefits..." allowClear style={{ width: 300 }} />
        </div>
        <Table columns={columns} dataSource={benefits} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
      <FormDrawer title="Create Benefit" open={drawerVisible} onClose={() => { setDrawerVisible(false); form.resetFields(); }} form={form} fields={[{ name: 'name', label: 'Benefit Name', type: 'text', required: true, span: 24 }, { name: 'type', label: 'Type', type: 'select', options: [], required: true, span: 24 }, { name: 'coverage', label: 'Coverage', type: 'select', options: [{ label: 'Full', value: 'Full' }, { label: 'Partial', value: 'Partial' }], required: true, span: 24 }]} onSubmit={() => { setDrawerVisible(false); }} />
    </div>
  );
};

export default Benefits;

