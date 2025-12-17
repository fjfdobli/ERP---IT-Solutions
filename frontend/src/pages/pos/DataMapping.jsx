import React, { useState } from 'react';
import {
  Card, Row, Col, Table, Tag, Button, Space, Input, Select, Switch,
  Typography, Alert, Tabs, Modal, Form, Tooltip, Badge, Collapse,
  Tree, Divider, List, Avatar, Progress, Descriptions, Empty
} from 'antd';
import {
  ApiOutlined, LinkOutlined, SwapOutlined, SettingOutlined,
  PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined,
  SyncOutlined, CheckCircleOutlined, WarningOutlined,
  DatabaseOutlined, DesktopOutlined, ArrowRightOutlined,
  CodeOutlined, CopyOutlined, QuestionCircleOutlined,
  CloudServerOutlined, FileTextOutlined, ReloadOutlined
} from '@ant-design/icons';
import { PageHeader, StatCard } from '../../components/Common';

const { Text, Title, Paragraph } = Typography;
const { Panel } = Collapse;

// Mock field mappings data
const mockFieldMappings = [
  {
    id: 1,
    name: 'Product Sync Mapping',
    source: 'POS Terminal',
    target: 'ERP System',
    entity: 'products',
    status: 'active',
    fieldsCount: 15,
    lastSync: '2025-01-15 14:30:00',
    mappings: [
      { sourceField: 'item_code', targetField: 'sku', type: 'direct', required: true },
      { sourceField: 'item_name', targetField: 'name', type: 'direct', required: true },
      { sourceField: 'description', targetField: 'description', type: 'direct', required: false },
      { sourceField: 'price', targetField: 'selling_price', type: 'direct', required: true },
      { sourceField: 'cost', targetField: 'cost_price', type: 'direct', required: false },
      { sourceField: 'qty_on_hand', targetField: 'stock_quantity', type: 'direct', required: true },
      { sourceField: 'category_id', targetField: 'category', type: 'lookup', required: false },
      { sourceField: 'barcode', targetField: 'barcode', type: 'direct', required: false },
      { sourceField: 'is_active', targetField: 'status', type: 'transform', required: true },
      { sourceField: 'tax_code', targetField: 'tax_rate', type: 'lookup', required: false },
    ],
  },
  {
    id: 2,
    name: 'Transaction Sync Mapping',
    source: 'POS Terminal',
    target: 'ERP System',
    entity: 'transactions',
    status: 'active',
    fieldsCount: 22,
    lastSync: '2025-01-15 14:28:00',
    mappings: [
      { sourceField: 'transaction_id', targetField: 'reference_number', type: 'direct', required: true },
      { sourceField: 'transaction_date', targetField: 'date', type: 'transform', required: true },
      { sourceField: 'customer_id', targetField: 'customer', type: 'lookup', required: false },
      { sourceField: 'total_amount', targetField: 'grand_total', type: 'direct', required: true },
      { sourceField: 'discount_amount', targetField: 'discount', type: 'direct', required: false },
      { sourceField: 'tax_amount', targetField: 'tax', type: 'direct', required: true },
      { sourceField: 'payment_method', targetField: 'payment_type', type: 'lookup', required: true },
      { sourceField: 'cashier_id', targetField: 'processed_by', type: 'lookup', required: true },
      { sourceField: 'terminal_id', targetField: 'pos_terminal', type: 'direct', required: true },
    ],
  },
  {
    id: 3,
    name: 'Customer Sync Mapping',
    source: 'POS Terminal',
    target: 'ERP System',
    entity: 'customers',
    status: 'active',
    fieldsCount: 12,
    lastSync: '2025-01-15 14:00:00',
    mappings: [
      { sourceField: 'customer_code', targetField: 'customer_id', type: 'direct', required: true },
      { sourceField: 'first_name', targetField: 'first_name', type: 'direct', required: true },
      { sourceField: 'last_name', targetField: 'last_name', type: 'direct', required: true },
      { sourceField: 'email', targetField: 'email', type: 'direct', required: false },
      { sourceField: 'phone', targetField: 'mobile', type: 'transform', required: false },
      { sourceField: 'loyalty_points', targetField: 'points_balance', type: 'direct', required: false },
    ],
  },
  {
    id: 4,
    name: 'Inventory Sync Mapping',
    source: 'ERP System',
    target: 'POS Terminal',
    entity: 'inventory',
    status: 'active',
    fieldsCount: 8,
    lastSync: '2025-01-15 14:25:00',
    mappings: [
      { sourceField: 'sku', targetField: 'item_code', type: 'direct', required: true },
      { sourceField: 'stock_quantity', targetField: 'qty_on_hand', type: 'direct', required: true },
      { sourceField: 'reorder_level', targetField: 'min_stock', type: 'direct', required: false },
      { sourceField: 'warehouse_id', targetField: 'location_id', type: 'lookup', required: true },
    ],
  },
  {
    id: 5,
    name: 'Discount Sync Mapping',
    source: 'ERP System',
    target: 'POS Terminal',
    entity: 'discounts',
    status: 'inactive',
    fieldsCount: 10,
    lastSync: '2025-01-14 18:00:00',
    mappings: [
      { sourceField: 'discount_code', targetField: 'promo_code', type: 'direct', required: true },
      { sourceField: 'discount_name', targetField: 'name', type: 'direct', required: true },
      { sourceField: 'discount_type', targetField: 'type', type: 'lookup', required: true },
      { sourceField: 'value', targetField: 'amount', type: 'direct', required: true },
      { sourceField: 'start_date', targetField: 'valid_from', type: 'transform', required: true },
      { sourceField: 'end_date', targetField: 'valid_until', type: 'transform', required: true },
    ],
  },
];

