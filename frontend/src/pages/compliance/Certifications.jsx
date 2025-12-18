import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, DatePicker, Form } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EditOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { PageHeader, FormDrawer } from '../../components/Common';
import dayjs from 'dayjs';

const { Search } = Input;
const { Text } = Typography;

const mockCertifications = [
  { id: 1, name: 'ISO 9001:2015', type: 'Quality Management', issuedDate: '2023-01-15', expiryDate: '2026-01-15', status: 'active', issuer: 'Certification Body' },
];

const Certifications = () => {
  const [certifications] = useState(mockCertifications);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: 'Certification Name', dataIndex: 'name', key: 'name', width: 200 },
    { title: 'Type', dataIndex: 'type', key: 'type', width: 180 },
    { title: 'Issued Date', dataIndex: 'issuedDate', key: 'issuedDate', width: 120, render: (date) => dayjs(date).format('MMM D, YYYY') },
    { title: 'Expiry Date', dataIndex: 'expiryDate', key: 'expiryDate', width: 120, render: (date) => dayjs(date).format('MMM D, YYYY') },
    { title: 'Issuer', dataIndex: 'issuer', key: 'issuer', width: 180 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status) => <Tag color={status === 'active' ? 'success' : 'default'}>{status}</Tag> },
    { title: 'Actions', key: 'actions', width: 120, render: () => <Button type="text" icon={<EditOutlined />} /> },
  ];

  return (
    <div>
      <PageHeader title="Certifications" subtitle={`${certifications.length} certifications`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Compliance', path: '/compliance' }, { title: 'Certifications', path: '/compliance/certifications' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />} onClick={() => setDrawerVisible(true)}>New Certification</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search placeholder="Search certifications..." allowClear style={{ width: 300 }} />
        </div>
        <Table columns={columns} dataSource={certifications} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
      <FormDrawer title="Create Certification" open={drawerVisible} onClose={() => { setDrawerVisible(false); form.resetFields(); }} form={form} fields={[{ name: 'name', label: 'Certification Name', type: 'text', required: true, span: 24 }, { name: 'type', label: 'Type', type: 'text', required: true, span: 24 }, { name: 'issuedDate', label: 'Issued Date', type: 'date', required: true, span: 24 }, { name: 'expiryDate', label: 'Expiry Date', type: 'date', required: true, span: 24 }, { name: 'issuer', label: 'Issuer', type: 'text', required: true, span: 24 }]} onSubmit={() => { setDrawerVisible(false); }} />
    </div>
  );
};

export default Certifications;

