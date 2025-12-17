import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Input, Select, Tag, 
  Tooltip, Badge, message, Typography, Steps, Modal, Form,
  Drawer, Descriptions, Avatar, Timeline, InputNumber, Divider
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ExportOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  SwapOutlined,
  ShopOutlined,
  InboxOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  UserOutlined,
  SendOutlined,
  CarOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text, Title } = Typography;

// Mock transfer data
const mockTransfers = [
  {
    id: 'TRF-2024-015',
    date: '2024-01-15T10:00:00',
    fromBranch: 'Warehouse',
    toBranch: 'Main Branch',
    status: 'pending',
    priority: 'high',
    requestedBy: 'Store Manager',
    approvedBy: null,
    items: [
      { sku: 'APL-IP15PM-256', name: 'iPhone 15 Pro Max 256GB', quantity: 10, received: 0 },
      { sku: 'APL-APP2', name: 'AirPods Pro 2nd Generation', quantity: 15, received: 0 },
    ],
    totalItems: 25,
    notes: 'Urgent restock needed for weekend sale',
    expectedDate: '2024-01-16',
    createdAt: '2024-01-15T10:00:00',
  },
  {
    id: 'TRF-2024-014',
    date: '2024-01-14T14:30:00',
    fromBranch: 'Main Branch',
    toBranch: 'Downtown Store',
    status: 'in_transit',
    priority: 'normal',
    requestedBy: 'Downtown Manager',
    approvedBy: 'Admin',
    items: [
      { sku: 'SNY-WH1000XM5', name: 'Sony WH-1000XM5 Headphones', quantity: 8, received: 0 },
      { sku: 'LOG-MX-MASTER3S', name: 'Logitech MX Master 3S Mouse', quantity: 12, received: 0 },
    ],
    totalItems: 20,
    notes: 'Regular stock replenishment',
    expectedDate: '2024-01-15',
    shippedAt: '2024-01-14T16:00:00',
    createdAt: '2024-01-14T14:30:00',
  },
  {
    id: 'TRF-2024-013',
    date: '2024-01-13T09:00:00',
    fromBranch: 'Warehouse',
    toBranch: 'Downtown Store',
    status: 'received',
    priority: 'normal',
    requestedBy: 'Downtown Manager',
    approvedBy: 'Warehouse Manager',
    items: [
      { sku: 'SAM-GS24U-512', name: 'Samsung Galaxy S24 Ultra 512GB', quantity: 5, received: 5 },
      { sku: 'APL-MBP-M3-14', name: 'MacBook Pro 14" M3 Pro', quantity: 3, received: 3 },
    ],
    totalItems: 8,
    notes: 'New model release stock',
    expectedDate: '2024-01-14',
    shippedAt: '2024-01-13T11:00:00',
    receivedAt: '2024-01-14T09:30:00',
    createdAt: '2024-01-13T09:00:00',
  },
  {
    id: 'TRF-2024-012',
    date: '2024-01-12T11:00:00',
    fromBranch: 'Main Branch',
    toBranch: 'Warehouse',
    status: 'received',
    priority: 'low',
    requestedBy: 'Inventory Manager',
    approvedBy: 'Admin',
    items: [
      { sku: 'LOG-MX-MASTER3S', name: 'Logitech MX Master 3S Mouse', quantity: 20, received: 20 },
    ],
    totalItems: 20,
    notes: 'Return excess stock to warehouse',
    expectedDate: '2024-01-13',
    shippedAt: '2024-01-12T14:00:00',
    receivedAt: '2024-01-13T10:00:00',
    createdAt: '2024-01-12T11:00:00',
  },
  {
    id: 'TRF-2024-011',
    date: '2024-01-11T16:00:00',
    fromBranch: 'Warehouse',
    toBranch: 'Main Branch',
    status: 'cancelled',
    priority: 'normal',
    requestedBy: 'Store Manager',
    approvedBy: null,
    items: [
      { sku: 'DEL-XPS15-9530', name: 'Dell XPS 15 9530', quantity: 5, received: 0 },
    ],
    totalItems: 5,
    notes: 'Cancelled - insufficient warehouse stock',
    expectedDate: '2024-01-12',
    createdAt: '2024-01-11T16:00:00',
    cancelledAt: '2024-01-11T17:30:00',
    cancelReason: 'Out of stock at source location',
  },
];

const branches = ['Main Branch', 'Downtown Store', 'Warehouse', 'Mall Kiosk'];

