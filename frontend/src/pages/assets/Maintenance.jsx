import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, DatePicker, Form } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EditOutlined, ToolOutlined } from '@ant-design/icons';
import { PageHeader, FormDrawer } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;

const mockMaintenance = [
  { id: 1, asset: 'Office Building', type: 'Routine', scheduledDate: '2024-02-01', completedDate: null, cost: 500, status: 'scheduled', vendor: 'Maintenance Co' },
];

const Maintenance = () => {
  const [maintenance] = useState(mockMaintenance);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Asset', dataIndex: 'asset', key: 'asset', width: 200 },
    { title: 'Type', dataIndex: 'type', key: 'type', width: 120 },
    { title: 'Scheduled Date', dataIndex: 'scheduledDate', key: 'scheduledDate', width: 130, render: (date) => dayjs(date).format('MMM D, YYYY') },
    { title: 'Completed Date', dataIndex: 'completedDate', key: 'completedDate', width: 130, render: (date) => date ? dayjs(date).format('MMM D, YYYY') : '—' },
    { title: 'Cost', dataIndex: 'cost', key: 'cost', width: 120, align: 'right', render: (c) => `$${c.toLocaleString()}` },
    { title: 'Vendor', dataIndex: 'vendor', key: 'vendor', width: 150 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 120, render: (status) => <Tag color={status === 'completed' ? 'success' : status === 'scheduled' ? 'blue' : 'default'}>{status}</Tag> },
    { title: 'Actions', key: 'actions', width: 120, render: () => <Button type="text" icon={<EditOutlined />} /> },
  ];

  return (
    <div>
      <PageHeader title="Maintenance Schedule" subtitle={`${maintenance.length} maintenance records`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Fixed Assets', path: '/assets' }, { title: 'Maintenance', path: '/assets/maintenance' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>Schedule Maintenance</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <DatePicker placeholder="Select Date" />
            <Search placeholder="Search..." allowClear style={{ width: 300 }} />
          </Space>
        </div>
        <Table columns={columns} dataSource={maintenance} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
      <FormDrawer title="Schedule Maintenance" open={drawerVisible} onClose={() => { setDrawerVisible(false); form.resetFields(); }} form={form} fields={[{ name: 'asset', label: 'Asset', type: 'select', options: [], required: true, span: 24 }, { name: 'type', label: 'Type', type: 'select', options: [{ label: 'Routine', value: 'Routine' }, { label: 'Repair', value: 'Repair' }], required: true, span: 24 }, { name: 'scheduledDate', label: 'Scheduled Date', type: 'date', required: true, span: 24 }, { name: 'cost', label: 'Estimated Cost', type: 'currency', span: 24 }]} onSubmit={() => { setDrawerVisible(false); }} />
    </div>
  );
};

export default Maintenance;

