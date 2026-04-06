import { Page, Section } from "admiral";
import { Button, Descriptions, Flex, message } from "antd";

import { usePermissionQuery } from "../_hooks/use-permission-query";
import { Link, useNavigate, useParams } from "react-router";
import { ROUTES } from "@/commons/constants/routes";
import { urlParser } from "@/utils/url-parser";
import { useDeletePermissionMutation } from "../../_hooks/use-delete-permission-mutation";
import { PERMISSIONS } from "@/commons/constants/permissions";
import { Guard } from "@/app/_components/guard";

export const permissions = [PERMISSIONS.PERMISSIONS.READ_PERMISSIONS];

const Component = () => {
  const params = useParams();
  const navigate = useNavigate();
  const permissionId = typeof params.id === "string" ? params.id : "";
  const permissionQuery = usePermissionQuery(permissionId);
  const deletePermissionMutation = useDeletePermissionMutation();

  const breadcrumbs = [
    {
      label: "Dashboard",
      path: ROUTES.dashboard,
    },
    {
      label: "Permission",
      path: ROUTES.iam.permissions.list,
    },
    {
      label: permissionQuery.data?.data.name ?? "",
      path: urlParser(ROUTES.iam.permissions.detail, { id: permissionId }),
    },
  ];

  return (
    <Page
      topActions={
        <Flex gap={10}>
          <Guard permissions={[PERMISSIONS.PERMISSIONS.DELETE_PERMISSIONS]} fallback={<></>}>
            <Button
              htmlType="button"
              onClick={() => {
                deletePermissionMutation.mutate(permissionQuery.data?.data.id ?? "", {
                  onSuccess: () => {
                    message.success("Permission berhasil dihapus");
                    navigate(ROUTES.iam.permissions.list);
                  },
                });
              }}
            >
              Delete
            </Button>
          </Guard>
          <Guard permissions={[PERMISSIONS.PERMISSIONS.UPDATE_PERMISSIONS]} fallback={<></>}>
            <Link
              to={urlParser(ROUTES.iam.roles.update, {
                id: Number(permissionQuery.data?.data.id),
              })}
            >
              <Button htmlType="button" type="primary">
                Edit
              </Button>
            </Link>
          </Guard>
        </Flex>
      }
      title="Detail Permission"
      breadcrumbs={breadcrumbs}
      noStyle
    >
      <Section loading={permissionQuery.isLoading} title="Detail Permission">
        <Descriptions bordered column={2}>
          <Descriptions.Item span={2} label="Name">
            {permissionQuery.data?.data.name}
          </Descriptions.Item>
        </Descriptions>
      </Section>
    </Page>
  );
};

export default Component;
