import { useState } from 'react';
import { Card, Table, Button, Space, Input, Typography, DatePicker } from 'antd';
import { SearchOutlined, ExportOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;

const mockOutput = [
  { id: 1, workOrder: 'WO-2024-00015', product: 'Product A', plannedQuantity: 100, actualQuantity: 98, date: '2024-01-20', efficiency: 98 },
];

const ProductionOutput = () => {
  const [output] = useState(mockOutput);
  const columns = [
    { title: 'Work Order', dataIndex: 'workOrder', key: 'workOrder', width: 150 },
    { title: 'Product', dataIndex: 'product', key: 'product', width: 200 },
    { title: 'Planned Qty', dataIndex: 'plannedQuantity', key: 'plannedQuantity', width: 120, align: 'center' },
    { title: 'Actual Qty', dataIndex: 'actualQuantity', key: 'actualQuantity', width: 120, align: 'center' },
    { title: 'Efficiency %', dataIndex: 'efficiency', key: 'efficiency', width: 120, align: 'center', render: (e) => `${e}%` },
    { title: 'Date', dataIndex: 'date', key: 'date', width: 120, render: (date) => dayjs(date).format('MMM D, YYYY') },
  ];
  return (
    <div>
      <PageHeader title="Production Output" breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Manufacturing', path: '/manufacturing' }, { title: 'Production Output', path: '/manufacturing/output' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <DatePicker placeholder="Select Date" />
            <Search placeholder="Search..." allowClear style={{ width: 300 }} />
          </Space>
        </div>
        <Table columns={columns} dataSource={output} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default ProductionOutput;

