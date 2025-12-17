import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Input, Select, Tag, 
  Tooltip, Badge, message, Typography, Modal, Form, InputNumber,
  Drawer, Descriptions, Avatar, Divider
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ExportOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  ToolOutlined,
  InboxOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  UserOutlined,
  ShopOutlined,
  MinusOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer, ConfirmModal } from '../../components/Common';
import dayjs from 'dayjs';

const { Search, TextArea } = Input;
const { Text, Title } = Typography;

// Mock adjustment data
const mockAdjustments = [
  {
    id: 'ADJ-2024-008',
    date: '2024-01-15T14:30:00',
    type: 'decrease',
    reason: 'damaged',
    branch: 'Main Branch',
    status: 'pending',
    items: [
      { sku: 'APL-IP15PM-256', name: 'iPhone 15 Pro Max 256GB', currentQty: 27, adjustQty: -1, newQty: 26 },
    ],
    totalItems: 1,
    totalValue: -1099.00,
    notes: 'Screen cracked during display setup',
    createdBy: 'Store Staff',
    approvedBy: null,
    createdAt: '2024-01-15T14:30:00',
  },
  {
    id: 'ADJ-2024-007',
    date: '2024-01-14T16:00:00',
    type: 'decrease',
    reason: 'theft',
    branch: 'Downtown Store',
    status: 'approved',
    items: [
      { sku: 'APL-APP2', name: 'AirPods Pro 2nd Generation', currentQty: 15, adjustQty: -2, newQty: 13 },
    ],
    totalItems: 2,
    totalValue: -360.00,
    notes: 'Inventory discrepancy discovered during audit',
    createdBy: 'Store Manager',
    approvedBy: 'Admin',
    createdAt: '2024-01-14T16:00:00',
    approvedAt: '2024-01-14T17:00:00',
  },
  {
    id: 'ADJ-2024-006',
    date: '2024-01-13T10:00:00',
    type: 'increase',
    reason: 'found',
    branch: 'Warehouse',
    status: 'approved',
    items: [
      { sku: 'LOG-MX-MASTER3S', name: 'Logitech MX Master 3S Mouse', currentQty: 118, adjustQty: 5, newQty: 123 },
    ],
    totalItems: 5,
    totalValue: 375.00,
    notes: 'Found during warehouse reorganization',
    createdBy: 'Warehouse Staff',
    approvedBy: 'Warehouse Manager',
    createdAt: '2024-01-13T10:00:00',
    approvedAt: '2024-01-13T11:30:00',
  },
  {
    id: 'ADJ-2024-005',
    date: '2024-01-12T09:00:00',
    type: 'decrease',
    reason: 'expired',
    branch: 'Main Branch',
    status: 'approved',
    items: [
      { sku: 'ACC-BATT-AA4', name: 'AA Batteries 4-Pack', currentQty: 50, adjustQty: -10, newQty: 40 },
    ],
    totalItems: 10,
    totalValue: -89.90,
    notes: 'Expired batteries removed from inventory',
    createdBy: 'Inventory Manager',
    approvedBy: 'Admin',
    createdAt: '2024-01-12T09:00:00',
    approvedAt: '2024-01-12T10:00:00',
  },
  {
    id: 'ADJ-2024-004',
    date: '2024-01-11T15:30:00',
    type: 'increase',
    reason: 'count_adjustment',
    branch: 'Downtown Store',
    status: 'rejected',
    items: [
      { sku: 'SAM-GS24U-512', name: 'Samsung Galaxy S24 Ultra 512GB', currentQty: 10, adjustQty: 2, newQty: 12 },
    ],
    totalItems: 2,
    totalValue: 1798.00,
    notes: 'Physical count shows 2 more than system',
    createdBy: 'Store Staff',
    approvedBy: null,
    rejectedBy: 'Admin',
    createdAt: '2024-01-11T15:30:00',
    rejectedAt: '2024-01-11T17:00:00',
    rejectReason: 'Insufficient documentation. Please provide count sheet.',
  },
];

const adjustmentReasons = [
  { value: 'damaged', label: 'Damaged', type: 'decrease' },
  { value: 'theft', label: 'Theft/Loss', type: 'decrease' },
  { value: 'expired', label: 'Expired', type: 'decrease' },
  { value: 'write_off', label: 'Write Off', type: 'decrease' },
  { value: 'found', label: 'Found/Recovered', type: 'increase' },
  { value: 'count_adjustment', label: 'Count Adjustment', type: 'both' },
  { value: 'correction', label: 'Data Correction', type: 'both' },
  { value: 'sample', label: 'Sample/Demo', type: 'decrease' },
];

