import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, DatePicker } from 'antd';
import { SearchOutlined, ExportOutlined, AuditOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;
const { RangePicker } = DatePicker;

const mockAuditLogs = [
  { id: 1, user: 'admin', action: 'Create', entity: 'User', entityId: 'U001', timestamp: '2024-01-15 10:30:00', ipAddress: '192.168.1.1' },
];

const AuditLogs = () => {
  const [auditLogs] = useState(mockAuditLogs);
  const columns = [
    { title: 'User', dataIndex: 'user', key: 'user', width: 120 },
    { title: 'Action', dataIndex: 'action', key: 'action', width: 100, render: (action) => <Tag color="blue">{action}</Tag> },
    { title: 'Entity', dataIndex: 'entity', key: 'entity', width: 120 },
    { title: 'Entity ID', dataIndex: 'entityId', key: 'entityId', width: 120 },
    { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp', width: 180 },
    { title: 'IP Address', dataIndex: 'ipAddress', key: 'ipAddress', width: 150 },
  ];
  return (
    <div>
      <PageHeader title="Audit Logs" subtitle={`${auditLogs.length} log entries`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Administration', path: '/admin' }, { title: 'Audit Logs', path: '/admin/audit-logs' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <RangePicker />
            <Search placeholder="Search logs..." allowClear style={{ width: 300 }} />
          </Space>
        </div>
        <Table columns={columns} dataSource={auditLogs} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default AuditLogs;

