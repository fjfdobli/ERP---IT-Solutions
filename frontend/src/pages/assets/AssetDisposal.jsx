import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, DatePicker, Form } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { PageHeader, FormDrawer } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;

const mockDisposals = [
  { id: 1, asset: 'Old Computer', disposalDate: '2024-01-15', disposalMethod: 'Sale', proceeds: 200, bookValue: 500, gainLoss: -300, status: 'completed' },
];

const AssetDisposal = () => {
  const [disposals] = useState(mockDisposals);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Asset', dataIndex: 'asset', key: 'asset', width: 200 },
    { title: 'Disposal Date', dataIndex: 'disposalDate', key: 'disposalDate', width: 130, render: (date) => dayjs(date).format('MMM D, YYYY') },
    { title: 'Method', dataIndex: 'disposalMethod', key: 'disposalMethod', width: 120 },
    { title: 'Proceeds', dataIndex: 'proceeds', key: 'proceeds', width: 120, align: 'right', render: (p) => `$${p.toLocaleString()}` },
    { title: 'Book Value', dataIndex: 'bookValue', key: 'bookValue', width: 120, align: 'right', render: (b) => `$${b.toLocaleString()}` },
    { title: 'Gain/Loss', dataIndex: 'gainLoss', key: 'gainLoss', width: 120, align: 'right', render: (gl) => <Text type={gl < 0 ? 'danger' : 'success'}>${gl.toLocaleString()}</Text> },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status) => <Tag color={status === 'completed' ? 'success' : 'default'}>{status}</Tag> },
    { title: 'Actions', key: 'actions', width: 120, render: () => <Button type="text" icon={<EditOutlined />} /> },
  ];

  return (
    <div>
      <PageHeader title="Asset Disposal" subtitle={`${disposals.length} disposals`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Fixed Assets', path: '/assets' }, { title: 'Asset Disposal', path: '/assets/disposal' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>New Disposal</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <DatePicker placeholder="Select Date" />
            <Search placeholder="Search..." allowClear style={{ width: 300 }} />
          </Space>
        </div>
        <Table columns={columns} dataSource={disposals} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
      <FormDrawer title="Record Disposal" open={drawerVisible} onClose={() => { setDrawerVisible(false); form.resetFields(); }} form={form} fields={[{ name: 'asset', label: 'Asset', type: 'select', options: [], required: true, span: 24 }, { name: 'disposalDate', label: 'Disposal Date', type: 'date', required: true, span: 24 }, { name: 'disposalMethod', label: 'Disposal Method', type: 'select', options: [{ label: 'Sale', value: 'Sale' }, { label: 'Scrap', value: 'Scrap' }, { label: 'Donation', value: 'Donation' }], required: true, span: 24 }, { name: 'proceeds', label: 'Proceeds', type: 'currency', span: 24 }]} onSubmit={() => { setDrawerVisible(false); }} />
    </div>
  );
};

export default AssetDisposal;

