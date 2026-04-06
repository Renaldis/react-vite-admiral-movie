import { Page, Section } from "admiral";
import { Button, Descriptions, Flex, message } from "antd";

import dayjs from "dayjs";
import { Link, useNavigate, useParams } from "react-router";
import { useGetDetailRole } from "../_hooks/use-get-detail-role";
import { ROUTES } from "@/commons/constants/routes";
import { urlParser } from "@/utils/url-parser";
import { useDeleteRole } from "../../_hooks/use-delete-role";
import { PERMISSIONS } from "@/commons/constants/permissions";
import { Guard } from "@/app/_components/guard";

export const permissions = [PERMISSIONS.ROLES.READ_ROLES];

export const Component = () => {
  const params = useParams();
  const navigate = useNavigate();
  const roleId = typeof params.id === "string" ? params.id : "";
  const roleQuery = useGetDetailRole(roleId);
  const deleteRoleMutation = useDeleteRole();

  const breadcrumbs = [
    {
      label: "Dashboard",
      path: ROUTES.dashboard,
    },
    {
      label: "Role",
      path: ROUTES.iam.roles.list,
    },
    {
      label: roleQuery.data?.data.name ?? "",
      path: "#",
    },
  ];

  return (
    <Page
      topActions={
        <Flex gap={10}>
          <Guard
            permissions={[PERMISSIONS.ROLES.DELETE_ROLES]}
            fallback={<></>}
          >
            <Button
              htmlType="button"
              onClick={() => {
                deleteRoleMutation.mutate(roleQuery.data?.data.id ?? "", {
                  onSuccess: () => {
                    message.success("Role berhasil dihapus");
                    navigate(ROUTES.iam.users.list);
                  },
                });
              }}
            >
              Delete
            </Button>
          </Guard>
          <Guard
            permissions={[PERMISSIONS.ROLES.UPDATE_ROLES]}
            fallback={<></>}
          >
            <Link
              to={urlParser(ROUTES.iam.roles.update, {
                id: Number(roleQuery.data?.data.id),
              })}
            >
              <Button htmlType="button" type="primary">
                Edit
              </Button>
            </Link>
          </Guard>
        </Flex>
      }
      title="Detail Role"
      breadcrumbs={breadcrumbs}
      noStyle
    >
      <Section loading={roleQuery.isLoading} title="Detail Role">
        <Descriptions bordered column={2}>
          <Descriptions.Item span={2} label="Name" key="name">
            {roleQuery.data?.data.name}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Key" key="key">
            {roleQuery.data?.data.key}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Permissions" key="permissions">
            {roleQuery.data?.data.permissions?.map((role) => role.name).join(", ")}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Created At" key="created_at">
            {roleQuery.data?.data.created_at
              ? dayjs(roleQuery.data?.data.created_at).format("DD/MM/YYYY")
              : "-"}
          </Descriptions.Item>
          <Descriptions.Item span={2} label="Updated At" key="updated_at">
            {roleQuery.data?.data.updated_at
              ? dayjs(roleQuery.data?.data.updated_at).format("DD/MM/YYYY")
              : "-"}
          </Descriptions.Item>
        </Descriptions>
      </Section>
    </Page>
  );
};

export default Component;
