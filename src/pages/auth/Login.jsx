/**
 * 登录页面
 */
import { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth";
import useUserStore from "../../store/userStore";
import styles from "./Login.module.css";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: loginUser } = useUserStore();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await login(values);

      // 使用 Zustand 保存 token 和用户信息
      loginUser(response.data.userInfo, response.data.token);

      message.success("登录成功");
      navigate("/");
    } catch {
      // 错误已在axios拦截器中处理
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <Card title="合格证打印系统" className={styles.loginCard}>
        <Form
          name="login"
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
          className={styles.loginForm}
        >
          <Form.Item
            name="operatorId"
            rules={[{ required: true, message: "请输入账号" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="请输入账号" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
            />
          </Form.Item>

          <Form.Item>
            <Button
              color="default"
              variant="solid"
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
