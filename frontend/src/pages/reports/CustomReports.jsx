import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Input, Select, Tag, 
  Typography, DatePicker, Form, Checkbox, Drawer, List, message
} from 'antd';
import {
  PlusOutlined,
  ExportOutlined,
  PrinterOutlined,
  PlayCircleOutlined,
  SettingOutlined,
  FileTextOutlined,
  SaveOutlined,
  CalendarOutlined,
  FilterOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  TableOutlined,
  ClockCircleOutlined,
  StarOutlined,
  StarFilled,
} from '@ant-design/icons';
import { PageHeader, FormDrawer } from '../../components/Common';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;
const { Search } = Input;

// Mock saved reports
const mockSavedReports = [
  {
    id: 1,
    name: 'Monthly Sales by Branch',
    description: 'Compare sales performance across all branches',
    type: 'sales',
    format: 'table',
    lastRun: '2024-01-15 14:30',
    schedule: 'monthly',
    isFavorite: true,
    filters: {
      dateRange: 'last_month',
      groupBy: 'branch',
    },
  },
  {
    id: 2,
    name: 'Inventory Valuation Report',
    description: 'Current inventory value by category and warehouse',
    type: 'inventory',
    format: 'table',
    lastRun: '2024-01-15 09:00',
    schedule: 'weekly',
    isFavorite: true,
    filters: {
      dateRange: 'current',
      groupBy: 'category',
    },
  },
  {
    id: 3,
    name: 'Top 20 Products by Revenue',
    description: 'Best selling products ranked by total revenue',
    type: 'sales',
    format: 'chart',
    lastRun: '2024-01-14 16:45',
    schedule: null,
    isFavorite: false,
    filters: {
      dateRange: 'last_30_days',
      limit: 20,
    },
  },
  {
    id: 4,
    name: 'Accounts Aging Report',
    description: 'Outstanding receivables by aging bucket',
    type: 'financial',
    format: 'table',
    lastRun: '2024-01-15 08:00',
    schedule: 'daily',
    isFavorite: true,
    filters: {
      dateRange: 'current',
      groupBy: 'customer',
    },
  },
  {
    id: 5,
    name: 'Employee Attendance Summary',
    description: 'Monthly attendance rates by department',
    type: 'hr',
    format: 'chart',
    lastRun: '2024-01-12 10:00',
    schedule: 'monthly',
    isFavorite: false,
    filters: {
      dateRange: 'last_month',
      groupBy: 'department',
    },
  },
  {
    id: 6,
    name: 'Cash Flow Statement',
    description: 'Monthly cash inflows and outflows',
    type: 'financial',
    format: 'table',
    lastRun: '2024-01-10 11:30',
    schedule: 'monthly',
    isFavorite: false,
    filters: {
      dateRange: 'last_month',
    },
  },
];

const reportTemplates = [
  { id: 1, name: 'Sales by Product', type: 'sales', icon: <BarChartOutlined /> },
  { id: 2, name: 'Sales by Customer', type: 'sales', icon: <PieChartOutlined /> },
  { id: 3, name: 'Sales by Region', type: 'sales', icon: <BarChartOutlined /> },
  { id: 4, name: 'Sales Trend', type: 'sales', icon: <LineChartOutlined /> },
  { id: 5, name: 'Stock Valuation', type: 'inventory', icon: <TableOutlined /> },
  { id: 6, name: 'Stock Movement', type: 'inventory', icon: <LineChartOutlined /> },
  { id: 7, name: 'Reorder Report', type: 'inventory', icon: <TableOutlined /> },
  { id: 8, name: 'Profit & Loss', type: 'financial', icon: <TableOutlined /> },
  { id: 9, name: 'Balance Sheet', type: 'financial', icon: <TableOutlined /> },
  { id: 10, name: 'Expense Analysis', type: 'financial', icon: <PieChartOutlined /> },
  { id: 11, name: 'Payroll Summary', type: 'hr', icon: <TableOutlined /> },
  { id: 12, name: 'Attendance Report', type: 'hr', icon: <BarChartOutlined /> },
];

