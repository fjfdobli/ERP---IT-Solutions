import { useState } from 'react';
import { Row, Col, Card, Table, Button, Space, Input, Select, Tag, Tooltip, message, Typography, DatePicker, Drawer, Descriptions, Avatar, Steps, Form } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EyeOutlined, EditOutlined, CheckOutlined, CloseOutlined, ShoppingOutlined, DollarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

const mockRequests = [
  { id: 'PR-2024-00025', date: '2024-01-15', requestedBy: 'John Doe', department: 'Sales', items: 5, total: 5000, status: 'pending', priority: 'high' },
  { id: 'PR-2024-00024', date: '2024-01-14', requestedBy: 'Jane Smith', department: 'Operations', items: 3, total: 3000, status: 'approved', priority: 'normal' },
];

const requestStatuses = [
  { value: 'pending', label: 'Pending', color: 'default' },
  { value: 'approved', label: 'Approved', color: 'success' },
  { value: 'rejected', label: 'Rejected', color: 'error' },
  { value: 'converted', label: 'Converted to PO', color: 'cyan' },
];

const PurchaseRequests = () => {
  const [requests, setRequests] = useState(mockRequests);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [form] = Form.useForm();

  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const totalValue = requests.reduce((sum, r) => sum + r.total, 0);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = !searchText || request.id.toLowerCase().includes(searchText.toLowerCase()) || request.requestedBy.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !filterStatus || request.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status) => requestStatuses.find(s => s.value === status) || requestStatuses[0];

  const columns = [
    { title: 'Request ID', dataIndex: 'id', key: 'id', width: 140, render: (id) => <Text strong style={{ color: '#1890ff' }}>{id}</Text> },
    { title: 'Date', dataIndex: 'date', key: 'date', width: 110, render: (date) => dayjs(date).format('MMM D, YYYY') },
    { title: 'Requested By', dataIndex: 'requestedBy', key: 'requestedBy', width: 150 },
    { title: 'Department', dataIndex: 'department', key: 'department', width: 120 },
    { title: 'Items', dataIndex: 'items', key: 'items', width: 80, align: 'center' },
    { title: 'Total', dataIndex: 'total', key: 'total', width: 120, align: 'right', render: (total) => <Text strong>${total.toLocaleString()}</Text> },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 120, render: (status) => { const config = getStatusConfig(status); return <Tag color={config.color}>{config.label}</Tag>; } },
    { title: 'Actions', key: 'actions', width: 150, render: (_, record) => (
      <Space>
        <Tooltip title="View Details"><Button type="text" icon={<EyeOutlined />} onClick={() => { setSelectedRequest(record); setDetailDrawerVisible(true); }} /></Tooltip>
        {record.status === 'pending' && <><Tooltip title="Approve"><Button type="text" icon={<CheckOutlined style={{ color: '#52c41a' }} />} /></Tooltip><Tooltip title="Reject"><Button type="text" icon={<CloseOutlined style={{ color: '#ff4d4f' }} />} /></Tooltip></>}
      </Space>
    ) },
  ];

  return (
    <div>
      <PageHeader title="Purchase Requests" subtitle={`${filteredRequests.length} requests`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Purchasing', path: '/purchasing' }, { title: 'Requests', path: '/purchasing/requests' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />}>New Request</Button>]} />
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}><StatCard title="Total Requests" value={totalRequests} icon={<ShoppingOutlined style={{ fontSize: 24, color: '#1890ff' }} />} color="#1890ff" /></Col>
        <Col xs={24} sm={12} md={6}><StatCard title="Pending Approval" value={pendingRequests} icon={<ClockCircleOutlined style={{ fontSize: 24, color: '#faad14' }} />} color="#faad14" warning={pendingRequests > 0} /></Col>
        <Col xs={24} sm={12} md={6}><StatCard title="Total Value" value={`$${totalValue.toLocaleString()}`} icon={<DollarOutlined style={{ fontSize: 24, color: '#52c41a' }} />} color="#52c41a" /></Col>
      </Row>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Space wrap>
            <Search placeholder="Search requests..." allowClear style={{ width: 220 }} value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            <Select placeholder="Status" allowClear style={{ width: 130 }} value={filterStatus} onChange={setFilterStatus} options={requestStatuses.map(s => ({ label: s.label, value: s.value }))} />
          </Space>
        </div>
        <Table columns={columns} dataSource={filteredRequests} rowKey="id" loading={loading} scroll={{ x: 1200 }} pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} requests` }} />
      </Card>
      <Drawer title="Request Details" placement="right" width={700} open={detailDrawerVisible} onClose={() => setDetailDrawerVisible(false)}>
        {selectedRequest && (
          <>
            <div style={{ marginBottom: 24 }}>
              <Space><Text strong style={{ fontSize: 20 }}>{selectedRequest.id}</Text><Tag color={getStatusConfig(selectedRequest.status).color}>{getStatusConfig(selectedRequest.status).label}</Tag></Space>
            </div>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Requested By">{selectedRequest.requestedBy}</Descriptions.Item>
              <Descriptions.Item label="Department">{selectedRequest.department}</Descriptions.Item>
              <Descriptions.Item label="Date">{dayjs(selectedRequest.date).format('MMMM D, YYYY')}</Descriptions.Item>
              <Descriptions.Item label="Total">${selectedRequest.total.toFixed(2)}</Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default PurchaseRequests;

