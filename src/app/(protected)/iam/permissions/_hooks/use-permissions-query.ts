import { getPermissions } from "@/api/permission";
import { TGetPermissionsParams } from "@/api/permission/type";
import { useQuery } from "@/app/_hooks/request/use-query";
import { QUERY_KEY } from "@/commons/constants/query-key";

export const usePermissionsQuery = (params: TGetPermissionsParams) => {
  return useQuery({
    queryKey: [QUERY_KEY.PERMISSIONS.DETAIL, params],
    queryFn: () => getPermissions(params),
  });
};
