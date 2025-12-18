import { useState } from 'react';
import { 
  Card, Table, Button, Space, Input, Select, Tag, 
  Tooltip, message, Typography, Alert
} from 'antd';
import {
  SearchOutlined,
  ExportOutlined,
  EditOutlined,
  WarningOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockReorderPoints = [
  {
    id: 1,
    productName: 'iPhone 15 Pro Max',
    sku: 'APL-IP15PM-256',
    currentStock: 8,
    minStock: 10,
    reorderPoint: 15,
    maxStock: 100,
    status: 'below',
  },
  {
    id: 2,
    productName: 'MacBook Pro 14"',
    sku: 'APL-MBP14-M3P',
    currentStock: 25,
    minStock: 10,
    reorderPoint: 20,
    maxStock: 50,
    status: 'ok',
  },
];

const ReorderPoints = () => {
  const [reorderPoints, setReorderPoints] = useState(mockReorderPoints);
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');

  const belowStock = reorderPoints.filter(r => r.status === 'below').length;
  const atReorderPoint = reorderPoints.filter(r => r.currentStock <= r.reorderPoint && r.currentStock > r.minStock).length;

  const columns = [
    {
      title: 'Product',
      key: 'product',
      width: 200,
      render: (_, record) => (
        <div>
          <div>{record.productName}</div>
          <Text type="secondary" style={{ fontSize: 11 }}>{record.sku}</Text>
        </div>
      ),
    },
    {
      title: 'Current Stock',
      dataIndex: 'currentStock',
      key: 'currentStock',
      width: 120,
      render: (stock, record) => (
        <Text type={record.status === 'below' ? 'danger' : undefined} strong>
          {stock}
        </Text>
      ),
    },
    {
      title: 'Min Stock',
      dataIndex: 'minStock',
      key: 'minStock',
      width: 100,
    },
    {
      title: 'Reorder Point',
      dataIndex: 'reorderPoint',
      key: 'reorderPoint',
      width: 120,
    },
    {
      title: 'Max Stock',
      dataIndex: 'maxStock',
      key: 'maxStock',
      width: 100,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        if (status === 'below') {
          return <Tag color="error" icon={<WarningOutlined />}>Below Minimum</Tag>;
        }
        if (status === 'reorder') {
          return <Tag color="warning">Reorder Needed</Tag>;
        }
        return <Tag color="success" icon={<CheckCircleOutlined />}>OK</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Reorder Point">
            <Button type="text" icon={<EditOutlined />} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Reorder Points"
        subtitle={`${reorderPoints.length} products configured`}
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'Inventory', path: '/inventory' },
          { title: 'Reorder Points', path: '/inventory/reorder' },
        ]}
        actions={[
          <Button key="export" icon={<ExportOutlined />}>Export</Button>,
        ]}
      />

      {belowStock > 0 && (
        <Alert
          message={`${belowStock} products are below minimum stock level`}
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="Search products..."
            allowClear
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <Table
          columns={columns}
          dataSource={reorderPoints}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
          }}
        />
      </Card>
    </div>
  );
};

export default ReorderPoints;

