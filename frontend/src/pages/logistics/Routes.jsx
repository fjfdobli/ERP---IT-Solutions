import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, Form } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EditOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { PageHeader, FormDrawer } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockRoutes = [
  { id: 1, name: 'Route A', startLocation: 'Warehouse', endLocation: 'Downtown', distance: 15, estimatedTime: 30, status: 'active' },
];

const Routes = () => {
  const [routes] = useState(mockRoutes);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Route Name', dataIndex: 'name', key: 'name', width: 150 },
    { title: 'Start Location', dataIndex: 'startLocation', key: 'startLocation', width: 150 },
    { title: 'End Location', dataIndex: 'endLocation', key: 'endLocation', width: 150 },
    { title: 'Distance (km)', dataIndex: 'distance', key: 'distance', width: 120 },
    { title: 'Est. Time (min)', dataIndex: 'estimatedTime', key: 'estimatedTime', width: 130 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status) => <Tag color={status === 'active' ? 'success' : 'default'}>{status}</Tag> },
    { title: 'Actions', key: 'actions', width: 120, render: () => <Button type="text" icon={<EditOutlined />} /> },
  ];

  return (
    <div>
      <PageHeader title="Route Planning" subtitle={`${routes.length} routes`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Logistics', path: '/logistics' }, { title: 'Route Planning', path: '/logistics/routes' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>New Route</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search placeholder="Search routes..." allowClear style={{ width: 300 }} />
        </div>
        <Table columns={columns} dataSource={routes} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
      <FormDrawer title="Create Route" open={drawerVisible} onClose={() => { setDrawerVisible(false); form.resetFields(); }} form={form} fields={[{ name: 'name', label: 'Route Name', type: 'text', required: true, span: 24 }, { name: 'startLocation', label: 'Start Location', type: 'text', required: true, span: 24 }, { name: 'endLocation', label: 'End Location', type: 'text', required: true, span: 24 }, { name: 'distance', label: 'Distance (km)', type: 'number', required: true, span: 24 }]} onSubmit={() => { setDrawerVisible(false); }} />
    </div>
  );
};

export default Routes;

