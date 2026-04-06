# API Module Templates

## type.ts Template

```typescript
import { TFilterParams } from "@/commons/types/filter";
import { TResponseData, TResponsePaginate } from "@/commons/types/response";

// Status type (adjust based on module needs)
export type T[Module]Status = "active" | "inactive"; // or 0 | 1

export type T[Module] = {
  id: string;
  // ... all fields from prototype
  status: T[Module]Status;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
};

export type T[Module]Request = {
  // ... fields for create and update
  status?: T[Module]Status;
};

export type TFilter[Module] = TFilterParams<{
  // ... optional filters
  status?: T[Module]Status;
}>;

export type T[Module]ListResponse = TResponsePaginate<T[Module]>;
export type T[Module]DetailResponse = TResponseData<T[Module]>;
```

## index.ts Template (Mock Data)

```typescript
import { TResponseData } from "@/commons/types/response";
import {
  TFilter[Module],
  T[Module],
  T[Module]Request,
  T[Module]DetailResponse,
  T[Module]ListResponse,
} from "./type";

// Mock data array
const list[Module]s: T[Module][] = [
  {
    id: "1",
    // ... fields
    status: "active",
    created_at: "2023-10-01T00:00:00.000Z",
    updated_at: "2023-10-01T00:00:00.000Z",
    deleted_at: null,
  },
  // ... more items
];

// List - returns paginated response with data.items and data.meta
export const get[Module]s = (
  params: TFilter[Module],
): Promise<T[Module]ListResponse> => {
  console.log(params);
  return Promise.resolve({
    status_code: 200,
    data: {
      items: list[Module]s,
      meta: {
        total_page: 1,
        total: list[Module]s.length,
        page: 1,
        per_page: 10,
      },
    },
    version: "1.0.0",
  });
};

// Detail - returns single item in data field
export const getDetail[Module] = (params: {
  id: string;
}): Promise<T[Module]DetailResponse> => {
  console.log(params);
  return Promise.resolve({
    status_code: 200,
    data: list[Module]s.find((item) => item.id === params.id)!,
    version: "1.0.0",
  });
};

// Create - returns null data
export const create[Module] = (
  req: T[Module]Request,
): Promise<TResponseData<null>> => {
  console.log(req);
  return Promise.resolve({
    status_code: 200,
    data: null,
    version: "1.0.0",
  });
};

// Update - returns null data
export const update[Module] = (
  params: { id: string },
  req: T[Module]Request,
): Promise<TResponseData<null>> => {
  console.log(req, params);
  return Promise.resolve({
    status_code: 200,
    data: null,
    version: "1.0.0",
  });
};

// Delete - returns null data
export const delete[Module] = (params: {
  id: string;
}): Promise<TResponseData<null>> => {
  console.log(params);
  return Promise.resolve({
    status_code: 200,
    data: null,
    version: "1.0.0",
  });
};
```
