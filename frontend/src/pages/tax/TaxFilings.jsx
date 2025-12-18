import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, DatePicker } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, FileDoneOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;

const mockFilings = [
  { id: 1, type: 'VAT Return', period: '2024-01', dueDate: '2024-02-15', filedDate: '2024-02-10', amount: 6000, status: 'filed' },
  { id: 2, type: 'Income Tax', period: '2023', dueDate: '2024-04-15', filedDate: null, amount: 50000, status: 'pending' },
];

const TaxFilings = () => {
  const [filings] = useState(mockFilings);
  const columns = [
    { title: 'Type', dataIndex: 'type', key: 'type', width: 150 },
    { title: 'Period', dataIndex: 'period', key: 'period', width: 120 },
    { title: 'Due Date', dataIndex: 'dueDate', key: 'dueDate', width: 120, render: (date) => dayjs(date).format('MMM D, YYYY') },
    { title: 'Filed Date', dataIndex: 'filedDate', key: 'filedDate', width: 120, render: (date) => date ? dayjs(date).format('MMM D, YYYY') : '—' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', width: 120, align: 'right', render: (a) => `$${a.toLocaleString()}` },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status) => <Tag color={status === 'filed' ? 'success' : status === 'pending' ? 'warning' : 'error'}>{status}</Tag> },
    { title: 'Actions', key: 'actions', width: 100, render: () => <Button type="text" icon={<FileDoneOutlined />} /> },
  ];
  return (
    <div>
      <PageHeader title="Tax Filings" subtitle={`${filings.length} filings`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Tax', path: '/tax' }, { title: 'Tax Filings', path: '/tax/filings' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />}>New Filing</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <DatePicker placeholder="Select Period" />
            <Search placeholder="Search filings..." allowClear style={{ width: 300 }} />
          </Space>
        </div>
        <Table columns={columns} dataSource={filings} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default TaxFilings;

