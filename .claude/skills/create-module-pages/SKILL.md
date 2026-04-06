---
name: create-module-pages
description: Create page components (list, detail, create, update) for a module
tools: Write, Edit, Read
---

# Create Module Pages

Create page components for a module in `src/app/(protected)/[module]/`.

## Overview

This skill creates the standard CRUD pages for a module: List, Detail, Create, and Update.

## Input

The user will provide the module name as an argument. Example: `/create-module-pages holidays`

## Expected Output

After running this skill, the following structure will be created:

```
src/app/(protected)/[module]/
├── page.tsx               # List Page
├── create/
│   ├── page.tsx           # Create Page
│   └── _hooks/
│       └── use-create-[module].ts
├── [id]/
│   ├── page.tsx           # Detail Page
│   ├── _hooks/
│   │   └── use-[module]-query.ts
│   └── update/
│       ├── page.tsx       # Update Page
│       └── _hooks/
│           └── use-update-[module]-mutation.ts
├── _components/
│   └── form/
│       ├── index.tsx      # Shared Form Component
│       └── schema.ts      # Zod Validation Schema
└── _hooks/
    ├── use-[module]s-query.ts
    └── use-delete-[module]-mutation.ts
```

## Output Checklist

- [ ] Create folder `src/app/(protected)/[module]/`
- [ ] Create `page.tsx` (List Page)
- [ ] Create `create/page.tsx` (Create Page) - **Condition: Only if requested or exists in reference/xml**
- [ ] Create `[id]/page.tsx` (Detail Page) - **Condition: Only if requested or exists in reference/xml**
- [ ] Create `[id]/update/page.tsx` (Update Page) - **Condition: Only if requested or exists in reference/xml**
- [ ] Create `_components/form/index.tsx` (Shared Form)
- [ ] Create `_components/form/schema.ts` (Validation Schema)
- [ ] Create `_hooks/use-[module]s-query.ts`
- [ ] Create `_hooks/use-delete-[module]-mutation.ts`
- [ ] Create `create/_hooks/use-create-[module].ts` - **Condition/Related: Create hooks**
- [ ] Create `[id]/_hooks/use-[module]-query.ts` - **Condition/Related: Detail/Update hooks**
- [ ] Create `[id]/update/_hooks/use-update-[module]-mutation.ts` - **Condition/Related: Update hooks**

## Steps

1. **Create module folder** at `src/app/(protected)/[module]/`
2. **Create List Page** (`page.tsx`)
3. **Create Create Page** (`create/page.tsx`) - _(Optional: check User Request/XML)_
4. **Create Detail Page** (`[id]/page.tsx`) - _(Optional: check User Request/XML)_
5. **Create Update Page** (`[id]/update/page.tsx`) - _(Optional: check User Request/XML)_
6. **Create Form Component** (`_components/form/index.tsx` & `_components/form/schema.ts`)
7. **Create Hooks**
   - `_hooks/use-[module]s-query.ts`
   - `_hooks/use-delete-[module]-mutation.ts`
   - `create/_hooks/use-create-[module].ts` _(Optional)_
   - `[id]/_hooks/use-[module]-query.ts` _(Optional)_
   - `[id]/update/_hooks/use-update-[module]-mutation.ts` _(Optional)_

## Standards

- **Routes**: Use `ROUTES` object from `@/commons/constants/routes` with `generatePath` from `react-router` for parameterized routes.
- **Navigation**: Use `useNavigate` from `react-router`.
- **Validation**: Use **Zod** schema defined in `schema.ts`.
- **Forms**: Use `Ant Design` Form with `createZodSync` from `@/utils/zod-sync`.
- **Loading State**: Use `isPending` / `isLoading` from TanStack Query.
- **Error Handling**: Use `useFormErrorHandling` hook from `@/app/_hooks/form/use-form-error-handling`.
- **Components**: Use `Admiral` components (`Page`, `Section` from `admiral`, `Datatable` from `admiral/table/datatable/index`).
- **Data Table**: Use `makeSource` from `@/utils/data-table` and `useFilter` from `@/app/_hooks/datatable/use-filter`.
- **Date Formatting**: Use `formatDate` / `formatStringToDate` from `@/utils/date-format`.
- **Query Keys**: Define and export as constants inside each hook file (e.g., `export const [module]sQueryKey = "get-[module]-list"`). Mutation hooks import query keys from sibling hook files for invalidation.
- **Mutations**: Use `useMutation` from `@/app/_hooks/request/use-mutation`. Invalidate queries via `queryClient.invalidateQueries()` in `onSuccess`.
- **Types**: Use `TResponseError` from `@/commons/types/response` for error prop types.
- **Exports**: Default exports for hooks and page components.
- **Module Naming**: Folder must use **dash-case** (e.g., `holiday-dates`).

## References

- See `template.md` for code templates
- **See `reference.md` for standard page implementations** (points to `src/app/(protected)/examples`)
