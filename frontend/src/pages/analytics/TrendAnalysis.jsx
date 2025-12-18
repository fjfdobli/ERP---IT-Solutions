import { useState } from 'react';
import { Card, Table, Button, Space, Input, Typography, DatePicker, Row, Col } from 'antd';
import { SearchOutlined, ExportOutlined, LineChartOutlined } from '@ant-design/icons';
import { PageHeader, StatCard } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;
const { RangePicker } = DatePicker;

const mockTrends = [
  { id: 1, metric: 'Sales Revenue', period: 'Last 30 Days', trend: 'up', change: 12.5, value: 500000 },
];

const TrendAnalysis = () => {
  const [trends] = useState(mockTrends);
  return (
    <div>
      <PageHeader title="Trend Analysis" breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Analytics', path: '/analytics' }, { title: 'Trend Analysis', path: '/analytics/trends' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <RangePicker />
            <Search placeholder="Search metrics..." allowClear style={{ width: 300 }} />
          </Space>
        </div>
        <Row gutter={[16, 16]}>
          {trends.map(trend => (
            <Col xs={24} sm={12} md={8} key={trend.id}>
              <Card size="small">
                <div>{trend.metric}</div>
                <Text strong style={{ fontSize: 24 }}>${trend.value.toLocaleString()}</Text>
                <div><Text type={trend.trend === 'up' ? 'success' : 'danger'}>+{trend.change}%</Text></div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default TrendAnalysis;