const CustomReports = () => {
  const [reports, setReports] = useState(mockSavedReports);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState(null);
  const [createDrawerVisible, setCreateDrawerVisible] = useState(false);
  const [configDrawerVisible, setConfigDrawerVisible] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [form] = Form.useForm();

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesSearch = !searchText || 
      report.name.toLowerCase().includes(searchText.toLowerCase()) ||
      report.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = !filterType || report.type === filterType;
    return matchesSearch && matchesType;
  });

  const favoriteReports = filteredReports.filter(r => r.isFavorite);
  const otherReports = filteredReports.filter(r => !r.isFavorite);

  const getTypeConfig = (type) => {
    const configs = {
      'sales': { color: 'blue', text: 'Sales' },
      'inventory': { color: 'green', text: 'Inventory' },
      'financial': { color: 'gold', text: 'Financial' },
      'hr': { color: 'purple', text: 'HR' },
    };
    return configs[type] || { color: 'default', text: type };
  };

  const getFormatIcon = (format) => {
    return format === 'chart' ? <BarChartOutlined /> : <TableOutlined />;
  };

  const getScheduleTag = (schedule) => {
    if (!schedule) return null;
    const schedules = {
      'daily': { color: 'blue', text: 'Daily' },
      'weekly': { color: 'cyan', text: 'Weekly' },
      'monthly': { color: 'purple', text: 'Monthly' },
    };
    return schedules[schedule] ? (
      <Tag color={schedules[schedule].color} icon={<ClockCircleOutlined />}>
        {schedules[schedule].text}
      </Tag>
    ) : null;
  };

  const handleToggleFavorite = (report) => {
    setReports(reports.map(r => 
      r.id === report.id ? { ...r, isFavorite: !r.isFavorite } : r
    ));
    message.success(report.isFavorite ? 'Removed from favorites' : 'Added to favorites');
  };

  const handleRunReport = () => {
    message.loading('Generating report...', 1.5).then(() => {
      message.success('Report generated successfully');
    });
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setCreateDrawerVisible(false);
    setConfigDrawerVisible(true);
  };

  const handleCreateReport = (values) => {
    const newReport = {
      id: reports.length + 1,
      name: values.name,
      description: values.description,
      type: selectedTemplate.type,
      format: values.format,
      lastRun: null,
      schedule: values.schedule,
      isFavorite: false,
      filters: values,
    };
    setReports([newReport, ...reports]);
    setConfigDrawerVisible(false);
    message.success('Report created successfully');
  };

  // Table columns
  const columns = [
    {
      title: 'Report',
      key: 'report',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={record.isFavorite ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
            onClick={() => handleToggleFavorite(record)}
            size="small"
          />
          <div>
            <Text strong>{record.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>{record.description}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => {
        const config = getTypeConfig(type);
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Format',
      dataIndex: 'format',
      key: 'format',
      width: 80,
      align: 'center',
      render: (format) => getFormatIcon(format),
    },
    {
      title: 'Schedule',
      dataIndex: 'schedule',
      key: 'schedule',
      width: 120,
      render: (schedule) => getScheduleTag(schedule) || <Text type="secondary">Manual</Text>,
    },
    {
      title: 'Last Run',
      dataIndex: 'lastRun',
      key: 'lastRun',
      width: 150,
      render: (lastRun) => lastRun ? (
        <Text type="secondary">{dayjs(lastRun).format('MMM D, HH:mm')}</Text>
      ) : <Text type="secondary">Never</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            icon={<PlayCircleOutlined />}
            onClick={() => handleRunReport(record)}
          >
            Run
          </Button>
          <Button 
            type="text" 
            size="small" 
            icon={<SettingOutlined />}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Custom Reports"
        subtitle="Create and manage custom reports"
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'Reports', path: '/reports' },
          { title: 'Custom', path: '/reports/custom' },
        ]}
        actions={[
          <Button 
            key="create" 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setCreateDrawerVisible(true)}
          >
            New Report
          </Button>,
        ]}
      />

      {/* Quick Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <Text type="secondary">Total Reports</Text>
            <Title level={3} style={{ margin: '8px 0' }}>{reports.length}</Title>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <Text type="secondary">Favorites</Text>
            <Title level={3} style={{ margin: '8px 0', color: '#faad14' }}>
              {reports.filter(r => r.isFavorite).length}
            </Title>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <Text type="secondary">Scheduled</Text>
            <Title level={3} style={{ margin: '8px 0', color: '#1890ff' }}>
              {reports.filter(r => r.schedule).length}
            </Title>
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <Text type="secondary">Run Today</Text>
            <Title level={3} style={{ margin: '8px 0', color: '#52c41a' }}>
              {reports.filter(r => r.lastRun && dayjs(r.lastRun).isSame(dayjs(), 'day')).length}
            </Title>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 24 }}>
        <Space wrap>
          <Search
            placeholder="Search reports..."
            allowClear
            style={{ width: 250 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            placeholder="All Types"
            allowClear
            style={{ width: 130 }}
            value={filterType}
            onChange={setFilterType}
            options={[
              { label: 'Sales', value: 'sales' },
              { label: 'Inventory', value: 'inventory' },
              { label: 'Financial', value: 'financial' },
              { label: 'HR', value: 'hr' },
            ]}
          />
        </Space>
      </Card>

      {/* Favorite Reports */}
      {favoriteReports.length > 0 && (
        <Card 
          title={<><StarFilled style={{ color: '#faad14' }} /> Favorite Reports</>}
          size="small"
          style={{ marginBottom: 24 }}
        >
          <Row gutter={[16, 16]}>
            {favoriteReports.map(report => (
              <Col xs={24} sm={12} md={8} lg={6} key={report.id}>
                <Card 
                  size="small" 
                  hoverable
                  actions={[
                    <Button 
                      type="text" 
                      icon={<PlayCircleOutlined />} 
                      onClick={() => handleRunReport(report)}
                    >
                      Run
                    </Button>,
                    <Button type="text" icon={<ExportOutlined />}>Export</Button>,
                  ]}
                >
                  <div style={{ marginBottom: 8 }}>
                    <Tag color={getTypeConfig(report.type).color}>
                      {getTypeConfig(report.type).text}
                    </Tag>
                    {getFormatIcon(report.format)}
                  </div>
                  <Text strong>{report.name}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    {report.lastRun ? `Last run: ${dayjs(report.lastRun).format('MMM D')}` : 'Never run'}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      {/* All Reports Table */}
      <Card title={<><FileTextOutlined /> All Reports</>} size="small">
        <Table
          columns={columns}
          dataSource={otherReports}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} reports`,
          }}
        />
      </Card>

      {/* Create Report Drawer - Template Selection */}
      <Drawer
        title="Create New Report"
        placement="right"
        width={500}
        open={createDrawerVisible}
        onClose={() => setCreateDrawerVisible(false)}
      >
        <Text type="secondary">Select a report template to get started:</Text>
        
        <div style={{ marginTop: 24 }}>
          <Title level={5}>Sales Reports</Title>
          <List
            dataSource={reportTemplates.filter(t => t.type === 'sales')}
            renderItem={template => (
              <List.Item 
                style={{ cursor: 'pointer', padding: '12px', borderRadius: 8 }}
                onClick={() => handleSelectTemplate(template)}
              >
                <List.Item.Meta
                  avatar={template.icon}
                  title={template.name}
                />
              </List.Item>
            )}
          />
          
          <Title level={5} style={{ marginTop: 24 }}>Inventory Reports</Title>
          <List
            dataSource={reportTemplates.filter(t => t.type === 'inventory')}
            renderItem={template => (
              <List.Item 
                style={{ cursor: 'pointer', padding: '12px', borderRadius: 8 }}
                onClick={() => handleSelectTemplate(template)}
              >
                <List.Item.Meta
                  avatar={template.icon}
                  title={template.name}
                />
              </List.Item>
            )}
          />
          
          <Title level={5} style={{ marginTop: 24 }}>Financial Reports</Title>
          <List
            dataSource={reportTemplates.filter(t => t.type === 'financial')}
            renderItem={template => (
              <List.Item 
                style={{ cursor: 'pointer', padding: '12px', borderRadius: 8 }}
                onClick={() => handleSelectTemplate(template)}
              >
                <List.Item.Meta
                  avatar={template.icon}
                  title={template.name}
                />
              </List.Item>
            )}
          />
          
          <Title level={5} style={{ marginTop: 24 }}>HR Reports</Title>
          <List
            dataSource={reportTemplates.filter(t => t.type === 'hr')}
            renderItem={template => (
              <List.Item 
                style={{ cursor: 'pointer', padding: '12px', borderRadius: 8 }}
                onClick={() => handleSelectTemplate(template)}
              >
                <List.Item.Meta
                  avatar={template.icon}
                  title={template.name}
                />
              </List.Item>
            )}
          />
        </div>
      </Drawer>

      {/* Configure Report Drawer */}
      <FormDrawer
        title={`Configure: ${selectedTemplate?.name || 'Report'}`}
        open={configDrawerVisible}
        onClose={() => setConfigDrawerVisible(false)}
        onSubmit={handleCreateReport}
        form={form}
        width={500}
        submitText="Create Report"
      >
        <Form.Item
          name="name"
          label="Report Name"
          rules={[{ required: true, message: 'Please enter report name' }]}
          initialValue={selectedTemplate?.name}
        >
          <Input placeholder="e.g., Monthly Sales Summary" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea rows={2} placeholder="Brief description of this report" />
        </Form.Item>
        <Form.Item
          name="dateRange"
          label="Date Range"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { label: 'Today', value: 'today' },
              { label: 'Yesterday', value: 'yesterday' },
              { label: 'Last 7 Days', value: 'last_7_days' },
              { label: 'Last 30 Days', value: 'last_30_days' },
              { label: 'This Month', value: 'this_month' },
              { label: 'Last Month', value: 'last_month' },
              { label: 'This Quarter', value: 'this_quarter' },
              { label: 'This Year', value: 'this_year' },
              { label: 'Custom', value: 'custom' },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="format"
          label="Output Format"
          initialValue="table"
        >
          <Select
            options={[
              { label: 'Table', value: 'table' },
              { label: 'Chart', value: 'chart' },
              { label: 'Both', value: 'both' },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="groupBy"
          label="Group By"
        >
          <Select
            placeholder="Select grouping"
            allowClear
            options={[
              { label: 'Product', value: 'product' },
              { label: 'Category', value: 'category' },
              { label: 'Branch', value: 'branch' },
              { label: 'Customer', value: 'customer' },
              { label: 'Date', value: 'date' },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="schedule"
          label="Schedule"
        >
          <Select
            placeholder="Manual (no schedule)"
            allowClear
            options={[
              { label: 'Daily', value: 'daily' },
              { label: 'Weekly', value: 'weekly' },
              { label: 'Monthly', value: 'monthly' },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="emailRecipients"
          label="Email Recipients"
        >
          <Input placeholder="email@example.com (comma separated)" />
        </Form.Item>
      </FormDrawer>
    </div>
  );
};

export default CustomReports;
