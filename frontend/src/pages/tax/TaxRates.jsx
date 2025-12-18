import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, Form } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EditOutlined, PercentageOutlined } from '@ant-design/icons';
import { PageHeader, StatCard, FormDrawer } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockTaxRates = [
  { id: 1, name: 'VAT', rate: 12, type: 'Percentage', effectiveDate: '2024-01-01', status: 'active' },
  { id: 2, name: 'Sales Tax', rate: 8, type: 'Percentage', effectiveDate: '2024-01-01', status: 'active' },
];

const TaxRates = () => {
  const [taxRates] = useState(mockTaxRates);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Tax Name', dataIndex: 'name', key: 'name', width: 200 },
    { title: 'Rate', dataIndex: 'rate', key: 'rate', width: 100, render: (rate) => `${rate}%` },
    { title: 'Type', dataIndex: 'type', key: 'type', width: 120 },
    { title: 'Effective Date', dataIndex: 'effectiveDate', key: 'effectiveDate', width: 120 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status) => <Tag color={status === 'active' ? 'success' : 'default'}>{status}</Tag> },
    { title: 'Actions', key: 'actions', width: 120, render: () => <Button type="text" icon={<EditOutlined />} /> },
  ];

  return (
    <div>
      <PageHeader title="Tax Rates" subtitle={`${taxRates.length} tax rates`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Tax', path: '/tax' }, { title: 'Tax Rates', path: '/tax/rates' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>New Tax Rate</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search placeholder="Search tax rates..." allowClear style={{ width: 300 }} />
        </div>
        <Table columns={columns} dataSource={taxRates} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
      <FormDrawer title="Create Tax Rate" open={drawerVisible} onClose={() => { setDrawerVisible(false); form.resetFields(); }} form={form} fields={[{ name: 'name', label: 'Tax Name', type: 'text', required: true, span: 24 }, { name: 'rate', label: 'Rate (%)', type: 'number', required: true, span: 24 }, { name: 'type', label: 'Type', type: 'select', options: [{ label: 'Percentage', value: 'Percentage' }, { label: 'Fixed', value: 'Fixed' }], required: true, span: 24 }]} onSubmit={() => { setDrawerVisible(false); }} />
    </div>
  );
};

export default TaxRates;

