import React, { useState, useEffect } from 'react';
import {
  Card, Row, Col, Table, Tag, Button, Space, Badge, Progress,
  Typography, Statistic, Alert, Tooltip, Timeline, Descriptions,
  Drawer, List, Avatar, Switch, Modal
} from 'antd';
import {
  SyncOutlined, CheckCircleOutlined, CloseCircleOutlined,
  WarningOutlined, ClockCircleOutlined, CloudSyncOutlined,
  DesktopOutlined, ShopOutlined, DatabaseOutlined, WifiOutlined,
  ReloadOutlined, PauseCircleOutlined, PlayCircleOutlined,
  ExclamationCircleOutlined, InfoCircleOutlined, HistoryOutlined,
  ApiOutlined
} from '@ant-design/icons';
import { PageHeader, StatCard } from '../../components/Common';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Text, Title } = Typography;

// Mock POS terminals data
const mockTerminals = [
  {
    id: 'POS-001',
    name: 'Main Register',
    branch: 'Main Branch',
    location: 'Counter 1',
    status: 'online',
    lastSync: '2025-01-15 14:30:00',
    lastSyncStatus: 'success',
    pendingSync: 0,
    syncEnabled: true,
    version: '2.5.1',
    ip: '192.168.1.101',
    transactions: 156,
    syncProgress: 100,
  },
  {
    id: 'POS-002',
    name: 'Express Lane',
    branch: 'Main Branch',
    location: 'Counter 2',
    status: 'online',
    lastSync: '2025-01-15 14:28:00',
    lastSyncStatus: 'success',
    pendingSync: 3,
    syncEnabled: true,
    version: '2.5.1',
    ip: '192.168.1.102',
    transactions: 89,
    syncProgress: 85,
  },
  {
    id: 'POS-003',
    name: 'Checkout 3',
    branch: 'Main Branch',
    location: 'Counter 3',
    status: 'syncing',
    lastSync: '2025-01-15 14:25:00',
    lastSyncStatus: 'success',
    pendingSync: 12,
    syncEnabled: true,
    version: '2.5.0',
    ip: '192.168.1.103',
    transactions: 45,
    syncProgress: 65,
  },
  {
    id: 'POS-101',
    name: 'Makati Register 1',
    branch: 'Makati Branch',
    location: 'Main Counter',
    status: 'online',
    lastSync: '2025-01-15 14:29:00',
    lastSyncStatus: 'success',
    pendingSync: 0,
    syncEnabled: true,
    version: '2.5.1',
    ip: '192.168.2.101',
    transactions: 203,
    syncProgress: 100,
  },
  {
    id: 'POS-102',
    name: 'Makati Register 2',
    branch: 'Makati Branch',
    location: 'Counter 2',
    status: 'offline',
    lastSync: '2025-01-15 12:00:00',
    lastSyncStatus: 'failed',
    pendingSync: 45,
    syncEnabled: true,
    version: '2.5.1',
    ip: '192.168.2.102',
    transactions: 78,
    syncProgress: 0,
    error: 'Connection timeout - Network unreachable',
  },
  {
    id: 'POS-201',
    name: 'QC Store Register',
    branch: 'Quezon City Branch',
    location: 'Main Counter',
    status: 'online',
    lastSync: '2025-01-15 14:27:00',
    lastSyncStatus: 'partial',
    pendingSync: 8,
    syncEnabled: true,
    version: '2.4.9',
    ip: '192.168.3.101',
    transactions: 167,
    syncProgress: 90,
    warning: 'Product catalog sync incomplete',
  },
];

// Mock sync queues
const mockSyncQueue = [
  { id: 1, type: 'transaction', terminal: 'POS-002', count: 3, priority: 'high', queuedAt: '2025-01-15 14:28:30' },
  { id: 2, type: 'inventory', terminal: 'POS-003', count: 12, priority: 'medium', queuedAt: '2025-01-15 14:25:00' },
  { id: 3, type: 'product', terminal: 'POS-201', count: 8, priority: 'low', queuedAt: '2025-01-15 14:20:00' },
  { id: 4, type: 'transaction', terminal: 'POS-102', count: 45, priority: 'critical', queuedAt: '2025-01-15 12:00:00' },
];

