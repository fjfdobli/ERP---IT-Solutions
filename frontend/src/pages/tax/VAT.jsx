import { useState } from 'react';
import { Card, Table, Button, Space, Input, Typography, DatePicker, Row, Col } from 'antd';
import { SearchOutlined, ExportOutlined, PercentageOutlined, DollarOutlined } from '@ant-design/icons';
import { PageHeader, StatCard } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;
const { RangePicker } = DatePicker;

const mockVAT = [
  { id: 1, period: '2024-01', sales: 100000, vatCollected: 12000, purchases: 50000, vatPaid: 6000, netVAT: 6000, status: 'filed' },
];

const VAT = () => {
  const [vat] = useState(mockVAT);
  const totalVAT = vat.reduce((sum, v) => sum + v.netVAT, 0);
  const columns = [
    { title: 'Period', dataIndex: 'period', key: 'period', width: 120 },
    { title: 'Sales', dataIndex: 'sales', key: 'sales', width: 120, align: 'right', render: (s) => `$${s.toLocaleString()}` },
    { title: 'VAT Collected', dataIndex: 'vatCollected', key: 'vatCollected', width: 130, align: 'right', render: (v) => `$${v.toLocaleString()}` },
    { title: 'Purchases', dataIndex: 'purchases', key: 'purchases', width: 120, align: 'right', render: (p) => `$${p.toLocaleString()}` },
    { title: 'VAT Paid', dataIndex: 'vatPaid', key: 'vatPaid', width: 120, align: 'right', render: (v) => `$${v.toLocaleString()}` },
    { title: 'Net VAT', dataIndex: 'netVAT', key: 'netVAT', width: 120, align: 'right', render: (n) => <Text strong>${n.toLocaleString()}</Text> },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status) => <Tag color={status === 'filed' ? 'success' : 'default'}>{status}</Tag> },
  ];
  return (
    <div>
      <PageHeader title="VAT/GST" breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Tax', path: '/tax' }, { title: 'VAT/GST', path: '/tax/vat' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>]} />
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}><StatCard title="Total VAT" value={`$${totalVAT.toLocaleString()}`} icon={<DollarOutlined style={{ fontSize: 24, color: '#1890ff' }} />} color="#1890ff" /></Col>
      </Row>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <RangePicker />
            <Search placeholder="Search..." allowClear style={{ width: 300 }} />
          </Space>
        </div>
        <Table columns={columns} dataSource={vat} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default VAT;

