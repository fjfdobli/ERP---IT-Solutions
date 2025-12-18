import { useState } from 'react';
import { Row, Col, Card, Table, Button, Space, Input, Select, Tag, Typography, DatePicker } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, CalendarOutlined, CheckCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { PageHeader, StatCard } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;
const { RangePicker } = DatePicker;

const mockLeaveRequests = [
  { id: 'LV-2024-00015', employee: 'John Doe', type: 'Annual Leave', startDate: '2024-02-01', endDate: '2024-02-05', days: 5, status: 'pending', submittedDate: '2024-01-15' },
  { id: 'LV-2024-00014', employee: 'Jane Smith', type: 'Sick Leave', startDate: '2024-01-20', endDate: '2024-01-20', days: 1, status: 'approved', submittedDate: '2024-01-18' },
];

const leaveTypes = ['Annual Leave', 'Sick Leave', 'Personal Leave', 'Maternity Leave', 'Paternity Leave'];
const leaveStatuses = [
  { value: 'pending', label: 'Pending', color: 'default' },
  { value: 'approved', label: 'Approved', color: 'success' },
  { value: 'rejected', label: 'Rejected', color: 'error' },
];

const LeaveManagement = () => {
  const [leaveRequests] = useState(mockLeaveRequests);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);

  const totalRequests = leaveRequests.length;
  const pendingRequests = leaveRequests.filter(l => l.status === 'pending').length;
  const approvedRequests = leaveRequests.filter(l => l.status === 'approved').length;

  const columns = [
    { title: 'Request ID', dataIndex: 'id', key: 'id', width: 140, render: (id) => <Text strong style={{ color: '#1890ff' }}>{id}</Text> },
    { title: 'Employee', dataIndex: 'employee', key: 'employee', width: 150 },
    { title: 'Type', dataIndex: 'type', key: 'type', width: 150 },
    { title: 'Start Date', dataIndex: 'startDate', key: 'startDate', width: 120, render: (date) => dayjs(date).format('MMM D, YYYY') },
    { title: 'End Date', dataIndex: 'endDate', key: 'endDate', width: 120, render: (date) => dayjs(date).format('MMM D, YYYY') },
    { title: 'Days', dataIndex: 'days', key: 'days', width: 80, align: 'center' },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 120, render: (status) => {
      const config = leaveStatuses.find(s => s.value === status);
      return <Tag color={config?.color}>{config?.label}</Tag>;
    } },
    { title: 'Actions', key: 'actions', width: 100, render: () => <Button type="text" icon={<EyeOutlined />} /> },
  ];

  return (
    <div>
      <PageHeader title="Leave Management" subtitle={`${leaveRequests.length} requests`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'HR', path: '/hr' }, { title: 'Leave Management', path: '/hr/leave' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />}>New Request</Button>]} />
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}><StatCard title="Total Requests" value={totalRequests} icon={<CalendarOutlined style={{ fontSize: 24, color: '#1890ff' }} />} color="#1890ff" /></Col>
        <Col xs={24} sm={12} md={8}><StatCard title="Pending" value={pendingRequests} icon={<CalendarOutlined style={{ fontSize: 24, color: '#faad14' }} />} color="#faad14" /></Col>
        <Col xs={24} sm={12} md={8}><StatCard title="Approved" value={approvedRequests} icon={<CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />} color="#52c41a" /></Col>
      </Row>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Search placeholder="Search requests..." allowClear style={{ width: 220 }} value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            <Select placeholder="Status" allowClear style={{ width: 130 }} value={filterStatus} onChange={setFilterStatus} options={leaveStatuses.map(s => ({ label: s.label, value: s.value }))} />
          </Space>
        </div>
        <Table columns={columns} dataSource={leaveRequests} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default LeaveManagement;

