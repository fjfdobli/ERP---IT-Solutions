import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Input, Select, Tag, 
  Tooltip, Badge, message, Typography, Progress, Steps, Timeline,
  Drawer, Descriptions, Avatar, Divider, Modal, Form
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ExportOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  UserOutlined,
  ShopOutlined,
  InboxOutlined,
  CalendarOutlined,
  AuditOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer } from '../../components/Common';
import dayjs from 'dayjs';

const { Search, TextArea } = Input;
const { Text, Title } = Typography;

// Mock count data
const mockCounts = [
  {
    id: 'CNT-2024-005',
    name: 'Monthly Full Count - January',
    type: 'full',
    branch: 'Main Branch',
    status: 'in_progress',
    scheduledDate: '2024-01-15',
    startedAt: '2024-01-15T09:00:00',
    completedAt: null,
    totalItems: 250,
    countedItems: 175,
    variance: { items: 3, value: -450.00 },
    assignedTo: ['John Smith', 'Jane Doe'],
    createdBy: 'Admin',
    zones: [
      { name: 'Zone A - Electronics', items: 80, counted: 80, status: 'completed', variance: 1 },
      { name: 'Zone B - Accessories', items: 100, counted: 75, status: 'in_progress', variance: 2 },
      { name: 'Zone C - Computers', items: 70, counted: 20, status: 'in_progress', variance: 0 },
    ],
    notes: 'Monthly inventory count for all products',
  },
  {
    id: 'CNT-2024-004',
    name: 'Spot Check - High Value Items',
    type: 'spot',
    branch: 'Downtown Store',
    status: 'completed',
    scheduledDate: '2024-01-14',
    startedAt: '2024-01-14T14:00:00',
    completedAt: '2024-01-14T16:30:00',
    totalItems: 25,
    countedItems: 25,
    variance: { items: 1, value: -899.00 },
    assignedTo: ['Mike Johnson'],
    createdBy: 'Store Manager',
    zones: [
      { name: 'High Value Cabinet', items: 25, counted: 25, status: 'completed', variance: 1 },
    ],
    notes: 'Random spot check on high-value smartphones',
  },
  {
    id: 'CNT-2024-003',
    name: 'Category Count - Cables & Adapters',
    type: 'category',
    branch: 'Warehouse',
    status: 'completed',
    scheduledDate: '2024-01-12',
    startedAt: '2024-01-12T10:00:00',
    completedAt: '2024-01-12T14:00:00',
    totalItems: 150,
    countedItems: 150,
    variance: { items: 0, value: 0 },
    assignedTo: ['Sarah Wilson', 'Tom Brown'],
    createdBy: 'Warehouse Manager',
    zones: [
      { name: 'Aisle 3 - USB Cables', items: 50, counted: 50, status: 'completed', variance: 0 },
      { name: 'Aisle 4 - HDMI Cables', items: 50, counted: 50, status: 'completed', variance: 0 },
      { name: 'Aisle 5 - Adapters', items: 50, counted: 50, status: 'completed', variance: 0 },
    ],
    notes: 'Quarterly count for cables category',
  },
  {
    id: 'CNT-2024-002',
    name: 'Annual Inventory Count',
    type: 'full',
    branch: 'All Branches',
    status: 'scheduled',
    scheduledDate: '2024-01-20',
    startedAt: null,
    completedAt: null,
    totalItems: 1200,
    countedItems: 0,
    variance: { items: 0, value: 0 },
    assignedTo: ['All Staff'],
    createdBy: 'Admin',
    zones: [],
    notes: 'Annual full inventory count for year-end audit',
  },
  {
    id: 'CNT-2024-001',
    name: 'Discrepancy Recount',
    type: 'recount',
    branch: 'Main Branch',
    status: 'cancelled',
    scheduledDate: '2024-01-10',
    startedAt: null,
    completedAt: null,
    totalItems: 15,
    countedItems: 0,
    variance: { items: 0, value: 0 },
    assignedTo: ['John Smith'],
    createdBy: 'Admin',
    cancelledBy: 'Admin',
    cancelReason: 'Issue resolved through stock adjustment',
    zones: [],
    notes: 'Recount for items showing variance',
  },
];