// Mock recent sync activity
const mockRecentActivity = [
  { id: 1, terminal: 'POS-001', type: 'Full Sync', status: 'success', time: '2025-01-15 14:30:00', records: 156 },
  { id: 2, terminal: 'POS-101', type: 'Transaction Sync', status: 'success', time: '2025-01-15 14:29:00', records: 23 },
  { id: 3, terminal: 'POS-002', type: 'Inventory Update', status: 'success', time: '2025-01-15 14:28:00', records: 45 },
  { id: 4, terminal: 'POS-201', type: 'Product Sync', status: 'partial', time: '2025-01-15 14:27:00', records: 89 },
  { id: 5, terminal: 'POS-003', type: 'Transaction Sync', status: 'in_progress', time: '2025-01-15 14:25:00', records: 12 },
  { id: 6, terminal: 'POS-102', type: 'Full Sync', status: 'failed', time: '2025-01-15 12:00:00', records: 0, error: 'Connection failed' },
];

const SyncStatus = () => {
  const [terminals] = useState(mockTerminals);
  const [selectedTerminal, setSelectedTerminal] = useState(null);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [syncAllLoading, setSyncAllLoading] = useState(false);

  // Calculate statistics
  const stats = {
    totalTerminals: terminals.length,
    onlineTerminals: terminals.filter(t => t.status === 'online' || t.status === 'syncing').length,
    offlineTerminals: terminals.filter(t => t.status === 'offline').length,
    pendingRecords: terminals.reduce((sum, t) => sum + t.pendingSync, 0),
    syncingTerminals: terminals.filter(t => t.status === 'syncing').length,
    failedTerminals: terminals.filter(t => t.lastSyncStatus === 'failed').length,
  };

  // Auto refresh simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // In real app, this would fetch updated status
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = (status) => {
    const config = {
      online: { color: 'success', text: 'Online', icon: <CheckCircleOutlined /> },
      offline: { color: 'error', text: 'Offline', icon: <CloseCircleOutlined /> },
      syncing: { color: 'processing', text: 'Syncing', icon: <SyncOutlined spin /> },
      paused: { color: 'warning', text: 'Paused', icon: <PauseCircleOutlined /> },
    };
    return config[status] || { color: 'default', text: status };
  };

  const getSyncStatusConfig = (status) => {
    const config = {
      success: { color: 'green', text: 'Success', icon: <CheckCircleOutlined /> },
      failed: { color: 'red', text: 'Failed', icon: <CloseCircleOutlined /> },
      partial: { color: 'orange', text: 'Partial', icon: <WarningOutlined /> },
      in_progress: { color: 'blue', text: 'In Progress', icon: <SyncOutlined spin /> },
    };
    return config[status] || { color: 'default', text: status };
  };

  const handleViewDetails = (terminal) => {
    setSelectedTerminal(terminal);
    setDetailDrawerVisible(true);
  };

  const handleSyncNow = (terminal) => {
    Modal.confirm({
      title: 'Sync Terminal',
      icon: <SyncOutlined />,
      content: `Are you sure you want to sync ${terminal.name} now?`,
      onOk() {
        // Trigger sync
      },
    });
  };

  const handleSyncAll = () => {
    setSyncAllLoading(true);
    setTimeout(() => {
      setSyncAllLoading(false);
    }, 2000);
  };

  const columns = [
    {
      title: 'Terminal',
      key: 'terminal',
      render: (_, record) => (
        <Space>
          <Avatar 
            icon={<DesktopOutlined />} 
            style={{ 
              backgroundColor: record.status === 'online' ? '#52c41a' : 
                record.status === 'syncing' ? '#1890ff' : '#ff4d4f' 
            }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>{record.id}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Branch',
      key: 'branch',
      render: (_, record) => (
        <div>
          <div>{record.branch}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.location}</Text>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => {
        const config = getStatusConfig(status);
        return (
          <Badge status={config.color} text={config.text} />
        );
      },
    },
    {
      title: 'Last Sync',
      key: 'lastSync',
      render: (_, record) => {
        const syncConfig = getSyncStatusConfig(record.lastSyncStatus);
        return (
          <div>
            <div>
              <Tag color={syncConfig.color} icon={syncConfig.icon}>
                {syncConfig.text}
              </Tag>
            </div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {dayjs(record.lastSync).fromNow()}
            </Text>
          </div>
        );
      },
    },
    {
      title: 'Pending',
      dataIndex: 'pendingSync',
      render: (pending) => (
        pending > 0 ? (
          <Badge count={pending} style={{ backgroundColor: pending > 20 ? '#ff4d4f' : '#faad14' }} />
        ) : (
          <Tag color="green">Synced</Tag>
        )
      ),
    },
    {
      title: 'Sync Progress',
      key: 'progress',
      width: 150,
      render: (_, record) => (
        <Progress 
          percent={record.syncProgress} 
          size="small"
          status={record.status === 'syncing' ? 'active' : 
            record.syncProgress === 100 ? 'success' : 'normal'}
        />
      ),
    },
    {
      title: 'Version',
      dataIndex: 'version',
      render: (version) => (
        <Tooltip title={version !== '2.5.1' ? 'Update available' : 'Latest version'}>
          <Tag color={version === '2.5.1' ? 'green' : 'orange'}>
            v{version}
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button 
              type="link" 
              icon={<InfoCircleOutlined />}
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Sync Now">
            <Button 
              type="link" 
              icon={<SyncOutlined />}
              disabled={record.status === 'offline'}
              onClick={() => handleSyncNow(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="POS Sync Status"
        subtitle="Monitor and manage POS terminal synchronization"
        actions={[
          <Button key="refresh" icon={<ReloadOutlined />}>
            Refresh
          </Button>,
          <Button 
            key="sync-all" 
            type="primary" 
            icon={<CloudSyncOutlined />}
            loading={syncAllLoading}
            onClick={handleSyncAll}
          >
            Sync All Terminals
          </Button>,
        ]}
      />

      {/* Alert for offline terminals */}
      {stats.offlineTerminals > 0 && (
        <Alert
          message={`${stats.offlineTerminals} terminal(s) offline`}
          description="Some terminals are not connected. Check network connectivity or terminal status."
          type="warning"
          showIcon
          icon={<ExclamationCircleOutlined />}
          closable
          style={{ marginBottom: 24 }}
        />
      )}

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <StatCard
            title="Total Terminals"
            value={stats.totalTerminals}
            icon={<DesktopOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard
            title="Online"
            value={stats.onlineTerminals}
            icon={<WifiOutlined />}
            color="#52c41a"
            suffix={`/ ${stats.totalTerminals}`}
          />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard
            title="Pending Records"
            value={stats.pendingRecords}
            icon={<CloudSyncOutlined />}
            color="#faad14"
          />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard
            title="Currently Syncing"
            value={stats.syncingTerminals}
            icon={<SyncOutlined spin={stats.syncingTerminals > 0} />}
            color="#722ed1"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Terminals Table */}
        <Col xs={24} lg={16}>
          <Card title="POS Terminals" extra={<Tag color="blue">{terminals.length} terminals</Tag>}>
            <Table
              columns={columns}
              dataSource={terminals}
              rowKey="id"
              pagination={false}
              size="middle"
            />
          </Card>
        </Col>

        {/* Sync Queue & Activity */}
        <Col xs={24} lg={8}>
          {/* Sync Queue */}
          <Card 
            title="Sync Queue" 
            extra={<Badge count={mockSyncQueue.length} />}
            style={{ marginBottom: 16 }}
          >
            <List
              size="small"
              dataSource={mockSyncQueue}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        size="small"
                        style={{ 
                          backgroundColor: item.priority === 'critical' ? '#ff4d4f' :
                            item.priority === 'high' ? '#faad14' : '#1890ff'
                        }}
                        icon={<DatabaseOutlined />}
                      />
                    }
                    title={
                      <Space>
                        <Text>{item.terminal}</Text>
                        <Tag size="small">{item.type}</Tag>
                      </Space>
                    }
                    description={`${item.count} records • ${dayjs(item.queuedAt).fromNow()}`}
                  />
                </List.Item>
              )}
            />
          </Card>

          {/* Recent Activity */}
          <Card title="Recent Activity" extra={<HistoryOutlined />}>
            <Timeline>
              {mockRecentActivity.slice(0, 5).map((activity) => {
                const statusConfig = getSyncStatusConfig(activity.status);
                return (
                  <Timeline.Item 
                    key={activity.id}
                    color={statusConfig.color}
                    dot={statusConfig.icon}
                  >
                    <div>
                      <Text strong>{activity.terminal}</Text>
                      <Tag size="small" style={{ marginLeft: 8 }}>{activity.type}</Tag>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {activity.records} records • {dayjs(activity.time).fromNow()}
                      </Text>
                    </div>
                    {activity.error && (
                      <Text type="danger" style={{ fontSize: '12px' }}>{activity.error}</Text>
                    )}
                  </Timeline.Item>
                );
              })}
            </Timeline>
          </Card>
        </Col>
      </Row>

      {/* Terminal Detail Drawer */}
      <Drawer
        title={`Terminal Details - ${selectedTerminal?.name}`}
        placement="right"
        width={500}
        onClose={() => setDetailDrawerVisible(false)}
        open={detailDrawerVisible}
        extra={
          <Space>
            <Switch 
              checkedChildren="Sync On" 
              unCheckedChildren="Sync Off"
              checked={selectedTerminal?.syncEnabled}
            />
            <Button 
              type="primary" 
              icon={<SyncOutlined />}
              disabled={selectedTerminal?.status === 'offline'}
            >
              Sync Now
            </Button>
          </Space>
        }
      >
        {selectedTerminal && (
          <div>
            {/* Status Alert */}
            {selectedTerminal.status === 'offline' && (
              <Alert
                message="Terminal Offline"
                description={selectedTerminal.error || 'Unable to connect to terminal'}
                type="error"
                showIcon
                style={{ marginBottom: 24 }}
              />
            )}
            {selectedTerminal.warning && (
              <Alert
                message="Sync Warning"
                description={selectedTerminal.warning}
                type="warning"
                showIcon
                style={{ marginBottom: 24 }}
              />
            )}

            {/* Terminal Info */}
            <Descriptions column={1} bordered size="small" style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Terminal ID">{selectedTerminal.id}</Descriptions.Item>
              <Descriptions.Item label="Name">{selectedTerminal.name}</Descriptions.Item>
              <Descriptions.Item label="Branch">{selectedTerminal.branch}</Descriptions.Item>
              <Descriptions.Item label="Location">{selectedTerminal.location}</Descriptions.Item>
              <Descriptions.Item label="IP Address">{selectedTerminal.ip}</Descriptions.Item>
              <Descriptions.Item label="Version">
                <Tag color={selectedTerminal.version === '2.5.1' ? 'green' : 'orange'}>
                  v{selectedTerminal.version}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Badge 
                  status={getStatusConfig(selectedTerminal.status).color} 
                  text={getStatusConfig(selectedTerminal.status).text} 
                />
              </Descriptions.Item>
            </Descriptions>

            {/* Sync Status */}
            <Title level={5}>Sync Status</Title>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="Last Sync"
                    value={dayjs(selectedTerminal.lastSync).format('HH:mm')}
                    suffix={<Text type="secondary" style={{ fontSize: 12 }}>{dayjs(selectedTerminal.lastSync).format('MMM D')}</Text>}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small">
                  <Statistic
                    title="Pending Records"
                    value={selectedTerminal.pendingSync}
                    valueStyle={{ color: selectedTerminal.pendingSync > 0 ? '#faad14' : '#52c41a' }}
                  />
                </Card>
              </Col>
            </Row>

            <Title level={5}>Today's Activity</Title>
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <Statistic
                  title="Transactions"
                  value={selectedTerminal.transactions}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Sync Count"
                  value={12}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Errors"
                  value={selectedTerminal.status === 'offline' ? 1 : 0}
                  valueStyle={{ color: selectedTerminal.status === 'offline' ? '#ff4d4f' : '#52c41a' }}
                />
              </Col>
            </Row>

            {/* Sync Progress */}
            <Title level={5}>Current Sync Progress</Title>
            <Progress 
              percent={selectedTerminal.syncProgress} 
              status={selectedTerminal.status === 'syncing' ? 'active' : 
                selectedTerminal.syncProgress === 100 ? 'success' : 
                selectedTerminal.status === 'offline' ? 'exception' : 'normal'}
            />

            {/* Data Types */}
            <Title level={5} style={{ marginTop: 24 }}>Sync Data Types</Title>
            <List
              size="small"
              dataSource={[
                { type: 'Transactions', status: 'synced', count: selectedTerminal.transactions },
                { type: 'Products', status: selectedTerminal.warning ? 'partial' : 'synced', count: 1250 },
                { type: 'Inventory', status: 'synced', count: 450 },
                { type: 'Customers', status: 'synced', count: 89 },
                { type: 'Discounts', status: 'synced', count: 15 },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Space>
                      <ApiOutlined />
                      <Text>{item.type}</Text>
                    </Space>
                    <Space>
                      <Text type="secondary">{item.count} records</Text>
                      <Tag color={item.status === 'synced' ? 'green' : 'orange'}>
                        {item.status}
                      </Tag>
                    </Space>
                  </div>
                </List.Item>
              )}
            />
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default SyncStatus;
