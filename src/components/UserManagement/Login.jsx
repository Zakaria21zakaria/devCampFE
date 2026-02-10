import React, { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Flex, Form, Input, Card, Alert } from "antd";
import { useAuth } from "../../context/AuthContext.jsx";
import { useLocation, useNavigate } from "react-router";

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

  const onFinish = async (values) => {
    setError(""); // reset error on submit
    setLoading(true);
    try {
      // Create the Basic Auth header
      const credentials = btoa(`${values.username}:${values.password}`); // base64 encode
      const response = await fetch("/v1/token", {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      });

      let data = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        setError(data?.errorMessage || "Invalid username or password");
        setLoading(false);
        return;
      }

      const isSuccess = data?.success === true || data?.success === "true" || data?.success === "SUCCESS";
      const loginAccessKey = data?.loginAccessKey;

      if (!isSuccess || !loginAccessKey) {
        setError(data?.errorMessage || "Login failed");
        setLoading(false);
        return;
      }

      //TODO: GET user details from (GetCustomerbyEmail)
      const user = {
        name: 'username'
      }
      auth.login(loginAccessKey,user);
      
      setLoading(false);
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <Flex justify="center" align="center" style={{ minHeight: "100vh" }}>
      <Card style={{ width: 420 }}>
        {error && (
          <Alert
            type="error"
            title={error}
            style={{ marginBottom: 16 }}
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
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input size="large" prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password size="large" prefix={<LockOutlined />} />
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
            <div style={{ marginTop: 12 }}>
              or <a href="">Register now!</a>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Flex>
  );
};

export default Login;