const countTypes = [
  { value: 'full', label: 'Full Count', icon: <InboxOutlined />, color: '#1890ff' },
  { value: 'category', label: 'Category Count', icon: <AuditOutlined />, color: '#722ed1' },
  { value: 'spot', label: 'Spot Check', icon: <SearchOutlined />, color: '#faad14' },
  { value: 'recount', label: 'Recount', icon: <SyncOutlined />, color: '#fa541c' },
];

const branches = ['Main Branch', 'Downtown Store', 'Warehouse', 'All Branches'];

const StockCounts = () => {
  const [counts, setCounts] = useState(mockCounts);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterType, setFilterType] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedCount, setSelectedCount] = useState(null);
  const [form] = Form.useForm();

  // Calculate stats
  const totalCounts = counts.length;
  const inProgressCounts = counts.filter(c => c.status === 'in_progress').length;
  const scheduledCounts = counts.filter(c => c.status === 'scheduled').length;
  const accuracyRate = counts.filter(c => c.status === 'completed').length > 0
    ? ((counts.filter(c => c.status === 'completed' && c.variance.items === 0).length / 
        counts.filter(c => c.status === 'completed').length) * 100).toFixed(1)
    : 100;

  // Filter counts
  const filteredCounts = counts.filter(count => {
    const matchesSearch = !searchText || 
      count.id.toLowerCase().includes(searchText.toLowerCase()) ||
      count.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !filterStatus || count.status === filterStatus;
    const matchesType = !filterType || count.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Get status config
  const getStatusConfig = (status) => {
    const config = {
      scheduled: { color: 'default', text: 'Scheduled', icon: <CalendarOutlined /> },
      in_progress: { color: 'processing', text: 'In Progress', icon: <SyncOutlined spin /> },
      completed: { color: 'success', text: 'Completed', icon: <CheckCircleOutlined /> },
      cancelled: { color: 'error', text: 'Cancelled', icon: <CloseOutlined /> },
    };
    return config[status] || config.scheduled;
  };

  // Get type config
  const getTypeConfig = (type) => {
    return countTypes.find(t => t.value === type) || countTypes[0];
  };

  // Table columns
  const columns = [
    {
      title: 'Count ID',
      dataIndex: 'id',
      key: 'id',
      width: 130,
      render: (id) => <Text strong style={{ color: '#1890ff' }}>{id}</Text>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 220,
      render: (name, record) => (
        <div>
          <Text strong>{name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            <ShopOutlined /> {record.branch}
          </Text>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 130,
      render: (type) => {
        const config = getTypeConfig(type);
        return <Tag color={config.color} icon={config.icon}>{config.label}</Tag>;
      },
    },
    {
      title: 'Scheduled',
      dataIndex: 'scheduledDate',
      key: 'scheduledDate',
      width: 120,
      render: (date) => dayjs(date).format('MMM D, YYYY'),
      sorter: (a, b) => dayjs(a.scheduledDate).unix() - dayjs(b.scheduledDate).unix(),
    },
    {
      title: 'Progress',
      key: 'progress',
      width: 200,
      render: (_, record) => {
        const percent = record.totalItems > 0 
          ? Math.round((record.countedItems / record.totalItems) * 100) 
          : 0;
        return (
          <div>
            <Progress 
              percent={percent} 
              size="small" 
              status={record.status === 'in_progress' ? 'active' : undefined}
              strokeColor={record.status === 'completed' ? '#52c41a' : undefined}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.countedItems} / {record.totalItems} items
            </Text>
          </div>
        );
      },
    },
    {
      title: 'Variance',
      key: 'variance',
      width: 120,
      render: (_, record) => {
        if (record.status !== 'completed') return <Text type="secondary">—</Text>;
        const hasVariance = record.variance.items > 0;
        return (
          <div>
            <Badge 
              status={hasVariance ? 'error' : 'success'} 
              text={<Text>{record.variance.items} items</Text>}
            />
            {hasVariance && (
              <div>
                <Text type="danger" style={{ fontSize: 12 }}>
                  ${record.variance.value.toFixed(2)}
                </Text>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      width: 150,
      render: (assigned) => (
        <Avatar.Group maxCount={3} size="small">
          {assigned.map((name, idx) => (
            <Tooltip key={idx} title={name}>
              <Avatar size="small" icon={<UserOutlined />} />
            </Tooltip>
          ))}
        </Avatar.Group>
      ),
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
          {record.status === 'scheduled' && (
            <Tooltip title="Start Count">
              <Button 
                type="text" 
                icon={<PlayCircleOutlined style={{ color: '#52c41a' }} />}
                onClick={() => handleStartCount(record)}
              />
            </Tooltip>
          )}
          {record.status === 'in_progress' && (
            <Tooltip title="Enter Counts">
              <Button 
                type="text" 
                icon={<EditOutlined style={{ color: '#1890ff' }} />}
                onClick={() => handleEnterCounts(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  // Zone columns
  const zoneColumns = [
    {
      title: 'Zone',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      width: 80,
      align: 'center',
    },
    {
      title: 'Counted',
      dataIndex: 'counted',
      key: 'counted',
      width: 80,
      align: 'center',
    },
    {
      title: 'Progress',
      key: 'progress',
      width: 150,
      render: (_, record) => {
        const percent = Math.round((record.counted / record.items) * 100);
        return <Progress percent={percent} size="small" />;
      },
    },
    {
      title: 'Variance',
      dataIndex: 'variance',
      key: 'variance',
      width: 80,
      align: 'center',
      render: (variance) => (
        <Badge 
          count={variance} 
          showZero 
          style={{ backgroundColor: variance > 0 ? '#ff4d4f' : '#52c41a' }}
        />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
  ];

  // Handlers
  const handleCreateCount = () => {
    form.resetFields();
    setDrawerVisible(true);
  };

  const handleViewDetails = (count) => {
    setSelectedCount(count);
    setDetailDrawerVisible(true);
  };

  const handleStartCount = (count) => {
    setCounts(counts.map(c => 
      c.id === count.id ? { 
        ...c, 
        status: 'in_progress',
        startedAt: new Date().toISOString()
      } : c
    ));
    message.success(`Count ${count.id} started`);
  };

  const handleEnterCounts = () => {
    message.info('Opening count entry screen...');
  };

  const handleSaveCount = () => {
    form.validateFields().then(values => {
      const newCount = {
        id: `CNT-2024-${String(counts.length + 6).padStart(3, '0')}`,
        ...values,
        status: 'scheduled',
        startedAt: null,
        completedAt: null,
        countedItems: 0,
        variance: { items: 0, value: 0 },
        createdBy: 'Current User',
        zones: [],
      };
      setCounts([newCount, ...counts]);
      message.success('Count scheduled successfully');
      setDrawerVisible(false);
    });
  };

  // Form fields
  const formFields = [
    {
      name: 'name',
      label: 'Count Name',
      type: 'input',
      placeholder: 'e.g., Monthly Full Count - January',
      rules: [{ required: true, message: 'Please enter count name' }],
      span: 24,
    },
    {
      name: 'type',
      label: 'Count Type',
      type: 'select',
      options: countTypes.map(t => ({ label: t.label, value: t.value })),
      rules: [{ required: true, message: 'Please select type' }],
      span: 12,
    },
    {
      name: 'branch',
      label: 'Branch',
      type: 'select',
      options: branches.map(b => ({ label: b, value: b })),
      rules: [{ required: true, message: 'Please select branch' }],
      span: 12,
    },
    {
      name: 'scheduledDate',
      label: 'Scheduled Date',
      type: 'date',
      rules: [{ required: true, message: 'Please select date' }],
      span: 12,
    },
    {
      name: 'totalItems',
      label: 'Estimated Items',
      type: 'number',
      placeholder: '0',
      rules: [{ required: true, message: 'Please enter estimated items' }],
      span: 12,
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea',
      placeholder: 'Enter any notes or instructions for the count...',
      span: 24,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Stock Counts"
        subtitle={`${totalCounts} counts`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'Inventory', path: '/inventory' },
          { title: 'Stock Counts', path: '/inventory/counts' },
        ]}
        actions={[
          <Button key="export" icon={<ExportOutlined />}>Export</Button>,
          <Button key="create" type="primary" icon={<PlusOutlined />} onClick={handleCreateCount}>
            Schedule Count
          </Button>,
        ]}
      />

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Counts"
            value={totalCounts}
            icon={<AuditOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="In Progress"
            value={inProgressCounts}
            icon={<SyncOutlined spin style={{ fontSize: 24, color: '#722ed1' }} />}
            color="#722ed1"
            warning={inProgressCounts > 0}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Scheduled"
            value={scheduledCounts}
            icon={<CalendarOutlined style={{ fontSize: 24, color: '#faad14' }} />}
            color="#faad14"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Accuracy Rate"
            value={`${accuracyRate}%`}
            icon={<CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
            color="#52c41a"
          />
        </Col>
      </Row>

      {/* Quick Status Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {counts.filter(c => c.status === 'in_progress').map(count => (
          <Col xs={24} md={12} lg={8} key={count.id}>
            <Card 
              size="small"
              hoverable
              onClick={() => handleViewDetails(count)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <Tag color="processing" icon={<SyncOutlined spin />}>In Progress</Tag>
                  <Title level={5} style={{ marginTop: 8, marginBottom: 4 }}>{count.name}</Title>
                  <Text type="secondary">{count.branch}</Text>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Title level={3} style={{ margin: 0 }}>
                    {Math.round((count.countedItems / count.totalItems) * 100)}%
                  </Title>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {count.countedItems}/{count.totalItems}
                  </Text>
                </div>
              </div>
              <Progress 
                percent={Math.round((count.countedItems / count.totalItems) * 100)}
                status="active"
                style={{ marginTop: 12 }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Filters and Table */}
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Space wrap>
            <Search
              placeholder="Search counts..."
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
                { label: 'Scheduled', value: 'scheduled' },
                { label: 'In Progress', value: 'in_progress' },
                { label: 'Completed', value: 'completed' },
                { label: 'Cancelled', value: 'cancelled' },
              ]}
            />
            <Select
              placeholder="Type"
              allowClear
              style={{ width: 140 }}
              value={filterType}
              onChange={setFilterType}
              options={countTypes.map(t => ({ label: t.label, value: t.value }))}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredCounts}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1400 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} counts`,
          }}
        />
      </Card>

      {/* Create Count Drawer */}
      <FormDrawer
        title="Schedule Stock Count"
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onSubmit={handleSaveCount}
        form={form}
        fields={formFields}
        width={600}
      />

      {/* Count Details Drawer */}
      <Drawer
        title="Count Details"
        placement="right"
        width={700}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
        extra={
          selectedCount?.status === 'scheduled' && (
            <Button type="primary" onClick={() => {
              handleStartCount(selectedCount);
              setDetailDrawerVisible(false);
            }}>
              Start Count
            </Button>
          )
        }
      >
        {selectedCount && (
          <>
            <div style={{ marginBottom: 24 }}>
              <Space align="start">
                <div>
                  <Text strong style={{ fontSize: 18 }}>{selectedCount.id}</Text>
                  <Title level={4} style={{ margin: '8px 0' }}>{selectedCount.name}</Title>
                </div>
              </Space>
              <Space style={{ marginTop: 8 }}>
                <Tag color={getStatusConfig(selectedCount.status).color} icon={getStatusConfig(selectedCount.status).icon}>
                  {getStatusConfig(selectedCount.status).text}
                </Tag>
                <Tag color={getTypeConfig(selectedCount.type).color}>
                  {getTypeConfig(selectedCount.type).label}
                </Tag>
              </Space>
            </div>

            <Descriptions column={2} bordered size="small" style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Branch">
                <Space>
                  <ShopOutlined />
                  {selectedCount.branch}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Scheduled">
                {dayjs(selectedCount.scheduledDate).format('MMM D, YYYY')}
              </Descriptions.Item>
              {selectedCount.startedAt && (
                <Descriptions.Item label="Started">
                  {dayjs(selectedCount.startedAt).format('MMM D, h:mm A')}
                </Descriptions.Item>
              )}
              {selectedCount.completedAt && (
                <Descriptions.Item label="Completed">
                  {dayjs(selectedCount.completedAt).format('MMM D, h:mm A')}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Total Items">
                {selectedCount.totalItems}
              </Descriptions.Item>
              <Descriptions.Item label="Counted">
                {selectedCount.countedItems}
              </Descriptions.Item>
              <Descriptions.Item label="Assigned To" span={2}>
                <Space wrap>
                  {selectedCount.assignedTo.map((name, idx) => (
                    <Tag key={idx} icon={<UserOutlined />}>{name}</Tag>
                  ))}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Created By">
                {selectedCount.createdBy}
              </Descriptions.Item>
              {selectedCount.status === 'completed' && (
                <Descriptions.Item label="Variance">
                  <Space direction="vertical" size={0}>
                    <Badge 
                      status={selectedCount.variance.items > 0 ? 'error' : 'success'}
                      text={<Text>{selectedCount.variance.items} items with variance</Text>}
                    />
                    {selectedCount.variance.items > 0 && (
                      <Text type="danger">
                        ${selectedCount.variance.value.toFixed(2)} value impact
                      </Text>
                    )}
                  </Space>
                </Descriptions.Item>
              )}
              {selectedCount.cancelReason && (
                <Descriptions.Item label="Cancel Reason" span={2}>
                  <Text type="danger">{selectedCount.cancelReason}</Text>
                </Descriptions.Item>
              )}
            </Descriptions>

            {/* Progress Overview */}
            <Title level={5}>Progress</Title>
            <Card size="small" style={{ marginBottom: 24 }}>
              <Row gutter={16}>
                <Col span={8}>
                  <div style={{ textAlign: 'center' }}>
                    <Progress
                      type="circle"
                      percent={Math.round((selectedCount.countedItems / selectedCount.totalItems) * 100)}
                      size={100}
                      status={selectedCount.status === 'in_progress' ? 'active' : undefined}
                    />
                    <div style={{ marginTop: 8 }}>
                      <Text strong>Overall Progress</Text>
                    </div>
                  </div>
                </Col>
                <Col span={16}>
                  <Steps
                    direction="vertical"
                    size="small"
                    current={
                      selectedCount.status === 'completed' ? 3 :
                      selectedCount.status === 'in_progress' ? 1 :
                      selectedCount.status === 'cancelled' ? -1 : 0
                    }
                  >
                    <Steps.Step title="Scheduled" description={dayjs(selectedCount.scheduledDate).format('MMM D')} />
                    <Steps.Step 
                      title="In Progress" 
                      description={selectedCount.startedAt ? dayjs(selectedCount.startedAt).format('MMM D, h:mm A') : 'Not started'}
                    />
                    <Steps.Step 
                      title="Completed" 
                      description={selectedCount.completedAt ? dayjs(selectedCount.completedAt).format('MMM D, h:mm A') : 'Pending'}
                    />
                  </Steps>
                </Col>
              </Row>
            </Card>

            {/* Zones */}
            {selectedCount.zones.length > 0 && (
              <>
                <Title level={5}>Count Zones</Title>
                <Table
                  columns={zoneColumns}
                  dataSource={selectedCount.zones}
                  rowKey="name"
                  pagination={false}
                  size="small"
                  style={{ marginBottom: 24 }}
                />
              </>
            )}

            {/* Notes */}
            {selectedCount.notes && (
              <>
                <Title level={5}>Notes</Title>
                <Card size="small" style={{ backgroundColor: '#fafafa' }}>
                  <Space>
                    <FileTextOutlined />
                    <Text>{selectedCount.notes}</Text>
                  </Space>
                </Card>
              </>
            )}
          </>
        )}
      </Drawer>
    </div>
  );
};

export default StockCounts;
