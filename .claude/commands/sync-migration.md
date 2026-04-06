---
description: Sync MIGRATION.md with API documentation modules
---

# Sync Migration Command

Scans `docs/api/modules/` and updates `MIGRATION.md` with API documentation mappings and integration status.

## Steps

1. **List API Documentation Files**:
   - Read all JSON files in `docs/api/modules/`
   - Display the list of available API documentation
   - If `docs/api/modules/` doesn't exist, report it and skip to step 3

2. **Update API Doc File Column**:
   - Match module names to API doc file names using the mapping below
   - Update the `API Doc File` column in `MIGRATION.md`

3. **Check API Integration Status & Type**:
   - For each module, check `src/api/[module]/index.ts`
   - Set **API Integration** status:
     - `Done` - All endpoints integrated with real/mock API
     - `Integrating` - Partial API integration (some endpoints converted)
     - `Pending` - Not yet integrated (still using local mock)
     - `N/A` - No API documentation available
   - Set **API Type** based on fetcher used:
     - `Real` - Uses `api` from `@/libs/axios/api` (production endpoint with auth)
     - `Mock` - Uses `apiMock` from `@/libs/axios/api` (BE mock endpoint, no auth)
     - `Local` - Uses local mock data with `Promise.resolve` (no endpoint hit)
     - `-` - Not yet integrated

4. **Report Unmapped API Docs**:
   - List any API doc files that don't match existing modules
   - Suggest potential module mappings

## Module to API Doc Mapping

| Module Name | API Doc File | Notes |
|-------------|--------------|-------|
| data-uploads | Import From Spec.json | Contains data upload endpoints |
| data-uploads-files | Import From Spec.json | File detail endpoints |
| descriptions | Descriptions.json | Master data descriptions |
| entity-districts | Entity Districts.json | Entity districts master data |
| period-actuals | Configuration.json | Period configuration |
| period-plans | Configuration.json | Period configuration |

## Detection Patterns

### Real API (API Type: `Real`)
```typescript
// Uses `api` from @/libs/axios/api (with auth interceptor)
import { api } from "@/libs/axios/api";

const ENDPOINT = "/api/v1/entities";

export const getEntities = async (params?: TFilterEntity) => {
  return await api.get<TResponsePaginate<TEntity>>(ENDPOINT, { params });
};
```

### Mock API (API Type: `Mock`)
```typescript
// Uses `apiMock` from @/libs/axios/api (no auth interceptor)
import { apiMock } from "@/libs/axios/api";

const ENDPOINT = "/api/v1/entities";

export const getEntities = async (params?: TFilterEntity) => {
  return await apiMock.get<TResponsePaginate<TEntity>>(ENDPOINT, { params });
};
```

### Local Mock (API Type: `Local`)
```typescript
// Local mock data - no endpoint hit, uses Promise.resolve
const mockData: TEntity[] = [...];

export const getEntities = (params: TFilterEntity): Promise<TEntityListResponse> => {
  console.log(params);
  return Promise.resolve({
    status_code: 200,
    data: {
      items: mockData,
      meta: { total_page: 1, total: 2, page: 1, per_page: 10 },
    },
    version: "1.0.0",
  });
};
```

### Mixed Usage (API Integration: `Integrating`)
```typescript
// Some functions use real/mock API, others use local mock
import { api } from "@/libs/axios/api";

const ENDPOINT = "/api/v1/entities";

export const getEntities = async (params?: TFilterEntity) => {
  return await api.get<TResponsePaginate<TEntity>>(ENDPOINT, { params });
};

// TODO: Replace with real API when available
export const exportEntities = (): Promise<TResponseData<null>> => {
  return Promise.resolve({ status_code: 200, data: null, version: "1.0.0" });
};
```

## Output

After running this command, `MIGRATION.md` will be updated with:
- Accurate `API Integration` status for all modules
- Correct `API Type` based on fetcher used (`Real`, `Mock`, `Local`, `-`)
- Correct `API Doc File` mappings
- List of unmapped API documentation files (if any)
