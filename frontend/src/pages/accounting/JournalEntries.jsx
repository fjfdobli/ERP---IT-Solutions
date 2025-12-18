import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, DatePicker, Form } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EditOutlined, FileTextOutlined } from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;
const { RangePicker } = DatePicker;

const mockEntries = [
  { id: 'JE-2024-00015', date: '2024-01-15', description: 'Sales transaction', debit: 1000, credit: 1000, status: 'posted' },
];

const JournalEntries = () => {
  const [entries] = useState(mockEntries);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Entry ID', dataIndex: 'id', key: 'id', width: 140, render: (id) => <Text strong style={{ color: '#1890ff' }}>{id}</Text> },
    { title: 'Date', dataIndex: 'date', key: 'date', width: 110, render: (date) => dayjs(date).format('MMM D, YYYY') },
    { title: 'Description', dataIndex: 'description', key: 'description', width: 250 },
    { title: 'Debit', dataIndex: 'debit', key: 'debit', width: 120, align: 'right', render: (d) => d > 0 ? `$${d.toLocaleString()}` : '—' },
    { title: 'Credit', dataIndex: 'credit', key: 'credit', width: 120, align: 'right', render: (c) => c > 0 ? `$${c.toLocaleString()}` : '—' },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status) => <Tag color={status === 'posted' ? 'success' : 'default'}>{status}</Tag> },
    { title: 'Actions', key: 'actions', width: 100, render: () => <Button type="text" icon={<EditOutlined />} /> },
  ];

  return (
    <div>
      <PageHeader title="Journal Entries" subtitle={`${entries.length} entries`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Accounting', path: '/accounting' }, { title: 'Journal Entries', path: '/accounting/journal' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>New Entry</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Search placeholder="Search entries..." allowClear style={{ width: 220 }} />
            <RangePicker />
          </Space>
        </div>
        <Table columns={columns} dataSource={entries} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
      <FormDrawer title="Create Journal Entry" open={drawerVisible} onClose={() => { setDrawerVisible(false); form.resetFields(); }} form={form} fields={[{ name: 'date', label: 'Date', type: 'date', required: true, span: 24 }, { name: 'description', label: 'Description', type: 'textarea', required: true, span: 24 }]} onSubmit={() => { setDrawerVisible(false); }} />
    </div>
  );
};

export default JournalEntries;

