import type { FC, ReactElement } from "react";
import { LayoutWithHeader } from "admiral";
import { Navigate, Outlet } from "react-router";
import { SIDEBAR_ITEMS } from "@/commons/constants/sidebar";
import { Flex, Typography } from "antd";
import { useSession } from "../_components/providers/session";

const ProtectedLayout: FC = (): ReactElement | null => {
  const { session, status } = useSession();

  if (status === "authenticating") return null;

  if (!session) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <LayoutWithHeader
      header={{
        brandLogo: (
          <Flex align="center" gap={8}>
            <Typography.Title level={4} style={{ marginBottom: 0 }}>
              Vite Admiral
            </Typography.Title>
          </Flex>
        ),
      }}
      sidebar={{
        width: 250,
        menu: SIDEBAR_ITEMS,
        theme: "light",
      }}
    >
      <Outlet />
    </LayoutWithHeader>
  );
};

export default ProtectedLayout;
