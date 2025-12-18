import { useState } from 'react';
import { Card, Table, Button, Space, Typography, DatePicker, Row, Col } from 'antd';
import { ExportOutlined, DollarOutlined } from '@ant-design/icons';
import { PageHeader, StatCard } from '../../components/Common';
import dayjs from 'dayjs';

const { Text } = Typography;
const { RangePicker } = DatePicker;

const mockCashFlow = {
  operating: [{ name: 'Net Income', amount: 100000 }, { name: 'Depreciation', amount: 20000 }],
  investing: [{ name: 'Equipment Purchase', amount: -50000 }],
  financing: [{ name: 'Loan Proceeds', amount: 30000 }],
};

const CashFlowStatement = () => {
  const [cashFlow] = useState(mockCashFlow);
  const operatingTotal = cashFlow.operating.reduce((sum, o) => sum + o.amount, 0);
  const investingTotal = cashFlow.investing.reduce((sum, i) => sum + i.amount, 0);
  const financingTotal = cashFlow.financing.reduce((sum, f) => sum + f.amount, 0);
  const netCashFlow = operatingTotal + investingTotal + financingTotal;

  return (
    <div>
      <PageHeader title="Cash Flow Statement" breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Accounting', path: '/accounting' }, { title: 'Cash Flow Statement', path: '/accounting/cash-flow' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>]} />
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}><StatCard title="Operating" value={`$${operatingTotal.toLocaleString()}`} icon={<DollarOutlined style={{ fontSize: 24, color: '#1890ff' }} />} color="#1890ff" /></Col>
        <Col xs={24} sm={12} md={6}><StatCard title="Investing" value={`$${investingTotal.toLocaleString()}`} icon={<DollarOutlined style={{ fontSize: 24, color: '#faad14' }} />} color="#faad14" /></Col>
        <Col xs={24} sm={12} md={6}><StatCard title="Financing" value={`$${financingTotal.toLocaleString()}`} icon={<DollarOutlined style={{ fontSize: 24, color: '#722ed1' }} />} color="#722ed1" /></Col>
        <Col xs={24} sm={12} md={6}><StatCard title="Net Cash Flow" value={`$${netCashFlow.toLocaleString()}`} icon={<DollarOutlined style={{ fontSize: 24, color: '#52c41a' }} />} color="#52c41a" /></Col>
      </Row>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <RangePicker />
        </div>
        <Card title="Operating Activities" size="small" style={{ marginBottom: 16 }}>
          <Table dataSource={cashFlow.operating} rowKey="name" pagination={false} columns={[{ title: 'Item', dataIndex: 'name' }, { title: 'Amount', dataIndex: 'amount', align: 'right', render: (a) => `$${a.toLocaleString()}` }]} />
        </Card>
        <Card title="Investing Activities" size="small" style={{ marginBottom: 16 }}>
          <Table dataSource={cashFlow.investing} rowKey="name" pagination={false} columns={[{ title: 'Item', dataIndex: 'name' }, { title: 'Amount', dataIndex: 'amount', align: 'right', render: (a) => `$${a.toLocaleString()}` }]} />
        </Card>
        <Card title="Financing Activities" size="small">
          <Table dataSource={cashFlow.financing} rowKey="name" pagination={false} columns={[{ title: 'Item', dataIndex: 'name' }, { title: 'Amount', dataIndex: 'amount', align: 'right', render: (a) => `$${a.toLocaleString()}` }]} />
        </Card>
      </Card>
    </div>
  );
};

export default CashFlowStatement;

