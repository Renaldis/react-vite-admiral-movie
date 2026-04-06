# Module Page Templates

**IMPORTANT NOTES:**
- All labels, placeholders, and messages in **English**
- Use `ROUTES` object from `@/commons/constants/routes` (NOT an enum)
- Use `generatePath` from `react-router` for parameterized routes
- Use `useNavigate` from `react-router` for navigation
- Define query/mutation keys as exported constants inside each hook file
- Default export all hooks and page components

## 1. List Page Template (`page.tsx`)

```typescript
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Page } from "admiral";
import Datatable from "admiral/table/datatable/index";
import { Button, Flex, message, Tag, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { generatePath, Link } from "react-router";

import { T[Module] } from "@/api/[module]/type";
import { ROUTES } from "@/commons/constants/routes";
import { useFilter } from "@/app/_hooks/datatable/use-filter";
import { makeSource } from "@/utils/data-table";

import use[Module]sQuery from "./_hooks/use-[module]s-query";
import useDelete[Module]Mutation from "./_hooks/use-delete-[module]-mutation";

export const Component = () => {
  const { handleChange, pagination, filters } = useFilter();

  const listQuery = use[Module]sQuery({
    ...pagination,
    ...filters,
  });

  const deleteMutation = useDelete[Module]Mutation();

  const columns: ColumnsType<T[Module]> = [
    {
      dataIndex: "name", // Adjust based on actual field
      key: "name",
      title: "Name",
      sorter: true,
      render: (_, record) => {
        return (
          <Typography.Link underline>
            <Link
              to={generatePath(ROUTES.[module].detail, {
                id: record.id,
              })}
            >
              {record.name}
            </Link>
          </Typography.Link>
        );
      },
    },
    // Add more columns as needed
    {
      key: "status",
      title: "Status",
      sorter: true,
      align: "center",
      render: (_, record) => {
        const color = record.status === "active" ? "green" : "red";
        const label = record.status === "active" ? "Active" : "Inactive";
        return <Tag color={color}>{label}</Tag>;
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
              to={generatePath(ROUTES.[module].detail, {
                id: record.id,
              })}
            >
              <Button type="link" icon={<EyeOutlined style={{ color: "green" }} />} />
            </Link>
            <Button
              type="link"
              icon={<DeleteOutlined style={{ color: "red" }} />}
              onClick={() => {
                deleteMutation.mutate(
                  { id: record.id },
                  {
                    onSuccess: () => {
                      message.success("[Module] deleted successfully");
                    },
                  },
                );
              }}
            />
            <Link
              to={generatePath(ROUTES.[module].update, {
                id: record.id,
              })}
            >
              <Button type="link" icon={<EditOutlined />} />
            </Link>
          </Flex>
        );
      },
    },
  ];

  const breadcrumbs = [
    {
      label: "[Module]s",
      path: ROUTES.[module].list,
    },
  ];

  return (
    <Page title="[Module]s" breadcrumbs={breadcrumbs} topActions={<TopAction />} noStyle>
      <Datatable
        filterComponents={[
          {
            label: "Status",
            name: "status",
            type: "Select",
            placeholder: "Select Status",
            value: filters.status,
            options: [
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ],
          },
        ]}
        onChange={handleChange}
        rowKey="id"
        showRowSelection={false}
        loading={listQuery.isLoading}
        source={makeSource(listQuery.data)}
        columns={columns}
        search={filters.search}
      />
    </Page>
  );
};

const TopAction = () => (
  <Link to={ROUTES.[module].create}>
    <Button icon={<PlusCircleOutlined />}>Add [Module]</Button>
  </Link>
);

export default Component;
```

## 2. Create Page Template (`create/page.tsx`)

```typescript
import { Page } from "admiral";
import { useNavigate } from "react-router";
import { message } from "antd";

import { ROUTES } from "@/commons/constants/routes";

import Form[Module] from "../_components/form";
import { T[Module]FormData } from "../_components/form/schema";
import useCreate[Module] from "./_hooks/use-create-[module]";

export const Component = () => {
  const navigate = useNavigate();
  const createMutation = useCreate[Module]();

  const breadcrumbs = [
    {
      label: "[Module]s",
      path: ROUTES.[module].list,
    },
    {
      label: "Create [Module]",
      path: "",
    },
  ];

  return (
    <Page
      title="Create [Module]"
      breadcrumbs={breadcrumbs}
      noStyle
      goBack={() => navigate(ROUTES.[module].list)}
    >
      <Form[Module]
        error={createMutation.error}
        loading={createMutation.isPending}
        editForm={false}
        formProps={{
          onFinish: (data: T[Module]FormData) => {
            createMutation.mutate(
              {
                ...data,
                // Add data transformation if needed
              },
              {
                onSuccess: () => {
                  message.success("[Module] created successfully");
                  navigate(ROUTES.[module].list);
                },
              },
            );
          },
        }}
      />
    </Page>
  );
};

export default Component;
```

