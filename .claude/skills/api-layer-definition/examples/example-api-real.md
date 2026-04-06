# Example: Real API Integration

This example shows how to integrate using `api` from `@/libs/axios/api`.

## Request

"Integrate the Descriptions API into `src/api/descriptions` using `api`."

## Input

- **MODULE_PATH**: `src/api/descriptions`
- **API_DOC_PATH**: `docs/api/modules/Descriptions.json`

## Execution

### 1. Read API Documentation

```json
// docs/api/modules/Descriptions.json
{
  "endpoints": [
    {
      "method": "GET",
      "path": "/api/v1/descriptions",
      "response": { "$ref": "../schemas/DescriptionListResponse.json" }
    },
    {
      "method": "GET",
      "path": "/api/v1/descriptions/{id}",
      "response": { "$ref": "../schemas/DescriptionDetailResponse.json" }
    },
    {
      "method": "POST",
      "path": "/api/v1/descriptions",
      "request": { "$ref": "../schemas/DescriptionRequest.json" }
    },
    {
      "method": "PUT",
      "path": "/api/v1/descriptions/{id}",
      "request": { "$ref": "../schemas/DescriptionRequest.json" }
    },
    {
      "method": "DELETE",
      "path": "/api/v1/descriptions/{id}"
    }
  ]
}
```

### 2. Resolve Schemas

```json
// docs/api/schemas/DescriptionDetailResponse.json
{
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "description_code": { "type": "string" },
    "description_name": { "type": "string" },
    "category_id": { "type": "string" },
    "category_name": { "type": "string" },
    "is_active": { "type": "boolean" },
    "notes": { "type": "string", "nullable": true },
    "created_at": { "type": "string", "nullable": true },
    "updated_at": { "type": "string", "nullable": true }
  }
}
```

### 3. Generate `type.ts`

```typescript
// src/api/descriptions/type.ts
import { TFilterParams } from "@/commons/types/filter";
import { TResponseData, TResponsePaginate } from "@/commons/types/response";

// Exact match with API response
export type TDescription = {
  id: string;
  description_code: string;
  description_name: string;
  category_id: string;
  category_name: string;
  is_active: boolean;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

// Request type for POST/PUT
export type TDescriptionRequest = {
  description_code: string;
  description_name: string;
  category_id: string;
  is_active: boolean;
  notes?: string;
};

// Filter type for GET list
export type TFilterDescription = TFilterParams<{
  description_code?: string;
  description_name?: string;
  category_id?: string;
  is_active?: boolean;
}>;

export type TDescriptionListResponse = TResponsePaginate<TDescription>;
export type TDescriptionDetailResponse = TResponseData<TDescription>;
```

### 4. Generate `index.ts`

```typescript
// src/api/descriptions/index.ts
import { api } from "@/libs/axios/api";
import { TResponseData, TResponsePaginate } from "@/commons/types/response";
import { TDescription, TDescriptionRequest, TFilterDescription } from "./type";

const ENDPOINT = "/api/v1/descriptions";

// ✅ Return as-is - NO transformation
export const getDescriptions = async (params?: TFilterDescription) => {
  return await api.get<TResponsePaginate<TDescription>>(ENDPOINT, { params });
};

export const getDetailDescription = async (params: { id: string }) => {
  return await api.get<TResponseData<TDescription>>(`${ENDPOINT}/${params.id}`);
};

export const createDescription = async (data: TDescriptionRequest) => {
  return await api.post<TResponseData<TDescription>>(ENDPOINT, data);
};

export const updateDescription = async (params: { id: string }, data: TDescriptionRequest) => {
  return await api.put<TResponseData<TDescription>>(`${ENDPOINT}/${params.id}`, data);
};

export const deleteDescription = async (params: { id: string }) => {
  return await api.delete<TResponseData<null>>(`${ENDPOINT}/${params.id}`);
};
```

### 5. Update Components

**Table columns** - use API field names:
```typescript
// src/app/(protected)/descriptions/page.tsx
const columns: ColumnsType<TDescription> = [
  { dataIndex: "description_code", title: "Code", sorter: true },
  { dataIndex: "description_name", title: "Description Name", sorter: true },
  { dataIndex: "category_name", title: "Category", sorter: true },
  {
    dataIndex: "is_active",
    title: "Status",
    render: (isActive: boolean) => (
      <Tag color={isActive ? "green" : "red"}>
        {isActive ? "Active" : "Inactive"}
      </Tag>
    ),
  },
  { dataIndex: "notes", title: "Notes" },
];
```

**Form schema** - match API request:
```typescript
// src/app/(protected)/descriptions/_components/form/schema.ts
import { z } from "zod";

export const DescriptionSchema = z.object({
  description_code: z.string().min(1, "Code is required"),
  description_name: z.string().min(1, "Description name is required"),
  category_id: z.string().min(1, "Category is required"),
  is_active: z.boolean(),
  notes: z.string().optional(),
});

export type TDescriptionFormData = z.infer<typeof DescriptionSchema>;
```

**Form fields** - use API field names:
```typescript
// src/app/(protected)/descriptions/_components/form/index.tsx
<Form.Item name="description_code" label="Code" rules={[rule]}>
  <Input placeholder="Enter code" />
</Form.Item>

<Form.Item name="description_name" label="Description Name" rules={[rule]}>
  <Input placeholder="Enter description name" />
</Form.Item>

<Form.Item name="category_id" label="Category" rules={[rule]}>
  <Select placeholder="Select category" options={categoryOptions} />
</Form.Item>

<Form.Item name="is_active" label="Status" valuePropName="checked">
  <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
</Form.Item>

<Form.Item name="notes" label="Notes">
  <Input.TextArea rows={4} placeholder="Enter notes (optional)" />
</Form.Item>
```

**Detail page** - use API field names:
```typescript
// src/app/(protected)/descriptions/[id]/page.tsx
const items: DescriptionsProps["items"] = [
  { key: "description_code", label: "Code", children: <Typography.Text strong>{data?.data.description_code}</Typography.Text> },
  { key: "description_name", label: "Name", children: <Typography.Text strong>{data?.data.description_name}</Typography.Text> },
  { key: "category_name", label: "Category", children: <Typography.Text strong>{data?.data.category_name}</Typography.Text> },
  {
    key: "is_active",
    label: "Status",
    children: (
      <Tag color={data?.data.is_active ? "green" : "red"}>
        {data?.data.is_active ? "Active" : "Inactive"}
      </Tag>
    ),
  },
  { key: "notes", label: "Notes", children: <Typography.Text strong>{data?.data.notes ?? "-"}</Typography.Text> },
];
```

### 6. Verify

```bash
npx tsc --noEmit  # No errors
pnpm run build    # No errors
```

## Key Points

1. **Fetcher**: `api` from `@/libs/axios/api` - connects to real endpoint
2. **Types**: Exact match with API schema (`description_code`, `is_active`, etc.)
3. **No transformation**: API response returned as-is
4. **Boolean handling**: `is_active` is boolean, render as "Active"/"Inactive"
5. **Nullable fields**: `notes` can be null, handle with `?? "-"`
