/**
 * 登录页面
 */
import { Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "../../api/auth";
import useUserStore from "../../store/userStore";
import styles from "./Login.module.css";

const Login = () => {
  const navigate = useNavigate();
  const { login: loginUser } = useUserStore();

  // 使用 TanStack Query 的 useMutation 处理登录
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      // 使用 Zustand 保存 token 和用户信息
      loginUser(response.data.user, response.data.token);
      message.success("登录成功");
      navigate("/");
    },
    onError: (error) => {
      console.error("登录失败:", error);
    },
  });

  const handleSubmit = (values) => {
    const loginData = {
      username: values.username,
      password: values.password,
    };
    loginMutation.mutate(loginData);
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
            name="username"
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
              loading={loginMutation.isPending}
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
