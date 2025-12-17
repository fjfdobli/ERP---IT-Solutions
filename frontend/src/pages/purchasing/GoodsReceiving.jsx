import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Input, Select, Tag, 
  Tooltip, Badge, message, Typography, DatePicker, Drawer,
  Descriptions, Avatar, Divider, Steps, Form, InputNumber, Checkbox
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ExportOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  InboxOutlined,
  ShoppingOutlined,
  DollarOutlined,
  UserOutlined,
  ShopOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  WarningOutlined,
  FileTextOutlined,
  BarcodeOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer } from '../../components/Common';
import dayjs from 'dayjs';

const { Search, TextArea } = Input;
const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

// Mock goods receiving data
const mockReceivings = [
  {
    id: 'GR-2024-0045',
    date: '2024-01-15T14:00:00',
    purchaseOrder: 'PO-2024-00121',
    supplier: { id: 'SUP005', name: 'Dell Technologies PH' },
    branch: 'Warehouse',
    receivedBy: 'Warehouse Staff',
    items: [
      { name: 'Dell Monitor 27" 4K', sku: 'DEL-MON27-4K', orderedQty: 40, receivedQty: 40, status: 'complete', condition: 'good' },
    ],
    totalOrdered: 40,
    totalReceived: 40,
    status: 'complete',
    inspectedBy: 'QC Inspector',
    notes: 'All items in good condition',
  },
  {
    id: 'GR-2024-0044',
    date: '2024-01-14T10:30:00',
    purchaseOrder: 'PO-2024-00122',
    supplier: { id: 'SUP004', name: 'Sony Philippines' },
    branch: 'Main Branch',
    receivedBy: 'Store Staff',
    items: [
      { name: 'Sony WH-1000XM5 Headphones', sku: 'SON-WH1000XM5', orderedQty: 75, receivedQty: 50, status: 'partial', condition: 'good' },
    ],
    totalOrdered: 75,
    totalReceived: 50,
    status: 'partial',
    inspectedBy: 'QC Inspector',
    notes: 'Partial delivery - remaining 25 units expected next week',
  },
  {
    id: 'GR-2024-0043',
    date: '2024-01-13T16:00:00',
    purchaseOrder: 'PO-2024-00118',
    supplier: { id: 'SUP003', name: 'Logitech Authorized' },
    branch: 'Warehouse',
    receivedBy: 'Warehouse Staff',
    items: [
      { name: 'Logitech MX Master 3S Mouse', sku: 'LOG-MX-MASTER3S', orderedQty: 100, receivedQty: 98, status: 'discrepancy', condition: 'good', discrepancyReason: '2 units missing' },
      { name: 'Logitech MX Keys', sku: 'LOG-MX-KEYS', orderedQty: 100, receivedQty: 100, status: 'complete', condition: 'good' },
    ],
    totalOrdered: 200,
    totalReceived: 198,
    status: 'discrepancy',
    inspectedBy: 'QC Inspector',
    notes: 'Shortage of 2 mice reported to supplier',
    discrepancyReported: true,
  },
  {
    id: 'GR-2024-0042',
    date: '2024-01-12T11:00:00',
    purchaseOrder: 'PO-2024-00115',
    supplier: { id: 'SUP002', name: 'Samsung Electronics PH' },
    branch: 'Downtown Store',
    receivedBy: 'Store Manager',
    items: [
      { name: 'Samsung Galaxy S24 Ultra 512GB', sku: 'SAM-GS24U-512', orderedQty: 20, receivedQty: 20, status: 'complete', condition: 'good' },
      { name: 'Samsung Galaxy Buds3 Pro', sku: 'SAM-GB3P', orderedQty: 30, receivedQty: 28, status: 'discrepancy', condition: 'damaged', discrepancyReason: '2 units damaged in transit' },
    ],
    totalOrdered: 50,
    totalReceived: 48,
    status: 'discrepancy',
    inspectedBy: 'Store Manager',
    notes: '2 Galaxy Buds damaged - claim filed with carrier',
    discrepancyReported: true,
    damageClaimFiled: true,
  },
  {
    id: 'GR-2024-0041',
    date: '2024-01-11T09:30:00',
    purchaseOrder: 'PO-2024-00112',
    supplier: { id: 'SUP001', name: 'Apple Philippines' },
    branch: 'Main Branch',
    receivedBy: 'Receiving Clerk',
    items: [
      { name: 'iPhone 15 Pro Max 256GB', sku: 'APL-IP15PM-256', orderedQty: 30, receivedQty: 30, status: 'complete', condition: 'good' },
      { name: 'AirPods Pro 2nd Generation', sku: 'APL-APP2', orderedQty: 50, receivedQty: 50, status: 'complete', condition: 'good' },
    ],
    totalOrdered: 80,
    totalReceived: 80,
    status: 'complete',
    inspectedBy: 'QC Inspector',
    notes: '',
  },
  {
    id: 'GR-2024-0040',
    date: '2024-01-10T14:30:00',
    purchaseOrder: 'PO-2024-00110',
    supplier: { id: 'SUP001', name: 'Apple Philippines' },
    branch: 'Warehouse',
    receivedBy: 'Warehouse Staff',
    items: [
      { name: 'MacBook Pro 14" M3 Pro', sku: 'APL-MBP14-M3P', orderedQty: 15, receivedQty: 15, status: 'complete', condition: 'good' },
    ],
    totalOrdered: 15,
    totalReceived: 15,
    status: 'complete',
    inspectedBy: 'Warehouse Manager',
    notes: 'All units serial numbers verified',
  },
];

