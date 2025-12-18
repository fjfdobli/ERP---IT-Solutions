import { useState } from 'react';
import { Row, Col, Card, Table, Button, Space, Input, Typography, DatePicker, Descriptions } from 'antd';
import { SearchOutlined, ExportOutlined, DollarOutlined, ArrowUpOutlined, ArrowDownOutlined, WalletOutlined } from '@ant-design/icons';
import { PageHeader, StatCard } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;

const mockDailyCash = [
  { id: 1, date: '2024-01-15', branch: 'Main Branch', openingBalance: 5000, cashSales: 15000, cashReceived: 2000, cashPaid: 3000, closingBalance: 19000 },
];

const DailyCashPosition = () => {
  const [dailyCash] = useState(mockDailyCash);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const totalOpening = dailyCash.reduce((sum, d) => sum + d.openingBalance, 0);
  const totalSales = dailyCash.reduce((sum, d) => sum + d.cashSales, 0);
  const totalReceived = dailyCash.reduce((sum, d) => sum + d.cashReceived, 0);
  const totalPaid = dailyCash.reduce((sum, d) => sum + d.cashPaid, 0);
  const totalClosing = dailyCash.reduce((sum, d) => sum + d.closingBalance, 0);

  const columns = [
    { title: 'Date', dataIndex: 'date', key: 'date', width: 120, render: (date) => dayjs(date).format('MMM D, YYYY') },
    { title: 'Branch', dataIndex: 'branch', key: 'branch', width: 150 },
    { title: 'Opening Balance', dataIndex: 'openingBalance', key: 'openingBalance', width: 150, align: 'right', render: (b) => `$${b.toLocaleString()}` },
    { title: 'Cash Sales', dataIndex: 'cashSales', key: 'cashSales', width: 120, align: 'right', render: (s) => <Text type="success">+${s.toLocaleString()}</Text> },
    { title: 'Cash Received', dataIndex: 'cashReceived', key: 'cashReceived', width: 130, align: 'right', render: (r) => <Text type="success">+${r.toLocaleString()}</Text> },
    { title: 'Cash Paid', dataIndex: 'cashPaid', key: 'cashPaid', width: 120, align: 'right', render: (p) => <Text type="danger">-${p.toLocaleString()}</Text> },
    { title: 'Closing Balance', dataIndex: 'closingBalance', key: 'closingBalance', width: 150, align: 'right', render: (b) => <Text strong>${b.toLocaleString()}</Text> },
  ];

  return (
    <div>
      <PageHeader title="Daily Cash Position" subtitle="Monitor daily cash flow" breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Cash Management', path: '/cash' }, { title: 'Daily Cash Position', path: '/cash/daily' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>]} />
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}><StatCard title="Opening Balance" value={`$${totalOpening.toLocaleString()}`} icon={<WalletOutlined style={{ fontSize: 24, color: '#1890ff' }} />} color="#1890ff" /></Col>
        <Col xs={24} sm={12} md={6}><StatCard title="Cash Sales" value={`$${totalSales.toLocaleString()}`} icon={<ArrowUpOutlined style={{ fontSize: 24, color: '#52c41a' }} />} color="#52c41a" /></Col>
        <Col xs={24} sm={12} md={6}><StatCard title="Cash Received" value={`$${totalReceived.toLocaleString()}`} icon={<ArrowUpOutlined style={{ fontSize: 24, color: '#52c41a' }} />} color="#52c41a" /></Col>
        <Col xs={24} sm={12} md={6}><StatCard title="Closing Balance" value={`$${totalClosing.toLocaleString()}`} icon={<DollarOutlined style={{ fontSize: 24, color: '#722ed1' }} />} color="#722ed1" /></Col>
      </Row>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <DatePicker value={selectedDate} onChange={setSelectedDate} />
            <Search placeholder="Search..." allowClear style={{ width: 300 }} />
          </Space>
        </div>
        <Table columns={columns} dataSource={dailyCash} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default DailyCashPosition;

