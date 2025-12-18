import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, DatePicker } from 'antd';
import { SearchOutlined, ExportOutlined, PercentageOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;
const { RangePicker } = DatePicker;

const mockWithholding = [
  { id: 1, vendor: 'Supplier A', amount: 10000, taxRate: 2, taxAmount: 200, date: '2024-01-15', status: 'paid' },
];

const WithholdingTax = () => {
  const [withholding] = useState(mockWithholding);
  const columns = [
    { title: 'Vendor', dataIndex: 'vendor', key: 'vendor', width: 200 },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', width: 120, align: 'right', render: (a) => `$${a.toLocaleString()}` },
    { title: 'Tax Rate', dataIndex: 'taxRate', key: 'taxRate', width: 100, render: (r) => `${r}%` },
    { title: 'Tax Amount', dataIndex: 'taxAmount', key: 'taxAmount', width: 120, align: 'right', render: (t) => <Text strong>${t.toLocaleString()}</Text> },
    { title: 'Date', dataIndex: 'date', key: 'date', width: 110, render: (date) => dayjs(date).format('MMM D, YYYY') },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status) => <Tag color={status === 'paid' ? 'success' : 'default'}>{status}</Tag> },
  ];
  return (
    <div>
      <PageHeader title="Withholding Tax" breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Tax', path: '/tax' }, { title: 'Withholding Tax', path: '/tax/withholding' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <RangePicker />
            <Search placeholder="Search..." allowClear style={{ width: 300 }} />
          </Space>
        </div>
        <Table columns={columns} dataSource={withholding} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default WithholdingTax;

