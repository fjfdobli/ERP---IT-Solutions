import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, Calendar } from 'antd';
import { SearchOutlined, ExportOutlined, CalendarOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockSchedule = [
  { id: 1, workOrder: 'WO-2024-00015', product: 'Product A', date: '2024-01-20', shift: 'Day', machine: 'Machine 1', status: 'scheduled' },
];

const ProductionScheduling = () => {
  const [schedule] = useState(mockSchedule);
  const columns = [
    { title: 'Work Order', dataIndex: 'workOrder', key: 'workOrder', width: 150 },
    { title: 'Product', dataIndex: 'product', key: 'product', width: 200 },
    { title: 'Date', dataIndex: 'date', key: 'date', width: 120 },
    { title: 'Shift', dataIndex: 'shift', key: 'shift', width: 100 },
    { title: 'Machine', dataIndex: 'machine', key: 'machine', width: 150 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status) => <Tag color={status === 'scheduled' ? 'blue' : 'default'}>{status}</Tag> },
  ];
  return (
    <div>
      <PageHeader title="Production Schedule" breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Manufacturing', path: '/manufacturing' }, { title: 'Production Schedule', path: '/manufacturing/scheduling' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search placeholder="Search..." allowClear style={{ width: 300 }} />
        </div>
        <Table columns={columns} dataSource={schedule} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default ProductionScheduling;