// Mock lookup tables
const mockLookupTables = [
  { id: 1, name: 'category_mapping', source: 'category_id', target: 'category', records: 45 },
  { id: 2, name: 'payment_method_mapping', source: 'payment_method', target: 'payment_type', records: 8 },
  { id: 3, name: 'tax_code_mapping', source: 'tax_code', target: 'tax_rate', records: 5 },
  { id: 4, name: 'employee_mapping', source: 'cashier_id', target: 'processed_by', records: 24 },
  { id: 5, name: 'warehouse_mapping', source: 'warehouse_id', target: 'location_id', records: 6 },
];

// Mock transformation rules
const mockTransformations = [
  { id: 1, name: 'Boolean to Status', input: 'is_active (true/false)', output: 'status (Active/Inactive)', entity: 'products' },
  { id: 2, name: 'Date Format', input: 'transaction_date (YYYY-MM-DD HH:mm:ss)', output: 'date (ISO 8601)', entity: 'transactions' },
  { id: 3, name: 'Phone Format', input: 'phone (+639XXXXXXXXX)', output: 'mobile (09XXXXXXXXX)', entity: 'customers' },
  { id: 4, name: 'Date Range', input: 'start_date/end_date', output: 'valid_from/valid_until (UTC)', entity: 'discounts' },
];

