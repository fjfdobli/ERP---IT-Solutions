import { useState } from 'react';
import { Card, Form, Input, Switch, Button, Space, message, Typography, Divider, Row, Col, Select, InputNumber } from 'antd';
import { SaveOutlined, SettingOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/Common';

const { TextArea } = Input;
const { Title } = Typography;

const SystemSettings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSave = async (values) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    message.success('Settings saved successfully');
    setLoading(false);
  };

  return (
    <div>
      <PageHeader title="System Settings" subtitle="Configure system-wide settings" breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Administration', path: '/admin' }, { title: 'System Settings', path: '/admin/settings' }]} />
      <Card>
        <Form form={form} layout="vertical" onFinish={handleSave} initialValues={{ companyName: 'My Company', currency: 'USD', timezone: 'UTC', taxRate: 8 }}>
          <Title level={5}>General Settings</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="companyName" label="Company Name" rules={[{ required: true }]}>
                <Input placeholder="Enter company name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="currency" label="Currency" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="USD">USD</Select.Option>
                  <Select.Option value="EUR">EUR</Select.Option>
                  <Select.Option value="PHP">PHP</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="timezone" label="Timezone" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="UTC">UTC</Select.Option>
                  <Select.Option value="EST">EST</Select.Option>
                  <Select.Option value="PST">PST</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="taxRate" label="Default Tax Rate (%)">
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Divider />
          <Title level={5}>Email Settings</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="smtpHost" label="SMTP Host">
                <Input placeholder="smtp.example.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="smtpPort" label="SMTP Port">
                <InputNumber min={1} max={65535} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>Save Settings</Button>
              <Button onClick={() => form.resetFields()}>Reset</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SystemSettings;