const StockTransfers = () => {
  const [transfers, setTransfers] = useState(mockTransfers);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterBranch, setFilterBranch] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [form] = Form.useForm();

  // Calculate stats
  const totalTransfers = transfers.length;
  const pendingTransfers = transfers.filter(t => t.status === 'pending').length;
  const inTransitTransfers = transfers.filter(t => t.status === 'in_transit').length;
  const completedTransfers = transfers.filter(t => t.status === 'received').length;

  // Filter transfers
  const filteredTransfers = transfers.filter(transfer => {
    const matchesSearch = !searchText || 
      transfer.id.toLowerCase().includes(searchText.toLowerCase()) ||
      transfer.fromBranch.toLowerCase().includes(searchText.toLowerCase()) ||
      transfer.toBranch.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !filterStatus || transfer.status === filterStatus;
    const matchesBranch = !filterBranch || 
      transfer.fromBranch === filterBranch || 
      transfer.toBranch === filterBranch;
    return matchesSearch && matchesStatus && matchesBranch;
  });

  // Get status config
  const getStatusConfig = (status) => {
    const config = {
      pending: { color: 'warning', text: 'Pending', icon: <ClockCircleOutlined /> },
      approved: { color: 'processing', text: 'Approved', icon: <CheckOutlined /> },
      in_transit: { color: 'blue', text: 'In Transit', icon: <CarOutlined /> },
      received: { color: 'success', text: 'Received', icon: <CheckCircleOutlined /> },
      cancelled: { color: 'default', text: 'Cancelled', icon: <CloseOutlined /> },
    };
    return config[status] || config.pending;
  };

  // Table columns
  const columns = [
    {
      title: 'Transfer ID',
      dataIndex: 'id',
      key: 'id',
      width: 140,
      render: (id) => <Text strong style={{ color: '#1890ff' }}>{id}</Text>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (date) => dayjs(date).format('MMM D, YYYY'),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
    },
    {
      title: 'From',
      dataIndex: 'fromBranch',
      key: 'fromBranch',
      width: 140,
      render: (branch) => (
        <Space>
          <ShopOutlined />
          {branch}
        </Space>
      ),
    },
    {
      title: '',
      key: 'arrow',
      width: 50,
      align: 'center',
      render: () => <SwapOutlined style={{ color: '#1890ff' }} />,
    },
    {
      title: 'To',
      dataIndex: 'toBranch',
      key: 'toBranch',
      width: 140,
      render: (branch) => (
        <Space>
          <ShopOutlined />
          {branch}
        </Space>
      ),
    },
    {
      title: 'Items',
      dataIndex: 'totalItems',
      key: 'totalItems',
      width: 80,
      align: 'center',
      render: (total) => <Badge count={total} style={{ backgroundColor: '#1890ff' }} />,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      width: 100,
      render: (priority) => {
        const colors = { high: 'red', normal: 'blue', low: 'default' };
        return <Tag color={colors[priority]}>{priority.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color} icon={config.icon}>{config.text}</Tag>;
      },
    },
    {
      title: 'Expected Date',
      dataIndex: 'expectedDate',
      key: 'expectedDate',
      width: 120,
      render: (date, record) => {
        const isOverdue = record.status !== 'received' && 
          record.status !== 'cancelled' && 
          dayjs(date).isBefore(dayjs(), 'day');
        return (
          <Text type={isOverdue ? 'danger' : 'secondary'}>
            {dayjs(date).format('MMM D, YYYY')}
            {isOverdue && <Tag color="red" style={{ marginLeft: 4 }}>Overdue</Tag>}
          </Text>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button 
              type="text" 
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          {record.status === 'pending' && (
            <>
              <Tooltip title="Approve">
                <Button 
                  type="text" 
                  icon={<CheckOutlined style={{ color: '#52c41a' }} />}
                  onClick={() => handleApprove(record)}
                />
              </Tooltip>
              <Tooltip title="Cancel">
                <Button 
                  type="text" 
                  icon={<CloseOutlined style={{ color: '#ff4d4f' }} />}
                  onClick={() => handleCancel(record)}
                />
              </Tooltip>
            </>
          )}
          {record.status === 'in_transit' && (
            <Tooltip title="Mark Received">
              <Button 
                type="text" 
                icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                onClick={() => handleReceive(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  // Item columns for detail view
  const itemColumns = [
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      width: 150,
    },
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      align: 'center',
    },
    {
      title: 'Received',
      dataIndex: 'received',
      key: 'received',
      width: 100,
      align: 'center',
      render: (received, record) => (
        <Text type={received === record.quantity ? 'success' : 'warning'}>
          {received} / {record.quantity}
        </Text>
      ),
    },
  ];

  // Handlers
  const handleCreateTransfer = () => {
    form.resetFields();
    setDrawerVisible(true);
  };

  const handleViewDetails = (transfer) => {
    setSelectedTransfer(transfer);
    setDetailDrawerVisible(true);
  };

  const handleApprove = (transfer) => {
    setTransfers(transfers.map(t => 
      t.id === transfer.id ? { ...t, status: 'approved', approvedBy: 'Admin' } : t
    ));
    message.success(`Transfer ${transfer.id} approved`);
  };

  const handleCancel = (transfer) => {
    setTransfers(transfers.map(t => 
      t.id === transfer.id ? { ...t, status: 'cancelled', cancelledAt: new Date().toISOString() } : t
    ));
    message.warning(`Transfer ${transfer.id} cancelled`);
  };

  const handleReceive = (transfer) => {
    setTransfers(transfers.map(t => 
      t.id === transfer.id ? { 
        ...t, 
        status: 'received', 
        receivedAt: new Date().toISOString(),
        items: t.items.map(item => ({ ...item, received: item.quantity }))
      } : t
    ));
    message.success(`Transfer ${transfer.id} marked as received`);
  };

  const handleSaveTransfer = () => {
    form.validateFields().then(values => {
      const newTransfer = {
        id: `TRF-2024-${String(transfers.length + 16).padStart(3, '0')}`,
        date: new Date().toISOString(),
        ...values,
        status: 'pending',
        items: [],
        totalItems: 0,
        createdAt: new Date().toISOString(),
      };
      setTransfers([newTransfer, ...transfers]);
      message.success('Transfer request created');
      setDrawerVisible(false);
    });
  };

  // Form fields
  const formFields = [
    {
      name: 'fromBranch',
      label: 'From Branch',
      type: 'select',
      options: branches.map(b => ({ label: b, value: b })),
      rules: [{ required: true, message: 'Please select source branch' }],
      span: 12,
    },
    {
      name: 'toBranch',
      label: 'To Branch',
      type: 'select',
      options: branches.map(b => ({ label: b, value: b })),
      rules: [{ required: true, message: 'Please select destination branch' }],
      span: 12,
    },
    {
      name: 'priority',
      label: 'Priority',
      type: 'select',
      options: [
        { label: 'High', value: 'high' },
        { label: 'Normal', value: 'normal' },
        { label: 'Low', value: 'low' },
      ],
      initialValue: 'normal',
      span: 12,
    },
    {
      name: 'expectedDate',
      label: 'Expected Date',
      type: 'date',
      rules: [{ required: true, message: 'Please select expected date' }],
      span: 12,
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea',
      span: 24,
    },
  ];

  // Get current step
  const getCurrentStep = (status) => {
    const steps = ['pending', 'approved', 'in_transit', 'received'];
    if (status === 'cancelled') return -1;
    return steps.indexOf(status);
  };

  return (
    <div>
      <PageHeader
        title="Stock Transfers"
        subtitle={`${totalTransfers} transfers`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'Inventory', path: '/inventory' },
          { title: 'Transfers', path: '/inventory/transfers' },
        ]}
        actions={[
          <Button key="export" icon={<ExportOutlined />}>Export</Button>,
          <Button key="create" type="primary" icon={<PlusOutlined />} onClick={handleCreateTransfer}>
            New Transfer
          </Button>,
        ]}
      />

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Transfers"
            value={totalTransfers}
            icon={<SwapOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Pending"
            value={pendingTransfers}
            icon={<ClockCircleOutlined style={{ fontSize: 24, color: '#faad14' }} />}
            color="#faad14"
            warning={pendingTransfers > 0}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="In Transit"
            value={inTransitTransfers}
            icon={<CarOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Completed"
            value={completedTransfers}
            icon={<CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
            color="#52c41a"
          />
        </Col>
      </Row>

      {/* Filters and Table */}
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Space wrap>
            <Search
              placeholder="Search transfers..."
              allowClear
              style={{ width: 250 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              placeholder="Status"
              allowClear
              style={{ width: 140 }}
              value={filterStatus}
              onChange={setFilterStatus}
              options={[
                { label: 'Pending', value: 'pending' },
                { label: 'Approved', value: 'approved' },
                { label: 'In Transit', value: 'in_transit' },
                { label: 'Received', value: 'received' },
                { label: 'Cancelled', value: 'cancelled' },
              ]}
            />
            <Select
              placeholder="Branch"
              allowClear
              style={{ width: 150 }}
              value={filterBranch}
              onChange={setFilterBranch}
              options={branches.map(b => ({ label: b, value: b }))}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredTransfers}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1300 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} transfers`,
          }}
        />
      </Card>

      {/* Create Transfer Drawer */}
      <FormDrawer
        title="Create Stock Transfer"
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onSubmit={handleSaveTransfer}
        form={form}
        fields={formFields}
        width={600}
      />

      {/* Transfer Details Drawer */}
      <Drawer
        title="Transfer Details"
        placement="right"
        width={600}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        extra={
          selectedTransfer?.status === 'pending' && (
            <Space>
              <Button onClick={() => handleCancel(selectedTransfer)}>Cancel</Button>
              <Button type="primary" onClick={() => handleApprove(selectedTransfer)}>Approve</Button>
            </Space>
          )
        }
      >
        {selectedTransfer && (
          <>
            <div style={{ marginBottom: 24 }}>
              <Space>
                <Text strong style={{ fontSize: 18 }}>{selectedTransfer.id}</Text>
                <Tag color={getStatusConfig(selectedTransfer.status).color}>
                  {getStatusConfig(selectedTransfer.status).text}
                </Tag>
                <Tag color={
                  selectedTransfer.priority === 'high' ? 'red' : 
                  selectedTransfer.priority === 'low' ? 'default' : 'blue'
                }>
                  {selectedTransfer.priority.toUpperCase()}
                </Tag>
              </Space>
            </div>

            {/* Progress Steps */}
            {selectedTransfer.status !== 'cancelled' && (
              <Steps
                current={getCurrentStep(selectedTransfer.status)}
                size="small"
                style={{ marginBottom: 24 }}
                items={[
                  { title: 'Pending', icon: <ClockCircleOutlined /> },
                  { title: 'Approved', icon: <CheckOutlined /> },
                  { title: 'In Transit', icon: <CarOutlined /> },
                  { title: 'Received', icon: <CheckCircleOutlined /> },
                ]}
              />
            )}

            <Descriptions column={2} bordered size="small" style={{ marginBottom: 24 }}>
              <Descriptions.Item label="From Branch">
                <Space>
                  <ShopOutlined />
                  {selectedTransfer.fromBranch}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="To Branch">
                <Space>
                  <ShopOutlined />
                  {selectedTransfer.toBranch}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Requested By">
                <Space>
                  <Avatar size="small" icon={<UserOutlined />} />
                  {selectedTransfer.requestedBy}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Approved By">
                {selectedTransfer.approvedBy || <Text type="secondary">Pending</Text>}
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {dayjs(selectedTransfer.createdAt).format('MMM D, YYYY h:mm A')}
              </Descriptions.Item>
              <Descriptions.Item label="Expected Date">
                {dayjs(selectedTransfer.expectedDate).format('MMM D, YYYY')}
              </Descriptions.Item>
            </Descriptions>

            {selectedTransfer.notes && (
              <>
                <Title level={5}>Notes</Title>
                <Text type="secondary">{selectedTransfer.notes}</Text>
                <Divider />
              </>
            )}

            <Title level={5}>Transfer Items ({selectedTransfer.totalItems})</Title>
            <Table
              columns={itemColumns}
              dataSource={selectedTransfer.items}
              rowKey="sku"
              pagination={false}
              size="small"
            />

            {/* Timeline */}
            <Divider />
            <Title level={5}>Activity Log</Title>
            <Timeline
              items={[
                {
                  color: 'blue',
                  children: (
                    <>
                      <Text strong>Transfer Requested</Text>
                      <br />
                      <Text type="secondary">
                        {dayjs(selectedTransfer.createdAt).format('MMM D, YYYY h:mm A')}
                      </Text>
                    </>
                  ),
                },
                ...(selectedTransfer.approvedBy ? [{
                  color: 'green',
                  children: (
                    <>
                      <Text strong>Approved by {selectedTransfer.approvedBy}</Text>
                      <br />
                      <Text type="secondary">Approved</Text>
                    </>
                  ),
                }] : []),
                ...(selectedTransfer.shippedAt ? [{
                  color: 'blue',
                  children: (
                    <>
                      <Text strong>Shipped</Text>
                      <br />
                      <Text type="secondary">
                        {dayjs(selectedTransfer.shippedAt).format('MMM D, YYYY h:mm A')}
                      </Text>
                    </>
                  ),
                }] : []),
                ...(selectedTransfer.receivedAt ? [{
                  color: 'green',
                  children: (
                    <>
                      <Text strong>Received</Text>
                      <br />
                      <Text type="secondary">
                        {dayjs(selectedTransfer.receivedAt).format('MMM D, YYYY h:mm A')}
                      </Text>
                    </>
                  ),
                }] : []),
                ...(selectedTransfer.cancelledAt ? [{
                  color: 'red',
                  children: (
                    <>
                      <Text strong>Cancelled</Text>
                      <br />
                      <Text type="secondary">{selectedTransfer.cancelReason}</Text>
                      <br />
                      <Text type="secondary">
                        {dayjs(selectedTransfer.cancelledAt).format('MMM D, YYYY h:mm A')}
                      </Text>
                    </>
                  ),
                }] : []),
              ]}
            />
          </>
        )}
      </Drawer>
    </div>
  );
};

export default StockTransfers;
