import { useState } from 'react';
import { Card, Table, Button, Space, Input, Typography, DatePicker } from 'antd';
import { SearchOutlined, ExportOutlined, PrinterOutlined, ReconciliationOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;
const { RangePicker } = DatePicker;

const mockPurchasingReports = [
  { id: 1, report: 'Purchase Order Summary', period: '2024-01', totalOrders: 25, totalValue: 500000 },
];

const PurchasingReports = () => {
  const [reports] = useState(mockPurchasingReports);
  const columns = [
    { title: 'Report Name', dataIndex: 'report', key: 'report', width: 250 },
    { title: 'Period', dataIndex: 'period', key: 'period', width: 120 },
    { title: 'Total Orders', dataIndex: 'totalOrders', key: 'totalOrders', width: 120, align: 'center' },
    { title: 'Total Value', dataIndex: 'totalValue', key: 'totalValue', width: 150, align: 'right', render: (v) => `$${v.toLocaleString()}` },
    { title: 'Actions', key: 'actions', width: 150, render: () => (
      <Space>
        <Button type="text" icon={<PrinterOutlined />} />
        <Button type="text" icon={<ExportOutlined />} />
      </Space>
    ) },
  ];
  return (
    <div>
      <PageHeader title="Purchasing Reports" subtitle={`${reports.length} reports`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Reports', path: '/reports' }, { title: 'Purchasing Reports', path: '/reports/purchasing' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>]} />
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

export default PurchasingReports;

