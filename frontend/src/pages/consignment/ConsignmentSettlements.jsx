import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography } from 'antd';
import { SearchOutlined, ExportOutlined, DollarOutlined } from '@ant-design/icons';
import { PageHeader, StatCard } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockSettlements = [
  { id: 1, partner: 'Partner 1', period: '2024-01', amount: 5000, status: 'pending' },
];

const ConsignmentSettlements = () => {
  const [settlements] = useState(mockSettlements);
  return (
    <div>
      <PageHeader title="Consignment Settlements" breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Consignment', path: '/consignment' }]} />
      <Card><Table dataSource={settlements} rowKey="id" columns={[{ title: 'Partner', dataIndex: 'partner' }, { title: 'Period', dataIndex: 'period' }, { title: 'Amount', dataIndex: 'amount', render: (a) => `$${a}` }, { title: 'Status', dataIndex: 'status', render: (s) => <Tag color={s === 'pending' ? 'warning' : 'success'}>{s}</Tag> }]} /></Card>
    </div>
  );
};

export default ConsignmentSettlements;

