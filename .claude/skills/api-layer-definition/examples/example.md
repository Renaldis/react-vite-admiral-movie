# API Layer Definition Examples

This directory contains examples for different API integration scenarios.

## Available Examples

| Example | Fetcher | Use Case |
|---------|---------|----------|
| [example-api-real.md](./example-api-real.md) | `api` | Real API endpoint (with auth) |
| [example-api-mock.md](./example-api-mock.md) | `apiMock` | Backend mock server (no auth) |
| [example-local-mock.md](./example-local-mock.md) | Local | No API endpoint available |

## Quick Reference

### Real API (`api` — with auth interceptor)

```typescript
import { api } from "@/libs/axios/api";

export const getEntities = async (params?: TFilter) => {
  return await api.get<TResponsePaginate<TEntity>>(ENDPOINT, { params });
};
```

### Mock API (`apiMock` — no auth interceptor)

```typescript
import { apiMock } from "@/libs/axios/api";

export const getEntities = async (params?: TFilter) => {
  return await apiMock.get<TResponsePaginate<TEntity>>(ENDPOINT, { params });
};
```

### Local Mock (Fallback)

Use when API endpoint is not available yet but UI feature must work.

```typescript
// TODO: Replace with real API when available
export const getFeature = (params: { id: string }): Promise<TResponseData<TFeature>> => {
  return Promise.resolve({ status_code: 200, data: mockData, version: "1.0.0" });
};
```

## Key Rules (All Examples)

1. **NO transformation** - Return API response as-is
2. **Types match API** - Use exact field names from API schema
3. **Components adapt** - Update UI to use API field names
4. **Preserve features** - Keep local mock for missing endpoints
