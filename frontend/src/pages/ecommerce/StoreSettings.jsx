import { useState } from 'react';
import { 
  Card, Form, Input, Switch, Button, Space, Upload, 
  message, Typography, Divider, Row, Col, Select, InputNumber
} from 'antd';
import {
  SaveOutlined,
  UploadOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { PageHeader } from '../../components/Common';

const { TextArea } = Input;
const { Title, Text } = Typography;

const StoreSettings = () => {
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
      <PageHeader
        title="Store Settings"
        subtitle="Configure your online store"
        breadcrumb={[
          { title: 'Home', path: '/' },
          { title: 'E-Commerce', path: '/ecommerce' },
          { title: 'Store Settings', path: '/ecommerce/settings' },
        ]}
      />

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{
            storeName: 'My Store',
            storeDescription: 'Welcome to our online store',
            currency: 'USD',
            taxRate: 8,
            shippingEnabled: true,
          }}
        >
          <Title level={5}>General Settings</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="storeName"
                label="Store Name"
                rules={[{ required: true, message: 'Please enter store name' }]}
              >
                <Input placeholder="Enter store name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="currency"
                label="Currency"
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="USD">USD</Select.Option>
                  <Select.Option value="EUR">EUR</Select.Option>
                  <Select.Option value="PHP">PHP</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="storeDescription"
            label="Store Description"
          >
            <TextArea rows={4} placeholder="Enter store description" />
          </Form.Item>

          <Divider />

          <Title level={5}>Tax Settings</Title>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="taxRate"
                label="Tax Rate (%)"
              >
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="taxEnabled"
                label="Enable Tax"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Title level={5}>Shipping Settings</Title>
          <Form.Item
            name="shippingEnabled"
            label="Enable Shipping"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                Save Settings
              </Button>
              <Button onClick={() => form.resetFields()}>Reset</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default StoreSettings;

