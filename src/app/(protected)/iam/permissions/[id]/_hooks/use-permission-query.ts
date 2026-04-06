import { getPermission } from "@/api/permission";
import { useQuery } from "@/app/_hooks/request/use-query";
import { QUERY_KEY } from "@/commons/constants/query-key";

export const usePermissionQuery = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY.PERMISSIONS.DETAIL, id],
    queryFn: () => getPermission(id),
  });
};
