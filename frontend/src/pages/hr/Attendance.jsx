import { useState } from 'react';
import { 
  Row, Col, Card, Table, Button, Space, Input, Select, Tag, 
  Tooltip, Typography, DatePicker, Statistic, Badge,
  Calendar, Drawer, Descriptions, Avatar, Timeline, Progress
} from 'antd';
import {
  ExportOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  UserOutlined,
  TeamOutlined,
  FieldTimeOutlined,
  ExclamationCircleOutlined,
  LoginOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

// Mock attendance data
const mockAttendance = [
  {
    id: 'ATT001',
    employeeId: 'EMP001',
    employeeName: 'Juan Dela Cruz',
    department: 'Sales',
    date: '2024-01-15',
    timeIn: '08:45',
    timeOut: '18:15',
    status: 'present',
    hoursWorked: 9.5,
    overtime: 0.5,
    lateMinutes: 0,
    undertimeMinutes: 0,
    breakDuration: 60,
    notes: '',
  },
  {
    id: 'ATT002',
    employeeId: 'EMP002',
    employeeName: 'Maria Santos',
    department: 'HR',
    date: '2024-01-15',
    timeIn: '08:30',
    timeOut: '17:30',
    status: 'present',
    hoursWorked: 9,
    overtime: 0,
    lateMinutes: 0,
    undertimeMinutes: 0,
    breakDuration: 60,
    notes: '',
  },
  {
    id: 'ATT003',
    employeeId: 'EMP003',
    employeeName: 'Pedro Reyes',
    department: 'Sales',
    date: '2024-01-15',
    timeIn: '09:15',
    timeOut: '17:30',
    status: 'late',
    hoursWorked: 8.25,
    overtime: 0,
    lateMinutes: 45,
    undertimeMinutes: 0,
    breakDuration: 60,
    notes: 'Traffic due to accident on EDSA',
  },
  {
    id: 'ATT004',
    employeeId: 'EMP004',
    employeeName: 'Ana Garcia',
    department: 'HR',
    date: '2024-01-15',
    timeIn: '08:28',
    timeOut: '17:35',
    status: 'present',
    hoursWorked: 9.1,
    overtime: 0,
    lateMinutes: 0,
    undertimeMinutes: 0,
    breakDuration: 60,
    notes: '',
  },
  {
    id: 'ATT005',
    employeeId: 'EMP005',
    employeeName: 'Carlos Tan',
    department: 'IT',
    date: '2024-01-15',
    timeIn: null,
    timeOut: null,
    status: 'absent',
    hoursWorked: 0,
    overtime: 0,
    lateMinutes: 0,
    undertimeMinutes: 0,
    breakDuration: 0,
    notes: 'Sick leave - flu',
  },
  {
    id: 'ATT006',
    employeeId: 'EMP006',
    employeeName: 'Lisa Wong',
    department: 'Finance',
    date: '2024-01-15',
    timeIn: '08:55',
    timeOut: '16:30',
    status: 'undertime',
    hoursWorked: 7.6,
    overtime: 0,
    lateMinutes: 0,
    undertimeMinutes: 60,
    breakDuration: 60,
    notes: 'Early out - personal emergency',
  },
  {
    id: 'ATT007',
    employeeId: 'EMP007',
    employeeName: 'Roberto Lim',
    department: 'Finance',
    date: '2024-01-15',
    timeIn: '08:30',
    timeOut: '20:00',
    status: 'present',
    hoursWorked: 11.5,
    overtime: 2.5,
    lateMinutes: 0,
    undertimeMinutes: 0,
    breakDuration: 60,
    notes: 'Working on month-end reports',
  },
  {
    id: 'ATT008',
    employeeId: 'EMP008',
    employeeName: 'Elena Flores',
    department: 'Operations',
    date: '2024-01-15',
    timeIn: null,
    timeOut: null,
    status: 'leave',
    hoursWorked: 0,
    overtime: 0,
    lateMinutes: 0,
    undertimeMinutes: 0,
    breakDuration: 0,
    notes: 'Vacation leave - approved',
  },
];

const departments = ['Sales', 'HR', 'IT', 'Finance', 'Operations', 'Marketing', 'Warehouse'];

const Attendance = () => {
  const [attendance] = useState(mockAttendance);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState(null);
  const [filterDepartment, setFilterDepartment] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs('2024-01-15'));
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Calculate stats
  const presentCount = attendance.filter(a => a.status === 'present').length;
  const lateCount = attendance.filter(a => a.status === 'late').length;
  const absentCount = attendance.filter(a => a.status === 'absent').length;
  const onLeaveCount = attendance.filter(a => a.status === 'leave').length;
  const totalHours = attendance.reduce((sum, a) => sum + a.hoursWorked, 0);
  const totalOvertime = attendance.reduce((sum, a) => sum + a.overtime, 0);

  // Filter attendance
  const filteredAttendance = attendance.filter(record => {
    const matchesSearch = !searchText || 
      record.employeeName.toLowerCase().includes(searchText.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = !filterStatus || record.status === filterStatus;
    const matchesDepartment = !filterDepartment || record.department === filterDepartment;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const getStatusConfig = (status) => {
    const configs = {
      'present': { color: 'success', text: 'Present', icon: <CheckCircleOutlined /> },
      'late': { color: 'warning', text: 'Late', icon: <ClockCircleOutlined /> },
      'absent': { color: 'error', text: 'Absent', icon: <CloseCircleOutlined /> },
      'leave': { color: 'blue', text: 'On Leave', icon: <CalendarOutlined /> },
      'undertime': { color: 'orange', text: 'Undertime', icon: <ExclamationCircleOutlined /> },
    };
    return configs[status] || configs['present'];
  };

  const getDepartmentColor = (dept) => {
    const colors = {
      'Sales': 'blue',
      'HR': 'purple',
      'IT': 'cyan',
      'Finance': 'gold',
      'Operations': 'green',
      'Marketing': 'magenta',
      'Warehouse': 'orange',
    };
    return colors[dept] || 'default';
  };

  // Table columns
  const columns = [
    {
      title: 'Employee',
      key: 'employee',
      width: 220,
      fixed: 'left',
      render: (_, record) => (
        <Space>
          <Avatar 
            style={{ backgroundColor: getDepartmentColor(record.department) }}
          >
            {record.employeeName.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <div>
            <Text strong>{record.employeeName}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 11 }}>{record.employeeId}</Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 120,
      render: (dept) => <Tag color={getDepartmentColor(dept)}>{dept}</Tag>,
    },
    {
      title: 'Time In',
      dataIndex: 'timeIn',
      key: 'timeIn',
      width: 100,
      align: 'center',
      render: (time, record) => (
        time ? (
          <Space>
            <LoginOutlined style={{ color: record.lateMinutes > 0 ? '#faad14' : '#52c41a' }} />
            <Text>{time}</Text>
          </Space>
        ) : <Text type="secondary">-</Text>
      ),
    },
    {
      title: 'Time Out',
      dataIndex: 'timeOut',
      key: 'timeOut',
      width: 100,
      align: 'center',
      render: (time, record) => (
        time ? (
          <Space>
            <LogoutOutlined style={{ color: record.undertimeMinutes > 0 ? '#faad14' : '#52c41a' }} />
            <Text>{time}</Text>
          </Space>
        ) : <Text type="secondary">-</Text>
      ),
    },
    {
      title: 'Hours',
      dataIndex: 'hoursWorked',
      key: 'hoursWorked',
      width: 90,
      align: 'center',
      render: (hours) => hours > 0 ? `${hours}h` : '-',
    },
    {
      title: 'Overtime',
      dataIndex: 'overtime',
      key: 'overtime',
      width: 90,
      align: 'center',
      render: (ot) => ot > 0 ? <Text type="success">+{ot}h</Text> : '-',
    },
    {
      title: 'Late',
      dataIndex: 'lateMinutes',
      key: 'lateMinutes',
      width: 90,
      align: 'center',
      render: (mins) => mins > 0 ? <Text type="warning">{mins}m</Text> : '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const config = getStatusConfig(status);
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      width: 200,
      ellipsis: true,
      render: (notes) => notes || <Text type="secondary">-</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      fixed: 'right',
      render: (_, record) => (
        <Tooltip title="View Details">
          <Button 
            type="text" 
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          />
        </Tooltip>
      ),
    },
  ];

  // Handlers
  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setDetailDrawerVisible(true);
  };

  return (
    <div>
      <PageHeader
        title="Attendance"
        subtitle={`${selectedDate.format('MMMM D, YYYY')}`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'HR', path: '/hr' },
          { title: 'Attendance', path: '/hr/attendance' },
        ]}
        actions={[
          <DatePicker 
            key="date"
            value={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            allowClear={false}
          />,
          <Button key="export" icon={<ExportOutlined />}>Export</Button>,
        ]}
      />

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={8} md={4}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <Statistic 
              title="Present" 
              value={presentCount}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <Statistic 
              title="Late" 
              value={lateCount}
              valueStyle={{ color: '#faad14' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <Statistic 
              title="Absent" 
              value={absentCount}
              valueStyle={{ color: '#ff4d4f' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <Statistic 
              title="On Leave" 
              value={onLeaveCount}
              valueStyle={{ color: '#1890ff' }}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <Statistic 
              title="Total Hours" 
              value={totalHours.toFixed(1)}
              suffix="h"
              prefix={<FieldTimeOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card size="small" style={{ textAlign: 'center' }}>
            <Statistic 
              title="Overtime" 
              value={totalOvertime.toFixed(1)}
              suffix="h"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Attendance Rate Overview */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Today's Attendance" size="small">
            <Row gutter={16}>
              <Col span={6} style={{ textAlign: 'center' }}>
                <Progress 
                  type="circle" 
                  percent={Math.round((presentCount / attendance.length) * 100)}
                  strokeColor="#52c41a"
                  size={100}
                />
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">Present Rate</Text>
                </div>
              </Col>
              <Col span={6} style={{ textAlign: 'center' }}>
                <Progress 
                  type="circle" 
                  percent={Math.round((lateCount / attendance.length) * 100)}
                  strokeColor="#faad14"
                  size={100}
                />
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">Late Rate</Text>
                </div>
              </Col>
              <Col span={6} style={{ textAlign: 'center' }}>
                <Progress 
                  type="circle" 
                  percent={Math.round((absentCount / attendance.length) * 100)}
                  strokeColor="#ff4d4f"
                  size={100}
                />
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">Absent Rate</Text>
                </div>
              </Col>
              <Col span={6} style={{ textAlign: 'center' }}>
                <Progress 
                  type="circle" 
                  percent={Math.round((onLeaveCount / attendance.length) * 100)}
                  strokeColor="#1890ff"
                  size={100}
                />
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">Leave Rate</Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Department Summary" size="small" style={{ height: '100%' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {departments.slice(0, 5).map(dept => {
                const deptRecords = attendance.filter(a => a.department === dept);
                const deptPresent = deptRecords.filter(a => a.status === 'present' || a.status === 'late').length;
                return (
                  <div key={dept} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Tag color={getDepartmentColor(dept)}>{dept}</Tag>
                    <Text>{deptPresent}/{deptRecords.length} present</Text>
                  </div>
                );
              })}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Filters and Table */}
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Space wrap>
            <Search
              placeholder="Search employees..."
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
                { label: 'Present', value: 'present' },
                { label: 'Late', value: 'late' },
                { label: 'Absent', value: 'absent' },
                { label: 'On Leave', value: 'leave' },
                { label: 'Undertime', value: 'undertime' },
              ]}
            />
            <Select
              placeholder="Department"
              allowClear
              style={{ width: 140 }}
              value={filterDepartment}
              onChange={setFilterDepartment}
              options={departments.map(d => ({ label: d, value: d }))}
            />
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredAttendance}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1400 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} records`,
          }}
        />
      </Card>

      {/* Details Drawer */}
      <Drawer
        title="Attendance Details"
        placement="right"
        width={500}
        open={detailDrawerVisible}
        onClose={() => setDetailDrawerVisible(false)}
      >
        {selectedRecord && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar 
                size={60}
                style={{ backgroundColor: getDepartmentColor(selectedRecord.department) }}
              >
                {selectedRecord.employeeName.split(' ').map(n => n[0]).join('')}
              </Avatar>
              <Title level={4} style={{ marginTop: 12, marginBottom: 4 }}>
                {selectedRecord.employeeName}
              </Title>
              <Space>
                <Tag color={getDepartmentColor(selectedRecord.department)}>
                  {selectedRecord.department}
                </Tag>
                <Tag color={getStatusConfig(selectedRecord.status).color}>
                  {getStatusConfig(selectedRecord.status).text}
                </Tag>
              </Space>
            </div>

            <Card title="Time Log" size="small" style={{ marginBottom: 24 }}>
              <Timeline
                items={[
                  {
                    color: selectedRecord.lateMinutes > 0 ? 'orange' : 'green',
                    children: (
                      <div>
                        <Text strong>Time In</Text>
                        <br />
                        <Text>{selectedRecord.timeIn || 'Not recorded'}</Text>
                        {selectedRecord.lateMinutes > 0 && (
                          <Tag color="warning" style={{ marginLeft: 8 }}>
                            {selectedRecord.lateMinutes}m late
                          </Tag>
                        )}
                      </div>
                    ),
                  },
                  {
                    color: 'blue',
                    children: (
                      <div>
                        <Text strong>Break</Text>
                        <br />
                        <Text>{selectedRecord.breakDuration} minutes</Text>
                      </div>
                    ),
                  },
                  {
                    color: selectedRecord.undertimeMinutes > 0 ? 'orange' : 'green',
                    children: (
                      <div>
                        <Text strong>Time Out</Text>
                        <br />
                        <Text>{selectedRecord.timeOut || 'Not recorded'}</Text>
                        {selectedRecord.undertimeMinutes > 0 && (
                          <Tag color="warning" style={{ marginLeft: 8 }}>
                            {selectedRecord.undertimeMinutes}m undertime
                          </Tag>
                        )}
                      </div>
                    ),
                  },
                ]}
              />
            </Card>

            <Descriptions column={2} bordered size="small" style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Date">
                {dayjs(selectedRecord.date).format('MMMM D, YYYY')}
              </Descriptions.Item>
              <Descriptions.Item label="Employee ID">
                {selectedRecord.employeeId}
              </Descriptions.Item>
              <Descriptions.Item label="Hours Worked">
                <Text strong>{selectedRecord.hoursWorked}h</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Overtime">
                <Text type="success">{selectedRecord.overtime > 0 ? `+${selectedRecord.overtime}h` : '-'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Late Minutes">
                <Text type={selectedRecord.lateMinutes > 0 ? 'warning' : 'secondary'}>
                  {selectedRecord.lateMinutes > 0 ? `${selectedRecord.lateMinutes}m` : '-'}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Undertime">
                <Text type={selectedRecord.undertimeMinutes > 0 ? 'warning' : 'secondary'}>
                  {selectedRecord.undertimeMinutes > 0 ? `${selectedRecord.undertimeMinutes}m` : '-'}
                </Text>
              </Descriptions.Item>
            </Descriptions>

            {selectedRecord.notes && (
              <Card title="Notes" size="small">
                <Text>{selectedRecord.notes}</Text>
              </Card>
            )}
          </>
        )}
      </Drawer>
    </div>
  );
};

export default Attendance;
