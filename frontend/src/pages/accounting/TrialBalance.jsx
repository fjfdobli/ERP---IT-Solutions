import { useState } from 'react';
import { Card, Table, Button, Space, Input, Typography, DatePicker } from 'antd';
import { SearchOutlined, ExportOutlined, CalculatorOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;

const mockTrialBalance = [
  { id: 1, account: 'Cash', debit: 50000, credit: 0 },
  { id: 2, account: 'Accounts Receivable', debit: 30000, credit: 0 },
  { id: 3, account: 'Accounts Payable', debit: 0, credit: 20000 },
];

const TrialBalance = () => {
  const [trialBalance] = useState(mockTrialBalance);
  const totalDebit = trialBalance.reduce((sum, t) => sum + t.debit, 0);
  const totalCredit = trialBalance.reduce((sum, t) => sum + t.credit, 0);
  const columns = [
    { title: 'Account', dataIndex: 'account', key: 'account', width: 250 },
    { title: 'Debit', dataIndex: 'debit', key: 'debit', width: 150, align: 'right', render: (d) => d > 0 ? `$${d.toLocaleString()}` : '—' },
    { title: 'Credit', dataIndex: 'credit', key: 'credit', width: 150, align: 'right', render: (c) => c > 0 ? `$${c.toLocaleString()}` : '—' },
  ];
  return (
    <div>
      <PageHeader title="Trial Balance" breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Accounting', path: '/accounting' }, { title: 'Trial Balance', path: '/accounting/trial-balance' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <DatePicker placeholder="As of Date" />
            <Search placeholder="Search accounts..." allowClear style={{ width: 300 }} />
          </Space>
        </div>
        <Table columns={columns} dataSource={trialBalance} rowKey="id" pagination={false} summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}><Text strong>Total</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="right"><Text strong>${totalDebit.toLocaleString()}</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={2} align="right"><Text strong>${totalCredit.toLocaleString()}</Text></Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )} />
      </Card>
    </div>
  );
};

export default TrialBalance;

