/**
 * 登录页面
 */
import { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
import { storage } from '../../utils';
import './Login.css';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await login(values);
      
      // 保存token和用户信息
      storage.setToken(response.data.token);
      storage.setUserInfo(response.data.userInfo);
      
      message.success('登录成功');
      navigate('/');
    } catch {
      // 错误已在axios拦截器中处理
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card title="合格证打印系统" className="login-card">
        <Form
          name="login"
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="operatorId"
            rules={[
              { required: true, message: '请输入操作员ID' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="操作员ID"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
