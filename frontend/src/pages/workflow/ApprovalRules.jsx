import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, Form } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EditOutlined, NodeIndexOutlined } from '@ant-design/icons';
import { PageHeader, FormDrawer } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockRules = [
  { id: 1, name: 'Purchase Request > $5000', documentType: 'Purchase Request', condition: 'Amount > 5000', approver: 'Finance Manager', status: 'active' },
];

const ApprovalRules = () => {
  const [rules] = useState(mockRules);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Rule Name', dataIndex: 'name', key: 'name', width: 250 },
    { title: 'Document Type', dataIndex: 'documentType', key: 'documentType', width: 180 },
    { title: 'Condition', dataIndex: 'condition', key: 'condition', width: 200 },
    { title: 'Approver', dataIndex: 'approver', key: 'approver', width: 180 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status) => <Tag color={status === 'active' ? 'success' : 'default'}>{status}</Tag> },
    { title: 'Actions', key: 'actions', width: 120, render: () => <Button type="text" icon={<EditOutlined />} /> },
  ];

  return (
    <div>
      <PageHeader title="Approval Rules" subtitle={`${rules.length} rules`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Approvals', path: '/workflow' }, { title: 'Approval Rules', path: '/workflow/rules' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>New Rule</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search placeholder="Search rules..." allowClear style={{ width: 300 }} />
        </div>
        <Table columns={columns} dataSource={rules} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
      <FormDrawer title="Create Approval Rule" open={drawerVisible} onClose={() => { setDrawerVisible(false); form.resetFields(); }} form={form} fields={[{ name: 'name', label: 'Rule Name', type: 'text', required: true, span: 24 }, { name: 'documentType', label: 'Document Type', type: 'select', options: [], required: true, span: 24 }, { name: 'condition', label: 'Condition', type: 'text', required: true, span: 24 }, { name: 'approver', label: 'Approver', type: 'select', options: [], required: true, span: 24 }]} onSubmit={() => { setDrawerVisible(false); }} />
    </div>
  );
};

export default ApprovalRules;

