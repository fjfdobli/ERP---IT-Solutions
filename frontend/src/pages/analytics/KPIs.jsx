import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, Row, Col, Progress } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EditOutlined, TrophyOutlined } from '@ant-design/icons';
import { PageHeader, StatCard } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockKPIs = [
  { id: 1, name: 'Sales Growth', target: 20, current: 18.5, unit: '%', status: 'on_track' },
  { id: 2, name: 'Customer Satisfaction', target: 90, current: 85, unit: '%', status: 'below_target' },
];

const KPIs = () => {
  const [kpis] = useState(mockKPIs);
  const columns = [
    { title: 'KPI Name', dataIndex: 'name', key: 'name', width: 200 },
    { title: 'Target', dataIndex: 'target', key: 'target', width: 100, align: 'right', render: (t, record) => `${t}${record.unit}` },
    { title: 'Current', dataIndex: 'current', key: 'current', width: 100, align: 'right', render: (c, record) => `${c}${record.unit}` },
    { title: 'Progress', key: 'progress', width: 200, render: (_, record) => {
      const percentage = (record.current / record.target) * 100;
      return <Progress percent={Math.min(percentage, 100)} status={record.status === 'below_target' ? 'exception' : 'active'} />;
    } },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 120, render: (status) => <Tag color={status === 'on_track' ? 'success' : 'warning'}>{status === 'on_track' ? 'On Track' : 'Below Target'}</Tag> },
    { title: 'Actions', key: 'actions', width: 120, render: () => <Button type="text" icon={<EditOutlined />} /> },
  ];
  return (
    <div>
      <PageHeader title="KPI Tracking" subtitle={`${kpis.length} KPIs`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Analytics', path: '/analytics' }, { title: 'KPIs', path: '/analytics/kpis' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />}>New KPI</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search placeholder="Search KPIs..." allowClear style={{ width: 300 }} />
        </div>
        <Table columns={columns} dataSource={kpis} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default KPIs;

