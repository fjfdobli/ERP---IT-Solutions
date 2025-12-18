import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography } from 'antd';
import { SearchOutlined, ExportOutlined } from '@ant-design/icons';
import { PageHeader, StatCard } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockInventory = [
  { id: 1, product: 'Product A', partner: 'Partner 1', quantity: 50, value: 5000 },
];

const ConsignmentInventory = () => {
  const [inventory] = useState(mockInventory);
  return (
    <div>
      <PageHeader title="Consignment Inventory" breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Consignment', path: '/consignment' }]} />
      <Card><Table dataSource={inventory} rowKey="id" columns={[{ title: 'Product', dataIndex: 'product' }, { title: 'Partner', dataIndex: 'partner' }, { title: 'Quantity', dataIndex: 'quantity' }]} /></Card>
    </div>
  );
};

export default ConsignmentInventory;

