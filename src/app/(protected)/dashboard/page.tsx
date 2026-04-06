import { useSession } from "@/app/_components/providers/session";
import { Page } from "admiral";
import { Button, Flex, Typography } from "antd";
import { FC, ReactElement } from "react";

const Component: FC = (): ReactElement => {
  const { signout, session } = useSession();

  const user = session?.user;

  const displayName =
    user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email || "User";

  const handleLogout = () => {
    signout();
  };

  return (
    <Page title="Dashboard">
      <Flex justify="space-between" align="center">
        <Typography.Title level={4} style={{ margin: 0 }}>
          Welcome, {displayName}
        </Typography.Title>

        <Button type="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Flex>
    </Page>
  );
};

export default Component;
