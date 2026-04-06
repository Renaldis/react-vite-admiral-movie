---
description: Generate a TypeScript module from reference XML
---

## Context

- A reference XML module is provided (e.g., `@references/users.xml`)
- The input XML serves as the prototype that defines the module structure and behavior
- Internal standards for layout, logic, and implementation must be followed
- The output must replicate the XML prototype's behavior in production-ready TypeScript code

## Your task

Based on the given XML reference, generate a complete TypeScript module. Your implementation must:

- Ask user to give the reference XML file (the prototype) and switch to plan mode.
- Analyze and translate the XML prototype structure and logic into TypeScript
- Use typed, structured, and maintainable code
- Match the visual layout and interaction as defined in the XML prototype
- Align with the conventions in the `examples` module
- Ensure that each field in the detail page has an explicitly defined type
- Make sure to follow code style and pattern in `@/api/examples` and `@/app/(protected)/examples`
- Use kebab-case naming convention for all directories and files
- Add `data-testid` to related field or component for better end-to-end testing.

## Steps

### 1. Analyze the Reference Module

- Detect included pages: `list`, `detail`, `create`, `edit`
- Extract fields, types, and labels
- Understand endpoints and routing logic
- Note any conditional UI behaviors or business rules

### 2. Translate to Code (TypeScript)

- Use explicit types for all variables, functions, and components
- Follow implementation patterns from:

  - `@/api/examples`
  - `@/app/(protected)/examples`

- Maintain consistent structure and logic

### 3. UI and Component Mapping

- Use components compliant with Admiral and Ant Design
- Ensure the layout closely matches the prototype
- Reuse form components (create/edit)
- Use `Zod` for form validation schemas
- **Always implement proper error handling in forms:**
  - Import `useFormErrorHandling` from `@/app/_hooks/form/use-form-error-handling`
  - Create form instance using `const [form] = Form.useForm()`
  - Call the hook with form instance and error: `useFormErrorHandling(form, error)`
  - The hook automatically maps API validation errors to form fields based on the `path` property
  - Pass the `error` prop from mutation (create/update) to the form component
  - Example:
    ```tsx
    const [form] = Form.useForm();
    useFormErrorHandling(form, error);

    return (
      <Form {...formProps} form={form} layout="vertical">
        {/* form fields */}
      </Form>
    );
    ```
- **Breadcrumb configuration for nested menu modules:**
  - For modules nested under a parent menu (e.g., "Master Data", "User Management"), the first breadcrumb item MUST use `"#"` as the path
  - Example:
    ```tsx
    const breadcrumbs = [
      {
        label: "Master Data",  // Parent menu group
        path: "#",             // Always use "#" for nested menu parent
      },
      {
        label: "Issues",
        path: ROUTES.masterData.issues.list,
      },
    ];
    ```
  - This applies to all pages: list, create, detail, and update
  - Standalone modules (not nested under a parent menu) don't need this rule

### 3a. Permission Guards and Authorization

**IMPORTANT: All CRUD operations MUST be protected with permission guards**

- **Always export permissions array** at the top of each page component:
  ```tsx
  export const permissions = [PERMISSIONS.RESOURCE.VIEW];
  ```

- **Permission patterns by page type:**
  - **List page**: `PERMISSIONS.RESOURCE.VIEW`
  - **Create page**: `PERMISSIONS.RESOURCE.CREATE`
  - **Detail page**: `PERMISSIONS.RESOURCE.VIEW`
  - **Update page**: `PERMISSIONS.RESOURCE.UPDATE`

- **Guard all action buttons** using the `Guard` component:
  ```tsx
  import { Guard } from "@/app/_components/guard";
  import { PERMISSIONS } from "@/commons/constants/permissions";

  // List page - Create button
  <Guard permissions={[PERMISSIONS.RESOURCE.CREATE]} fallback={<></>}>
    <Button type="primary" icon={<PlusOutlined />}>
      Tambah
    </Button>
  </Guard>

  // List page - Edit button (in table actions)
  <Guard permissions={[PERMISSIONS.RESOURCE.UPDATE]} fallback={<></>}>
    <Button type="link" icon={<EditOutlined />} />
  </Guard>

  // List page - Delete button (in table actions)
  <Guard permissions={[PERMISSIONS.RESOURCE.DELETE]} fallback={<></>}>
    <Button type="link" icon={<DeleteOutlined />} />
  </Guard>

  // Detail page - Edit and Delete buttons
  <Flex gap={8}>
    <Guard permissions={[PERMISSIONS.RESOURCE.DELETE]} fallback={<></>}>
      <Button danger icon={<DeleteOutlined />}>Delete</Button>
    </Guard>
    <Guard permissions={[PERMISSIONS.RESOURCE.UPDATE]} fallback={<></>}>
      <Button danger icon={<EditOutlined />}>Edit</Button>
    </Guard>
  </Flex>
  ```

- **Complete implementation checklist:**
  1. Add `export const permissions = [...]` to ALL pages (list, create, detail, update)
  2. Import `Guard` component where action buttons exist
  3. Import `PERMISSIONS` constant from `@/commons/constants/permissions`
  4. Wrap ALL action buttons (Create, Edit, Delete) with appropriate Guard
  5. Use `fallback={<></>}` to hide buttons when user lacks permission
  6. Follow the exact pattern used in `risks` and `issues` modules as reference

### 4. Sidebar Registration

- **Always register new modules in the sidebar navigation**
- Add routes, permissions (if needed), and menu items
- Follow the exact pattern used by existing modules
- Use appropriate icons from Ant Design
- Ensure menu items are properly localized (Bahasa Indonesia)

## Output Specification

Your generated module must include:

- `index.ts` and `types.ts` → API module under `@/api/[parent]/[resource]/`
- Page files → Located at `src/app/(protected)/[parent]/[resource]/`
- Schema → `form/schema.ts` under `_components`
- Hooks → Defined under `_hooks/` in related page.
- Use kebab-case for all component and module names (e.g., `user-management`, `feasibility-studies`)
- Fully typed components and business logic using React + TypeScript
- **Automatically register the new module in `@src/commons/constants/sidebar.tsx`**:
  - Add appropriate routes to `@src/commons/constants/routes.ts`
  - Add any required permissions to `@src/commons/constants/permissions.ts` (optional)
  - Add sidebar menu item with proper icon and navigation
  - Follow existing sidebar structure and naming conventions
