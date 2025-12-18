import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, DatePicker } from 'antd';
import { SearchOutlined, ExportOutlined, EyeOutlined, FileDoneOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;

const mockSubmitted = [
  { id: 'APP-2024-00014', type: 'Expense', document: 'EXP-2024-00025', submittedDate: '2024-01-14', approvedDate: '2024-01-15', status: 'approved', approver: 'Manager 1' },
];

const SubmittedApprovals = () => {
  const [submitted] = useState(mockSubmitted);
  const columns = [
    { title: 'Approval ID', dataIndex: 'id', key: 'id', width: 140, render: (id) => <Text strong style={{ color: '#1890ff' }}>{id}</Text> },
    { title: 'Type', dataIndex: 'type', key: 'type', width: 150 },
    { title: 'Document', dataIndex: 'document', key: 'document', width: 150 },
    { title: 'Submitted Date', dataIndex: 'submittedDate', key: 'submittedDate', width: 130, render: (date) => dayjs(date).format('MMM D, YYYY') },
    { title: 'Approved Date', dataIndex: 'approvedDate', key: 'approvedDate', width: 130, render: (date) => dayjs(date).format('MMM D, YYYY') },
    { title: 'Approver', dataIndex: 'approver', key: 'approver', width: 150 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status) => <Tag color={status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'default'}>{status}</Tag> },
    { title: 'Actions', key: 'actions', width: 100, render: () => <Button type="text" icon={<EyeOutlined />} /> },
  ];
  return (
    <div>
      <PageHeader title="My Submitted" subtitle={`${submitted.length} submitted items`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Approvals', path: '/workflow' }, { title: 'My Submitted', path: '/workflow/submitted' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <DatePicker placeholder="Select Date" />
            <Search placeholder="Search..." allowClear style={{ width: 300 }} />
          </Space>
        </div>
        <Table columns={columns} dataSource={submitted} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default SubmittedApprovals;

