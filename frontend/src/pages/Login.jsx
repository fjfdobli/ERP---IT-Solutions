import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Checkbox, App } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';

const { Title, Text } = Typography;

// Static user data for development
const STATIC_USERS = [
  {
    id: 1,
    username: 'admin',
    password: 'password',
    email: 'admin@erp.com',
    first_name: 'System',
    last_name: 'Administrator',
    role: { id: 1, name: 'Administrator' },
    is_active: true,
  },
  {
    id: 2,
    username: 'manager',
    password: 'password',
    email: 'manager@erp.com',
    first_name: 'Branch',
    last_name: 'Manager',
    role: { id: 2, name: 'Manager' },
    is_active: true,
  },
];

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { message } = App.useApp();

  const onFinish = async (values) => {
    setLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find user in static data
    const user = STATIC_USERS.find(
      u => u.username === values.username && u.password === values.password
    );
    
    if (user) {
      // Create mock tokens
      const mockAccessToken = `mock_access_token_${user.id}_${Date.now()}`;
      const mockRefreshToken = `mock_refresh_token_${user.id}_${Date.now()}`;
      
      // Remove password from user object before storing
      const { password: _password, ...userWithoutPassword } = user;
      
      setAuth(mockAccessToken, mockRefreshToken, userWithoutPassword);
      message.success('Login successful!');
      navigate('/');
    } else {
      message.error('Invalid username or password');
    }
    
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 24,
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 400,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          borderRadius: 12,
        }}
        styles={{ body: { padding: 32 } }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 64,
              height: 64,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>ERP</Text>
          </div>
          <Title level={3} style={{ marginBottom: 4 }}>
            Welcome Back
          </Title>
          <Text type="secondary">Sign in to your account</Text>
        </div>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a href="#forgot">Forgot password?</a>
            </div>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: 44,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
              }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Available users: admin, manager (password: password)
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Login;
