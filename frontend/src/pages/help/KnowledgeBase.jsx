import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, EditOutlined, BookOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockArticles = [
  { id: 1, title: 'How to Create a Sales Order', category: 'Sales', views: 150, status: 'published' },
];

const KnowledgeBase = () => {
  const [articles] = useState(mockArticles);
  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title', width: 300 },
    { title: 'Category', dataIndex: 'category', key: 'category', width: 150 },
    { title: 'Views', dataIndex: 'views', key: 'views', width: 100, align: 'center' },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status) => <Tag color={status === 'published' ? 'success' : 'default'}>{status}</Tag> },
    { title: 'Actions', key: 'actions', width: 120, render: () => <Button type="text" icon={<EditOutlined />} /> },
  ];
  return (
    <div>
      <PageHeader title="Knowledge Base" subtitle={`${articles.length} articles`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Help & Support', path: '/help' }, { title: 'Knowledge Base', path: '/help/knowledge-base' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Button key="create" type="primary" icon={<PlusOutlined />}>New Article</Button>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Search placeholder="Search articles..." allowClear style={{ width: 300 }} />
        </div>
        <Table columns={columns} dataSource={articles} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default KnowledgeBase;

