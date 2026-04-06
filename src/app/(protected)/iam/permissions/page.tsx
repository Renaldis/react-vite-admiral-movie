import { Button, Flex, message } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { ActionTable, DataTable, Page } from "admiral";

import { makeSource } from "@/utils/data-table";

import { useDeletePermissionMutation } from "./_hooks/use-delete-permission-mutation";
import { usePermissionsQuery } from "./_hooks/use-permissions-query";
import { Link, useNavigate } from "react-router";
import { useFilter } from "@/app/_hooks/datatable/use-filter";
import { TPermissionItem } from "@/api/permission/type";
import { ROUTES } from "@/commons/constants/routes";
import { urlParser } from "@/utils/url-parser";
import { PERMISSIONS } from "@/commons/constants/permissions";
import { Guard } from "@/app/_components/guard";

export const permissions = [PERMISSIONS.PERMISSIONS.READ_PERMISSIONS];

export const Component = () => {
  const navigate = useNavigate();
  const { filters, pagination, handleChange, setFilters } = useFilter();

  const permissionsQuery = usePermissionsQuery(pagination);

  const deletePermissionMutation = useDeletePermissionMutation();

  const columns: ColumnsType<TPermissionItem> = [
    {
      dataIndex: "name",
      key: "name",
      title: "Name",
    },
    {
      dataIndex: "Action",
      title: "Action",
      key: "Action",
      render: (_, record) => {
        return (
          <Flex>
            <Link to={urlParser(ROUTES.iam.permissions.detail, { id: record?.id })}>
              <Button type="link" icon={<EyeOutlined style={{ color: "green" }} />} />
            </Link>
            <Guard permissions={[PERMISSIONS.PERMISSIONS.DELETE_PERMISSIONS]} fallback={<></>}>
              <Button
                type="link"
                icon={<DeleteOutlined style={{ color: "red" }} />}
                onClick={() => {
                  deletePermissionMutation.mutate(record.id, {
                    onSuccess: () => {
                      message.success("Permission berhasil dihapus");
                      navigate(0);
                    },
                  });
                }}
              />
            </Guard>
            <Guard permissions={[PERMISSIONS.PERMISSIONS.UPDATE_PERMISSIONS]} fallback={<></>}>
              <Link to={`/iam/permissions/${record?.id}/update`}>
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
      label: "Permissions",
      path: ROUTES.iam.permissions.list,
    },
  ];

  return (
    <Page
      title="Permissions"
      breadcrumbs={breadcrumbs}
      topActions={
        <Guard permissions={[PERMISSIONS.PERMISSIONS.CREATE_PERMISSIONS]} fallback={<></>}>
          <TopAction />
        </Guard>
      }
      noStyle
    >
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
        <DataTable
          onChange={handleChange}
          rowKey="id"
          showRowSelection={false}
          loading={permissionsQuery.isLoading}
          source={makeSource(permissionsQuery.data)}
          columns={columns}
          search={filters.search}
        />
      </div>
    </Page>
  );
};

export default Component;

const TopAction = () => (
  <Link to={ROUTES.iam.permissions.create}>
    <Button icon={<PlusCircleOutlined />}>Add Permission</Button>
  </Link>
);
