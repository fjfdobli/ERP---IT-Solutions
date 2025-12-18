import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined } from '@ant-design/icons';
import { PageHeader, StatCard } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockPartners = [
  { id: 1, name: 'Partner 1', contact: 'partner1@email.com', status: 'active' },
];

const ConsignmentPartners = () => {
  const [partners] = useState(mockPartners);
  return (
    <div>
      <PageHeader title="Consignment Partners" breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Consignment', path: '/consignment' }]} actions={[<Button key="create" type="primary" icon={<PlusOutlined />}>New Partner</Button>]} />
      <Card><Table dataSource={partners} rowKey="id" columns={[{ title: 'Name', dataIndex: 'name' }, { title: 'Contact', dataIndex: 'contact' }, { title: 'Status', dataIndex: 'status', render: (s) => <Tag color={s === 'active' ? 'success' : 'default'}>{s}</Tag> }]} /></Card>
    </div>
  );
};

export default ConsignmentPartners;