## 3. Detail Page Template (`[id]/page.tsx`)

```typescript
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Page, Section } from "admiral";
import { Button, Descriptions, Flex, message, Tag, Typography } from "antd";
import { DescriptionsProps } from "antd/lib";
import { generatePath, useNavigate, useParams } from "react-router";

import { ROUTES } from "@/commons/constants/routes";
import { formatDate } from "@/utils/date-format";

import useDelete[Module]Mutation from "../_hooks/use-delete-[module]-mutation";
import use[Module]Query from "./_hooks/use-[module]-query";

export const Component = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const detailQuery = use[Module]Query(id || "");
  const deleteMutation = useDelete[Module]Mutation();
  const data = detailQuery.data;

  const breadcrumbs = [
    {
      label: "[Module]s",
      path: ROUTES.[module].list,
    },
    {
      label: `Detail ${data?.data.name ?? ""}`,
      path: generatePath(ROUTES.[module].detail, { id: id || "" }),
    },
  ];

  const items: DescriptionsProps["items"] = [
    {
      key: "name",
      label: "Name",
      children: <Typography.Text strong>{data?.data.name ?? "-"}</Typography.Text>,
    },
    {
      key: "status",
      label: "Status",
      children: (() => {
        const color = data?.data.status === "active" ? "green" : "red";
        const label = data?.data.status === "active" ? "Active" : "Inactive";
        return <Tag color={color}>{label}</Tag>;
      })(),
    },
    {
      key: "created_at",
      label: "Created At",
      children: (
        <Typography.Text strong>{formatDate(data?.data.created_at) ?? "-"}</Typography.Text>
      ),
    },
    {
      key: "updated_at",
      label: "Updated At",
      children: (
        <Typography.Text strong>{formatDate(data?.data.updated_at) ?? "-"}</Typography.Text>
      ),
    },
    // Add more fields
  ];

  return (
    <Page
      title={`Detail : ${data?.data.name ?? ""}`}
      breadcrumbs={breadcrumbs}
      noStyle
      goBack={() => navigate(ROUTES.[module].list)}
      topActions={
        <Flex gap={8}>
          <Button
            loading={deleteMutation.isPending}
            onClick={() => {
              deleteMutation.mutate(
                { id: id || "" },
                {
                  onSuccess: () => {
                    message.success("[Module] deleted successfully");
                    navigate(-1);
                  },
                },
              );
            }}
            danger
            icon={<DeleteOutlined />}
          >
            Delete
          </Button>
          <Button
            onClick={() => navigate(generatePath(ROUTES.[module].update, { id }))}
            type="primary"
            icon={<EditOutlined />}
          >
            Edit
          </Button>
        </Flex>
      }
    >
      <Section loading={detailQuery.isLoading}>
        <Section title="[Module] Information">
          <Descriptions
            bordered
            layout="horizontal"
            items={items}
            labelStyle={{
              width: "20%",
              textAlign: "left",
            }}
            contentStyle={{
              width: "30%",
            }}
            column={{
              md: 1,
              lg: 2,
              xl: 2,
              xxl: 2,
            }}
          />
        </Section>
      </Section>
    </Page>
  );
};

export default Component;
```

## 4. Update Page Template (`[id]/update/page.tsx`)

```typescript
import { Page } from "admiral";
import { generatePath, useNavigate, useParams } from "react-router";
import { message } from "antd";

import { ROUTES } from "@/commons/constants/routes";

import Form[Module] from "../../_components/form";
import { T[Module]FormData } from "../../_components/form/schema";
import use[Module]Query from "../_hooks/use-[module]-query";
import useUpdate[Module]Mutation from "./_hooks/use-update-[module]-mutation";

export const Component = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const updateMutation = useUpdate[Module]Mutation(id || "");
  const detailQuery = use[Module]Query(id || "");

  const breadcrumbs = [
    {
      label: "[Module]s",
      path: ROUTES.[module].list,
    },
    {
      label: `Detail ${detailQuery.data?.data.name ?? ""}`,
      path: generatePath(ROUTES.[module].detail, { id }),
    },
    {
      label: "Update [Module]",
      path: "",
    },
  ];

  return (
    <Page
      title={`Update ${detailQuery.data?.data.name ?? ""}`}
      breadcrumbs={breadcrumbs}
      noStyle
      goBack={() => navigate(ROUTES.[module].list)}
    >
      <Form[Module]
        key={detailQuery.data?.data.id}
        error={updateMutation.error}
        loading={updateMutation.isPending}
        editForm={true}
        formProps={{
          disabled: updateMutation.isPending || !detailQuery.data?.data,
          initialValues: {
            // Map initial values here
            name: detailQuery.data?.data.name,
            status: detailQuery.data?.data.status === "active",
          },
          onFinish: (data: T[Module]FormData) => {
            updateMutation.mutate(
              {
                ...data,
                // Add transformations if needed
                status: data.status ? "active" : "inactive",
              },
              {
                onSuccess: () => {
                  message.success("[Module] updated successfully");
                  navigate(ROUTES.[module].list);
                },
              },
            );
          },
        }}
      />
    </Page>
  );
};

export default Component;
```

