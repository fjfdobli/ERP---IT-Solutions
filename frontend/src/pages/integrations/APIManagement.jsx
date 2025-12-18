import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, Modal, Form } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EditOutlined, ApiOutlined, CopyOutlined } from '@ant-design/icons';
import { PageHeader, FormDrawer } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockAPIs = [
  { id: 1, name: 'Sales API', key: 'sk_live_abc123...', status: 'active', createdDate: '2024-01-01', lastUsed: '2024-01-15' },
];

const APIManagement = () => {
  const [apis] = useState(mockAPIs);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'API Name', dataIndex: 'name', key: 'name', width: 200 },
    { title: 'API Key', dataIndex: 'key', key: 'key', width: 250, render: (key) => <Space><Text code>{key}</Text><Button type="text" size="small" icon={<CopyOutlined />} /></Space> },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status) => <Tag color={status === 'active' ? 'success' : 'default'}>{status}</Tag> },
    { title: 'Created Date', dataIndex: 'createdDate', key: 'createdDate', width: 130 },
    { title: 'Last Used', dataIndex: 'lastUsed', key: 'lastUsed', width: 130 },
    { title: 'Actions', key: 'actions', width: 120, render: () => <Button type="text" icon={<EditOutlined />} /> },
  ];

  return (
    <div>
      <PageHeader title="API Management" subtitle={`${apis.length} API keys`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Integrations', path: '/integrations' }, { title: 'API Management', path: '/integrations/api' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>Generate API Key</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search placeholder="Search API keys..." allowClear style={{ width: 300 }} />
        </div>
        <Table columns={columns} dataSource={apis} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
      <FormDrawer title="Generate API Key" open={drawerVisible} onClose={() => { setDrawerVisible(false); form.resetFields(); }} form={form} fields={[{ name: 'name', label: 'API Name', type: 'text', required: true, span: 24 }]} onSubmit={() => { setDrawerVisible(false); }} />
    </div>
  );
};

export default APIManagement;

