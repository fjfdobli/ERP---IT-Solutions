import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, DatePicker } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EyeOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;

const mockInspections = [
  { id: 'INS-2024-00015', product: 'Product A', inspector: 'QC Inspector 1', date: '2024-01-15', result: 'Pass', defects: 0, status: 'completed' },
];

const Inspections = () => {
  const [inspections] = useState(mockInspections);
  const columns = [
    { title: 'Inspection ID', dataIndex: 'id', key: 'id', width: 150, render: (id) => <Text strong style={{ color: '#1890ff' }}>{id}</Text> },
    { title: 'Product', dataIndex: 'product', key: 'product', width: 200 },
    { title: 'Inspector', dataIndex: 'inspector', key: 'inspector', width: 180 },
    { title: 'Date', dataIndex: 'date', key: 'date', width: 120, render: (date) => dayjs(date).format('MMM D, YYYY') },
    { title: 'Result', dataIndex: 'result', key: 'result', width: 100, render: (result) => <Tag color={result === 'Pass' ? 'success' : 'error'}>{result}</Tag> },
    { title: 'Defects', dataIndex: 'defects', key: 'defects', width: 100, align: 'center' },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status) => <Tag color={status === 'completed' ? 'success' : 'default'}>{status}</Tag> },
    { title: 'Actions', key: 'actions', width: 100, render: () => <Button type="text" icon={<EyeOutlined />} /> },
  ];
  return (
    <div>
      <PageHeader title="Inspections" subtitle={`${inspections.length} inspections`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Quality Control', path: '/quality' }, { title: 'Inspections', path: '/quality/inspections' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />}>New Inspection</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <DatePicker placeholder="Select Date" />
            <Search placeholder="Search..." allowClear style={{ width: 300 }} />
          </Space>
        </div>
        <Table columns={columns} dataSource={inspections} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default Inspections;