## 5. Form Component (`_components/form/index.tsx`)

```typescript
import { Button, Col, Form, FormProps, Input, Row, Space, Switch } from "antd";
import { useNavigate } from "react-router";
import { Section } from "admiral";

import { useFormErrorHandling } from "@/app/_hooks/form/use-form-error-handling";
import { TResponseError } from "@/commons/types/response";
import { createZodSync } from "@/utils/zod-sync";

import { [Module]Schema } from "./schema";

interface Props {
  formProps: FormProps;
  loading?: boolean;
  loadingData?: boolean;
  error: TResponseError | null;
  editForm?: boolean;
}

const rule = createZodSync([Module]Schema);

const Form[Module] = ({ formProps, loading, loadingData, error, editForm }: Props) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useFormErrorHandling(error, ({ key, message }) =>
    form.setFields([{ name: key, errors: [message] }]),
  );

  return (
    <Form {...formProps} form={form} layout="vertical">
      <Section loading={loadingData}>
        <Section title="[Module] Information">
          <Row gutter={[16, 0]}>
            <Col span={24} sm={12}>
              <Form.Item label="Name" name="name" required rules={[rule]}>
                <Input placeholder="Enter name" />
              </Form.Item>
            </Col>
            <Col span={24} sm={12}>
              <Form.Item label="Status" name="status" rules={[rule]}>
                <Switch checkedChildren="Active" unCheckedChildren="Inactive" defaultChecked />
              </Form.Item>
            </Col>
            {/* Add more form items here */}
          </Row>
        </Section>
      </Section>

      <Form.Item style={{ textAlign: "right", marginTop: 16 }}>
        <Space>
          <Button type="default" htmlType="button" onClick={() => navigate(-1)} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            disabled={loading || formProps.disabled}
            loading={loading}
          >
            {!editForm ? "Save" : "Save Changes"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
export default Form[Module];
```

## 6. Form Schema (`_components/form/schema.ts`)

```typescript
import { z } from "zod";

export const [Module]Schema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(1, { message: "Name is required" }),
  status: z.boolean().optional().default(true),
});

export type T[Module]FormData = z.infer<typeof [Module]Schema>;
```

## 7. Get List Hook Template (`_hooks/use-[module]s-query.ts`)

```typescript
import { useQuery } from "@tanstack/react-query";

import { get[Module]s } from "@/api/[module]";
import { TFilter[Module] } from "@/api/[module]/type";

export const [module]sQueryKey = "get-[module]-list";

const use[Module]sQuery = (params: TFilter[Module] = {}) => {
  return useQuery({
    queryKey: [[module]sQueryKey, params],
    queryFn: () => get[Module]s(params),
  });
};

export default use[Module]sQuery;
```

## 8. Get Detail Hook Template (`[id]/_hooks/use-[module]-query.ts`)

```typescript
import { useQuery } from "@tanstack/react-query";

import { getDetail[Module] } from "@/api/[module]";

export const [module]QueryKey = "get-detail-[module]";

const use[Module]Query = (id: string) => {
  return useQuery({
    queryKey: [[module]QueryKey, { id }],
    queryFn: () => getDetail[Module]({ id }),
  });
};

export default use[Module]Query;
```

## 9. Create Mutation Hook Template (`create/_hooks/use-create-[module].ts`)

```typescript
import { useMutation } from "@/app/_hooks/request/use-mutation";
import { create[Module] } from "@/api/[module]";

const useCreate[Module] = () => {
  return useMutation({
    mutationKey: ["create-[module]"],
    mutationFn: create[Module],
  });
};

export default useCreate[Module];
```

## 10. Update Mutation Hook Template (`[id]/update/_hooks/use-update-[module]-mutation.ts`)

```typescript
import { useMutation } from "@/app/_hooks/request/use-mutation";
import { update[Module] } from "@/api/[module]";
import { T[Module]Request } from "@/api/[module]/type";

const useUpdate[Module]Mutation = (id: string) => {
  return useMutation({
    mutationKey: ["update-[module]", { id }],
    mutationFn: (req: T[Module]Request) => update[Module]({ id }, req),
  });
};

export default useUpdate[Module]Mutation;
```

## 11. Delete Mutation Hook Template (`_hooks/use-delete-[module]-mutation.ts`)

```typescript
import { useMutation } from "@/app/_hooks/request/use-mutation";
import { delete[Module] } from "@/api/[module]";
import { useQueryClient } from "@tanstack/react-query";

import { [module]sQueryKey } from "./use-[module]s-query";

export const delete[Module]MutationKey = "delete-[module]";

const useDelete[Module]Mutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: [delete[Module]MutationKey],
    mutationFn: delete[Module],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [[module]sQueryKey] });
    },
  });
};

export default useDelete[Module]Mutation;
```