const DataMapping = () => {
  const [mappings] = useState(mockFieldMappings);
  const [selectedMapping, setSelectedMapping] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingField, setEditingField] = useState(null);

  // Statistics
  const stats = {
    totalMappings: mappings.length,
    activeMappings: mappings.filter(m => m.status === 'active').length,
    totalFields: mappings.reduce((sum, m) => sum + m.fieldsCount, 0),
    lookupTables: mockLookupTables.length,
  };

  const getMappingTypeConfig = (type) => {
    const config = {
      direct: { color: 'green', text: 'Direct', icon: <ArrowRightOutlined /> },
      lookup: { color: 'blue', text: 'Lookup', icon: <DatabaseOutlined /> },
      transform: { color: 'purple', text: 'Transform', icon: <CodeOutlined /> },
      custom: { color: 'orange', text: 'Custom', icon: <SettingOutlined /> },
    };
    return config[type] || { color: 'default', text: type };
  };

  const handleViewMapping = (mapping) => {
    setSelectedMapping(mapping);
    setDetailModalVisible(true);
  };

  const handleEditField = (field) => {
    setEditingField(field);
    setEditModalVisible(true);
  };

  const handleTestMapping = (mapping) => {
    Modal.info({
      title: 'Testing Mapping',
      content: (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <SyncOutlined spin style={{ fontSize: 32, color: '#1890ff', marginBottom: 16 }} />
          <div>Testing {mapping.name}...</div>
          <div style={{ marginTop: 8 }}>
            <Text type="secondary">Validating field mappings and connections</Text>
          </div>
        </div>
      ),
    });
  };

  const columns = [
    {
      title: 'Mapping Name',
      key: 'name',
      render: (_, record) => (
        <Space>
          <Avatar 
            icon={<SwapOutlined />} 
            style={{ backgroundColor: record.status === 'active' ? '#1890ff' : '#d9d9d9' }}
          />
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.entity}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Direction',
      key: 'direction',
      render: (_, record) => (
        <Space>
          <Tag icon={record.source === 'POS Terminal' ? <DesktopOutlined /> : <CloudServerOutlined />}>
            {record.source}
          </Tag>
          <ArrowRightOutlined />
          <Tag icon={record.target === 'ERP System' ? <CloudServerOutlined /> : <DesktopOutlined />}>
            {record.target}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Fields',
      dataIndex: 'fieldsCount',
      render: (count) => <Badge count={count} style={{ backgroundColor: '#1890ff' }} />,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Last Sync',
      dataIndex: 'lastSync',
      render: (date) => <Text type="secondary">{date}</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button 
              type="link" 
              icon={<FileTextOutlined />}
              onClick={() => handleViewMapping(record)}
            />
          </Tooltip>
          <Tooltip title="Test Mapping">
            <Button 
              type="link" 
              icon={<SyncOutlined />}
              onClick={() => handleTestMapping(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button type="link" icon={<EditOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const fieldColumns = [
    {
      title: 'Source Field',
      dataIndex: 'sourceField',
      render: (field) => <Text code>{field}</Text>,
    },
    {
      title: '',
      key: 'arrow',
      width: 50,
      render: () => <ArrowRightOutlined style={{ color: '#1890ff' }} />,
    },
    {
      title: 'Target Field',
      dataIndex: 'targetField',
      render: (field) => <Text code>{field}</Text>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      render: (type) => {
        const config = getMappingTypeConfig(type);
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: 'Required',
      dataIndex: 'required',
      render: (required) => (
        required ? (
          <Tag color="red">Required</Tag>
        ) : (
          <Tag>Optional</Tag>
        )
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEditField(record)} />
          <Button type="link" size="small" danger icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  const renderMappingOverview = () => (
    <div>
      <Alert
        message="Data Mapping Configuration"
        description="Configure how data fields are mapped between POS terminals and the ERP system. Proper mapping ensures accurate data synchronization."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Table
        columns={columns}
        dataSource={mappings}
        rowKey="id"
        pagination={false}
      />
    </div>
  );

  const renderLookupTables = () => (
    <div>
      <Alert
        message="Lookup Tables"
        description="Lookup tables are used to translate values between different systems. For example, mapping POS category IDs to ERP category codes."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[16, 16]}>
        {mockLookupTables.map((table) => (
          <Col xs={24} sm={12} md={8} key={table.id}>
            <Card 
              size="small"
              title={
                <Space>
                  <DatabaseOutlined />
                  {table.name}
                </Space>
              }
              extra={
                <Space>
                  <Button type="link" size="small" icon={<EditOutlined />} />
                  <Button type="link" size="small" icon={<ReloadOutlined />} />
                </Space>
              }
            >
              <Descriptions column={1} size="small">
                <Descriptions.Item label="Source Field">
                  <Text code>{table.source}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Target Field">
                  <Text code>{table.target}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Records">
                  <Badge count={table.records} style={{ backgroundColor: '#52c41a' }} />
                </Descriptions.Item>
              </Descriptions>
              <Divider style={{ margin: '12px 0' }} />
              <Button type="dashed" block icon={<FileTextOutlined />}>
                View Entries
              </Button>
            </Card>
          </Col>
        ))}
        <Col xs={24} sm={12} md={8}>
          <Card 
            size="small"
            style={{ 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              minHeight: 200,
              border: '1px dashed #d9d9d9',
            }}
          >
            <Button type="dashed" icon={<PlusOutlined />}>
              Add Lookup Table
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderTransformations = () => (
    <div>
      <Alert
        message="Data Transformations"
        description="Transformations convert data from one format to another during sync. This includes date formats, phone number formats, status codes, etc."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <List
        dataSource={mockTransformations}
        renderItem={(item) => (
          <Card size="small" style={{ marginBottom: 16 }}>
            <Row align="middle" gutter={16}>
              <Col xs={24} sm={6}>
                <Space>
                  <Avatar icon={<CodeOutlined />} style={{ backgroundColor: '#722ed1' }} />
                  <div>
                    <Text strong>{item.name}</Text>
                    <div>
                      <Tag size="small">{item.entity}</Tag>
                    </div>
                  </div>
                </Space>
              </Col>
              <Col xs={24} sm={7}>
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>Input Format</Text>
                  <div><Text code style={{ fontSize: 11 }}>{item.input}</Text></div>
                </div>
              </Col>
              <Col xs={24} sm={2} style={{ textAlign: 'center' }}>
                <ArrowRightOutlined style={{ color: '#722ed1', fontSize: 18 }} />
              </Col>
              <Col xs={24} sm={7}>
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>Output Format</Text>
                  <div><Text code style={{ fontSize: 11 }}>{item.output}</Text></div>
                </div>
              </Col>
              <Col xs={24} sm={2}>
                <Space>
                  <Button type="link" size="small" icon={<EditOutlined />} />
                  <Button type="link" size="small" danger icon={<DeleteOutlined />} />
                </Space>
              </Col>
            </Row>
          </Card>
        )}
      />

      <Button type="dashed" icon={<PlusOutlined />} style={{ marginTop: 16 }}>
        Add Transformation Rule
      </Button>
    </div>
  );

  const renderValidation = () => (
    <div>
      <Alert
        message="Validation Rules"
        description="Configure validation rules to ensure data integrity during synchronization. Invalid data will be flagged or rejected."
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Collapse defaultActiveKey={['1']}>
        <Panel header="Required Field Validation" key="1">
          <List
            size="small"
            dataSource={[
              { field: 'sku', entity: 'products', rule: 'Must not be empty' },
              { field: 'name', entity: 'products', rule: 'Must not be empty, max 255 chars' },
              { field: 'selling_price', entity: 'products', rule: 'Must be > 0' },
              { field: 'reference_number', entity: 'transactions', rule: 'Must be unique' },
              { field: 'grand_total', entity: 'transactions', rule: 'Must be >= 0' },
            ]}
            renderItem={(item) => (
              <List.Item>
                <Space>
                  <Tag>{item.entity}</Tag>
                  <Text code>{item.field}</Text>
                  <Text type="secondary">{item.rule}</Text>
                </Space>
              </List.Item>
            )}
          />
        </Panel>
        <Panel header="Data Type Validation" key="2">
          <List
            size="small"
            dataSource={[
              { field: 'selling_price', type: 'Decimal', precision: '2 decimal places' },
              { field: 'stock_quantity', type: 'Integer', precision: 'Whole numbers only' },
              { field: 'date', type: 'DateTime', precision: 'ISO 8601 format' },
              { field: 'email', type: 'Email', precision: 'Valid email format' },
              { field: 'mobile', type: 'Phone', precision: 'Philippine format' },
            ]}
            renderItem={(item) => (
              <List.Item>
                <Space>
                  <Text code>{item.field}</Text>
                  <Tag color="blue">{item.type}</Tag>
                  <Text type="secondary">{item.precision}</Text>
                </Space>
              </List.Item>
            )}
          />
        </Panel>
        <Panel header="Reference Validation" key="3">
          <List
            size="small"
            dataSource={[
              { field: 'category', check: 'Must exist in categories table' },
              { field: 'customer', check: 'Must exist in customers table or be null' },
              { field: 'warehouse_id', check: 'Must exist in warehouses table' },
              { field: 'processed_by', check: 'Must exist in employees table' },
            ]}
            renderItem={(item) => (
              <List.Item>
                <Space>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  <Text code>{item.field}</Text>
                  <Text type="secondary">{item.check}</Text>
                </Space>
              </List.Item>
            )}
          />
        </Panel>
      </Collapse>

      <Space style={{ marginTop: 24 }}>
        <Button type="primary" icon={<SyncOutlined />}>
          Validate All Mappings
        </Button>
        <Button icon={<PlusOutlined />}>
          Add Validation Rule
        </Button>
      </Space>
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Data Mapping"
        subtitle="Configure field mappings between POS terminals and ERP system"
        actions={[
          <Button key="import" icon={<CopyOutlined />}>
            Import Mapping
          </Button>,
          <Button key="validate" icon={<CheckCircleOutlined />}>
            Validate All
          </Button>,
          <Button key="add" type="primary" icon={<PlusOutlined />}>
            New Mapping
          </Button>,
        ]}
      />

      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <StatCard
            title="Total Mappings"
            value={stats.totalMappings}
            icon={<SwapOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard
            title="Active"
            value={stats.activeMappings}
            icon={<CheckCircleOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard
            title="Total Fields"
            value={stats.totalFields}
            icon={<DatabaseOutlined />}
            color="#722ed1"
          />
        </Col>
        <Col xs={12} sm={6}>
          <StatCard
            title="Lookup Tables"
            value={stats.lookupTables}
            icon={<LinkOutlined />}
            color="#faad14"
          />
        </Col>
      </Row>

      {/* Tabs */}
      <Card>
        <Tabs
          items={[
            {
              key: 'mappings',
              label: (
                <span>
                  <SwapOutlined />
                  Field Mappings
                </span>
              ),
              children: renderMappingOverview(),
            },
            {
              key: 'lookups',
              label: (
                <span>
                  <DatabaseOutlined />
                  Lookup Tables
                  <Badge count={mockLookupTables.length} style={{ marginLeft: 8 }} />
                </span>
              ),
              children: renderLookupTables(),
            },
            {
              key: 'transformations',
              label: (
                <span>
                  <CodeOutlined />
                  Transformations
                </span>
              ),
              children: renderTransformations(),
            },
            {
              key: 'validation',
              label: (
                <span>
                  <CheckCircleOutlined />
                  Validation Rules
                </span>
              ),
              children: renderValidation(),
            },
          ]}
        />
      </Card>

      {/* Mapping Detail Modal */}
      <Modal
        title={selectedMapping?.name}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={900}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Close
          </Button>,
          <Button key="test" icon={<SyncOutlined />}>
            Test Mapping
          </Button>,
          <Button key="save" type="primary" icon={<SaveOutlined />}>
            Save Changes
          </Button>,
        ]}
      >
        {selectedMapping && (
          <div>
            <Descriptions column={3} style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Entity">{selectedMapping.entity}</Descriptions.Item>
              <Descriptions.Item label="Source">{selectedMapping.source}</Descriptions.Item>
              <Descriptions.Item label="Target">{selectedMapping.target}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={selectedMapping.status === 'active' ? 'success' : 'default'}>
                  {selectedMapping.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Fields">{selectedMapping.fieldsCount}</Descriptions.Item>
              <Descriptions.Item label="Last Sync">{selectedMapping.lastSync}</Descriptions.Item>
            </Descriptions>

            <Divider>Field Mappings</Divider>

            <Table
              columns={fieldColumns}
              dataSource={selectedMapping.mappings}
              rowKey="sourceField"
              pagination={false}
              size="small"
            />

            <Button 
              type="dashed" 
              icon={<PlusOutlined />} 
              style={{ marginTop: 16 }}
              block
            >
              Add Field Mapping
            </Button>
          </div>
        )}
      </Modal>

      {/* Edit Field Modal */}
      <Modal
        title="Edit Field Mapping"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => setEditModalVisible(false)}
      >
        {editingField && (
          <Form layout="vertical">
            <Form.Item label="Source Field">
              <Input defaultValue={editingField.sourceField} />
            </Form.Item>
            <Form.Item label="Target Field">
              <Input defaultValue={editingField.targetField} />
            </Form.Item>
            <Form.Item label="Mapping Type">
              <Select defaultValue={editingField.type}>
                <Select.Option value="direct">Direct Mapping</Select.Option>
                <Select.Option value="lookup">Lookup Table</Select.Option>
                <Select.Option value="transform">Transformation</Select.Option>
                <Select.Option value="custom">Custom Function</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Required">
              <Switch defaultChecked={editingField.required} />
            </Form.Item>
            <Form.Item label="Default Value">
              <Input placeholder="Value to use if source is empty" />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default DataMapping;
