import { Col, Row, message } from "antd";
import { Page } from "admiral";

import { usePermissionQuery } from "../_hooks/use-permission-query";
import { useUpdatePermissionMutation } from "./_hooks/use-update-permission-mutation";
import { useNavigate, useParams } from "react-router";
import { FormPermission } from "../../_components/form-permission";
import { PermissionFormData } from "../../_components/form-permission/schema";
import { ROUTES } from "@/commons/constants/routes";
import { urlParser } from "@/utils/url-parser";
import { PERMISSIONS } from "@/commons/constants/permissions";

export const permissions = [PERMISSIONS.PERMISSIONS.UPDATE_PERMISSIONS];

export const Component = () => {
  const params = useParams();
  const navigate = useNavigate();

  const permissionId = typeof params.id === "string" ? params.id : "";

  const permissionQuery = usePermissionQuery(permissionId);

  const updatePermissionMutation = useUpdatePermissionMutation(permissionId);

  const handleOnFinish = (data: PermissionFormData) =>
    updatePermissionMutation.mutate(
      { id: permissionId, ...data },
      {
        onSuccess: () => {
          navigate("/iam/permissions");
          message.success("Permission berhasil diupdate");
        },
        onError: () => {
          message.error("Permission gagal diupdate");
        },
      },
    );

  const breadcrumb = [
    {
      label: "Dashboard",
      path: ROUTES.dashboard,
    },
    {
      label: "Permissions",
      path: ROUTES.iam.permissions.list,
    },
    {
      label: permissionQuery.data?.data.name ?? "",
      path: urlParser(ROUTES.iam.permissions.detail, { id: permissionId }),
    },
    {
      label: "Update",
      path: "#",
    },
  ];

  const initialValues = {
    name: permissionQuery.data?.data.name,
    permissionKey: permissionQuery.data?.data.key,
  };

  return (
    <Page title="Update Permission" breadcrumbs={breadcrumb}>
      <Row>
        <Col span={12} style={{ margin: "auto" }}>
          <FormPermission
            key={permissionQuery.data?.data.id}
            formProps={{
              onFinish: handleOnFinish,
              initialValues,
              disabled: permissionQuery.isLoading,
            }}
            error={updatePermissionMutation.error}
            loading={updatePermissionMutation.isPending}
          />
        </Col>
      </Row>
    </Page>
  );
};

export default Component;
