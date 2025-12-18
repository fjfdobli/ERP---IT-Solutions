import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, Tabs } from 'antd';
import { SearchOutlined, ExportOutlined, GlobalOutlined, ShoppingOutlined, FileTextOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;
const { TabPane } = Tabs;

const mockVendorData = {
  purchaseOrders: [{ id: 'PO-2024-00125', date: '2024-01-15', total: 93450.00, status: 'pending' }],
  invoices: [{ id: 'INV-2024-00025', date: '2024-01-15', amount: 93450.00, status: 'pending' }],
};

const VendorPortal = () => {
  const [vendorData] = useState(mockVendorData);
  return (
    <div>
      <PageHeader title="Vendor Portal" breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Self-Service Portals', path: '/portals' }, { title: 'Vendor Portal', path: '/portals/vendor' }]} />
      <Card>
        <Tabs defaultActiveKey="pos">
          <TabPane tab={<span><ShoppingOutlined />Purchase Orders</span>} key="pos">
            <Table dataSource={vendorData.purchaseOrders} rowKey="id" columns={[{ title: 'PO ID', dataIndex: 'id' }, { title: 'Date', dataIndex: 'date' }, { title: 'Total', dataIndex: 'total', render: (t) => `$${t}` }, { title: 'Status', dataIndex: 'status', render: (s) => <Tag>{s}</Tag> }]} />
          </TabPane>
          <TabPane tab={<span><FileTextOutlined />Invoices</span>} key="invoices">
            <Table dataSource={vendorData.invoices} rowKey="id" columns={[{ title: 'Invoice ID', dataIndex: 'id' }, { title: 'Date', dataIndex: 'date' }, { title: 'Amount', dataIndex: 'amount', render: (a) => `$${a}` }, { title: 'Status', dataIndex: 'status', render: (s) => <Tag>{s}</Tag> }]} />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default VendorPortal;

