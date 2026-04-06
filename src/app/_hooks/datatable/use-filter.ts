import { useTableFilter } from "admiral";
import { UseTableFilterProps } from "admiral/table/datatable/hook";
import { useNavigate, useSearchParams } from "react-router";

/**
 * Custom hook to manage and synchronize filter state with URL query parameters.
 *
 * @param {UseTableFilterProps['options']} [options] - Optional configuration for the table filter.
 * @returns {Object} An object containing:
 * - `searchParams`: The current URL search parameters.
 * - `cb`: A callback function to update the URL with the new query parameters.
 * - `options`: Optional configuration for the table filter.
 *
 * @example
 * const { searchParams, cb, options } = useFilter();
 *
 * console.log(searchParams);
 * // Output:
 * // URLSearchParams { 'page' => '1', 'limit' => '10', 'sort' => 'name', 'order' => 'asc', 'search' => 'example' }
 *
 * // Implementation on Datatable component
 * <DataTable
 *  onChange={cb}
 *  search={searchParams.get('search')}
 * ...
 * />
 *
 * // Update filter manually
 * cb(new URLSearchParams({ name: "new value" }));
 * // Output:
 * // URL updated with new query parameters
 */

export const useFilter = (options?: UseTableFilterProps["options"]) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  return useTableFilter({
    searchParams,
    cb: (params) => {
      const queryParams = params.toString();

      navigate(queryParams ? `?${queryParams}` : "");
    },
    options,
  });
};

export type TFilter = string | undefined;
