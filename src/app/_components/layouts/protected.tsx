import { FC } from "react";
import { LayoutWithHeader } from "admiral";
import { Outlet, Navigate } from "react-router";
import { SIDEBAR_ITEMS } from "@/commons/constants/sidebar";
import { Flex, Grid, Typography, Spin } from "antd";
import { useSession } from "../providers/session";

export const ProtectedLayout: FC = () => {
  const { session, status } = useSession();
  const { md } = Grid.useBreakpoint();

  if (status === "authenticating") {
    return (
      <Flex justify="center" align="center" style={{ height: "100vh" }}>
        <Spin size="large" />
      </Flex>
    );
  }

  if (!session) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <LayoutWithHeader
      header={{
        brandLogo: (
          <Flex align="center" gap={8}>
            <Typography.Title
              level={4}
              style={{
                marginBottom: 0,
                color: md ? "white" : "black",
                whiteSpace: "nowrap",
              }}
            >
              Vite Admiral
            </Typography.Title>
          </Flex>
        ),
      }}
      sidebar={{
        width: 250,
        menu: SIDEBAR_ITEMS, // 🔥 langsung pakai tanpa filter
        theme: "light",
      }}
    >
      <Outlet />
    </LayoutWithHeader>
  );
};
