import { useState } from 'react';
import { Card, Form, Switch, Button, Space, message, Typography, Divider, Row, Col } from 'antd';
import { SaveOutlined, BellOutlined } from '@ant-design/icons';
import { PageHeader } from '../../components/Common';

const { Title } = Typography;

const NotificationSettings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSave = async (values) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    message.success('Notification settings saved successfully');
    setLoading(false);
  };

  return (
    <div>
      <PageHeader title="Notification Settings" subtitle="Configure notification preferences" breadcrumb={[{ title: 'Home', path: '/' }, { title: 'Administration', path: '/admin' }, { title: 'Notification Settings', path: '/admin/notifications' }]} />
      <Card>
        <Form form={form} layout="vertical" onFinish={handleSave} initialValues={{ emailNotifications: true, smsNotifications: false, pushNotifications: true, orderNotifications: true, inventoryNotifications: true }}>
          <Title level={5}>Notification Channels</Title>
          <Form.Item name="emailNotifications" label="Email Notifications" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="smsNotifications" label="SMS Notifications" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="pushNotifications" label="Push Notifications" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Divider />
          <Title level={5}>Notification Types</Title>
          <Form.Item name="orderNotifications" label="Order Notifications" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="inventoryNotifications" label="Inventory Notifications" valuePropName="checked">
            <Switch />
          </Form.Item>
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

export default NotificationSettings;

