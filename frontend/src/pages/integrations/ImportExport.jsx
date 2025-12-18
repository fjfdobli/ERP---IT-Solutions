import { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, Typography, Upload, Tabs } from 'antd';
import { UploadOutlined, DownloadOutlined, ImportOutlined, ExportOutlined, FileOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/Common';

const { Search } = Input;
const { Text } = Typography;
const { TabPane } = Tabs;

const mockImports = [
  { id: 1, filename: 'products_import.csv', type: 'Products', status: 'completed', records: 150, date: '2024-01-15' },
];

const ImportExport = () => {
  const [imports] = useState(mockImports);
  return (
    <div>
      <PageHeader title="Import/Export" breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Integrations', path: '/integrations' }, { title: 'Import/Export', path: '/integrations/import-export' }]} />
      <Card>
        <Tabs defaultActiveKey="import">
          <TabPane tab={<span><ImportOutlined />Import</span>} key="import">
            <div style={{ marginBottom: 16 }}>
              <Upload>
                <Button icon={<UploadOutlined />}>Upload File</Button>
              </Upload>
            </div>
            <Table dataSource={imports} rowKey="id" columns={[{ title: 'Filename', dataIndex: 'filename' }, { title: 'Type', dataIndex: 'type' }, { title: 'Status', dataIndex: 'status', render: (s) => <Tag color={s === 'completed' ? 'success' : 'default'}>{s}</Tag> }, { title: 'Records', dataIndex: 'records' }, { title: 'Date', dataIndex: 'date' }]} />
          </TabPane>
          <TabPane tab={<span><ExportOutlined />Export</span>} key="export">
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Button icon={<DownloadOutlined />}>Export Products</Button>
                <Button icon={<DownloadOutlined />}>Export Customers</Button>
                <Button icon={<DownloadOutlined />}>Export Orders</Button>
              </Space>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ImportExport;

