# AI Prototype Project – Code Utilities Generation Guidelines

This guide outlines the required steps and standards for adding a new resource to the AI Prototype project. Follow these instructions carefully to ensure consistency and quality across the codebase.

---

## 1. Define Resource Routes

Routes determine the navigation paths for a specific resource in the application.

* **Location:** `src/commons/constants/routes.ts`
* **Action:** Add a new entry for the resource under the `ROUTES` object.
* **Rule:** 
  * Preserve all existing route definitions.
  * Understand the user request. If user only request for read data, you don't need to create route for create and update
* **Example:**

```ts
export const ROUTES = {
  ...
  faqs: {
    list: "/faqs",
    create: "/faqs/create",
    detail: "/faqs/:id",
    update: "/faqs/:id/update",
    ...
  },
  ...
};
```

---

## 2. Define Resource Permissions

Permissions control access to various actions related to the resource.

* **Location:** `src/commons/constants/permissions.ts`
* **Action:** Add a new object for the resource under the `PERMISSION` constant.
* **Rule:** 
  * Preserve all existing permission definitions.
  * Understand the user request. If user only request for read data, you don't need to create permission for create and update
* **Example:**

```ts
export const PERMISSION = {
  ...
  FAQS: {
    READ_FAQS: "READ FAQS",
    CREATE_FAQS: "CREATE FAQS",
    UPDATE_FAQS: "UPDATE FAQS",
    DELETE_FAQS: "DELETE FAQS",
    ...
  },
  ...
};
```

---

## 3. Add Resource to Sidebar Menu

This enables users to navigate to the resource via the application sidebar.

* **Location:** `src/commons/constants/sidebar.tsx`

* **Action:** Add the new resource to `SIDEBAR_ITEMS`.

* **Icon:** Use `MailOutlined` from `@ant-design/icons` as the default icon if none is specified.

* **Rule:** Preserve all existing menu items.

* **Example:**

```tsx
{
  key: "/faqs",
  label: <Link to={ROUTES.faqs.list}>FAQs</Link>,
  icon: <MailOutlined />,
  permissions: [PERMISSIONS.FAQS.READ_FAQS],
},
```

* **If the resource has a parent menu:**

```tsx
{
  key: "/managements",
  label: "Managements",
  icon: <MailOutlined />,
  children: [
    {
      key: "/managements/inventories",
      label: <Link to={ROUTES.managements.inventories.list}>Inventory</Link>,
      permissions: [PERMISSIONS.MANAGEMENTS.INVENTORIES.READ_INVENTORIES],
    },
  ],
},
```

> Use `ROUTES` and `PERMISSIONS` constants from the files defined earlier.

---

## 4. Register Resource Query Keys

Query keys are used to uniquely identify API queries and mutations in the application.

* **Location:** `src/commons/constants/query-key.ts`
* **Action:** Add a new entry for the resource in `QUERY_KEY`.
* **Rule:** 
  * Preserve all existing keys.
  * Understand the user request. If user only request for read data, you don't need to create query keys for create and update
* **Example:**

```ts
export const QUERY_KEY = {
  ...
  FAQS: {
    LIST: "get-faqs-list",
    DETAIL: "get-faqs-detail",
    ...
  },
  ...
};
```

---

## Final Notes

Strictly follow the above guidelines when introducing new resources to ensure project consistency, maintainability, and quality.
