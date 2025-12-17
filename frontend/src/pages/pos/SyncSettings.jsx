import React, { useState } from 'react';
import {
  Card, Row, Col, Form, Input, InputNumber, Select, Switch, Button,
  Space, Divider, Typography, Alert, Tabs, TimePicker, Table, Tag,
  Modal, Tooltip, Badge, Checkbox, List, Avatar, Progress, Statistic
} from 'antd';
import {
  SettingOutlined, SaveOutlined, ReloadOutlined, SyncOutlined,
  CloudSyncOutlined, ClockCircleOutlined, DatabaseOutlined,
  SafetyOutlined, ApiOutlined, BranchesOutlined, DesktopOutlined,
  CheckCircleOutlined, WarningOutlined, InfoCircleOutlined,
  ThunderboltOutlined, WifiOutlined, HistoryOutlined, DeleteOutlined,
  PlusOutlined, EditOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';
import { PageHeader } from '../../components/Common';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

const mockSettings = {
  general: {
    syncEnabled: true,
    autoSync: true,
    syncInterval: 5,
    batchSize: 100,
    retryAttempts: 3,
    retryDelay: 30,
    timeout: 60,
    compression: true,
    encryptData: true,
  },
  schedule: {
    enabled: true,
    fullSyncTime: '02:00',
    incrementalEnabled: true,
    incrementalInterval: 15,
    offPeakOnly: false,
    offPeakStart: '22:00',
    offPeakEnd: '06:00',
  },
  dataTypes: {
    transactions: { enabled: true, priority: 'high', realtime: true },
    inventory: { enabled: true, priority: 'high', realtime: false },
    products: { enabled: true, priority: 'medium', realtime: false },
    customers: { enabled: true, priority: 'low', realtime: false },
    discounts: { enabled: true, priority: 'low', realtime: false },
    employees: { enabled: false, priority: 'low', realtime: false },
  },
  conflict: {
    resolution: 'server_wins',
    notifyOnConflict: true,
    logConflicts: true,
    autoResolve: true,
  },
  notifications: {
    onSuccess: false,
    onFailure: true,
    onPartial: true,
    emailNotify: true,
    emailRecipients: 'admin@company.com, it@company.com',
    slackWebhook: '',
  },
};

// Mock terminal configurations
const mockTerminalConfigs = [
  {
    id: 'POS-001',
    name: 'Main Register',
    branch: 'Main Branch',
    syncEnabled: true,
    customInterval: null,
    lastConfigUpdate: '2025-01-15 10:00:00',
  },
  {
    id: 'POS-002',
    name: 'Express Lane',
    branch: 'Main Branch',
    syncEnabled: true,
    customInterval: 3,
    lastConfigUpdate: '2025-01-14 15:30:00',
  },
  {
    id: 'POS-003',
    name: 'Checkout 3',
    branch: 'Main Branch',
    syncEnabled: true,
    customInterval: null,
    lastConfigUpdate: '2025-01-15 09:00:00',
  },
  {
    id: 'POS-101',
    name: 'Makati Register 1',
    branch: 'Makati Branch',
    syncEnabled: true,
    customInterval: null,
    lastConfigUpdate: '2025-01-15 08:00:00',
  },
  {
    id: 'POS-102',
    name: 'Makati Register 2',
    branch: 'Makati Branch',
    syncEnabled: false,
    customInterval: null,
    lastConfigUpdate: '2025-01-15 12:00:00',
  },
];

const SyncSettings = () => {
  const [settings, setSettings] = useState(mockSettings);
  const [terminalConfigs] = useState(mockTerminalConfigs);
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [editingTerminal, setEditingTerminal] = useState(null);
  const [terminalModalVisible, setTerminalModalVisible] = useState(false);

  const handleSaveSettings = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setHasChanges(false);
      Modal.success({
        title: 'Settings Saved',
        content: 'Sync settings have been updated successfully. Changes will apply to all terminals.',
      });
    }, 1500);
  };

  const handleResetSettings = () => {
    Modal.confirm({
      title: 'Reset Settings',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to reset all settings to default? This cannot be undone.',
      okText: 'Reset',
      okType: 'danger',
      onOk() {
        setSettings(mockSettings);
        form.resetFields();
        setHasChanges(false);
      },
    });
  };

  const handleTestConnection = () => {
    Modal.info({
      title: 'Testing Connection',
      content: (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <SyncOutlined spin style={{ fontSize: 32, color: '#1890ff', marginBottom: 16 }} />
          <div>Testing sync connection to all terminals...</div>
        </div>
      ),
      okText: 'Close',
    });
  };

  const handleEditTerminal = (terminal) => {
    setEditingTerminal(terminal);
    setTerminalModalVisible(true);
  };

  const terminalColumns = [
    {
      title: 'Terminal',
      key: 'terminal',
      render: (_, record) => (
        <Space>
          <Avatar 
            icon={<DesktopOutlined />} 
            style={{ backgroundColor: record.syncEnabled ? '#52c41a' : '#ff4d4f' }}
            size="small"
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
      dataIndex: 'branch',
    },
    {
      title: 'Sync Status',
      key: 'status',
      render: (_, record) => (
        <Switch 
          checked={record.syncEnabled}
          checkedChildren="Enabled"
          unCheckedChildren="Disabled"
        />
      ),
    },
    {
      title: 'Interval',
      key: 'interval',
      render: (_, record) => (
        record.customInterval ? (
          <Tag color="purple">{record.customInterval} min (custom)</Tag>
        ) : (
          <Tag color="default">Default ({settings.general.syncInterval} min)</Tag>
        )
      ),
    },
    {
      title: 'Last Config Update',
      dataIndex: 'lastConfigUpdate',
      render: (date) => dayjs(date).format('MMM D, HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Settings">
            <Button 
              type="link" 
              icon={<EditOutlined />}
              onClick={() => handleEditTerminal(record)}
            />
          </Tooltip>
          <Tooltip title="Force Sync">
            <Button 
              type="link" 
              icon={<SyncOutlined />}
              disabled={!record.syncEnabled}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const renderGeneralSettings = () => (
    <Form
      form={form}
      layout="vertical"
      initialValues={settings.general}
      onValuesChange={() => setHasChanges(true)}
    >
      <Alert
        message="Global Sync Settings"
        description="These settings apply to all POS terminals unless overridden at the terminal level."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[24, 16]}>
        <Col xs={24} md={12}>
          <Card title="Basic Settings" size="small">
            <Form.Item
              name="syncEnabled"
              label="Enable Sync"
              valuePropName="checked"
            >
              <Switch checkedChildren="On" unCheckedChildren="Off" />
            </Form.Item>

            <Form.Item
              name="autoSync"
              label="Auto Sync"
              valuePropName="checked"
              tooltip="Automatically sync data at regular intervals"
            >
              <Switch checkedChildren="Auto" unCheckedChildren="Manual" />
            </Form.Item>

            <Form.Item
              name="syncInterval"
              label="Sync Interval (minutes)"
              tooltip="How often to sync data between terminals and server"
            >
              <InputNumber min={1} max={60} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="batchSize"
              label="Batch Size"
              tooltip="Number of records to process per sync batch"
            >
              <InputNumber min={10} max={1000} step={10} style={{ width: '100%' }} />
            </Form.Item>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Error Handling" size="small">
            <Form.Item
              name="retryAttempts"
              label="Retry Attempts"
              tooltip="Number of times to retry failed sync"
            >
              <InputNumber min={0} max={10} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="retryDelay"
              label="Retry Delay (seconds)"
              tooltip="Time to wait between retry attempts"
            >
              <InputNumber min={5} max={300} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="timeout"
              label="Connection Timeout (seconds)"
              tooltip="Maximum time to wait for sync response"
            >
              <InputNumber min={10} max={300} style={{ width: '100%' }} />
            </Form.Item>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Performance" size="small">
            <Form.Item
              name="compression"
              label="Data Compression"
              valuePropName="checked"
              tooltip="Compress data during transfer to reduce bandwidth"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="encryptData"
              label="Encrypt Data"
              valuePropName="checked"
              tooltip="Encrypt sensitive data during transfer"
            >
              <Switch />
            </Form.Item>
          </Card>
        </Col>
      </Row>
    </Form>
  );

  const renderScheduleSettings = () => (
    <div>
      <Alert
        message="Scheduled Sync"
        description="Configure automatic sync schedules for comprehensive data synchronization."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[24, 16]}>
        <Col xs={24} md={12}>
          <Card title="Full Sync Schedule" size="small">
            <Form.Item label="Enable Scheduled Full Sync">
              <Switch 
                checked={settings.schedule.enabled}
                onChange={(checked) => {
                  setSettings({
                    ...settings,
                    schedule: { ...settings.schedule, enabled: checked }
                  });
                  setHasChanges(true);
                }}
              />
            </Form.Item>

            <Form.Item label="Daily Full Sync Time">
              <TimePicker
                format="HH:mm"
                defaultValue={dayjs(settings.schedule.fullSyncTime, 'HH:mm')}
                disabled={!settings.schedule.enabled}
                style={{ width: '100%' }}
              />
            </Form.Item>

            <Alert
              message="Recommended: Schedule during off-peak hours (2:00 AM - 4:00 AM)"
              type="warning"
              showIcon
              icon={<WarningOutlined />}
              style={{ marginTop: 16 }}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Incremental Sync" size="small">
            <Form.Item label="Enable Incremental Sync">
              <Switch 
                checked={settings.schedule.incrementalEnabled}
                onChange={(checked) => {
                  setSettings({
                    ...settings,
                    schedule: { ...settings.schedule, incrementalEnabled: checked }
                  });
                  setHasChanges(true);
                }}
              />
            </Form.Item>

            <Form.Item label="Incremental Interval (minutes)">
              <InputNumber 
                min={5} 
                max={60} 
                value={settings.schedule.incrementalInterval}
                disabled={!settings.schedule.incrementalEnabled}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Card>
        </Col>

        <Col xs={24}>
          <Card title="Off-Peak Settings" size="small">
            <Form.Item label="Limit Full Sync to Off-Peak Hours">
              <Switch 
                checked={settings.schedule.offPeakOnly}
                onChange={(checked) => {
                  setSettings({
                    ...settings,
                    schedule: { ...settings.schedule, offPeakOnly: checked }
                  });
                  setHasChanges(true);
                }}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Off-Peak Start">
                  <TimePicker
                    format="HH:mm"
                    defaultValue={dayjs(settings.schedule.offPeakStart, 'HH:mm')}
                    disabled={!settings.schedule.offPeakOnly}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Off-Peak End">
                  <TimePicker
                    format="HH:mm"
                    defaultValue={dayjs(settings.schedule.offPeakEnd, 'HH:mm')}
                    disabled={!settings.schedule.offPeakOnly}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderDataTypeSettings = () => (
    <div>
      <Alert
        message="Data Type Configuration"
        description="Configure which data types to sync and their priority levels."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <List
        dataSource={Object.entries(settings.dataTypes)}
        renderItem={([key, config]) => (
          <Card size="small" style={{ marginBottom: 16 }}>
            <Row align="middle" gutter={16}>
              <Col xs={24} sm={6}>
                <Space>
                  <Avatar 
                    icon={<DatabaseOutlined />} 
                    style={{ 
                      backgroundColor: config.enabled ? '#1890ff' : '#d9d9d9' 
                    }}
                  />
                  <div>
                    <Text strong style={{ textTransform: 'capitalize' }}>{key}</Text>
                    {config.realtime && <Tag color="green" size="small" style={{ marginLeft: 8 }}>Real-time</Tag>}
                  </div>
                </Space>
              </Col>
              <Col xs={12} sm={6}>
                <Form.Item label="Enabled" style={{ marginBottom: 0 }}>
                  <Switch 
                    checked={config.enabled}
                    onChange={(checked) => {
                      setSettings({
                        ...settings,
                        dataTypes: {
                          ...settings.dataTypes,
                          [key]: { ...config, enabled: checked }
                        }
                      });
                      setHasChanges(true);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xs={12} sm={6}>
                <Form.Item label="Priority" style={{ marginBottom: 0 }}>
                  <Select 
                    value={config.priority}
                    disabled={!config.enabled}
                    style={{ width: '100%' }}
                    onChange={(value) => {
                      setSettings({
                        ...settings,
                        dataTypes: {
                          ...settings.dataTypes,
                          [key]: { ...config, priority: value }
                        }
                      });
                      setHasChanges(true);
                    }}
                  >
                    <Select.Option value="high">
                      <Tag color="red">High</Tag>
                    </Select.Option>
                    <Select.Option value="medium">
                      <Tag color="orange">Medium</Tag>
                    </Select.Option>
                    <Select.Option value="low">
                      <Tag color="blue">Low</Tag>
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={6}>
                <Form.Item label="Real-time" style={{ marginBottom: 0 }}>
                  <Switch 
                    checked={config.realtime}
                    disabled={!config.enabled || key === 'employees'}
                    onChange={(checked) => {
                      setSettings({
                        ...settings,
                        dataTypes: {
                          ...settings.dataTypes,
                          [key]: { ...config, realtime: checked }
                        }
                      });
                      setHasChanges(true);
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>
        )}
      />
    </div>
  );

  const renderConflictSettings = () => (
    <div>
      <Alert
        message="Conflict Resolution"
        description="Configure how to handle data conflicts when syncing between terminals and server."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[24, 16]}>
        <Col xs={24} md={12}>
          <Card title="Resolution Strategy" size="small">
            <Form.Item label="Conflict Resolution Method">
              <Select 
                value={settings.conflict.resolution}
                onChange={(value) => {
                  setSettings({
                    ...settings,
                    conflict: { ...settings.conflict, resolution: value }
                  });
                  setHasChanges(true);
                }}
              >
                <Select.Option value="server_wins">
                  <Space>
                    <CloudSyncOutlined />
                    Server Wins (Recommended)
                  </Space>
                </Select.Option>
                <Select.Option value="terminal_wins">
                  <Space>
                    <DesktopOutlined />
                    Terminal Wins
                  </Space>
                </Select.Option>
                <Select.Option value="newest_wins">
                  <Space>
                    <ClockCircleOutlined />
                    Newest Wins
                  </Space>
                </Select.Option>
                <Select.Option value="manual">
                  <Space>
                    <EditOutlined />
                    Manual Resolution
                  </Space>
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Auto-resolve Minor Conflicts">
              <Switch 
                checked={settings.conflict.autoResolve}
                onChange={(checked) => {
                  setSettings({
                    ...settings,
                    conflict: { ...settings.conflict, autoResolve: checked }
                  });
                  setHasChanges(true);
                }}
              />
            </Form.Item>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Conflict Logging" size="small">
            <Form.Item label="Log All Conflicts">
              <Switch 
                checked={settings.conflict.logConflicts}
                onChange={(checked) => {
                  setSettings({
                    ...settings,
                    conflict: { ...settings.conflict, logConflicts: checked }
                  });
                  setHasChanges(true);
                }}
              />
            </Form.Item>

            <Form.Item label="Notify on Conflict">
              <Switch 
                checked={settings.conflict.notifyOnConflict}
                onChange={(checked) => {
                  setSettings({
                    ...settings,
                    conflict: { ...settings.conflict, notifyOnConflict: checked }
                  });
                  setHasChanges(true);
                }}
              />
            </Form.Item>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderNotificationSettings = () => (
    <div>
      <Alert
        message="Notification Settings"
        description="Configure alerts and notifications for sync events."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[24, 16]}>
        <Col xs={24} md={12}>
          <Card title="Sync Event Notifications" size="small">
            <Form.Item>
              <Checkbox 
                checked={settings.notifications.onSuccess}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, onSuccess: e.target.checked }
                  });
                  setHasChanges(true);
                }}
              >
                Notify on Successful Sync
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Checkbox 
                checked={settings.notifications.onFailure}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, onFailure: e.target.checked }
                  });
                  setHasChanges(true);
                }}
              >
                Notify on Failed Sync
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Checkbox 
                checked={settings.notifications.onPartial}
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, onPartial: e.target.checked }
                  });
                  setHasChanges(true);
                }}
              >
                Notify on Partial Sync
              </Checkbox>
            </Form.Item>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Email Notifications" size="small">
            <Form.Item label="Enable Email Notifications">
              <Switch 
                checked={settings.notifications.emailNotify}
                onChange={(checked) => {
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, emailNotify: checked }
                  });
                  setHasChanges(true);
                }}
              />
            </Form.Item>

            <Form.Item label="Email Recipients">
              <Input.TextArea
                rows={2}
                value={settings.notifications.emailRecipients}
                disabled={!settings.notifications.emailNotify}
                placeholder="Comma-separated email addresses"
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, emailRecipients: e.target.value }
                  });
                  setHasChanges(true);
                }}
              />
            </Form.Item>
          </Card>
        </Col>

        <Col xs={24}>
          <Card title="Integrations" size="small">
            <Form.Item label="Slack Webhook URL">
              <Input
                value={settings.notifications.slackWebhook}
                placeholder="https://hooks.slack.com/services/..."
                onChange={(e) => {
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, slackWebhook: e.target.value }
                  });
                  setHasChanges(true);
                }}
              />
            </Form.Item>
            <Button icon={<ApiOutlined />}>Test Slack Integration</Button>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderTerminalSettings = () => (
    <div>
      <Alert
        message="Terminal-Specific Settings"
        description="Override global settings for individual POS terminals."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Table
        columns={terminalColumns}
        dataSource={terminalConfigs}
        rowKey="id"
        pagination={false}
      />
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Sync Settings"
        subtitle="Configure POS synchronization settings and preferences"
        actions={[
          <Button key="test" icon={<WifiOutlined />} onClick={handleTestConnection}>
            Test Connection
          </Button>,
          <Button key="reset" icon={<ReloadOutlined />} onClick={handleResetSettings}>
            Reset to Default
          </Button>,
          <Button 
            key="save" 
            type="primary" 
            icon={<SaveOutlined />}
            loading={saving}
            disabled={!hasChanges}
            onClick={handleSaveSettings}
          >
            Save Settings
          </Button>,
        ]}
      />

      {hasChanges && (
        <Alert
          message="Unsaved Changes"
          description="You have unsaved changes. Click Save Settings to apply them."
          type="warning"
          showIcon
          closable
          style={{ marginBottom: 24 }}
        />
      )}

      {/* Quick Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="Sync Status"
              value={settings.general.syncEnabled ? 'Enabled' : 'Disabled'}
              valueStyle={{ color: settings.general.syncEnabled ? '#52c41a' : '#ff4d4f' }}
              prefix={settings.general.syncEnabled ? <CheckCircleOutlined /> : <WarningOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="Sync Interval"
              value={settings.general.syncInterval}
              suffix="min"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="Active Terminals"
              value={terminalConfigs.filter(t => t.syncEnabled).length}
              suffix={`/ ${terminalConfigs.length}`}
              prefix={<DesktopOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="Data Types"
              value={Object.values(settings.dataTypes).filter(d => d.enabled).length}
              suffix={`/ ${Object.keys(settings.dataTypes).length}`}
              prefix={<DatabaseOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Settings Tabs */}
      <Card>
        <Tabs
          items={[
            {
              key: 'general',
              label: (
                <span>
                  <SettingOutlined />
                  General
                </span>
              ),
              children: renderGeneralSettings(),
            },
            {
              key: 'schedule',
              label: (
                <span>
                  <ClockCircleOutlined />
                  Schedule
                </span>
              ),
              children: renderScheduleSettings(),
            },
            {
              key: 'data-types',
              label: (
                <span>
                  <DatabaseOutlined />
                  Data Types
                </span>
              ),
              children: renderDataTypeSettings(),
            },
            {
              key: 'conflict',
              label: (
                <span>
                  <BranchesOutlined />
                  Conflict Resolution
                </span>
              ),
              children: renderConflictSettings(),
            },
            {
              key: 'notifications',
              label: (
                <span>
                  <ThunderboltOutlined />
                  Notifications
                </span>
              ),
              children: renderNotificationSettings(),
            },
            {
              key: 'terminals',
              label: (
                <span>
                  <DesktopOutlined />
                  Terminals
                  <Badge count={terminalConfigs.length} style={{ marginLeft: 8 }} />
                </span>
              ),
              children: renderTerminalSettings(),
            },
          ]}
        />
      </Card>

      {/* Terminal Edit Modal */}
      <Modal
        title={`Edit Terminal: ${editingTerminal?.name}`}
        open={terminalModalVisible}
        onCancel={() => setTerminalModalVisible(false)}
        onOk={() => {
          setTerminalModalVisible(false);
          setHasChanges(true);
        }}
      >
        {editingTerminal && (
          <Form layout="vertical">
            <Form.Item label="Terminal ID">
              <Input value={editingTerminal.id} disabled />
            </Form.Item>
            <Form.Item label="Sync Enabled">
              <Switch defaultChecked={editingTerminal.syncEnabled} />
            </Form.Item>
            <Form.Item label="Custom Sync Interval" tooltip="Leave empty to use global setting">
              <InputNumber
                min={1}
                max={60}
                placeholder={`Default: ${settings.general.syncInterval} min`}
                defaultValue={editingTerminal.customInterval}
                style={{ width: '100%' }}
                addonAfter="minutes"
              />
            </Form.Item>
            <Form.Item label="Data Types to Sync">
              <Checkbox.Group
                options={Object.keys(settings.dataTypes).map(type => ({
                  label: type.charAt(0).toUpperCase() + type.slice(1),
                  value: type,
                }))}
                defaultValue={Object.keys(settings.dataTypes).filter(k => settings.dataTypes[k].enabled)}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default SyncSettings;
