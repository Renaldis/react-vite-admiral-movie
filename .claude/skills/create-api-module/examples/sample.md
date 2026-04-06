# Sample: Holidays Module

Complete example of an API module for managing holidays.

## Folder Structure

```
src/api/holidays/
├── type.ts
└── index.ts
```

---

## type.ts

```typescript
import { TFilterParams } from "@/commons/types/filter";
import { TResponseData, TResponsePaginate } from "@/commons/types/response";

export type THolidayStatus = "active" | "inactive";

export type THoliday = {
  id: string;
  name: string;
  date: string;
  description: string;
  status: THolidayStatus;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
};

export type THolidayRequest = {
  name: string;
  date: string;
  description: string;
  status?: THolidayStatus;
};

export type TFilterHoliday = TFilterParams<{
  status?: THolidayStatus;
}>;

export type THolidayListResponse = TResponsePaginate<THoliday>;
export type THolidayDetailResponse = TResponseData<THoliday>;
```

---

## index.ts

```typescript
import { TResponseData } from "@/commons/types/response";
import {
  TFilterHoliday,
  THoliday,
  THolidayRequest,
  THolidayDetailResponse,
  THolidayListResponse,
} from "./type";

const listHolidays: THoliday[] = [
  {
    id: "1",
    name: "New Year's Day",
    date: "2024-01-01T00:00:00.000Z",
    description: "New Year's Day celebration",
    status: "active",
    created_at: "2023-10-01T00:00:00.000Z",
    updated_at: "2023-10-01T00:00:00.000Z",
    deleted_at: null,
  },
  {
    id: "2",
    name: "Independence Day",
    date: "2024-08-17T00:00:00.000Z",
    description: "Independence Day celebration",
    status: "active",
    created_at: "2023-10-01T00:00:00.000Z",
    updated_at: "2023-10-01T00:00:00.000Z",
    deleted_at: null,
  },
  {
    id: "3",
    name: "Christmas",
    date: "2024-12-25T00:00:00.000Z",
    description: "Christmas Day",
    status: "inactive",
    created_at: "2023-10-01T00:00:00.000Z",
    updated_at: "2023-10-01T00:00:00.000Z",
    deleted_at: null,
  },
];

export const getHolidays = (
  params: TFilterHoliday,
): Promise<THolidayListResponse> => {
  console.log(params);
  return Promise.resolve({
    status_code: 200,
    data: {
      items: listHolidays,
      meta: {
        total_page: 1,
        total: listHolidays.length,
        page: 1,
        per_page: 10,
      },
    },
    version: "1.0.0",
  });
};

export const getDetailHoliday = (params: {
  id: string;
}): Promise<THolidayDetailResponse> => {
  console.log(params);
  return Promise.resolve({
    status_code: 200,
    data: listHolidays.find((item) => item.id === params.id)!,
    version: "1.0.0",
  });
};

export const createHoliday = (
  req: THolidayRequest,
): Promise<TResponseData<null>> => {
  console.log(req);
  return Promise.resolve({
    status_code: 200,
    data: null,
    version: "1.0.0",
  });
};

export const updateHoliday = (
  params: { id: string },
  req: THolidayRequest,
): Promise<TResponseData<null>> => {
  console.log(req, params);
  return Promise.resolve({
    status_code: 200,
    data: null,
    version: "1.0.0",
  });
};

export const deleteHoliday = (params: {
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

---

## Notes

- All field names are in **English**
- All field names use **snake_case** format
- Status uses string type (`"active"` | `"inactive"`)
- Single `T[Module]Request` type shared for create and update
- List response: items and meta wrapped inside `data` field (`data.items`, `data.meta`)
- Detail response: entity in `data` field
- Mutation responses: return `TResponseData<null>`
