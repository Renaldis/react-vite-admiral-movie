import { Button, Flex, message } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { ActionTable, Page } from "admiral";
import Datatable from "admiral/table/datatable/index";
import { makeSource } from "@/utils/data-table";
import dayjs from "dayjs";
import { useFilter } from "@/app/_hooks/datatable/use-filter";
import { Link, useNavigate } from "react-router";
import { useGetRoles } from "./_hooks/use-get-roles";
import { useDeleteRole } from "./_hooks/use-delete-role";
import { TRoleItem } from "@/api/role/type";
import { urlParser } from "@/utils/url-parser";
import { ROUTES } from "@/commons/constants/routes";
import { PERMISSIONS } from "@/commons/constants/permissions";
import { Guard } from "@/app/_components/guard";

export const permissions = [PERMISSIONS.ROLES.READ_ROLES];

export const Component = () => {
  const navigate = useNavigate();
  const { handleChange, pagination, filters, setFilters } = useFilter();

  const rolesQuery = useGetRoles(pagination);

  const deleteRoleMutation = useDeleteRole();

  const columns: ColumnsType<TRoleItem> = [
    {
      dataIndex: "name",
      key: "name",
      title: "Name",
    },
    {
      dataIndex: "permissions",
      title: "Permissions",
      key: "permissions",
      render: (_, record) => {
        return record.permissions?.map((role) => role.name).join(", ");
      },
    },
    {
      dataIndex: "createdAt",
      title: "Created At",
      key: "createdAt",
      render: (_, record) => {
        return record.created_at ? dayjs(record.created_at).format("DD/MM/YYYY") : "-";
      },
    },
    {
      dataIndex: "Action",
      title: "Action",
      key: "Action",
      render: (_, record) => {
        return (
          <Flex>
            <Link
              to={urlParser(ROUTES.iam.roles.detail, {
                id: record.id,
              })}
            >
              <Button type="link" icon={<EyeOutlined style={{ color: "green" }} />} />
            </Link>
            <Guard permissions={[PERMISSIONS.ROLES.DELETE_ROLES]} fallback={<></>}>
              <Button
                type="link"
                icon={<DeleteOutlined style={{ color: "red" }} />}
                onClick={() => {
                  deleteRoleMutation.mutate(record.id, {
                    onSuccess: () => {
                      message.success("Role berhasil dihapus");
                      navigate(0);
                    },
                  });
                }}
              />
            </Guard>
            <Guard permissions={[PERMISSIONS.ROLES.UPDATE_ROLES]} fallback={<></>}>
              <Link
                to={urlParser(ROUTES.iam.roles.update, {
                  id: record.id,
                })}
              >
                <Button type="link" icon={<EditOutlined />} />
              </Link>
            </Guard>
          </Flex>
        );
      },
    },
  ];

  const breadcrumbs = [
    {
      label: "Dashboard",
      path: ROUTES.dashboard,
    },
    {
      label: "Roles",
      path: ROUTES.iam.roles.list,
    },
  ];

  return (
    <Page title="Roles" breadcrumbs={breadcrumbs} topActions={
      <Guard permissions={[PERMISSIONS.ROLES.CREATE_ROLES]} fallback={<></>}>
        <TopAction />
      </Guard>
    } noStyle>
      <ActionTable
        onSearch={(value) => setFilters({ search: value })}
        searchValue={filters.search}
        onFiltersChange={(values) => setFilters(values as Record<string, string>)}
        filters={[
          {
            label: "filter",
            name: "filter",
            type: "Group",
            icon: <FilterOutlined />,
            filters: [
              {
                label: "Name",
                name: "name",
                type: "Select",
                placeholder: "Filter Name",
                value: filters.name,
                options: [
                  {
                    label: "A-Z",
                    value: "ASC",
                  },
                  {
                    label: "Z-A",
                    value: "DESC",
                  },
                ],
              },
            ],
          },
        ]}
      />
      <div
        style={{
          backgroundColor: "white",
          padding: "5px",
          marginTop: "10px",
        }}
      >
        <Datatable
          onChange={handleChange}
          rowKey="id"
          showRowSelection={false}
          loading={rolesQuery.isLoading}
          source={makeSource(rolesQuery.data)}
          columns={columns}
          search={filters.search}
        />
      </div>
    </Page>
  );
};

const TopAction = () => (
  <Link to={ROUTES.iam.roles.create}>
    <Button icon={<PlusCircleOutlined />}>Add Role</Button>
  </Link>
);

export default Component;
