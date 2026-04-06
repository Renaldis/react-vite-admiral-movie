# AI Prototype Project – Page Code Generation Guidelines

This guide outlines the steps and standards for generating pages in the AI Prototype project. Consistent adherence ensures maintainable and standardized page structures across the codebase.

---

## 1. Important: Before Creating a Page

If a resource belongs to a **Parent Menu**, follow this directory structure:

* **Path Format:** `src/app/(protected)/[parent]/[resource]/page.tsx`
* **Example:** `src/app/(protected)/managements/inventories/page.tsx`
* **Important**:
    * Always refer to the example files. **Do not create additional functions or features** beyond what is demonstrated.
    * Create api request and definition based on user request. If user not request update, or create do not create the page.

---

## 2. List Page (Read)

Displays a list of resource items.

* **Path:** `src/app/(protected)/[resource]/page.tsx`
* Use `DataTable` from `admiral`, not `antd`

### Hooks

#### a. Fetching Data

* **Path:** `src/app/(protected)/[resource]/_hooks/use-get-[resource].ts`
* **Example:**

```tsx
import { useQuery } from "@tanstack/react-query";
import { getFaqs } from "@/api/example";
import { TFilterFaq } from "@/api/example/type";
import { QUERY_KEY } from "@/commons/constants/query-key";

const useGetFaqs = (params: TFilterFaq = {}) => {
  return useQuery({
    queryKey: [QUERY_KEY.FAQS.LIST, params],
    queryFn: () => getFaqs(params),
  });
};

export default useGetFaqs;
```

#### b. Deleting Items (Optional)

Only create if user request for Delete action.

* **Path:** `src/app/(protected)/[resource]/_hooks/use-delete-[resource].ts`
* **Example:**

```tsx
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@/app/_hooks/request/use-mutation";
import { deleteFaq } from "@/api/example";
import { QUERY_KEY } from "@/commons/constants/query-key";

const useDeleteFaq = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-faq-item"],
    mutationFn: deleteFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.FAQS.LIST],
      });
    },
  });
};

export default useDeleteFaq;
```

### Notes

* Reuse **components** from the examples — **do not** create custom components.
* Must include:

  * Resource item list
  * Search, filter, and sort
  * Navigation to Create, Edit, and Detail pages
  * **DO NOT** add fields outside the defined specification

---

## 3. Detail Page (Read)

* **Path:** `src/app/(protected)/[resource]/[id]/page.tsx`

* **Reference:** `src/app/(protected)/examples/[id]/page.tsx`

* **Features:**

  * Display detailed data of selected item
  * Include a **back button** to return to the list page

### Hooks

#### Fetching Data

* **Path:** `src/app/(protected)/[resource]/[id]/_hooks/use-get-detail-[resource].ts`
* **Example:**

```tsx
import { useQuery } from "@tanstack/react-query";
import { getDetailFaq } from "@/api/example";
import { QUERY_KEY } from "@/commons/constants/query-key";

const useGetDetailFaq = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY.FAQS.DETAIL, id],
    queryFn: () => getDetailFaq(id),
  });
};

export default useGetDetailFaq;
```

---

## 4. Shared Form Component

- Create this before building Create and Update pages.
- Create Form for create and update page if user request for edit and create. If not do not create this.


### Form

* **Path:** `src/app/(protected)/[resource]/_components/form/index.tsx`
* **Reference:** `src/app/(protected)/examples/_components/form/index.tsx`

### Validation Rules

* **Path:** `src/app/(protected)/[resource]/_components/form/schema.ts`
* **Example:**

```ts
import { z } from "zod";

export const FAQSchema = z.object({
  answer: z.string({ message: "Answer is required" }).min(1, { message: "Answer is required" }),
});

export type TFAQFormData = z.infer<typeof FAQSchema>;
```

### Notes

* Used for both Create and Update pages
* Implement required validation rules using `zod`

---

## 5. Edit Page (Update)

* **Path:** `src/app/(protected)/[resource]/[id]/update/page.tsx`

* **Reference:** `src/app/(protected)/examples/[id]/update/page.tsx`

* **Features:**

  * Pre-filled form with existing data
  * Include **back**, **cancel**, and **submit** buttons

> Create this if user request for Edit Feature

### Hooks

* **Path:** `src/app/(protected)/[resource]/[id]/update/_hooks/use-update-[resource].ts`
* **Example:**

```ts
import { updateFaq } from "@/api/example";
import { TFaqRequest } from "@/api/example/type";
import { useMutation } from "@/app/_hooks/request/use-mutation";

const useUpdateFaq = (id: string) => {
  return useMutation({
    mutationKey: ["update-faq", { id }],
    mutationFn: (req: TFaqRequest) => updateFaq({ id }, req),
  });
};

export default useUpdateFaq;
```

---

## 6. Create Page (Create)

* **Path:** `src/app/(protected)/[resource]/create/page.tsx`

* **Reference:** `src/app/(protected)/examples/create/page.tsx`

* **Features:**

  * Blank form to create new item
  * Include **back**, **cancel**, and **submit** buttons

> Create this if user request for Edit Feature

### Hooks

* **Path:** `src/app/(protected)/[resource]/create/_hooks/use-create-[resource].ts`
* **Example:**

```ts
import { createFaq } from "@/api/example";
import { useMutation } from "@/app/_hooks/request/use-mutation";

const useCreateFaq = () => {
  return useMutation({
    mutationKey: ["create-faq"],
    mutationFn: createFaq,
  });
};

export default useCreateFaq;
```

---

## Final Notes

Strictly follow these page generation guidelines to ensure consistency, maintainability, and quality throughout the AI Prototype project.
