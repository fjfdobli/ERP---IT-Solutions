import { useState } from 'react';
import { Card, Table, Button, Space, Input, Typography, Progress, Row, Col } from 'antd';
import { SearchOutlined, ExportOutlined, FundOutlined } from '@ant-design/icons';
import { PageHeader, StatCard } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockTracking = [
  { id: 1, budget: 'Sales Budget 2024', allocated: 500000, spent: 350000, variance: -150000, percentage: 70 },
];

const BudgetTracking = () => {
  const [tracking] = useState(mockTracking);
  const columns = [
    { title: 'Budget', dataIndex: 'budget', key: 'budget', width: 200 },
    { title: 'Allocated', dataIndex: 'allocated', key: 'allocated', width: 120, align: 'right', render: (a) => `$${a.toLocaleString()}` },
    { title: 'Spent', dataIndex: 'spent', key: 'spent', width: 120, align: 'right', render: (s) => `$${s.toLocaleString()}` },
    { title: 'Variance', dataIndex: 'variance', key: 'variance', width: 120, align: 'right', render: (v) => <Text type={v < 0 ? 'success' : 'danger'}>${v.toLocaleString()}</Text> },
    { title: 'Progress', key: 'progress', width: 200, render: (_, record) => <Progress percent={record.percentage} status={record.percentage > 90 ? 'exception' : 'active'} /> },
  ];
  return (
    <div>
      <PageHeader title="Budget vs Actual" breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Budgeting', path: '/budgeting' }, { title: 'Budget Tracking', path: '/budgeting/tracking' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search placeholder="Search..." allowClear style={{ width: 300 }} />
        </div>
        <Table columns={columns} dataSource={tracking} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default BudgetTracking;

