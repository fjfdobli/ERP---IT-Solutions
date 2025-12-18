import { useState } from 'react';
import { Card, Table, Button, Space, Input, Typography, DatePicker } from 'antd';
import { SearchOutlined, ExportOutlined, PrinterOutlined, SolutionOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;
const { RangePicker } = DatePicker;

const mockHRReports = [
  { id: 1, report: 'Employee Attendance Report', period: '2024-01', employees: 50, totalHours: 8000 },
];

const HRReports = () => {
  const [reports] = useState(mockHRReports);
  const columns = [
    { title: 'Report Name', dataIndex: 'report', key: 'report', width: 250 },
    { title: 'Period', dataIndex: 'period', key: 'period', width: 120 },
    { title: 'Employees', dataIndex: 'employees', key: 'employees', width: 120, align: 'center' },
    { title: 'Total Hours', dataIndex: 'totalHours', key: 'totalHours', width: 150, align: 'right' },
    { title: 'Actions', key: 'actions', width: 150, render: () => (
      <Space>
        <Button type="text" icon={<PrinterOutlined />} />
        <Button type="text" icon={<ExportOutlined />} />
      </Space>
    ) },
  ];
  return (
    <div>
      <PageHeader title="HR Reports" subtitle={`${reports.length} reports`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Reports', path: '/reports' }, { title: 'HR Reports', path: '/reports/hr' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <RangePicker />
            <Search placeholder="Search reports..." allowClear style={{ width: 300 }} />
          </Space>
        </div>
        <Table columns={columns} dataSource={reports} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default HRReports;

