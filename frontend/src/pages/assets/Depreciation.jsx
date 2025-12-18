import { useState } from 'react';
import { Card, Table, Button, Space, Input, Typography, DatePicker } from 'antd';
import { SearchOutlined, ExportOutlined, CalculatorOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;

const mockDepreciation = [
  { id: 1, asset: 'Office Building', period: '2024-01', depreciationAmount: 1388.89, accumulatedDepreciation: 55555.56, bookValue: 444444.44 },
];

const Depreciation = () => {
  const [depreciation] = useState(mockDepreciation);
  const columns = [
    { title: 'Asset', dataIndex: 'asset', key: 'asset', width: 200 },
    { title: 'Period', dataIndex: 'period', key: 'period', width: 120 },
    { title: 'Depreciation Amount', dataIndex: 'depreciationAmount', key: 'depreciationAmount', width: 180, align: 'right', render: (d) => `$${d.toFixed(2)}` },
    { title: 'Accumulated Depreciation', dataIndex: 'accumulatedDepreciation', key: 'accumulatedDepreciation', width: 200, align: 'right', render: (a) => `$${a.toFixed(2)}` },
    { title: 'Book Value', dataIndex: 'bookValue', key: 'bookValue', width: 150, align: 'right', render: (b) => <Text strong>${b.toFixed(2)}</Text> },
  ];
  return (
    <div>
      <PageHeader title="Depreciation" breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Fixed Assets', path: '/assets' }, { title: 'Depreciation', path: '/assets/depreciation' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <DatePicker placeholder="Select Period" />
            <Search placeholder="Search..." allowClear style={{ width: 300 }} />
          </Space>
        </div>
        <Table columns={columns} dataSource={depreciation} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default Depreciation;

