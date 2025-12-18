import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, DatePicker } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EyeOutlined, AuditOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;

const mockAudits = [
  { id: 'AUD-2024-00015', type: 'Internal Audit', scope: 'Financial Processes', scheduledDate: '2024-02-01', auditor: 'Auditor 1', status: 'scheduled' },
];

const Audits = () => {
  const [audits] = useState(mockAudits);
  const columns = [
    { title: 'Audit ID', dataIndex: 'id', key: 'id', width: 140, render: (id) => <Text strong style={{ color: '#1890ff' }}>{id}</Text> },
    { title: 'Type', dataIndex: 'type', key: 'type', width: 150 },
    { title: 'Scope', dataIndex: 'scope', key: 'scope', width: 200 },
    { title: 'Scheduled Date', dataIndex: 'scheduledDate', key: 'scheduledDate', width: 130, render: (date) => dayjs(date).format('MMM D, YYYY') },
    { title: 'Auditor', dataIndex: 'auditor', key: 'auditor', width: 150 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status) => <Tag color={status === 'scheduled' ? 'blue' : status === 'completed' ? 'success' : 'default'}>{status}</Tag> },
    { title: 'Actions', key: 'actions', width: 100, render: () => <Button type="text" icon={<EyeOutlined />} /> },
  ];
  return (
    <div>
      <PageHeader title="Audit Schedules" subtitle={`${audits.length} audits`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Compliance', path: '/compliance' }, { title: 'Audits', path: '/compliance/audits' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />}>Schedule Audit</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <DatePicker placeholder="Select Date" />
            <Search placeholder="Search..." allowClear style={{ width: 300 }} />
          </Space>
        </div>
        <Table columns={columns} dataSource={audits} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default Audits;

