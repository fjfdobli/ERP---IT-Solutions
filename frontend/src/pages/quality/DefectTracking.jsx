import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, DatePicker } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EyeOutlined, WarningOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;

const mockDefects = [
  { id: 'DEF-2024-00015', product: 'Product A', defectType: 'Surface Scratch', severity: 'Minor', reportedBy: 'QC Inspector 1', date: '2024-01-15', status: 'open', resolution: null },
];

const DefectTracking = () => {
  const [defects] = useState(mockDefects);
  const columns = [
    { title: 'Defect ID', dataIndex: 'id', key: 'id', width: 140, render: (id) => <Text strong style={{ color: '#1890ff' }}>{id}</Text> },
    { title: 'Product', dataIndex: 'product', key: 'product', width: 200 },
    { title: 'Defect Type', dataIndex: 'defectType', key: 'defectType', width: 180 },
    { title: 'Severity', dataIndex: 'severity', key: 'severity', width: 100, render: (severity) => <Tag color={severity === 'Major' ? 'error' : severity === 'Minor' ? 'warning' : 'default'}>{severity}</Tag> },
    { title: 'Reported By', dataIndex: 'reportedBy', key: 'reportedBy', width: 180 },
    { title: 'Date', dataIndex: 'date', key: 'date', width: 120, render: (date) => dayjs(date).format('MMM D, YYYY') },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status) => <Tag color={status === 'open' ? 'error' : status === 'resolved' ? 'success' : 'default'}>{status}</Tag> },
    { title: 'Actions', key: 'actions', width: 100, render: () => <Button type="text" icon={<EyeOutlined />} /> },
  ];
  return (
    <div>
      <PageHeader title="Defect Tracking" subtitle={`${defects.length} defects`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Quality Control', path: '/quality' }, { title: 'Defect Tracking', path: '/quality/defects' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />}>Report Defect</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <DatePicker placeholder="Select Date" />
            <Search placeholder="Search..." allowClear style={{ width: 300 }} />
          </Space>
        </div>
        <Table columns={columns} dataSource={defects} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default DefectTracking;