const branches = ['Main Branch', 'Downtown Store', 'Warehouse'];

const StockAdjustments = () => {
  const [adjustments, setAdjustments] = useState(mockAdjustments);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedAdjustment, setSelectedAdjustment] = useState(null);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [form] = Form.useForm();

  // Calculate stats
  const totalAdjustments = adjustments.length;
  const pendingAdjustments = adjustments.filter(a => a.status === 'pending').length;
  const totalIncrease = adjustments.filter(a => a.type === 'increase' && a.status === 'approved')
    .reduce((sum, a) => sum + a.totalItems, 0);
  const totalDecrease = Math.abs(adjustments.filter(a => a.type === 'decrease' && a.status === 'approved')
    .reduce((sum, a) => sum + a.totalItems, 0));

  // Filter adjustments
  const filteredAdjustments = adjustments.filter(adjustment => {
    const matchesSearch = !searchText || 
      adjustment.id.toLowerCase().includes(searchText.toLowerCase()) ||
      adjustment.items.some(i => i.name.toLowerCase().includes(searchText.toLowerCase()));
    const matchesStatus = !filterStatus || adjustment.status === filterStatus;
    const matchesType = !filterType || adjustment.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Get status config
  const getStatusConfig = (status) => {
    const config = {
      pending: { color: 'warning', text: 'Pending', icon: <ClockCircleOutlined /> },
      approved: { color: 'success', text: 'Approved', icon: <CheckCircleOutlined /> },
      rejected: { color: 'error', text: 'Rejected', icon: <CloseOutlined /> },
    };
    return config[status] || config.pending;
  };

  // Table columns
  const columns = [
    {
      title: 'Adjustment ID',
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
      defaultSortOrder: 'descend',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => (
        <Tag 
          color={type === 'increase' ? 'green' : 'red'}
          icon={type === 'increase' ? <PlusOutlined /> : <MinusOutlined />}
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      width: 140,
      render: (reason) => {
        const reasonConfig = adjustmentReasons.find(r => r.value === reason);
        return <Tag>{reasonConfig?.label || reason}</Tag>;
      },
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
      key: 'branch',
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
      key: 'items',
      width: 200,
      render: (_, record) => (
        <div>
          {record.items.slice(0, 2).map((item, idx) => (
            <div key={idx}>
              <Text style={{ fontSize: 12 }}>{item.name}</Text>
              <Text type="secondary" style={{ fontSize: 11 }}> ({item.adjustQty > 0 ? '+' : ''}{item.adjustQty})</Text>
            </div>
          ))}
          {record.items.length > 2 && (
            <Text type="secondary" style={{ fontSize: 11 }}>+{record.items.length - 2} more</Text>
          )}
        </div>
      ),
    },
    {
      title: 'Qty Change',
      dataIndex: 'totalItems',
      key: 'totalItems',
      width: 100,
      align: 'center',
      render: (total, record) => (
        <Text strong style={{ color: record.type === 'increase' ? '#52c41a' : '#ff4d4f', fontSize: 16 }}>
          {record.type === 'increase' ? '+' : '-'}{Math.abs(total)}
        </Text>
      ),
    },
    {
      title: 'Value Impact',
      dataIndex: 'totalValue',
      key: 'totalValue',
      width: 120,
      align: 'right',
      render: (value) => (
        <Text strong style={{ color: value >= 0 ? '#52c41a' : '#ff4d4f' }}>
          {value >= 0 ? '+' : ''}${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color} icon={config.icon}>{config.text}</Tag>;
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
              <Tooltip title="Reject">
                <Button 
                  type="text" 
                  icon={<CloseOutlined style={{ color: '#ff4d4f' }} />}
                  onClick={() => handleRejectClick(record)}
                />
              </Tooltip>
            </>
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
      title: 'Before',
      dataIndex: 'currentQty',
      key: 'currentQty',
      width: 80,
      align: 'center',
    },
    {
      title: 'Adjust',
      dataIndex: 'adjustQty',
      key: 'adjustQty',
      width: 80,
      align: 'center',
      render: (qty) => (
        <Text strong style={{ color: qty > 0 ? '#52c41a' : '#ff4d4f' }}>
          {qty > 0 ? '+' : ''}{qty}
        </Text>
      ),
    },
    {
      title: 'After',
      dataIndex: 'newQty',
      key: 'newQty',
      width: 80,
      align: 'center',
      render: (qty) => <Text strong>{qty}</Text>,
    },
  ];

  // Handlers
  const handleCreateAdjustment = () => {
    form.resetFields();
    setDrawerVisible(true);
  };

  const handleViewDetails = (adjustment) => {
    setSelectedAdjustment(adjustment);
    setDetailDrawerVisible(true);
  };

  const handleApprove = (adjustment) => {
    setAdjustments(adjustments.map(a => 
      a.id === adjustment.id ? { 
        ...a, 
        status: 'approved', 
        approvedBy: 'Admin',
        approvedAt: new Date().toISOString()
      } : a
    ));
    message.success(`Adjustment ${adjustment.id} approved`);
  };

  const handleRejectClick = (adjustment) => {
    setSelectedAdjustment(adjustment);
    setRejectReason('');
    setRejectModalVisible(true);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      message.error('Please provide a reason for rejection');
      return;
    }
    setAdjustments(adjustments.map(a => 
      a.id === selectedAdjustment.id ? { 
        ...a, 
        status: 'rejected', 
        rejectedBy: 'Admin',
        rejectedAt: new Date().toISOString(),
        rejectReason: rejectReason
      } : a
    ));
    setRejectModalVisible(false);
    message.warning(`Adjustment ${selectedAdjustment.id} rejected`);
  };

  const handleSaveAdjustment = () => {
    form.validateFields().then(values => {
      const newAdjustment = {
        id: `ADJ-2024-${String(adjustments.length + 9).padStart(3, '0')}`,
        date: new Date().toISOString(),
        ...values,
        status: 'pending',
        items: [],
        totalItems: 0,
        totalValue: 0,
        createdBy: 'Current User',
        createdAt: new Date().toISOString(),
      };
      setAdjustments([newAdjustment, ...adjustments]);
      message.success('Adjustment created successfully');
      setDrawerVisible(false);
    });
  };

  // Form fields
  const formFields = [
    {
      name: 'type',
      label: 'Adjustment Type',
      type: 'select',
      options: [
        { label: 'Increase', value: 'increase' },
        { label: 'Decrease', value: 'decrease' },
      ],
      rules: [{ required: true, message: 'Please select type' }],
      span: 12,
    },
    {
      name: 'reason',
      label: 'Reason',
      type: 'select',
      options: adjustmentReasons.map(r => ({ label: r.label, value: r.value })),
      rules: [{ required: true, message: 'Please select reason' }],
      span: 12,
    },
    {
      name: 'branch',
      label: 'Branch',
      type: 'select',
      options: branches.map(b => ({ label: b, value: b })),
      rules: [{ required: true, message: 'Please select branch' }],
      span: 24,
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea',
      rules: [{ required: true, message: 'Please provide notes' }],
      span: 24,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Stock Adjustments"
        subtitle={`${totalAdjustments} adjustments`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'Inventory', path: '/inventory' },
          { title: 'Adjustments', path: '/inventory/adjustments' },
        ]}
        actions={[
          <Button key="export" icon={<ExportOutlined />}>Export</Button>,
          <Button key="create" type="primary" icon={<PlusOutlined />} onClick={handleCreateAdjustment}>
            New Adjustment
          </Button>,
        ]}
      />

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Adjustments"
            value={totalAdjustments}
            icon={<ToolOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Pending Approval"
            value={pendingAdjustments}
            icon={<ClockCircleOutlined style={{ fontSize: 24, color: '#faad14' }} />}
            color="#faad14"
            warning={pendingAdjustments > 0}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Units Added"
            value={totalIncrease}
            icon={<PlusOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Units Removed"
            value={totalDecrease}
            icon={<MinusOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />}
            color="#ff4d4f"
          />
        </Col>
      </Row>

      {/* Filters and Table */}
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Space wrap>
            <Search
              placeholder="Search adjustments..."
              allowClear
              style={{ width: 250 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              placeholder="Status"
              allowClear
              style={{ width: 130 }}
              value={filterStatus}
              onChange={setFilterStatus}
              options={[
                { label: 'Pending', value: 'pending' },
                { label: 'Approved', value: 'approved' },
                { label: 'Rejected', value: 'rejected' },
              ]}
            />
            <Select
              placeholder="Type"
              allowClear
              style={{ width: 120 }}
              value={filterType}
              onChange={setFilterType}
              options={[
                { label: 'Increase', value: 'increase' },
                { label: 'Decrease', value: 'decrease' },
              ]}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredAdjustments}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1400 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} adjustments`,
          }}
        />
      </Card>

      {/* Create Adjustment Drawer */}
      <FormDrawer
        title="Create Stock Adjustment"
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onSubmit={handleSaveAdjustment}
        form={form}
        fields={formFields}
        width={600}
      />

      {/* Adjustment Details Drawer */}
      <Drawer
        title="Adjustment Details"
        placement="right"
        width={600}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        extra={
          selectedAdjustment?.status === 'pending' && (
            <Space>
              <Button onClick={() => {
                setDetailDrawerVisible(false);
                handleRejectClick(selectedAdjustment);
              }}>Reject</Button>
              <Button type="primary" onClick={() => {
                handleApprove(selectedAdjustment);
                setDetailDrawerVisible(false);
              }}>Approve</Button>
            </Space>
          )
        }
      >
        {selectedAdjustment && (
          <>
            <div style={{ marginBottom: 24 }}>
              <Space>
                <Text strong style={{ fontSize: 18 }}>{selectedAdjustment.id}</Text>
                <Tag color={getStatusConfig(selectedAdjustment.status).color}>
                  {getStatusConfig(selectedAdjustment.status).text}
                </Tag>
                <Tag color={selectedAdjustment.type === 'increase' ? 'green' : 'red'}>
                  {selectedAdjustment.type.toUpperCase()}
                </Tag>
              </Space>
            </div>

            <Descriptions column={2} bordered size="small" style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Date">
                {dayjs(selectedAdjustment.date).format('MMM D, YYYY h:mm A')}
              </Descriptions.Item>
              <Descriptions.Item label="Branch">
                <Space>
                  <ShopOutlined />
                  {selectedAdjustment.branch}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Reason">
                {adjustmentReasons.find(r => r.value === selectedAdjustment.reason)?.label}
              </Descriptions.Item>
              <Descriptions.Item label="Created By">
                <Space>
                  <Avatar size="small" icon={<UserOutlined />} />
                  {selectedAdjustment.createdBy}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Total Qty Change">
                <Text strong style={{ 
                  color: selectedAdjustment.type === 'increase' ? '#52c41a' : '#ff4d4f',
                  fontSize: 16
                }}>
                  {selectedAdjustment.type === 'increase' ? '+' : '-'}
                  {Math.abs(selectedAdjustment.totalItems)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Value Impact">
                <Text strong style={{ 
                  color: selectedAdjustment.totalValue >= 0 ? '#52c41a' : '#ff4d4f',
                  fontSize: 16
                }}>
                  {selectedAdjustment.totalValue >= 0 ? '+' : ''}
                  ${selectedAdjustment.totalValue.toFixed(2)}
                </Text>
              </Descriptions.Item>
              {selectedAdjustment.approvedBy && (
                <Descriptions.Item label="Approved By" span={2}>
                  <Space>
                    <Avatar size="small" icon={<UserOutlined />} />
                    {selectedAdjustment.approvedBy}
                    <Text type="secondary">
                      ({dayjs(selectedAdjustment.approvedAt).format('MMM D, h:mm A')})
                    </Text>
                  </Space>
                </Descriptions.Item>
              )}
              {selectedAdjustment.rejectedBy && (
                <>
                  <Descriptions.Item label="Rejected By" span={2}>
                    <Space>
                      <Avatar size="small" icon={<UserOutlined />} />
                      {selectedAdjustment.rejectedBy}
                      <Text type="secondary">
                        ({dayjs(selectedAdjustment.rejectedAt).format('MMM D, h:mm A')})
                      </Text>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Rejection Reason" span={2}>
                    <Text type="danger">{selectedAdjustment.rejectReason}</Text>
                  </Descriptions.Item>
                </>
              )}
            </Descriptions>

            {selectedAdjustment.notes && (
              <>
                <Title level={5}>Notes</Title>
                <Card size="small" style={{ marginBottom: 24, backgroundColor: '#fafafa' }}>
                  <Space>
                    <FileTextOutlined />
                    <Text>{selectedAdjustment.notes}</Text>
                  </Space>
                </Card>
              </>
            )}

            <Title level={5}>Adjusted Items</Title>
            <Table
              columns={itemColumns}
              dataSource={selectedAdjustment.items}
              rowKey="sku"
              pagination={false}
              size="small"
            />
          </>
        )}
      </Drawer>

      {/* Reject Modal */}
      <Modal
        title="Reject Adjustment"
        open={rejectModalVisible}
        onOk={handleReject}
        onCancel={() => setRejectModalVisible(false)}
        okText="Reject"
        okButtonProps={{ danger: true }}
      >
        <p>Please provide a reason for rejecting adjustment <strong>{selectedAdjustment?.id}</strong>:</p>
        <TextArea
          rows={4}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Enter rejection reason..."
        />
      </Modal>
    </div>
  );
};

export default StockAdjustments;
