import { useState } from 'react';
import { Card, Table, Button, Space, Input, Typography, DatePicker, Row, Col } from 'antd';
import { SearchOutlined, ExportOutlined, LineChartOutlined } from '@ant-design/icons';
import { PageHeader, StatCard } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockForecasts = [
  { id: 1, period: 'Q1 2024', category: 'Sales', forecast: 500000, actual: 480000, variance: -20000 },
];

const Forecasting = () => {
  const [forecasts] = useState(mockForecasts);
  const columns = [
    { title: 'Period', dataIndex: 'period', key: 'period', width: 120 },
    { title: 'Category', dataIndex: 'category', key: 'category', width: 150 },
    { title: 'Forecast', dataIndex: 'forecast', key: 'forecast', width: 120, align: 'right', render: (f) => `$${f.toLocaleString()}` },
    { title: 'Actual', dataIndex: 'actual', key: 'actual', width: 120, align: 'right', render: (a) => `$${a.toLocaleString()}` },
    { title: 'Variance', dataIndex: 'variance', key: 'variance', width: 120, align: 'right', render: (v) => <Text type={v < 0 ? 'danger' : 'success'}>${v.toLocaleString()}</Text> },
  ];
  return (
    <div>
      <PageHeader title="Forecasting" breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Budgeting', path: '/budgeting' }, { title: 'Forecasting', path: '/budgeting/forecasts' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <DatePicker placeholder="Select Period" />
            <Search placeholder="Search..." allowClear style={{ width: 300 }} />
          </Space>
        </div>
        <Table columns={columns} dataSource={forecasts} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default Forecasting;

