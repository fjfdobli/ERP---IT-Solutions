import { useState } from 'react';
import { Row, Col, Card, Table, Button, Space, Input, Tag, Typography } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, RocketOutlined, CheckCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { PageHeader, StatCard } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockCampaigns = [
  { id: 1, name: 'Q1 Product Launch', type: 'Email', status: 'active', startDate: '2024-01-01', endDate: '2024-03-31', budget: 10000, spent: 3500, leads: 150, conversions: 25 },
];

const Campaigns = () => {
  const [campaigns] = useState(mockCampaigns);
  const columns = [
    { title: 'Campaign Name', dataIndex: 'name', key: 'name', width: 200 },
    { title: 'Type', dataIndex: 'type', key: 'type', width: 120 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status) => <Tag color={status === 'active' ? 'success' : 'default'}>{status}</Tag> },
    { title: 'Budget', dataIndex: 'budget', key: 'budget', width: 120, render: (b) => `$${b.toLocaleString()}` },
    { title: 'Spent', dataIndex: 'spent', key: 'spent', width: 120, render: (s) => `$${s.toLocaleString()}` },
    { title: 'Leads', dataIndex: 'leads', key: 'leads', width: 100 },
    { title: 'Conversions', dataIndex: 'conversions', key: 'conversions', width: 120 },
    { title: 'Actions', key: 'actions', width: 100, render: () => <Button type="text" icon={<EyeOutlined />} /> },
  ];
  return (
    <div>
      <PageHeader title="Campaigns" breadcrumb={[{ title: 'Home', path: '/' }, { title: 'CRM', path: '/crm' }, { title: 'Campaigns', path: '/crm/campaigns' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />}>New Campaign</Button>]} />
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}><StatCard title="Active Campaigns" value={campaigns.filter(c => c.status === 'active').length} icon={<RocketOutlined style={{ fontSize: 24, color: '#1890ff' }} />} color="#1890ff" /></Col>
        <Col xs={24} sm={12} md={8}><StatCard title="Total Leads" value={campaigns.reduce((sum, c) => sum + c.leads, 0)} icon={<CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />} color="#52c41a" /></Col>
      </Row>
      <Card><Table columns={columns} dataSource={campaigns} rowKey="id" pagination={{ pageSize: 10 }} /></Card>
    </div>
  );
};

export default Campaigns;

