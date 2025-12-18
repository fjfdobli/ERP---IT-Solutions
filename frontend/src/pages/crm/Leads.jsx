import { useState } from 'react';
import { Row, Col, Card, Table, Button, Space, Input, Select, Tag, Tooltip, Typography, DatePicker, Drawer, Descriptions, Avatar, Steps, Form } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EyeOutlined, EditOutlined, UserOutlined, PhoneOutlined, MailOutlined, DollarOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;
const { RangePicker } = DatePicker;

const mockLeads = [
  { id: 'LD-2024-00025', name: 'John Smith', company: 'Tech Corp', email: 'john@techcorp.com', phone: '+1 234 567 890', source: 'Website', value: 50000, status: 'new', assignedTo: 'Sales Rep 1', createdDate: '2024-01-15' },
  { id: 'LD-2024-00024', name: 'Jane Doe', company: 'Business Inc', email: 'jane@business.com', phone: '+1 345 678 901', source: 'Referral', value: 75000, status: 'contacted', assignedTo: 'Sales Rep 2', createdDate: '2024-01-14' },
];

const leadStatuses = [
  { value: 'new', label: 'New', color: 'blue' },
  { value: 'contacted', label: 'Contacted', color: 'cyan' },
  { value: 'qualified', label: 'Qualified', color: 'processing' },
  { value: 'converted', label: 'Converted', color: 'success' },
  { value: 'lost', label: 'Lost', color: 'error' },
];

const Leads = () => {
  const [leads, setLeads] = useState(mockLeads);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [form] = Form.useForm();

  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'new').length;
  const totalValue = leads.reduce((sum, l) => sum + l.value, 0);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = !searchText || lead.name.toLowerCase().includes(searchText.toLowerCase()) || lead.company.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !filterStatus || lead.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status) => leadStatuses.find(s => s.value === status) || leadStatuses[0];

  const columns = [
    { title: 'Lead ID', dataIndex: 'id', key: 'id', width: 140, render: (id) => <Text strong style={{ color: '#1890ff' }}>{id}</Text> },
    { title: 'Name', key: 'name', width: 180, render: (_, record) => (
      <Space>
        <Avatar icon={<UserOutlined />} />
        <div>
          <div>{record.name}</div>
          <Text type="secondary" style={{ fontSize: 11 }}>{record.company}</Text>
        </div>
      </Space>
    ) },
    { title: 'Contact', key: 'contact', width: 200, render: (_, record) => (
      <div>
        <div><MailOutlined /> {record.email}</div>
        <Text type="secondary" style={{ fontSize: 11 }}><PhoneOutlined /> {record.phone}</Text>
      </div>
    ) },
    { title: 'Source', dataIndex: 'source', key: 'source', width: 120 },
    { title: 'Value', dataIndex: 'value', key: 'value', width: 120, align: 'right', render: (value) => <Text strong>${value.toLocaleString()}</Text> },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 120, render: (status) => { const config = getStatusConfig(status); return <Tag color={config.color}>{config.label}</Tag>; } },
    { title: 'Assigned To', dataIndex: 'assignedTo', key: 'assignedTo', width: 150 },
    { title: 'Actions', key: 'actions', width: 100, render: (_, record) => (
      <Space>
        <Tooltip title="View Details"><Button type="text" icon={<EyeOutlined />} onClick={() => { setSelectedLead(record); setDetailDrawerVisible(true); }} /></Tooltip>
        <Tooltip title="Edit"><Button type="text" icon={<EditOutlined />} /></Tooltip>
      </Space>
    ) },
  ];

  return (
    <div>
      <PageHeader title="Leads" subtitle={`${filteredLeads.length} leads`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'CRM', path: '/crm' }, { title: 'Leads', path: '/crm/leads' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />}>New Lead</Button>]} />
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}><StatCard title="Total Leads" value={totalLeads} icon={<UserOutlined style={{ fontSize: 24, color: '#1890ff' }} />} color="#1890ff" /></Col>
        <Col xs={24} sm={12} md={8}><StatCard title="New Leads" value={newLeads} icon={<ClockCircleOutlined style={{ fontSize: 24, color: '#faad14' }} />} color="#faad14" /></Col>
        <Col xs={24} sm={12} md={8}><StatCard title="Total Value" value={`$${totalValue.toLocaleString()}`} icon={<DollarOutlined style={{ fontSize: 24, color: '#52c41a' }} />} color="#52c41a" /></Col>
      </Row>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Search placeholder="Search leads..." allowClear style={{ width: 220 }} value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            <Select placeholder="Status" allowClear style={{ width: 130 }} value={filterStatus} onChange={setFilterStatus} options={leadStatuses.map(s => ({ label: s.label, value: s.value }))} />
          </Space>
        </div>
        <Table columns={columns} dataSource={filteredLeads} rowKey="id" loading={loading} scroll={{ x: 1200 }} pagination={{ pageSize: 10, showSizeChanger: true }} />
      </Card>
      <Drawer title="Lead Details" placement="right" width={700} open={detailDrawerVisible} onClose={() => setDetailDrawerVisible(false)}>
        {selectedLead && (
          <>
            <div style={{ marginBottom: 24 }}>
              <Space><Text strong style={{ fontSize: 20 }}>{selectedLead.name}</Text><Tag color={getStatusConfig(selectedLead.status).color}>{getStatusConfig(selectedLead.status).label}</Tag></Space>
            </div>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Company">{selectedLead.company}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedLead.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedLead.phone}</Descriptions.Item>
              <Descriptions.Item label="Source">{selectedLead.source}</Descriptions.Item>
              <Descriptions.Item label="Value">${selectedLead.value.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Assigned To">{selectedLead.assignedTo}</Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Drawer>
    </div>
  );
};

export default Leads;

