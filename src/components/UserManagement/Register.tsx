import { useMemo, useState, useEffect, useRef } from "react";
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Flex,
  Space,
  Typography,
  message,
} from "antd";
import {
  MailOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import classes from "./Register.module.css";
import { logEvent, analytics } from "../../firebase";
import { createProfile, createUser, login } from "../../../api/usermanagement";

const { Title, Text } = Typography;

export default function Register() {
  const navigate = useNavigate();
  const auth = useAuth();

  const [emailForm] = Form.useForm();
  const [codeForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [profileForm] = Form.useForm();

  const [current, setCurrent] = useState(0);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [wizardData, setWizardData] = useState({
    email: "",
    verificationCode: "",
    password: "",
    firstName: "",
    lastName: "",
    idNumber: "",
  });

  const completedRef = useRef(false);
  const stepRef = useRef(0);

  const watchedPassword = Form.useWatch("password", passwordForm);
  const hasTypedPassword = String(watchedPassword || "").length > 0;

  const passwordChecks = useMemo(() => {
    const value = String(watchedPassword || "");
    return {
      minLength: value.length >= 8,
      hasUpper: /[A-Z]/.test(value),
      hasLower: /[a-z]/.test(value),
      hasNumber: /\d/.test(value),
      hasSymbol: /[^A-Za-z0-9]/.test(value),
    };
  }, [watchedPassword]);

  useEffect(() => {
    stepRef.current = current;
  }, [current]);

  useEffect(() => {
    if (!analytics) return;

    logEvent(analytics, "register_step_view", {
      step: current,
    });
  }, [current]);

useEffect(() => {
  return () => {
    if (!analytics) return;
    if (completedRef.current) return;

    logEvent(analytics, "register_abandoned", {
      last_step: stepRef.current,
    });
  };
}, []);

  const forms = [emailForm, codeForm, passwordForm, profileForm];

  const resendCode = () => {
    const nextCode = String(Math.floor(100000 + Math.random() * 900000));
    setDevCode(nextCode);
    message.info(`Dev verification code: ${nextCode}`);
  };

  const back = () => {
    setError("");
    setCurrent((s) => Math.max(0, s - 1));
  };

  const next = () => {
    setError("");
    forms[current].submit();

    if (analytics) {
      logEvent(analytics, "register_step_next", {
        from_step: current,
        to_step: current + 1,
      });
    }
  };

  // Step 1 submit
  const onEmailFinish = ({ email }: { email: string }) => {
    setWizardData((d) => ({ ...d, email }));

    const nextCode = String(Math.floor(100000 + Math.random() * 900000));
    setDevCode(nextCode);
    message.info(`Dev verification code: ${nextCode}`);

    // prefill next form if you want
    codeForm.setFieldsValue({ verificationCode: "" });

    setCurrent(1);
  };

  // Step 2 submit
  const onCodeFinish = ({ verificationCode }: { verificationCode: string }) => {
    setWizardData((d) => ({ ...d, verificationCode }));

    if (!devCode) {
      setError("No verification code generated. Please resend.");
      return;
    }
    if (String(verificationCode).trim() !== String(devCode)) {
      setError("Invalid verification code.");
      return;
    }

    passwordForm.setFieldsValue({ password: wizardData.password || "" });
    setCurrent(2);
  };

  // Step 3 submit
  const onPasswordFinish = ({ password }: { password: string }) => {
    setWizardData((d) => ({ ...d, password }));
    profileForm.setFieldsValue({
      firstName: wizardData.firstName,
      lastName: wizardData.lastName,
      idNumber: wizardData.idNumber,
    });
    setCurrent(3);
  };

  // Step 4 submit (final)
  const onProfileFinish = async ({
	firstName,
	lastName,
	idNumber,
  }: {
	firstName: string;
	lastName: string;
	idNumber: string;
  }) => {
    const email = wizardData.email?.trim();
    const password = wizardData.password;

    setWizardData((d) => ({ ...d, firstName, lastName, idNumber }));
    setSubmitting(true);
    setError("");

    try {
      // 1) Create auth user
      await createUser({ username: email, password });

      // 2) Login to get token
      const { loginAccessKey } = await login({ username: email, password });
      auth.login(loginAccessKey);

      // 3) Create profile
      await createProfile({ loginAccessKey, email, firstName, lastName, idNumber });

      message.success("Profile created");

      completedRef.current = true;
      if (analytics) {
        logEvent(analytics, "register_completed", {
          email_domain: email.split("@")[1],
        });
      }
      navigate("/kyc", { replace: true });
    } catch (e: unknown) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={classes.container}>
      <Card className={classes.card}>
        {/* <div style={{ marginTop: 20 }}>

        <Steps
          current={current}
          items={[
            { title: "Email" },
            { title: "Verify" },
            { title: "Password" },
            { title: "Profile" },
          ]}
        />
</div> */}

        <Flex justify="center" align="center" style={{ minHeight: 150 }}>
          {/* Step 1 */}
          {current === 0 && (
            <Form
              form={emailForm}
              layout="vertical"
              //   style={{
              //     marginTop: 16,
              //     justifyContent: "center",
              //     display: "flex",
              //   }}
              initialValues={{ email: wizardData.email }}
              onFinish={onEmailFinish}
            >
              {error && (
                <Alert
                  style={{ marginTop: 16 }}
                  type="error"
                  title={error}
                  showIcon
                  closable
                />
              )}
              <Space orientation="vertical" align="center">
                <Title level={3} style={{ marginBottom: 8 }}>
                  Create your account
                </Title>
                <Text type="secondary" style={{ paddingBottom: 30 }}>
                  Create a profile, browse and subscribe to our range of
                  products.
                </Text>

                <Form.Item
                  //   label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email" },
                    { type: "email", message: "Please enter a valid email" },
                  ]}
                >
                  <Input
                    size="large"
                    prefix={<MailOutlined />}
                    placeholder="Enter email address"
                  />
                </Form.Item>
              </Space>
            </Form>
          )}

          {/* Step 2 */}
          {current === 1 && (
            <Form
              form={codeForm}
              layout="vertical"
              style={{ marginTop: 16 }}
              initialValues={{ verificationCode: wizardData.verificationCode }}
              onFinish={onCodeFinish}
            >
              {error && (
                <Alert
                  style={{ marginTop: 16 }}
                  type="error"
                  title={error}
                  showIcon
                  closable
                />
              )}
              <Space orientation="vertical" align="center">
                <Title level={3} style={{ marginBottom: 8 }}>
                  Enter verification code
                </Title>
                <Text type="secondary" style={{ paddingBottom: 30 }}>
                  We have a temporary login code to {wizardData.email}
                </Text>
                <Form.Item
                  //   label="Verification code"
                  name="verificationCode"
                  rules={[
                    { required: true, message: "Enter the 6-digit code" },
                    { len: 6, message: "Code must be 6 digits" },
                  ]}
                >
                  {/* <Input
                size="large"
                prefix={<NumberOutlined />}
                maxLength={6}
                inputMode="numeric"
              /> */}
                  <Input.OTP
                    length={6}
                    formatter={(str) => str.toUpperCase()}
                  />
                </Form.Item>
                <Text>Havent received your code?</Text>
                <Button
                  type="link"
                  onClick={resendCode}
                  style={{ paddingLeft: 0 }}
                >
                  Resend code
                </Button>
              </Space>
            </Form>
          )}

          {/* Step 3 */}
          {current === 2 && (
            <Form
              form={passwordForm}
              layout="vertical"
              style={{ marginTop: 16 }}
              initialValues={{ password: wizardData.password }}
              onFinish={onPasswordFinish}
            >
              {error && (
                <Alert
                  style={{ marginTop: 16 }}
                  type="error"
                  title={error}
                  showIcon
                  closable
                />
              )}
              <Space orientation="vertical" align="center">
                <Title level={3} style={{ marginBottom: 8 }}>
                  Welcome to My Store
                </Title>
                <Text type="secondary" style={{ paddingBottom: 30 }}>
                  Create a password
                </Text>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: "Please choose a password" },
                    () => ({
                      validator(_, value) {
                        const pwd = String(value || "");
                        const checks = {
                          minLength: pwd.length >= 8,
                          hasUpper: /[A-Z]/.test(pwd),
                          hasLower: /[a-z]/.test(pwd),
                          hasNumber: /\d/.test(pwd),
                          hasSymbol: /[^A-Za-z0-9]/.test(pwd),
                        };

                        const ok =
                          checks.minLength &&
                          checks.hasUpper &&
                          checks.hasLower &&
                          checks.hasNumber &&
                          checks.hasSymbol;

                        if (ok) return Promise.resolve();

						// Reject without a message; the checklist below is the guidance UI.
						return Promise.reject(new Error(""));
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    size="large"
                    prefix={<LockOutlined />}
                    placeholder="Password"
                  />
                </Form.Item>

                <Space orientation="vertical" size={2} style={{ width: "100%" }}>
                  <Text>Password must contain at least:</Text>
                  
                  <Text
                    type={
                      hasTypedPassword
                        ? passwordChecks.hasUpper
                          ? "success"
                          : "danger"
                        : "secondary"
                    }
                  >
                    One uppercase character (A–Z)
                  </Text>
                  <Text
                    type={
                      hasTypedPassword
                        ? passwordChecks.hasLower
                          ? "success"
                          : "danger"
                        : "secondary"
                    }
                  >
                    One lowercase letter (a–z)
                  </Text>
                  <Text
                    type={
                      hasTypedPassword
                        ? passwordChecks.hasNumber
                          ? "success"
                          : "danger"
                        : "secondary"
                    }
                  >
                    one number (0–9)
                  </Text>
                  <Text
                    type={
                      hasTypedPassword
                        ? passwordChecks.hasSymbol
                          ? "success"
                          : "danger"
                        : "secondary"
                    }
                  >
                    one special symbol (e.g. !@#$)
                  </Text>
                  <Text
                    type={
                      hasTypedPassword
                        ? passwordChecks.minLength
                          ? "success"
                          : "danger"
                        : "secondary"
                    }
                  >
                    8 characters
                  </Text>
                </Space>
              </Space>
            </Form>
          )}

          {/* Step 4 */}
          {current === 3 && (
            <Form
              form={profileForm}
              layout="vertical"
              style={{ marginTop: 16 }}
              initialValues={{
                firstName: wizardData.firstName,
                lastName: wizardData.lastName,
                idNumber: wizardData.idNumber,
              }}
              onFinish={onProfileFinish}
            >
              <Space orientation="vertical" align="center">
                {error && (
                  <Alert
                    style={{ marginTop: 16 }}
                    type="error"
                    title={error}
                    showIcon
                    closable
                  />
                )}
                <Title level={3} style={{ marginBottom: 8 }}>
                  Welcome to My Store
                </Title>
                <Text type="secondary" style={{ paddingBottom: 30 }}>
                  Tell us about yourself
                </Text>
                <Form.Item name="firstName" rules={[{ required: true, message: "First name is required" }]}>
                  <Input size="large" placeholder="First name" />
                </Form.Item>
                <Form.Item name="lastName" rules={[{ required: true, message: "Last name is required"  }]}>
                  <Input size="large" placeholder="Last name" />
                </Form.Item>
                <Form.Item name="idNumber" rules={[{ required: true, message: "ID number is required" }]}>
                  <Input size="large" placeholder="ID number" />
                </Form.Item>
              </Space>
            </Form>
          )}
        </Flex>
        <div className={classes.actions} style={{ marginTop: 16 }}>
          <Button disabled={current === 0 || submitting} onClick={back}>
            Back
          </Button>
          <Button type="primary" onClick={next} loading={submitting}>
            {current === 3 ? "Create profile" : "Next"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
