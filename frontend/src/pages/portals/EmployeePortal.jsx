import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, Tabs } from 'antd';
import { SearchOutlined, ExportOutlined, GlobalOutlined, IdcardOutlined, CalendarOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;
const { TabPane } = Tabs;

const mockEmployeeData = {
  attendance: [{ id: 1, date: '2024-01-15', checkIn: '09:00', checkOut: '18:00', hours: 8 }],
  leave: [{ id: 1, type: 'Annual Leave', startDate: '2024-02-01', endDate: '2024-02-05', days: 5, status: 'pending' }],
};

const EmployeePortal = () => {
  const [employeeData] = useState(mockEmployeeData);
  return (
    <div>
      <PageHeader title="Employee Portal" breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Self-Service Portals', path: '/portals' }, { title: 'Employee Portal', path: '/portals/employee' }]} />
      <Card>
        <Tabs defaultActiveKey="attendance">
          <TabPane tab={<span><IdcardOutlined />Attendance</span>} key="attendance">
            <Table dataSource={employeeData.attendance} rowKey="id" columns={[{ title: 'Date', dataIndex: 'date' }, { title: 'Check In', dataIndex: 'checkIn' }, { title: 'Check Out', dataIndex: 'checkOut' }, { title: 'Hours', dataIndex: 'hours' }]} />
          </TabPane>
          <TabPane tab={<span><CalendarOutlined />Leave</span>} key="leave">
            <Table dataSource={employeeData.leave} rowKey="id" columns={[{ title: 'Type', dataIndex: 'type' }, { title: 'Start Date', dataIndex: 'startDate' }, { title: 'End Date', dataIndex: 'endDate' }, { title: 'Days', dataIndex: 'days' }, { title: 'Status', dataIndex: 'status', render: (s) => <Tag>{s}</Tag> }]} />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default EmployeePortal;

