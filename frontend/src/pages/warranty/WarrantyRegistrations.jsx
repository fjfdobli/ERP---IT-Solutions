import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, DatePicker, Form } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EditOutlined, FieldTimeOutlined } from '@ant-design/icons';
import { PageHeader, FormDrawer } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;

const mockRegistrations = [
  { id: 'WR-2024-00015', product: 'iPhone 15 Pro Max', customer: 'John Doe', purchaseDate: '2024-01-10', warrantyStart: '2024-01-10', warrantyEnd: '2025-01-10', status: 'active' },
];

const WarrantyRegistrations = () => {
  const [registrations] = useState(mockRegistrations);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Registration ID', dataIndex: 'id', key: 'id', width: 150, render: (id) => <Text strong style={{ color: '#1890ff' }}>{id}</Text> },
    { title: 'Product', dataIndex: 'product', key: 'product', width: 200 },
    { title: 'Customer', dataIndex: 'customer', key: 'customer', width: 150 },
    { title: 'Purchase Date', dataIndex: 'purchaseDate', key: 'purchaseDate', width: 120, render: (date) => dayjs(date).format('MMM D, YYYY') },
    { title: 'Warranty Start', dataIndex: 'warrantyStart', key: 'warrantyStart', width: 120, render: (date) => dayjs(date).format('MMM D, YYYY') },
    { title: 'Warranty End', dataIndex: 'warrantyEnd', key: 'warrantyEnd', width: 120, render: (date) => dayjs(date).format('MMM D, YYYY') },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status) => <Tag color={status === 'active' ? 'success' : 'default'}>{status}</Tag> },
    { title: 'Actions', key: 'actions', width: 120, render: () => <Button type="text" icon={<EditOutlined />} /> },
  ];

  return (
    <div>
      <PageHeader title="Warranty Registrations" subtitle={`${registrations.length} registrations`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Warranty & Service', path: '/warranty' }, { title: 'Registrations', path: '/warranty/registrations' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>New Registration</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <DatePicker placeholder="Select Date" />
            <Search placeholder="Search..." allowClear style={{ width: 300 }} />
          </Space>
        </div>
        <Table columns={columns} dataSource={registrations} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
      <FormDrawer title="Register Warranty" open={drawerVisible} onClose={() => { setDrawerVisible(false); form.resetFields(); }} form={form} fields={[{ name: 'product', label: 'Product', type: 'select', options: [], required: true, span: 24 }, { name: 'customer', label: 'Customer', type: 'select', options: [], required: true, span: 24 }, { name: 'purchaseDate', label: 'Purchase Date', type: 'date', required: true, span: 24 }]} onSubmit={() => { setDrawerVisible(false); }} />
    </div>
  );
};

export default WarrantyRegistrations;

