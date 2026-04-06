# Example: API Mock Integration

This example shows how to integrate using `apiMock` from `@/libs/axios/api` — a separate axios instance without auth interceptors, useful for connecting to a backend mock server during development.

## Request

"Integrate the Data Uploads API into `src/api/data-uploads` using `apiMock`."

## Input

- **MODULE_PATH**: `src/api/data-uploads`
- **API_DOC_PATH**: `docs/api/modules/DataUploads.json`

## Execution

### 1. Read API Documentation

```json
// docs/api/modules/DataUploads.json
{
  "endpoints": [
    {
      "method": "GET",
      "path": "/api/v1/data-uploads",
      "response": { "$ref": "../schemas/DataUploadListResponse.json" }
    },
    {
      "method": "GET",
      "path": "/api/v1/data-uploads/{id}",
      "response": { "$ref": "../schemas/DataUploadDetailResponse.json" }
    },
    {
      "method": "POST",
      "path": "/api/v1/data-uploads",
      "request": { "$ref": "../schemas/DataUploadRequest.json" }
    }
  ]
}
```

### 2. Resolve Schemas

```json
// docs/api/schemas/DataUploadDetailResponse.json
{
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "file_name": { "type": "string" },
    "file_path": { "type": "string" },
    "description_id": { "type": "string" },
    "table_name": { "type": "string" },
    "period_year": { "type": "number" },
    "period_month": { "type": "number" },
    "status": { "type": "number" },
    "created_at": { "type": "string", "nullable": true },
    "updated_at": { "type": "string", "nullable": true }
  }
}
```

### 3. Generate `type.ts`

```typescript
// src/api/data-uploads/type.ts
import { TFilterParams } from "@/commons/types/filter";
import { TResponseData, TResponsePaginate } from "@/commons/types/response";

// Exact match with API response - NO transformation
export type TDataUpload = {
  id: string;
  file_name: string;
  file_path: string;
  description_id: string;
  table_name: string;
  period_year: number;
  period_month: number;
  status: number;
  created_at: string | null;
  updated_at: string | null;
};

// Request type for POST/PUT
export type TDataUploadRequest = {
  file_name: string;
  file_path: string;
  description_id: string;
  table_name: string;
  period_year: number;
  period_month: number;
};

// Filter type for GET list
export type TFilterDataUpload = TFilterParams<{
  file_name?: string;
  description_id?: string;
  period_year?: number;
  status?: number;
}>;

export type TDataUploadListResponse = TResponsePaginate<TDataUpload>;
export type TDataUploadDetailResponse = TResponseData<TDataUpload>;
```

### 4. Generate `index.ts`

```typescript
// src/api/data-uploads/index.ts
import { apiMock } from "@/libs/axios/api";  // ← Using apiMock (no auth interceptor)
import { TResponseData, TResponsePaginate } from "@/commons/types/response";
import { TDataUpload, TDataUploadRequest, TFilterDataUpload } from "./type";

const ENDPOINT = "/api/v1/data-uploads";

// ✅ Return as-is - NO transformation
export const getDataUploads = async (params?: TFilterDataUpload) => {
  return await apiMock.get<TResponsePaginate<TDataUpload>>(ENDPOINT, { params });
};

export const getDetailDataUpload = async (params: { id: string }) => {
  return await apiMock.get<TResponseData<TDataUpload>>(`${ENDPOINT}/${params.id}`);
};

export const createDataUpload = async (data: TDataUploadRequest) => {
  return await apiMock.post<TResponseData<TDataUpload>>(ENDPOINT, data);
};

export const updateDataUpload = async (params: { id: string }, data: TDataUploadRequest) => {
  return await apiMock.put<TResponseData<TDataUpload>>(`${ENDPOINT}/${params.id}`, data);
};

export const deleteDataUpload = async (params: { id: string }) => {
  return await apiMock.delete<TResponseData<null>>(`${ENDPOINT}/${params.id}`);
};
```

### 5. Update Components

**Table columns** - use API field names:
```typescript
// src/app/(protected)/data-uploads/page.tsx
const columns: ColumnsType<TDataUpload> = [
  { dataIndex: "file_name", title: "File Name", sorter: true },
  { dataIndex: "table_name", title: "Table Name", sorter: true },
  { dataIndex: "period_year", title: "Year", sorter: true },
  { dataIndex: "period_month", title: "Month", sorter: true },
  {
    dataIndex: "status",
    title: "Status",
    render: (status: number) => (
      <Tag color={status === 1 ? "green" : "red"}>
        {status === 1 ? "Active" : "Inactive"}
      </Tag>
    ),
  },
];
```

**Form schema** - match API request:
```typescript
// src/app/(protected)/data-uploads/_components/form/schema.ts
import { z } from "zod";

export const DataUploadSchema = z.object({
  file_name: z.string().min(1, "File name is required"),
  file_path: z.string().min(1, "File path is required"),
  description_id: z.string().min(1, "Description is required"),
  table_name: z.string().min(1, "Table name is required"),
  period_year: z.number().min(2000, "Invalid year"),
  period_month: z.number().min(1).max(12, "Invalid month"),
});

export type TDataUploadFormData = z.infer<typeof DataUploadSchema>;
```

### 6. Verify

```bash
npx tsc --noEmit  # No errors
pnpm run build    # No errors
```

## Key Points

1. **Fetcher**: `apiMock` from `@/libs/axios/api` - no auth interceptor, for backend mock server
2. **Types**: Exact match with API schema (`file_name`, `description_id`, etc.)
3. **No transformation**: API response returned as-is
4. **Components adapted**: All field names match API
