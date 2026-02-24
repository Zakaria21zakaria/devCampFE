import { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Flex, Form, Input, Card, Alert } from "antd";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router";
import classes from "./Login.module.css";
import { login as loginApi } from "../../../api/usermanagement";
import { NavLink } from "react-router";

// const fakeLogin = (username, password) =>
//   new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(password === "1234"); // only password '1234' is valid
//     }, 1000);
//   });

const Login = () => {
    const navigate = useNavigate();
const location = useLocation();
  const [form] = Form.useForm();
  const [error, setError] = useState(""); // state to hold form-level error
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  type LoginFormValues = {
	username: string;
	password: string;
	remember?: boolean;
  };

  const onFinish = async (values: LoginFormValues) => {
    setError(""); // reset error on submit
    setLoading(true);
    try {
      const { loginAccessKey } = await loginApi({
        username: values.username,
        password: values.password,
      });

      auth.login(loginAccessKey);
      
      setLoading(false);
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <Flex justify="center" align="center" className={classes.container}>
      <Card className={classes.card}>
        {error && (
          <Alert
            type="error"
            title={error}
            className={classes.errorAlert}
            closable
            showIcon
          />
        )}
        <Form
          form={form}
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            // label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
            
          >
            <Input size="large" prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            // label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password size="large" prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a href="">Forgot password</a>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button size="large" block type="primary" htmlType="submit" loading={loading}>
              Log in
            </Button>
            <div className={classes.registerHint}>
              or <NavLink to="/register">Register now!</NavLink>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
};

export default Login;