const branches = ['Main Branch', 'Downtown Store', 'Warehouse'];

const GoodsReceiving = () => {
  const [receivings, setReceivings] = useState(mockReceivings);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterBranch, setFilterBranch] = useState(null);
  const [dateRange, setDateRange] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedReceiving, setSelectedReceiving] = useState(null);
  const [form] = Form.useForm();

  // Calculate stats
  const totalReceivings = receivings.length;
  const completeReceivings = receivings.filter(r => r.status === 'complete').length;
  const partialReceivings = receivings.filter(r => r.status === 'partial').length;
  const discrepancyReceivings = receivings.filter(r => r.status === 'discrepancy').length;
  // Filter receivings
  const filteredReceivings = receivings.filter(receiving => {
    const matchesSearch = !searchText || 
      receiving.id.toLowerCase().includes(searchText.toLowerCase()) ||
      receiving.purchaseOrder.toLowerCase().includes(searchText.toLowerCase()) ||
      receiving.supplier.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !filterStatus || receiving.status === filterStatus;
    const matchesBranch = !filterBranch || receiving.branch === filterBranch;
    const matchesDate = !dateRange || (
      dayjs(receiving.date).isAfter(dateRange[0].startOf('day')) &&
      dayjs(receiving.date).isBefore(dateRange[1].endOf('day'))
    );
    return matchesSearch && matchesStatus && matchesBranch && matchesDate;
  });

  // Get status config
  const getStatusConfig = (status) => {
    const config = {
      complete: { color: 'success', text: 'Complete', icon: <CheckCircleOutlined /> },
      partial: { color: 'warning', text: 'Partial', icon: <ClockCircleOutlined /> },
      discrepancy: { color: 'error', text: 'Discrepancy', icon: <ExclamationCircleOutlined /> },
    };
    return config[status] || config.complete;
  };

  // Get item status config
  const getItemStatusConfig = (status) => {
    const config = {
      complete: { color: 'success', text: 'Complete' },
      partial: { color: 'warning', text: 'Partial' },
      discrepancy: { color: 'error', text: 'Discrepancy' },
    };
    return config[status] || config.complete;
  };

  // Get condition config
  const getConditionConfig = (condition) => {
    const config = {
      good: { color: 'green', text: 'Good' },
      damaged: { color: 'red', text: 'Damaged' },
      defective: { color: 'orange', text: 'Defective' },
    };
    return config[condition] || config.good;
  };

  // Table columns
  const columns = [
    {
      title: 'GR Number',
      dataIndex: 'id',
      key: 'id',
      width: 130,
      fixed: 'left',
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
      title: 'PO Reference',
      dataIndex: 'purchaseOrder',
      key: 'purchaseOrder',
      width: 140,
      render: (po) => <Text code>{po}</Text>,
    },
    {
      title: 'Supplier',
      key: 'supplier',
      width: 180,
      render: (_, record) => <Text strong>{record.supplier.name}</Text>,
    },
    {
      title: 'Branch',
      dataIndex: 'branch',
      key: 'branch',
      width: 130,
      render: (branch) => (
        <Space>
          <ShopOutlined />
          {branch}
        </Space>
      ),
    },
    {
      title: 'Qty',
      key: 'qty',
      width: 120,
      render: (_, record) => (
        <div>
          <Text strong>{record.totalReceived}</Text>
          <Text type="secondary"> / {record.totalOrdered}</Text>
        </div>
      ),
    },
    {
      title: 'Received By',
      dataIndex: 'receivedBy',
      key: 'receivedBy',
      width: 140,
      render: (name) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          {name}
        </Space>
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
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button 
              type="text" 
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Item columns
  const itemColumns = [
    {
      title: 'Product',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div>
          <div>{name}</div>
          <Text type="secondary" style={{ fontSize: 11 }}>{record.sku}</Text>
        </div>
      ),
    },
    {
      title: 'Ordered',
      dataIndex: 'orderedQty',
      key: 'orderedQty',
      width: 80,
      align: 'center',
    },
    {
      title: 'Received',
      dataIndex: 'receivedQty',
      key: 'receivedQty',
      width: 80,
      align: 'center',
      render: (qty, record) => (
        <Text strong style={{ color: qty < record.orderedQty ? '#ff4d4f' : '#52c41a' }}>
          {qty}
        </Text>
      ),
    },
    {
      title: 'Variance',
      key: 'variance',
      width: 80,
      align: 'center',
      render: (_, record) => {
        const variance = record.receivedQty - record.orderedQty;
        if (variance === 0) return <Text type="secondary">—</Text>;
        return (
          <Text type={variance < 0 ? 'danger' : 'success'}>
            {variance > 0 ? '+' : ''}{variance}
          </Text>
        );
      },
    },
    {
      title: 'Condition',
      dataIndex: 'condition',
      key: 'condition',
      width: 100,
      render: (condition) => {
        const config = getConditionConfig(condition);
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const config = getItemStatusConfig(status);
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
  ];

  // Handlers
  const handleCreateReceiving = () => {
    form.resetFields();
    setDrawerVisible(true);
  };

  const handleViewDetails = (receiving) => {
    setSelectedReceiving(receiving);
    setDetailDrawerVisible(true);
  };

  const handleSaveReceiving = () => {
    form.validateFields().then(values => {
      const newReceiving = {
        id: `GR-2024-${String(receivings.length + 46).padStart(4, '0')}`,
        date: new Date().toISOString(),
        ...values,
        status: 'complete',
        items: [],
        totalOrdered: 0,
        totalReceived: 0,
        receivedBy: 'Current User',
      };
      setReceivings([newReceiving, ...receivings]);
      message.success('Goods receiving recorded');
      setDrawerVisible(false);
    });
  };

  // Form fields
  const formFields = [
    {
      name: 'purchaseOrder',
      label: 'Purchase Order',
      type: 'select',
      options: [
        { label: 'PO-2024-00125 - Apple Philippines', value: 'PO-2024-00125' },
        { label: 'PO-2024-00124 - Samsung Electronics PH', value: 'PO-2024-00124' },
        { label: 'PO-2024-00123 - Logitech Authorized', value: 'PO-2024-00123' },
      ],
      rules: [{ required: true, message: 'Please select purchase order' }],
      span: 24,
    },
    {
      name: 'branch',
      label: 'Receiving Branch',
      type: 'select',
      options: branches.map(b => ({ label: b, value: b })),
      rules: [{ required: true, message: 'Please select branch' }],
      span: 12,
    },
    {
      name: 'inspectedBy',
      label: 'Inspected By',
      type: 'input',
      placeholder: 'QC Inspector name',
      span: 12,
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'textarea',
      placeholder: 'Enter any notes about the receiving...',
      span: 24,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Goods Receiving"
        subtitle={`${filteredReceivings.length} receipts`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'Purchasing', path: '/purchasing' },
          { title: 'Goods Receiving', path: '/purchasing/receiving' },
        ]}
        actions={[
          <Button key="export" icon={<ExportOutlined />}>Export</Button>,
          <Button key="create" type="primary" icon={<PlusOutlined />} onClick={handleCreateReceiving}>
            New Receiving
          </Button>,
        ]}
      />

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Receipts"
            value={totalReceivings}
            icon={<InboxOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Complete"
            value={completeReceivings}
            icon={<CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Partial"
            value={partialReceivings}
            icon={<ClockCircleOutlined style={{ fontSize: 24, color: '#faad14' }} />}
            color="#faad14"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Discrepancies"
            value={discrepancyReceivings}
            icon={<WarningOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />}
            color="#ff4d4f"
            warning={discrepancyReceivings > 0}
          />
        </Col>
      </Row>

      {/* Filters and Table */}
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Space wrap>
            <Search
              placeholder="Search receipts..."
              allowClear
              style={{ width: 220 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <RangePicker 
              value={dateRange}
              onChange={setDateRange}
            />
            <Select
              placeholder="Status"
              allowClear
              style={{ width: 140 }}
              value={filterStatus}
              onChange={setFilterStatus}
              options={[
                { label: 'Complete', value: 'complete' },
                { label: 'Partial', value: 'partial' },
                { label: 'Discrepancy', value: 'discrepancy' },
              ]}
            />
            <Select
              placeholder="Branch"
              allowClear
              style={{ width: 140 }}
              value={filterBranch}
              onChange={setFilterBranch}
              options={branches.map(b => ({ label: b, value: b }))}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredReceivings}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1300 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} receipts`,
          }}
        />
      </Card>

      {/* Create Receiving Drawer */}
      <FormDrawer
        title="Record Goods Receiving"
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onSubmit={handleSaveReceiving}
        form={form}
        fields={formFields}
        width={600}
      />

      {/* Receiving Details Drawer */}
      <Drawer
        title="Goods Receiving Details"
        placement="right"
        width={650}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
      >
        {selectedReceiving && (
          <>
            <div style={{ marginBottom: 24 }}>
              <Space>
                <Text strong style={{ fontSize: 20 }}>{selectedReceiving.id}</Text>
                <Tag color={getStatusConfig(selectedReceiving.status).color}>
                  {getStatusConfig(selectedReceiving.status).text}
                </Tag>
              </Space>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">
                  <CalendarOutlined /> {dayjs(selectedReceiving.date).format('MMMM D, YYYY h:mm A')}
                </Text>
              </div>
            </div>

            <Descriptions column={2} bordered size="small" style={{ marginBottom: 24 }}>
              <Descriptions.Item label="PO Reference" span={2}>
                <Text code>{selectedReceiving.purchaseOrder}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Supplier" span={2}>
                {selectedReceiving.supplier.name}
              </Descriptions.Item>
              <Descriptions.Item label="Branch">
                <ShopOutlined /> {selectedReceiving.branch}
              </Descriptions.Item>
              <Descriptions.Item label="Received By">
                {selectedReceiving.receivedBy}
              </Descriptions.Item>
              <Descriptions.Item label="Inspected By">
                {selectedReceiving.inspectedBy}
              </Descriptions.Item>
              <Descriptions.Item label="Total Received">
                <Text strong style={{ fontSize: 16 }}>
                  {selectedReceiving.totalReceived} / {selectedReceiving.totalOrdered}
                </Text>
              </Descriptions.Item>
            </Descriptions>

            {/* Summary Cards */}
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Text type="secondary">Ordered</Text>
                  <Title level={3} style={{ margin: 0 }}>{selectedReceiving.totalOrdered}</Title>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Text type="secondary">Received</Text>
                  <Title level={3} style={{ margin: 0, color: '#52c41a' }}>{selectedReceiving.totalReceived}</Title>
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Text type="secondary">Variance</Text>
                  <Title level={3} style={{ 
                    margin: 0, 
                    color: selectedReceiving.totalReceived === selectedReceiving.totalOrdered ? '#52c41a' : '#ff4d4f' 
                  }}>
                    {selectedReceiving.totalReceived - selectedReceiving.totalOrdered}
                  </Title>
                </Card>
              </Col>
            </Row>

            <Divider orientation="left">Received Items</Divider>
            <Table
              columns={itemColumns}
              dataSource={selectedReceiving.items}
              rowKey="sku"
              pagination={false}
              size="small"
              style={{ marginBottom: 24 }}
            />

            {/* Discrepancy Details */}
            {selectedReceiving.items.some(i => i.discrepancyReason) && (
              <>
                <Divider orientation="left">Discrepancy Details</Divider>
                {selectedReceiving.items.filter(i => i.discrepancyReason).map((item, idx) => (
                  <Card 
                    key={idx} 
                    size="small" 
                    style={{ marginBottom: 8, backgroundColor: '#fff2f0', borderColor: '#ffccc7' }}
                  >
                    <Space>
                      <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                      <div>
                        <Text strong>{item.name}</Text>
                        <br />
                        <Text type="danger">{item.discrepancyReason}</Text>
                      </div>
                    </Space>
                  </Card>
                ))}
                {selectedReceiving.discrepancyReported && (
                  <Tag color="blue" icon={<CheckOutlined />}>Discrepancy Reported to Supplier</Tag>
                )}
                {selectedReceiving.damageClaimFiled && (
                  <Tag color="orange" icon={<FileTextOutlined />}>Damage Claim Filed</Tag>
                )}
              </>
            )}

            {selectedReceiving.notes && (
              <>
                <Divider orientation="left">Notes</Divider>
                <Card size="small" style={{ backgroundColor: '#fafafa' }}>
                  <Text>{selectedReceiving.notes}</Text>
                </Card>
              </>
            )}
          </>
        )}
      </Drawer>
    </div>
  );
};

export default GoodsReceiving;
