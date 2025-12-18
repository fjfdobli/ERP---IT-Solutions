import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, DatePicker } from 'antd';
import { SearchOutlined, ExportOutlined, CheckOutlined, CloseOutlined, NodeIndexOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;

const mockPending = [
  { id: 'APP-2024-00015', type: 'Purchase Request', document: 'PR-2024-00025', submittedBy: 'John Doe', submittedDate: '2024-01-15', amount: 5000, priority: 'high', status: 'pending' },
];

const PendingApprovals = () => {
  const [pending] = useState(mockPending);
  const columns = [
    { title: 'Approval ID', dataIndex: 'id', key: 'id', width: 140, render: (id) => <Text strong style={{ color: '#1890ff' }}>{id}</Text> },
    { title: 'Type', dataIndex: 'type', key: 'type', width: 150 },
    { title: 'Document', dataIndex: 'document', key: 'document', width: 150 },
    { title: 'Submitted By', dataIndex: 'submittedBy', key: 'submittedBy', width: 150 },
    { title: 'Submitted Date', dataIndex: 'submittedDate', key: 'submittedDate', width: 130, render: (date) => dayjs(date).format('MMM D, YYYY') },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', width: 120, align: 'right', render: (a) => `$${a.toLocaleString()}` },
    { title: 'Priority', dataIndex: 'priority', key: 'priority', width: 100, render: (priority) => <Tag color={priority === 'high' ? 'error' : 'default'}>{priority}</Tag> },
    { title: 'Actions', key: 'actions', width: 150, render: () => (
      <Space>
        <Button type="text" icon={<CheckOutlined style={{ color: '#52c41a' }} />} />
        <Button type="text" icon={<CloseOutlined style={{ color: '#ff4d4f' }} />} />
      </Space>
    ) },
  ];
  return (
    <div>
      <PageHeader title="Pending Approvals" subtitle={`${pending.length} pending approvals`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Approvals', path: '/workflow' }, { title: 'Pending Approvals', path: '/workflow/pending' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <DatePicker placeholder="Select Date" />
            <Search placeholder="Search..." allowClear style={{ width: 300 }} />
          </Space>
        </div>
        <Table columns={columns} dataSource={pending} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default PendingApprovals;

