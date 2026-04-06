import { TResponsePaginate } from "@/commons/types/response";
import { IDataTableProps } from "admiral/table/datatable/type";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const makeSource = <T extends Record<string, any>>(
  source?: TResponsePaginate<T>,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
): IDataTableProps<T, {}>["source"] | undefined => {
  if (!source) return;
  return {
    data: source.data.items,
    meta: {
      page: source.data.meta.page,
      pageSize: source.data.meta.per_page,
      total: source.data.meta.total,
    },
  };
};
