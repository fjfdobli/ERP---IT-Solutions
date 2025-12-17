import React, { useState } from 'react';
import {
  Card, Row, Col, Table, Tag, Button, Space, Input, DatePicker,
  Select, Typography, Badge, Drawer, Descriptions, Timeline,
  Alert, Tabs, Tooltip, Collapse, Modal
} from 'antd';
import {
  SearchOutlined, FilterOutlined, SyncOutlined, CheckCircleOutlined,
  CloseCircleOutlined, WarningOutlined, DownloadOutlined,
  ReloadOutlined, DesktopOutlined, DatabaseOutlined, EyeOutlined,
  ClockCircleOutlined, InfoCircleOutlined, FileTextOutlined,
  ExclamationCircleOutlined, BugOutlined, DeleteOutlined
} from '@ant-design/icons';
import { PageHeader, StatCard } from '../../components/Common';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Text } = Typography;
const { Panel } = Collapse;

// Mock sync logs data
const mockLogs = [
  {
    id: 'LOG-001',
    timestamp: '2025-01-15 14:30:00',
    terminal: 'POS-001',
    terminalName: 'Main Register',
    branch: 'Main Branch',
    type: 'full_sync',
    status: 'success',
    duration: 12500,
    recordsProcessed: 156,
    recordsSuccess: 156,
    recordsFailed: 0,
    dataTypes: ['transactions', 'inventory', 'products'],
    initiatedBy: 'system',
    details: {
      transactions: { processed: 45, success: 45, failed: 0 },
      inventory: { processed: 78, success: 78, failed: 0 },
      products: { processed: 33, success: 33, failed: 0 },
    },
  },
  {
    id: 'LOG-002',
    timestamp: '2025-01-15 14:28:00',
    terminal: 'POS-002',
    terminalName: 'Express Lane',
    branch: 'Main Branch',
    type: 'incremental',
    status: 'success',
    duration: 3200,
    recordsProcessed: 23,
    recordsSuccess: 23,
    recordsFailed: 0,
    dataTypes: ['transactions'],
    initiatedBy: 'system',
    details: {
      transactions: { processed: 23, success: 23, failed: 0 },
    },
  },
  {
    id: 'LOG-003',
    timestamp: '2025-01-15 14:25:00',
    terminal: 'POS-003',
    terminalName: 'Checkout 3',
    branch: 'Main Branch',
    type: 'inventory_sync',
    status: 'in_progress',
    duration: null,
    recordsProcessed: 12,
    recordsSuccess: 8,
    recordsFailed: 0,
    dataTypes: ['inventory'],
    initiatedBy: 'manual',
    details: {
      inventory: { processed: 12, success: 8, failed: 0, pending: 4 },
    },
  },
  {
    id: 'LOG-004',
    timestamp: '2025-01-15 14:20:00',
    terminal: 'POS-201',
    terminalName: 'QC Store Register',
    branch: 'Quezon City Branch',
    type: 'product_sync',
    status: 'partial',
    duration: 45600,
    recordsProcessed: 89,
    recordsSuccess: 81,
    recordsFailed: 8,
    dataTypes: ['products'],
    initiatedBy: 'system',
    errors: [
      { code: 'PRD_404', message: 'Product SKU not found: SKU-12345', count: 3 },
      { code: 'PRD_DUP', message: 'Duplicate product entry detected', count: 5 },
    ],
    details: {
      products: { processed: 89, success: 81, failed: 8 },
    },
  },
  {
    id: 'LOG-005',
    timestamp: '2025-01-15 12:00:00',
    terminal: 'POS-102',
    terminalName: 'Makati Register 2',
    branch: 'Makati Branch',
    type: 'full_sync',
    status: 'failed',
    duration: 5000,
    recordsProcessed: 0,
    recordsSuccess: 0,
    recordsFailed: 45,
    dataTypes: ['transactions', 'inventory', 'products'],
    initiatedBy: 'system',
    errors: [
      { code: 'NET_TIMEOUT', message: 'Connection timeout - Network unreachable', count: 1 },
      { code: 'AUTH_FAILED', message: 'Terminal authentication failed', count: 1 },
    ],
    details: {
      transactions: { processed: 0, success: 0, failed: 45 },
    },
  },
  {
    id: 'LOG-006',
    timestamp: '2025-01-15 11:30:00',
    terminal: 'POS-101',
    terminalName: 'Makati Register 1',
    branch: 'Makati Branch',
    type: 'full_sync',
    status: 'success',
    duration: 18900,
    recordsProcessed: 203,
    recordsSuccess: 203,
    recordsFailed: 0,
    dataTypes: ['transactions', 'inventory', 'products', 'customers'],
    initiatedBy: 'scheduled',
    details: {
      transactions: { processed: 78, success: 78, failed: 0 },
      inventory: { processed: 56, success: 56, failed: 0 },
      products: { processed: 45, success: 45, failed: 0 },
      customers: { processed: 24, success: 24, failed: 0 },
    },
  },
  {
    id: 'LOG-007',
    timestamp: '2025-01-15 10:00:00',
    terminal: 'POS-001',
    terminalName: 'Main Register',
    branch: 'Main Branch',
    type: 'full_sync',
    status: 'success',
    duration: 15600,
    recordsProcessed: 189,
    recordsSuccess: 189,
    recordsFailed: 0,
    dataTypes: ['transactions', 'inventory', 'products'],
    initiatedBy: 'scheduled',
    details: {
      transactions: { processed: 67, success: 67, failed: 0 },
      inventory: { processed: 89, success: 89, failed: 0 },
      products: { processed: 33, success: 33, failed: 0 },
    },
  },
  {
    id: 'LOG-008',
    timestamp: '2025-01-15 08:00:00',
    terminal: 'ALL',
    terminalName: 'All Terminals',
    branch: 'All Branches',
    type: 'product_catalog',
    status: 'success',
    duration: 120000,
    recordsProcessed: 1250,
    recordsSuccess: 1250,
    recordsFailed: 0,
    dataTypes: ['products'],
    initiatedBy: 'scheduled',
    details: {
      products: { processed: 1250, success: 1250, failed: 0 },
    },
  },
];

