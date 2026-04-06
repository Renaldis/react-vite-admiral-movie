import { Col, Row, message } from "antd";
import { Page } from "admiral";
import { FormRole } from "../_components/form-role";
import { RoleFormData } from "../_components/form-role/schema";
import { useNavigate } from "react-router";
import { ROUTES } from "@/commons/constants/routes";
import { usePostCreateRole } from "./_hooks/use-post-create-role-";
import { PERMISSIONS } from "@/commons/constants/permissions";

export const permissions = [PERMISSIONS.ROLES.CREATE_ROLES];

export const Component = () => {
  const navigate = useNavigate();
  const breadcrumb = [
    {
      label: "Dashboard",
      path: ROUTES.dashboard,
    },
    {
      label: "Roles",
      path: ROUTES.iam.roles.list,
    },
    {
      label: "Create Role",
      path: "#",
    },
  ];

  const createRoleMutation = usePostCreateRole();

  const handleOnFinish = (data: RoleFormData) => {
    const payload = {
      name: data.name,
      key: data.roleKey,
      permissions_ids: data.permissions_ids,
    };
    createRoleMutation.mutate(payload, {
      onSuccess: () => {
        message.success("Role berhasil dibuat");
        navigate(ROUTES.iam.roles.list);
      },
      onError: () => {
        message.error("Role gagal dibuat");
      },
    });
  };

  return (
    <Page title="Add Role" breadcrumbs={breadcrumb}>
      <Row>
        <Col span={12} style={{ margin: "auto" }}>
          <FormRole
            formProps={{ onFinish: handleOnFinish }}
            error={createRoleMutation.error}
            loading={createRoleMutation.isPending}
          />
        </Col>
      </Row>
    </Page>
  );
};

export default Component;
