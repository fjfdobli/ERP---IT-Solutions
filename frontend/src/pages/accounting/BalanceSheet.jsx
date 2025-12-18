import { useState } from 'react';
import { Card, Table, Button, Space, Typography, DatePicker, Row, Col, Statistic } from 'antd';
import { ExportOutlined, DollarOutlined } from '@ant-design/icons';
import { PageHeader, StatCard } from '../../components/Common';
import dayjs from 'dayjs';

const { Text } = Typography;

const mockBalanceSheet = {
  assets: [
    { id: 1, account: 'Current Assets', items: [{ name: 'Cash', amount: 50000 }, { name: 'Accounts Receivable', amount: 30000 }], total: 80000 },
    { id: 2, account: 'Fixed Assets', items: [{ name: 'Equipment', amount: 200000 }], total: 200000 },
  ],
  liabilities: [
    { id: 3, account: 'Current Liabilities', items: [{ name: 'Accounts Payable', amount: 20000 }], total: 20000 },
  ],
  equity: [
    { id: 4, account: 'Equity', items: [{ name: 'Retained Earnings', amount: 260000 }], total: 260000 },
  ],
};

const BalanceSheet = () => {
  const [balanceSheet] = useState(mockBalanceSheet);
  const totalAssets = balanceSheet.assets.reduce((sum, a) => sum + a.total, 0);
  const totalLiabilities = balanceSheet.liabilities.reduce((sum, l) => sum + l.total, 0);
  const totalEquity = balanceSheet.equity.reduce((sum, e) => sum + e.total, 0);

  return (
    <div>
      <PageHeader title="Balance Sheet" breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Accounting', path: '/accounting' }, { title: 'Balance Sheet', path: '/accounting/balance-sheet' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>]} />
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}><StatCard title="Total Assets" value={`$${totalAssets.toLocaleString()}`} icon={<DollarOutlined style={{ fontSize: 24, color: '#1890ff' }} />} color="#1890ff" /></Col>
        <Col xs={24} sm={12} md={8}><StatCard title="Total Liabilities" value={`$${totalLiabilities.toLocaleString()}`} icon={<DollarOutlined style={{ fontSize: 24, color: '#faad14' }} />} color="#faad14" /></Col>
        <Col xs={24} sm={12} md={8}><StatCard title="Total Equity" value={`$${totalEquity.toLocaleString()}`} icon={<DollarOutlined style={{ fontSize: 24, color: '#52c41a' }} />} color="#52c41a" /></Col>
      </Row>
      <Card title="Assets">
        {balanceSheet.assets.map(asset => (
          <div key={asset.id} style={{ marginBottom: 16 }}>
            <Text strong>{asset.account}</Text>
            <Table dataSource={asset.items} rowKey="name" pagination={false} size="small" columns={[{ title: 'Item', dataIndex: 'name' }, { title: 'Amount', dataIndex: 'amount', align: 'right', render: (a) => `$${a.toLocaleString()}` }]} />
            <div style={{ textAlign: 'right', marginTop: 8 }}><Text strong>Total: ${asset.total.toLocaleString()}</Text></div>
          </div>
        ))}
      </Card>
    </div>
  );
};

export default BalanceSheet;

