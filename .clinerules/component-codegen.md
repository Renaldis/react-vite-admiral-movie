# Understand the component

## Section from Admiral

Examples:

```jsx
    <Section 
      title="Detail Information"
      loading={false}
      actions={
        <Button type="primary">
          Add Tax Type
        </Button>
        }
      >
    </Section>
```

### Important Note

If the component has more than one `Section` in a parent element, wrap the Sections with `Space` from `antd`.
Example:

```jsx
<Section loading={false}>
  <Space direction="vertical" size="middle" style={{ width: "100%" }}>
    <Section />
    <Section />
    ...or More
  </Space>
</Section>

```
Implement this on Detail Page and Form (Create and Edit page) if the parent has more than 1 Section.

## Tag from Antd

Use the `Tag` component from `antd` to display data such as status or other fixed values. Apply a different color for each value to make them visually distinguishable. Choose the color based on the meaning or context of each value.

Example:

```jsx
<Tag color="{{color}}">
  {{label}}
</Tag>
```

## Button Group

Use this type of button if user request for one type of button but with difference functionality.
example:

```jsx
      <Dropdown
        trigger={["click"]}
        menu={{
          items: [
            {
              label: (
                <Link to={{link to page}}>{{Label}}</Link>
              ),
              key: "1",
            },

            {
              label: (
                <Link to={{link to page}}>{{Label 2}}</Link>
              ),
              key: "2",
            },
          ],
        }}
      >
        <Button size="large" type="primary" icon={<PlusOutlined />}>
          Create Data
          <Space />
          <DownOutlined />
        </Button>
      </Dropdown>
```

## Row selection on DataTable and ActionTable

Use this type of DataTable when user request for bulk action. for example bulk delete or bulk download. If user not request fot it remove `batchActionMenus` and set `showRowSelection` to `false`

```jsx
  <Datatable
    ...otherProps
    batchActionMenus={[
      {
        key: "delete",
        label: "Delete",
        onClick: (_values, cb) => {
          message.success("Role berhasil dihapus");
          cb.reset();
        },
        danger: true,
        icon: <DeleteOutlined />,
      },
      {
        key: "download",
        label: "Download",
        onClick: (_values, cb) => {
          message.success("Role berhasil didownload");
          cb.reset();
        },
        icon: <DeleteOutlined />,
      },
    ]}
    showRowSelection={true}
  />
```
or with ActionTable

```jsx
  <ActionTable
    ...otherProps
    batchActionMenus={[
      {
        key: "delete",
        label: "Delete",
        onClick: (_values, cb) => {
          message.success("Role berhasil dihapus");
          cb.reset();
        },
        danger: true,
        icon: <DeleteOutlined />,
      },
    ]}
    showRowSelection={true}
  />
```

## `filterComponents` on DataTable and `filters` on ActionTable

`filterComponents` and `filters` are functionally the same — the only difference is the prop name used in each component.

Usage:

```jsx
<DataTable filterComponents={filters} />
<ActionTable filters={filters} />
```

### Filter Type 1: Filter Group

Use this for list pages that require **more than 3 fields**.

**Example:**

```jsx
const filters = [
  {
    label: "filter",
    name: "filter",
    type: "Group",
    icon: <FilterOutlined />,
    cols: 2,
    filters: [
      {
        label: "Name",
        name: "name",
        type: "Select",
        placeholder: "Type to search",
        defaultValue: filters.name,
        options: [
          {
            label: "Admin",
            value: "admin",
          },
        ],
      },
      {
        label: "Period",
        name: "date",
        type: "DateRangePicker",
        defaultValue: filters.date,
      },
      {
        label: "Permissions",
        name: "permissions",
        type: "CheckboxDropdown",
        defaultValue: filters.permissions,
        placeholder: "Type to search",
        options: [
          {
            label: "View Role",
            value: "view-role",
          },
        ],
      },
    ],
  },
];
```

### Filter Type 2: Single Filter

Use this for list pages that require **1 to 3 fields**.

**Example:**

```jsx
const filters = [
  {
    label: "Name",
    name: "name",
    type: "Select",
    placeholder: "Type to search",
    defaultValue: filters.name,
    options: [
      {
        label: "Admin",
        value: "admin",
      },
    ],
  },
  {
    label: "Period",
    name: "date",
    type: "DateRangePicker",
    defaultValue: filters.date,
  },
  {
    label: "Permissions",
    name: "permissions",
    type: "CheckboxDropdown",
    defaultValue: filters.permissions,
    placeholder: "Type to search",
    options: [
      {
        label: "View Role",
        value: "view-role",
      },
    ],
  },
];
```

### Filter Type 3: Sort Filter

Use **only** when the user explicitly requests custom sorting. If not requested, use column-based sorting instead.

**Example:**

```jsx
const filter = [
  {
    label: "Sort",
    title: "Sort",
    name: "sort",
    type: "Group",
    icon: <SortAscendingOutlined />,
    cols: 2,
    filters: [
      {
        label: "Field",
        name: "sort_by",
        type: "Select",
        placeholder: "Choose field",
        value: filters?.sort_by,
        options: [
          {
            label: "Name",
            value: "name",
          },
        ],
      },
      {
        label: <span style={{ color: "white" }}>.</span>,
        name: "order",
        type: "Select",
        placeholder: "Order",
        value: filters?.order,
        options: [
          {
            label: "Ascending",
            value: "asc",
          },
          {
            label: "Descending",
            value: "desc",
          },
        ],
      },
    ],
  },
];
```
