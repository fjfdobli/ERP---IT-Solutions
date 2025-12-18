import { useState } from 'react';
import { Card, Table, Button, Space, Typography, DatePicker, Row, Col } from 'antd';
import { ExportOutlined, DollarOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { PageHeader, StatCard } from '../../components/Common';
import dayjs from 'dayjs';

const { Text } = Typography;
const { RangePicker } = DatePicker;

const mockIncomeStatement = {
  revenue: [{ name: 'Sales Revenue', amount: 500000 }],
  expenses: [{ name: 'Cost of Goods Sold', amount: 300000 }, { name: 'Operating Expenses', amount: 100000 }],
};

const IncomeStatement = () => {
  const [incomeStatement] = useState(mockIncomeStatement);
  const totalRevenue = incomeStatement.revenue.reduce((sum, r) => sum + r.amount, 0);
  const totalExpenses = incomeStatement.expenses.reduce((sum, e) => sum + e.amount, 0);
  const netIncome = totalRevenue - totalExpenses;

  return (
    <div>
      <PageHeader title="Income Statement" breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Accounting', path: '/accounting' }, { title: 'Income Statement', path: '/accounting/income-statement' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>]} />
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}><StatCard title="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={<ArrowUpOutlined style={{ fontSize: 24, color: '#52c41a' }} />} color="#52c41a" /></Col>
        <Col xs={24} sm={12} md={8}><StatCard title="Total Expenses" value={`$${totalExpenses.toLocaleString()}`} icon={<ArrowDownOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />} color="#ff4d4f" /></Col>
        <Col xs={24} sm={12} md={8}><StatCard title="Net Income" value={`$${netIncome.toLocaleString()}`} icon={<DollarOutlined style={{ fontSize: 24, color: '#1890ff' }} />} color="#1890ff" /></Col>
      </Row>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <RangePicker />
        </div>
        <Card title="Revenue" size="small" style={{ marginBottom: 16 }}>
          <Table dataSource={incomeStatement.revenue} rowKey="name" pagination={false} columns={[{ title: 'Item', dataIndex: 'name' }, { title: 'Amount', dataIndex: 'amount', align: 'right', render: (a) => `$${a.toLocaleString()}` }]} />
        </Card>
        <Card title="Expenses" size="small">
          <Table dataSource={incomeStatement.expenses} rowKey="name" pagination={false} columns={[{ title: 'Item', dataIndex: 'name' }, { title: 'Amount', dataIndex: 'amount', align: 'right', render: (a) => `$${a.toLocaleString()}` }]} />
        </Card>
      </Card>
    </div>
  );
};

export default IncomeStatement;

