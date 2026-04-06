import { Col, Row, message } from "antd";
import { Page } from "admiral";

import { FormPermission } from "../_components/form-permission";
import { PermissionFormData } from "../_components/form-permission/schema";
import { useCreatePermissionMutation } from "./_hooks/use-create-permission-mutation";
import { useNavigate } from "react-router";
import { PERMISSIONS } from "@/commons/constants/permissions";

export const permissions = [PERMISSIONS.PERMISSIONS.CREATE_PERMISSIONS];

export const Component = () => {
  const navigate = useNavigate();
  const breadcrumb = [
    {
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      label: "Permissions",
      path: "/iam/permissions",
    },
    {
      label: "Create Permission",
      path: "#",
    },
  ];

  const createPermissionMutation = useCreatePermissionMutation();

  const handleOnFinish = (data: PermissionFormData) =>
    createPermissionMutation.mutate(data, {
      onSuccess: () => {
        message.success("Permission berhasil dibuat");
        navigate("/iam/permissions");
      },
      onError: () => {
        message.error("Permission gagal dibuat");
      },
    });

  return (
    <Page title="Add Permission" breadcrumbs={breadcrumb}>
      <Row>
        <Col span={12} style={{ margin: "auto" }}>
          <FormPermission
            formProps={{ onFinish: handleOnFinish }}
            error={createPermissionMutation.error}
            loading={createPermissionMutation.isPending}
          />
        </Col>
      </Row>
    </Page>
  );
};

export default Component;
