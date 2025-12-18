import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, Form } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EditOutlined, BuildOutlined } from '@ant-design/icons';
import { PageHeader, FormDrawer } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockBOMs = [
  { id: 1, product: 'Product A', version: '1.0', components: 5, totalCost: 150, status: 'active' },
];

const BillOfMaterials = () => {
  const [boms] = useState(mockBOMs);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Product', dataIndex: 'product', key: 'product', width: 200 },
    { title: 'Version', dataIndex: 'version', key: 'version', width: 100 },
    { title: 'Components', dataIndex: 'components', key: 'components', width: 120, align: 'center' },
    { title: 'Total Cost', dataIndex: 'totalCost', key: 'totalCost', width: 120, align: 'right', render: (c) => `$${c.toLocaleString()}` },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status) => <Tag color={status === 'active' ? 'success' : 'default'}>{status}</Tag> },
    { title: 'Actions', key: 'actions', width: 120, render: () => <Button type="text" icon={<EditOutlined />} /> },
  ];

  return (
    <div>
      <PageHeader title="Bill of Materials" subtitle={`${boms.length} BOMs`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Manufacturing', path: '/manufacturing' }, { title: 'Bill of Materials', path: '/manufacturing/bom' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>New BOM</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search placeholder="Search BOMs..." allowClear style={{ width: 300 }} />
        </div>
        <Table columns={columns} dataSource={boms} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
      <FormDrawer title="Create BOM" open={drawerVisible} onClose={() => { setDrawerVisible(false); form.resetFields(); }} form={form} fields={[{ name: 'product', label: 'Product', type: 'select', options: [], required: true, span: 24 }, { name: 'version', label: 'Version', type: 'text', required: true, span: 24 }]} onSubmit={() => { setDrawerVisible(false); }} />
    </div>
  );
};

export default BillOfMaterials;

