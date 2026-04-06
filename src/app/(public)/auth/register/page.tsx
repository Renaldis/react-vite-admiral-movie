import { Button, Col, Row, Space, Typography, Form, Input, notification } from "antd";
import { useIsMobileScreen } from "admiral";
import { useNavigate } from "react-router";
import { supabase } from "@/libs/supabase/client";

const Component: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobileScreen();

  const handleRegister = async (values: { name: string; email: string; password: string }) => {
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          name: values.name,
        },
      },
    });

    if (error) {
      notification.error({
        message: "Register Failed",
        description: error.message,
      });
      return;
    }

    notification.success({
      message: "Register Success",
      description: "Please check your email to verify your account",
    });

    navigate("/auth/login");
  };

  return (
    <Row align="middle" justify="center" style={{ height: "80vh" }}>
      <Col
        span={24}
        style={{
          padding: `4rem ${isMobile ? "" : "7rem"}`,
          width: `50%`,
        }}
      >
        <Space
          direction="vertical"
          style={{
            width: "100%",
            alignItems: "center",
            textAlign: "center",
            marginBottom: "1rem",
          }}
        >
          <Typography.Title level={4}>Create Account</Typography.Title>
          <Typography.Text style={{ opacity: 0.5 }}>
            Register to start using the application
          </Typography.Text>
        </Space>

        <Form layout="vertical" onFinish={handleRegister}>
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="Your name" />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true }]}>
            <Input type="email" />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit" type="primary" style={{ width: "100%" }}>
              Register
            </Button>
          </Form.Item>

          <Form.Item>
            <Button type="link" style={{ width: "100%" }} onClick={() => navigate("/auth/login")}>
              Already have an account? Login
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default Component;
