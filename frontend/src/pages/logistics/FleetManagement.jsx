import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, Form } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EditOutlined, CarOutlined } from '@ant-design/icons';
import { PageHeader, FormDrawer } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockFleet = [
  { id: 1, vehicleNumber: 'VH-001', type: 'Truck', make: 'Toyota', model: 'Hiace', year: 2020, status: 'active', driver: 'Driver 1' },
];

const FleetManagement = () => {
  const [fleet] = useState(mockFleet);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Vehicle Number', dataIndex: 'vehicleNumber', key: 'vehicleNumber', width: 140 },
    { title: 'Type', dataIndex: 'type', key: 'type', width: 100 },
    { title: 'Make', dataIndex: 'make', key: 'make', width: 120 },
    { title: 'Model', dataIndex: 'model', key: 'model', width: 150 },
    { title: 'Year', dataIndex: 'year', key: 'year', width: 80 },
    { title: 'Driver', dataIndex: 'driver', key: 'driver', width: 150 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status) => <Tag color={status === 'active' ? 'success' : 'default'}>{status}</Tag> },
    { title: 'Actions', key: 'actions', width: 120, render: () => <Button type="text" icon={<EditOutlined />} /> },
  ];

  return (
    <div>
      <PageHeader title="Fleet Management" subtitle={`${fleet.length} vehicles`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Logistics', path: '/logistics' }, { title: 'Fleet Management', path: '/logistics/fleet' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>Add Vehicle</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search placeholder="Search vehicles..." allowClear style={{ width: 300 }} />
        </div>
        <Table columns={columns} dataSource={fleet} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
      <FormDrawer title="Add Vehicle" open={drawerVisible} onClose={() => { setDrawerVisible(false); form.resetFields(); }} form={form} fields={[{ name: 'vehicleNumber', label: 'Vehicle Number', type: 'text', required: true, span: 24 }, { name: 'type', label: 'Type', type: 'select', options: [{ label: 'Truck', value: 'Truck' }, { label: 'Van', value: 'Van' }, { label: 'Car', value: 'Car' }], required: true, span: 24 }, { name: 'make', label: 'Make', type: 'text', required: true, span: 24 }, { name: 'model', label: 'Model', type: 'text', required: true, span: 24 }, { name: 'year', label: 'Year', type: 'number', required: true, span: 24 }]} onSubmit={() => { setDrawerVisible(false); }} />
    </div>
  );
};

export default FleetManagement;

