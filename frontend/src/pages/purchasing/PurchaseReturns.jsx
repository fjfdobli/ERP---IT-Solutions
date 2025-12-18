import { useState } from 'react';
import { Row, Col, Card, Table, Button, Space, Input, Select, Tag, Tooltip, message, Typography, DatePicker, Drawer, Descriptions } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EyeOutlined, EditOutlined, UndoOutlined, DollarOutlined, WarningOutlined } from '@ant-design/icons';
import { PageHeader, StatCard } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;
const { RangePicker } = DatePicker;

const mockReturns = [
  { id: 'PRT-2024-00015', date: '2024-01-15', supplier: 'Apple Philippines', poNumber: 'PO-2024-00125', items: 2, amount: 500, status: 'pending', reason: 'Defective items' },
];

const returnStatuses = [
  { value: 'pending', label: 'Pending', color: 'default' },
  { value: 'approved', label: 'Approved', color: 'success' },
  { value: 'rejected', label: 'Rejected', color: 'error' },
  { value: 'completed', label: 'Completed', color: 'cyan' },
];

const PurchaseReturns = () => {
  const [returns, setReturns] = useState(mockReturns);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);

  const totalReturns = returns.length;
  const pendingReturns = returns.filter(r => r.status === 'pending').length;
  const totalAmount = returns.reduce((sum, r) => sum + r.amount, 0);

  const filteredReturns = returns.filter(ret => {
    const matchesSearch = !searchText || ret.id.toLowerCase().includes(searchText.toLowerCase()) || ret.supplier.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !filterStatus || ret.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status) => returnStatuses.find(s => s.value === status) || returnStatuses[0];

  const columns = [
    { title: 'Return ID', dataIndex: 'id', key: 'id', width: 140, render: (id) => <Text strong style={{ color: '#1890ff' }}>{id}</Text> },
    { title: 'Date', dataIndex: 'date', key: 'date', width: 110, render: (date) => dayjs(date).format('MMM D, YYYY') },
    { title: 'Supplier', dataIndex: 'supplier', key: 'supplier', width: 180 },
    { title: 'PO Number', dataIndex: 'poNumber', key: 'poNumber', width: 140 },
    { title: 'Items', dataIndex: 'items', key: 'items', width: 80, align: 'center' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', width: 120, align: 'right', render: (amount) => <Text strong>${amount.toFixed(2)}</Text> },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 120, render: (status) => { const config = getStatusConfig(status); return <Tag color={config.color}>{config.label}</Tag>; } },
    { title: 'Actions', key: 'actions', width: 100, render: (_, record) => (
      <Space>
        <Tooltip title="View Details"><Button type="text" icon={<EyeOutlined />} /></Tooltip>
      </Space>
    ) },
  ];

  return (
    <div>
      <PageHeader title="Purchase Returns" subtitle={`${filteredReturns.length} returns`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Purchasing', path: '/purchasing' }, { title: 'Returns', path: '/purchasing/returns' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />}>New Return</Button>]} />
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8}><StatCard title="Total Returns" value={totalReturns} icon={<UndoOutlined style={{ fontSize: 24, color: '#1890ff' }} />} color="#1890ff" /></Col>
        <Col xs={24} sm={12} md={8}><StatCard title="Pending" value={pendingReturns} icon={<WarningOutlined style={{ fontSize: 24, color: '#faad14' }} />} color="#faad14" /></Col>
        <Col xs={24} sm={12} md={8}><StatCard title="Total Amount" value={`$${totalAmount.toFixed(2)}`} icon={<DollarOutlined style={{ fontSize: 24, color: '#52c41a' }} />} color="#52c41a" /></Col>
      </Row>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Search placeholder="Search returns..." allowClear style={{ width: 220 }} value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            <Select placeholder="Status" allowClear style={{ width: 130 }} value={filterStatus} onChange={setFilterStatus} options={returnStatuses.map(s => ({ label: s.label, value: s.value }))} />
          </Space>
        </div>
        <Table columns={columns} dataSource={filteredReturns} rowKey="id" loading={loading} pagination={{ pageSize: 10, showSizeChanger: true }} />
      </Card>
    </div>
  );
};

export default PurchaseReturns;

