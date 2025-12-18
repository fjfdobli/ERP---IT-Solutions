import { useState } from 'react';
import { Row, Col, Card, Table, Button, Space, Input, Select, Tag, Typography, Drawer, Descriptions } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EyeOutlined, DollarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { PageHeader, StatCard } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockOpportunities = [
  { id: 'OPP-2024-00015', name: 'Enterprise Deal', company: 'Tech Corp', value: 500000, stage: 'proposal', probability: 60, expectedClose: '2024-02-15', owner: 'Sales Rep 1' },
];

const opportunityStages = [
  { value: 'prospecting', label: 'Prospecting', color: 'default' },
  { value: 'qualification', label: 'Qualification', color: 'blue' },
  { value: 'proposal', label: 'Proposal', color: 'cyan' },
  { value: 'negotiation', label: 'Negotiation', color: 'processing' },
  { value: 'closed_won', label: 'Closed Won', color: 'success' },
  { value: 'closed_lost', label: 'Closed Lost', color: 'error' },
];

const Opportunities = () => {
  const [opportunities] = useState(mockOpportunities);
  const totalValue = opportunities.reduce((sum, o) => sum + o.value, 0);
  const columns = [
    { title: 'Opportunity', dataIndex: 'name', key: 'name', width: 200 },
    { title: 'Company', dataIndex: 'company', key: 'company', width: 150 },
    { title: 'Value', dataIndex: 'value', key: 'value', width: 120, render: (v) => `$${v.toLocaleString()}` },
    { title: 'Stage', dataIndex: 'stage', key: 'stage', width: 120, render: (stage) => {
      const config = opportunityStages.find(s => s.value === stage);
      return <Tag color={config?.color}>{config?.label}</Tag>;
    } },
    { title: 'Probability', dataIndex: 'probability', key: 'probability', width: 100, render: (p) => `${p}%` },
    { title: 'Actions', key: 'actions', width: 100, render: () => <Button type="text" icon={<EyeOutlined />} /> },
  ];
  return (
    <div>
      <PageHeader title="Opportunities" breadcrumb={[{ title: 'Home', path: '/' }, { title: 'CRM', path: '/crm' }, { title: 'Opportunities', path: '/crm/opportunities' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />}>New Opportunity</Button>]} />
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}><StatCard title="Total Opportunities" value={opportunities.length} icon={<CheckCircleOutlined style={{ fontSize: 24, color: '#1890ff' }} />} color="#1890ff" /></Col>
        <Col xs={24} sm={12} md={8}><StatCard title="Total Value" value={`$${totalValue.toLocaleString()}`} icon={<DollarOutlined style={{ fontSize: 24, color: '#52c41a' }} />} color="#52c41a" /></Col>
      </Row>
      <Card><Table columns={columns} dataSource={opportunities} rowKey="id" pagination={{ pageSize: 10 }} /></Card>
    </div>
  );
};

export default Opportunities;

