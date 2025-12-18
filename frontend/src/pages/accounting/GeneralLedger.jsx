import { useState } from 'react';
import { Card, Table, Button, Space, Input, Typography, DatePicker, Select } from 'antd';
import { SearchOutlined, ExportOutlined, BookOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;
const { RangePicker } = DatePicker;

const mockLedger = [
  { id: 1, account: 'Cash', date: '2024-01-15', description: 'Sales', debit: 1000, credit: 0, balance: 1000 },
];

const GeneralLedger = () => {
  const [ledger] = useState(mockLedger);
  const columns = [
    { title: 'Date', dataIndex: 'date', key: 'date', width: 110, render: (date) => dayjs(date).format('MMM D, YYYY') },
    { title: 'Account', dataIndex: 'account', key: 'account', width: 200 },
    { title: 'Description', dataIndex: 'description', key: 'description', width: 250 },
    { title: 'Debit', dataIndex: 'debit', key: 'debit', width: 120, align: 'right', render: (d) => d > 0 ? `$${d.toLocaleString()}` : '—' },
    { title: 'Credit', dataIndex: 'credit', key: 'credit', width: 120, align: 'right', render: (c) => c > 0 ? `$${c.toLocaleString()}` : '—' },
    { title: 'Balance', dataIndex: 'balance', key: 'balance', width: 120, align: 'right', render: (b) => <Text strong>${b.toLocaleString()}</Text> },
  ];
  return (
    <div>
      <PageHeader title="General Ledger" breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Accounting', path: '/accounting' }, { title: 'General Ledger', path: '/accounting/ledger' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Search placeholder="Search..." allowClear style={{ width: 220 }} />
            <Select placeholder="Account" allowClear style={{ width: 200 }} />
            <RangePicker />
          </Space>
        </div>
        <Table columns={columns} dataSource={ledger} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default GeneralLedger;

