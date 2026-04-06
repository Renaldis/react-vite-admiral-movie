import { Page } from "admiral";
import { Col, Row, message } from "antd";
import { useUpdateUserMutation } from "./_hooks/use-update-user-mutation";
import { TUserUpdateRequest } from "@/api/user/type";
import { useUserQuery } from "../_hooks/use-user-query";
import { useNavigate, useParams } from "react-router";
import { FormUser } from "../../_components/form-user";
import { ROUTES } from "@/commons/constants/routes";
import { PERMISSIONS } from "@/commons/constants/permissions";

export const permissions = [PERMISSIONS.USERS.UPDATE_USERS];

export const Component = () => {
  const params = useParams();
  const navigate = useNavigate();

  const userId = typeof params.id === "string" ? params.id : "";

  const userQuery = useUserQuery(userId);

  const updateUserMutation = useUpdateUserMutation(userId);

  const handleOnFinish = (data: TUserUpdateRequest) =>
    updateUserMutation.mutate(data, {
      onSuccess: () => {
        navigate("/iam/users");
        message.success("User berhasil diupdate");
      },
      onError: () => {
        message.error("User gagal diupdate");
      },
    });

  const breadcrumb = [
    {
      label: "Dashboard",
      path: ROUTES.dashboard,
    },
    {
      label: "Users",
      path: ROUTES.iam.users.list,
    },
    {
      label: userQuery.data?.data.name ?? "",
      path: `/iam/users/${userQuery.data?.data.id}`,
    },
    {
      label: "Update",
      path: "#",
    },
  ];

  return (
    <Page title="Update User" breadcrumbs={breadcrumb}>
      <Row>
        <Col span={12} style={{ margin: "auto" }}>
          <FormUser
            formProps={{
              onFinish: handleOnFinish,
              initialValues: userQuery.data,
              disabled: userQuery.isLoading,
            }}
            error={updateUserMutation.error}
            loading={updateUserMutation.isPending}
          />
        </Col>
      </Row>
    </Page>
  );
};

export default Component;
