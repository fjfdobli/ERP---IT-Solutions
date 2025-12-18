import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, Upload } from 'antd';
import { PlusOutlined, SearchOutlined, ExportOutlined, DownloadOutlined, DeleteOutlined, FolderOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;

const mockFiles = [
  { id: 1, name: 'Invoice_2024_001.pdf', type: 'PDF', size: '2.5 MB', category: 'Invoices', uploadedBy: 'John Doe', uploadedDate: '2024-01-15' },
];

const FileManager = () => {
  const [files] = useState(mockFiles);
  const columns = [
    { title: 'File Name', dataIndex: 'name', key: 'name', width: 250 },
    { title: 'Type', dataIndex: 'type', key: 'type', width: 100 },
    { title: 'Size', dataIndex: 'size', key: 'size', width: 100 },
    { title: 'Category', dataIndex: 'category', key: 'category', width: 150 },
    { title: 'Uploaded By', dataIndex: 'uploadedBy', key: 'uploadedBy', width: 150 },
    { title: 'Uploaded Date', dataIndex: 'uploadedDate', key: 'uploadedDate', width: 130 },
    { title: 'Actions', key: 'actions', width: 150, render: () => (
      <Space>
        <Button type="text" icon={<DownloadOutlined />} />
        <Button type="text" danger icon={<DeleteOutlined />} />
      </Space>
    ) },
  ];
  return (
    <div>
      <PageHeader title="File Manager" subtitle={`${files.length} files`} breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Documents', path: '/documents' }]} actions={[<Button key="export" icon={<ExportOutlined />}>Export</Button>, <Upload><Button key="upload" type="primary" icon={<PlusOutlined />}>Upload File</Button></Upload>]} />
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space wrap>
            <Search placeholder="Search files..." allowClear style={{ width: 300 }} />
          </Space>
        </div>
        <Table columns={columns} dataSource={files} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default FileManager;

