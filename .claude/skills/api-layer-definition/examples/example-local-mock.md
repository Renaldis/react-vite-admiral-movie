# Example: Local Mock (No API Endpoint)

This example shows how to handle features that have **no API endpoint** available. The UI feature is preserved with local mock data.

## Scenario

The module has a "Preview" feature in the UI, but the API documentation does not include a preview endpoint. We keep the feature working with local mock data.

## Request

"Integrate the Reports API. Note: Preview endpoint is not available yet."

## Input

- **MODULE_PATH**: `src/api/reports`
- **API_DOC_PATH**: `docs/api/modules/Reports.json`

## API Documentation (Partial)

```json
// docs/api/modules/Reports.json
{
  "endpoints": [
    {
      "method": "GET",
      "path": "/api/v1/reports",
      "description": "Get list of reports"
    },
    {
      "method": "GET",
      "path": "/api/v1/reports/{id}",
      "description": "Get report detail"
    }
    // NOTE: No preview endpoint!
  ]
}
```

## Execution

### 1. Generate `type.ts`

```typescript
// src/api/reports/type.ts
import { TFilterParams } from "@/commons/types/filter";
import { TResponseData, TResponsePaginate } from "@/commons/types/response";

// Main entity type - matches API
export type TReport = {
  id: string;
  report_name: string;
  report_code: string;
  description: string | null;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
};

// Filter type
export type TFilterReport = TFilterParams<{
  report_name?: string;
  is_active?: boolean;
}>;

// Preview type - LOCAL ONLY (no API)
export type TReportPreview = {
  id: string;
  report_name: string;
  preview_url: string;
  generated_at: string;
  total_rows: number;
  columns: string[];
  sample_data: Record<string, unknown>[];
};

export type TReportListResponse = TResponsePaginate<TReport>;
export type TReportDetailResponse = TResponseData<TReport>;
```

### 2. Generate `index.ts`

```typescript
// src/api/reports/index.ts
import { api } from "@/libs/axios/api";
import { TResponseData, TResponsePaginate } from "@/commons/types/response";
import { TReport, TFilterReport, TReportPreview } from "./type";

const ENDPOINT = "/api/v1/reports";

// ============================================
// REAL API FUNCTIONS
// ============================================

export const getReports = async (params?: TFilterReport) => {
  return await api.get<TResponsePaginate<TReport>>(ENDPOINT, { params });
};

export const getDetailReport = async (params: { id: string }) => {
  return await api.get<TResponseData<TReport>>(`${ENDPOINT}/${params.id}`);
};

// ============================================
// LOCAL MOCK - No API endpoint available
// ============================================

// Mock data for preview feature
const mockPreviewData: TReportPreview = {
  id: "preview-1",
  report_name: "Sample Report",
  preview_url: "/preview/sample-report",
  generated_at: new Date().toISOString(),
  total_rows: 100,
  columns: ["id", "name", "value", "date"],
  sample_data: [
    { id: "1", name: "Item A", value: 1000, date: "2024-01-01" },
    { id: "2", name: "Item B", value: 2000, date: "2024-01-02" },
    { id: "3", name: "Item C", value: 3000, date: "2024-01-03" },
  ],
};

/**
 * Get report preview
 * TODO: Replace with real API when available
 * Endpoint needed: GET /api/v1/reports/{id}/preview
 */
export const getReportPreview = (
  params: { id: string },
): Promise<TResponseData<TReportPreview>> => {
  return Promise.resolve({
    status_code: 200,
    data: {
      ...mockPreviewData,
      id: params.id,
    },
    version: "1.0.0",
  });
};

/**
 * Generate report preview
 * TODO: Replace with real API when available
 * Endpoint needed: POST /api/v1/reports/{id}/preview
 */
export const generateReportPreview = (
  params: { id: string },
): Promise<TResponseData<TReportPreview>> => {
  return Promise.resolve({
    status_code: 200,
    data: {
      ...mockPreviewData,
      id: params.id,
      generated_at: new Date().toISOString(),
    },
    version: "1.0.0",
  });
};
```

### 3. Usage in Component

The preview feature continues to work with mock data:

```typescript
// src/app/(protected)/reports/[id]/_components/preview-section.tsx
import { useQuery } from "@tanstack/react-query";
import { getReportPreview } from "@/api/reports";

export const reportPreviewQueryKey = "get-report-preview";

export const PreviewSection = ({ reportId }: { reportId: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: [reportPreviewQueryKey, reportId],
    queryFn: () => getReportPreview({ id: reportId }),
  });

  if (isLoading) return <Spin />;

  const preview = data?.data;

  return (
    <Card title="Preview">
      <p>Generated: {preview?.generated_at}</p>
      <p>Total Rows: {preview?.total_rows}</p>
      <Table
        dataSource={preview?.sample_data}
        columns={preview?.columns.map((col) => ({
          dataIndex: col,
          title: col,
        }))}
      />
    </Card>
  );
};
```

## Key Points

1. **Preserve UI Feature**: The preview feature stays functional
2. **Clear TODO Comments**: Mark functions that need real API
3. **Document Expected Endpoint**: Note the endpoint that backend needs to create
4. **Realistic Mock Data**: Provide sensible mock data structure
5. **Same Interface**: Mock function returns same type as real API would

## When to Use Local Mock

| Scenario | Action |
|----------|--------|
| API endpoint exists | Use `api` from `@/libs/axios/api` |
| API endpoint coming soon | Use local mock + TODO |
| Feature is frontend-only | Use local mock (permanent) |

## Migration Path

When the real API becomes available:

```typescript
// Before (local mock)
export const getReportPreview = (params: { id: string }): Promise<TResponseData<TReportPreview>> => {
  return Promise.resolve({ status_code: 200, data: mockPreviewData, version: "1.0.0" });
};

// After (real API)
export const getReportPreview = async (params: { id: string }) => {
  return await api.get<TResponseData<TReportPreview>>(`${ENDPOINT}/${params.id}/preview`);
};
```
