import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, Row, Col } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, LineChartOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockDashboards = [
  { id: 1, name: 'Sales Dashboard', description: 'Sales performance metrics', widgets: 8, status: 'active' },
];

const Dashboards = () => {
  const [dashboards] = useState(mockDashboards);
  const columns = [
    { title: 'Dashboard Name', dataIndex: 'name', key: 'name', width: 250 },
    { title: 'Description', dataIndex: 'description', key: 'description', width: 300 },
    { title: 'Widgets', dataIndex: 'widgets', key: 'widgets', width: 100, align: 'center' },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status) => <Tag color={status === 'active' ? 'success' : 'default'}>{status}</Tag> },
    { title: 'Actions', key: 'actions', width: 120, render: () => <Button type="text">View</Button> },
  ];
  return (
    <div>
      <PageHeader title="Custom Dashboards" subtitle={`${dashboards.length} dashboards`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Analytics', path: '/analytics' }, { title: 'Dashboards', path: '/analytics/dashboards' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />}>New Dashboard</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search placeholder="Search dashboards..." allowClear style={{ width: 300 }} />
        </div>
        <Table columns={columns} dataSource={dashboards} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default Dashboards;

