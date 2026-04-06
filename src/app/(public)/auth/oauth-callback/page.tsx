import { useEffect } from "react";
import { Flex, Spin } from "antd";
import { useNavigate } from "react-router";
import { ROUTES } from "@/commons/constants/routes";
import { supabase } from "@/libs/supabase/client";

const Component = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        navigate(ROUTES.dashboard);
      } else {
        navigate(ROUTES.auth.login);
      }
    };

    handleSession();
  }, []);

  return (
    <Flex
      style={{
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
      vertical
      gap={16}
    >
      <Spin />
      Redirecting...
    </Flex>
  );
};

export default Component;
