import { Button, Col, Row, Space, Typography, Form, Input } from "antd";
import { useIsMobileScreen } from "admiral";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { supabase } from "@/libs/supabase/client";

const Component: React.FC = () => {
  const navigate = useNavigate();

  const isMobile = useIsMobileScreen();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        navigate("/dashboard");
      }
    };

    checkSession();
  }, [navigate]);

  const handleCredentialLogin = async (values: { email: string; password: string }) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      console.error(error.message);
    }

    navigate("/dashboard");
  };

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/oauth-callback`,
      },
    });
  };

  const loginWithGithub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
    });
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
          <Typography.Title level={4}>Welcome back!</Typography.Title>
          <Typography.Text style={{ opacity: 0.5 }}>
            Ant Design is the most influential web design specification in Xihu district
          </Typography.Text>
        </Space>

        <Form layout="vertical" onFinish={handleCredentialLogin}>
          <Form.Item label="Email" name="email" rules={[{ required: true }]}>
            <Input type="email" />
          </Form.Item>

          <Form.Item label="Password" name="password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit" type="primary" style={{ width: "100%" }}>
              Login with Email
            </Button>
          </Form.Item>

          <Form.Item>
            <Button onClick={loginWithGoogle} style={{ width: "100%", marginBottom: 8 }}>
              Login with Google
            </Button>

            <Button onClick={loginWithGithub} style={{ width: "100%" }}>
              Login with GitHub
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default Component;
