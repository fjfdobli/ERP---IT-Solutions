import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, Tabs } from 'antd';
import { SearchOutlined, ExportOutlined, GlobalOutlined, ShoppingCartOutlined, FileTextOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;
const { TabPane } = Tabs;

const mockCustomerData = {
  orders: [{ id: 'SO-2024-00045', date: '2024-01-15', total: 20282.40, status: 'processing' }],
  invoices: [{ id: 'INV-2024-00025', date: '2024-01-15', amount: 20282.40, status: 'unpaid' }],
};

const CustomerPortal = () => {
  const [customerData] = useState(mockCustomerData);
  return (
    <div>
      <PageHeader title="Customer Portal" breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Self-Service Portals', path: '/portals' }, { title: 'Customer Portal', path: '/portals/customer' }]} />
      <Card>
        <Tabs defaultActiveKey="orders">
          <TabPane tab={<span><ShoppingCartOutlined />Orders</span>} key="orders">
            <Table dataSource={customerData.orders} rowKey="id" columns={[{ title: 'Order ID', dataIndex: 'id' }, { title: 'Date', dataIndex: 'date' }, { title: 'Total', dataIndex: 'total', render: (t) => `$${t}` }, { title: 'Status', dataIndex: 'status', render: (s) => <Tag>{s}</Tag> }]} />
          </TabPane>
          <TabPane tab={<span><FileTextOutlined />Invoices</span>} key="invoices">
            <Table dataSource={customerData.invoices} rowKey="id" columns={[{ title: 'Invoice ID', dataIndex: 'id' }, { title: 'Date', dataIndex: 'date' }, { title: 'Amount', dataIndex: 'amount', render: (a) => `$${a}` }, { title: 'Status', dataIndex: 'status', render: (s) => <Tag>{s}</Tag> }]} />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default CustomerPortal;