const SyncLogs = () => {
  const [logs] = useState(mockLogs);
  const [selectedLog, setSelectedLog] = useState(null);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: null,
    type: null,
    terminal: null,
    dateRange: null,
  });

  // Calculate statistics
  const stats = {
    totalLogs: logs.length,
    successCount: logs.filter(l => l.status === 'success').length,
    failedCount: logs.filter(l => l.status === 'failed').length,
    partialCount: logs.filter(l => l.status === 'partial').length,
    totalRecords: logs.reduce((sum, l) => sum + l.recordsProcessed, 0),
    failedRecords: logs.reduce((sum, l) => sum + l.recordsFailed, 0),
  };

  const getStatusConfig = (status) => {
    const config = {
      success: { color: 'success', text: 'Success', icon: <CheckCircleOutlined /> },
      failed: { color: 'error', text: 'Failed', icon: <CloseCircleOutlined /> },
      partial: { color: 'warning', text: 'Partial', icon: <WarningOutlined /> },
      in_progress: { color: 'processing', text: 'In Progress', icon: <SyncOutlined spin /> },
    };
    return config[status] || { color: 'default', text: status };
  };

  const getTypeConfig = (type) => {
    const config = {
      full_sync: { color: 'blue', text: 'Full Sync' },
      incremental: { color: 'cyan', text: 'Incremental' },
      inventory_sync: { color: 'purple', text: 'Inventory' },
      product_sync: { color: 'green', text: 'Products' },
      product_catalog: { color: 'magenta', text: 'Catalog Update' },
      transaction_sync: { color: 'orange', text: 'Transactions' },
    };
    return config[type] || { color: 'default', text: type };
  };

  const formatDuration = (ms) => {
    if (!ms) return '-';
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${Math.floor(ms / 60000)}m ${Math.round((ms % 60000) / 1000)}s`;
  };

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setDetailDrawerVisible(true);
  };

  const handleExportLogs = () => {
    Modal.success({
      title: 'Export Started',
      content: 'Sync logs are being exported. Download will start shortly.',
    });
  };

  const handleRetrySync = (log) => {
    Modal.confirm({
      title: 'Retry Sync',
      icon: <SyncOutlined />,
      content: `Are you sure you want to retry sync for ${log.terminalName}?`,
      onOk() {
        // Retry sync logic
      },
    });
  };

  const filteredLogs = logs.filter(log => {
    if (filters.search && !log.terminal.toLowerCase().includes(filters.search.toLowerCase()) &&
        !log.terminalName.toLowerCase().includes(filters.search.toLowerCase()) &&
        !log.id.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status && log.status !== filters.status) return false;
    if (filters.type && log.type !== filters.type) return false;
    if (filters.terminal && log.terminal !== filters.terminal) return false;
    return true;
  });

  const columns = [
    {
      title: 'Log ID',
      dataIndex: 'id',
      width: 100,
      render: (id) => <Text code>{id}</Text>,
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      width: 160,
      render: (timestamp) => (
        <div>
          <div>{dayjs(timestamp).format('MMM D, YYYY')}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {dayjs(timestamp).format('HH:mm:ss')}
          </Text>
        </div>
      ),
      sorter: (a, b) => dayjs(a.timestamp).unix() - dayjs(b.timestamp).unix(),
      defaultSortOrder: 'descend',
    },
    {
      title: 'Terminal',
      key: 'terminal',
      render: (_, record) => (
        <Space>
          <DesktopOutlined />
          <div>
            <div style={{ fontWeight: 500 }}>{record.terminalName}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>{record.branch}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: 120,
      render: (type) => {
        const config = getTypeConfig(type);
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 120,
      render: (status) => {
        const config = getStatusConfig(status);
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
      filters: [
        { text: 'Success', value: 'success' },
        { text: 'Failed', value: 'failed' },
        { text: 'Partial', value: 'partial' },
        { text: 'In Progress', value: 'in_progress' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Records',
      key: 'records',
      width: 120,
      render: (_, record) => (
        <div>
          <Text type="success">{record.recordsSuccess}</Text>
          {record.recordsFailed > 0 && (
            <>
              <Text type="secondary"> / </Text>
              <Text type="danger">{record.recordsFailed}</Text>
            </>
          )}
          <div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              of {record.recordsProcessed}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      width: 100,
      render: (duration) => (
        <Space>
          <ClockCircleOutlined />
          {formatDuration(duration)}
        </Space>
      ),
    },
    {
      title: 'Initiated By',
      dataIndex: 'initiatedBy',
      width: 100,
      render: (initiatedBy) => {
        const colors = {
          system: 'blue',
          manual: 'purple',
          scheduled: 'green',
        };
        return <Tag color={colors[initiatedBy] || 'default'}>{initiatedBy}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button 
              type="link" 
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          {record.status === 'failed' && (
            <Tooltip title="Retry">
              <Button 
                type="link" 
                icon={<ReloadOutlined />}
                onClick={() => handleRetrySync(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Sync Logs"
        subtitle="View detailed synchronization history and error logs"
        actions={[
          <Button key="clear" icon={<DeleteOutlined />}>
            Clear Old Logs
          </Button>,
          <Button key="export" icon={<DownloadOutlined />} onClick={handleExportLogs}>
            Export Logs
          </Button>,
          <Button key="refresh" type="primary" icon={<ReloadOutlined />}>
            Refresh
          </Button>,
        ]}
      />

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <StatCard
            title="Total Syncs"
            value={stats.totalLogs}
            icon={<SyncOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard
            title="Successful"
            value={stats.successCount}
            icon={<CheckCircleOutlined />}
            color="#52c41a"
            suffix={<Text type="secondary" style={{ fontSize: 12 }}>{((stats.successCount / stats.totalLogs) * 100).toFixed(0)}%</Text>}
          />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard
            title="Failed"
            value={stats.failedCount}
            icon={<CloseCircleOutlined />}
            color="#ff4d4f"
          />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard
            title="Total Records"
            value={stats.totalRecords.toLocaleString()}
            icon={<DatabaseOutlined />}
            color="#722ed1"
          />
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8}>
            <Input
              placeholder="Search by ID, terminal..."
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              allowClear
            />
          </Col>
          <Col xs={12} sm={4}>
            <Select
              placeholder="Status"
              style={{ width: '100%' }}
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
              allowClear
            >
              <Select.Option value="success">Success</Select.Option>
              <Select.Option value="failed">Failed</Select.Option>
              <Select.Option value="partial">Partial</Select.Option>
              <Select.Option value="in_progress">In Progress</Select.Option>
            </Select>
          </Col>
          <Col xs={12} sm={4}>
            <Select
              placeholder="Type"
              style={{ width: '100%' }}
              value={filters.type}
              onChange={(value) => setFilters({ ...filters, type: value })}
              allowClear
            >
              <Select.Option value="full_sync">Full Sync</Select.Option>
              <Select.Option value="incremental">Incremental</Select.Option>
              <Select.Option value="inventory_sync">Inventory</Select.Option>
              <Select.Option value="product_sync">Products</Select.Option>
              <Select.Option value="product_catalog">Catalog</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <RangePicker 
              style={{ width: '100%' }}
              onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
            />
          </Col>
        </Row>
      </Card>

      {/* Logs Table */}
      <Card title="Sync History" extra={<FilterOutlined />}>
        <Table
          columns={columns}
          dataSource={filteredLogs}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} logs`,
          }}
          expandable={{
            expandedRowRender: (record) => (
              <div style={{ padding: '12px 0' }}>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Space wrap>
                      <Text strong>Data Types:</Text>
                      {record.dataTypes.map((type) => (
                        <Tag key={type}>{type}</Tag>
                      ))}
                    </Space>
                  </Col>
                  {record.errors && record.errors.length > 0 && (
                    <Col span={24}>
                      <Alert
                        message="Sync Errors"
                        description={
                          <ul style={{ margin: 0, paddingLeft: 20 }}>
                            {record.errors.map((error, idx) => (
                              <li key={idx}>
                                <Text code>{error.code}</Text>: {error.message} ({error.count}x)
                              </li>
                            ))}
                          </ul>
                        }
                        type="error"
                        showIcon
                        icon={<BugOutlined />}
                      />
                    </Col>
                  )}
                </Row>
              </div>
            ),
            rowExpandable: (record) => record.errors || record.dataTypes.length > 1,
          }}
        />
      </Card>

      {/* Detail Drawer */}
      <Drawer
        title="Sync Log Details"
        placement="right"
        width={600}
        onClose={() => setDetailDrawerVisible(false)}
        open={detailDrawerVisible}
        extra={
          selectedLog?.status === 'failed' && (
            <Button type="primary" icon={<ReloadOutlined />}>
              Retry Sync
            </Button>
          )
        }
      >
        {selectedLog && (
          <div>
            {/* Status Alert */}
            {selectedLog.status === 'failed' && (
              <Alert
                message="Sync Failed"
                description="This synchronization operation failed. Review the errors below and retry."
                type="error"
                showIcon
                style={{ marginBottom: 24 }}
              />
            )}
            {selectedLog.status === 'partial' && (
              <Alert
                message="Partial Sync"
                description="Some records failed to sync. Review the details below."
                type="warning"
                showIcon
                style={{ marginBottom: 24 }}
              />
            )}

            <Tabs
              items={[
                {
                  key: 'overview',
                  label: 'Overview',
                  children: (
                    <div>
                      <Descriptions column={2} bordered size="small">
                        <Descriptions.Item label="Log ID" span={2}>
                          <Text copyable>{selectedLog.id}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Terminal">{selectedLog.terminalName}</Descriptions.Item>
                        <Descriptions.Item label="Branch">{selectedLog.branch}</Descriptions.Item>
                        <Descriptions.Item label="Timestamp" span={2}>
                          {dayjs(selectedLog.timestamp).format('YYYY-MM-DD HH:mm:ss')}
                        </Descriptions.Item>
                        <Descriptions.Item label="Type">
                          <Tag color={getTypeConfig(selectedLog.type).color}>
                            {getTypeConfig(selectedLog.type).text}
                          </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Status">
                          <Tag color={getStatusConfig(selectedLog.status).color} icon={getStatusConfig(selectedLog.status).icon}>
                            {getStatusConfig(selectedLog.status).text}
                          </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Duration">{formatDuration(selectedLog.duration)}</Descriptions.Item>
                        <Descriptions.Item label="Initiated By">
                          <Tag>{selectedLog.initiatedBy}</Tag>
                        </Descriptions.Item>
                      </Descriptions>

                      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                        <Col span={8}>
                          <Card size="small">
                            <Statistic
                              title="Processed"
                              value={selectedLog.recordsProcessed}
                              prefix={<DatabaseOutlined />}
                            />
                          </Card>
                        </Col>
                        <Col span={8}>
                          <Card size="small">
                            <Statistic
                              title="Success"
                              value={selectedLog.recordsSuccess}
                              valueStyle={{ color: '#52c41a' }}
                              prefix={<CheckCircleOutlined />}
                            />
                          </Card>
                        </Col>
                        <Col span={8}>
                          <Card size="small">
                            <Statistic
                              title="Failed"
                              value={selectedLog.recordsFailed}
                              valueStyle={{ color: selectedLog.recordsFailed > 0 ? '#ff4d4f' : '#52c41a' }}
                              prefix={<CloseCircleOutlined />}
                            />
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  ),
                },
                {
                  key: 'details',
                  label: 'Data Details',
                  children: (
                    <div>
                      <Collapse defaultActiveKey={Object.keys(selectedLog.details)}>
                        {Object.entries(selectedLog.details).map(([dataType, data]) => (
                          <Panel 
                            header={
                              <Space>
                                <Text strong style={{ textTransform: 'capitalize' }}>{dataType}</Text>
                                <Tag color={data.failed > 0 ? 'error' : 'success'}>
                                  {data.success}/{data.processed}
                                </Tag>
                              </Space>
                            }
                            key={dataType}
                          >
                            <Descriptions column={3} size="small">
                              <Descriptions.Item label="Processed">{data.processed}</Descriptions.Item>
                              <Descriptions.Item label="Success">
                                <Text type="success">{data.success}</Text>
                              </Descriptions.Item>
                              <Descriptions.Item label="Failed">
                                <Text type={data.failed > 0 ? 'danger' : 'success'}>{data.failed}</Text>
                              </Descriptions.Item>
                              {data.pending !== undefined && (
                                <Descriptions.Item label="Pending">
                                  <Text type="warning">{data.pending}</Text>
                                </Descriptions.Item>
                              )}
                            </Descriptions>
                          </Panel>
                        ))}
                      </Collapse>
                    </div>
                  ),
                },
                {
                  key: 'errors',
                  label: (
                    <Space>
                      Errors
                      {selectedLog.errors && <Badge count={selectedLog.errors.length} size="small" />}
                    </Space>
                  ),
                  children: (
                    <div>
                      {selectedLog.errors && selectedLog.errors.length > 0 ? (
                        <Timeline>
                          {selectedLog.errors.map((error, idx) => (
                            <Timeline.Item 
                              key={idx} 
                              color="red"
                              dot={<ExclamationCircleOutlined />}
                            >
                              <div>
                                <Text code>{error.code}</Text>
                                <Tag color="red" style={{ marginLeft: 8 }}>{error.count}x</Tag>
                              </div>
                              <Text type="secondary">{error.message}</Text>
                            </Timeline.Item>
                          ))}
                        </Timeline>
                      ) : (
                        <Alert
                          message="No Errors"
                          description="This sync completed without any errors."
                          type="success"
                          showIcon
                        />
                      )}
                    </div>
                  ),
                },
                {
                  key: 'raw',
                  label: 'Raw Log',
                  children: (
                    <div>
                      <pre style={{ 
                        backgroundColor: '#f5f5f5', 
                        padding: 16, 
                        borderRadius: 4,
                        fontSize: 12,
                        overflow: 'auto',
                        maxHeight: 400,
                      }}>
                        {JSON.stringify(selectedLog, null, 2)}
                      </pre>
                      <Button 
                        icon={<DownloadOutlined />} 
                        style={{ marginTop: 16 }}
                      >
                        Download Raw Log
                      </Button>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default SyncLogs;
