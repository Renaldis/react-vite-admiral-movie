import { getRoles } from "@/api/role";
import { TRoleGetRequest } from "@/api/role/type";
import { useQuery } from "@/app/_hooks/request/use-query";
import { QUERY_KEY } from "@/commons/constants/query-key";

export const useGetRoles = (params: TRoleGetRequest) => {
  return useQuery({
    queryKey: [QUERY_KEY.ROLES.LIST, params],
    queryFn: () => getRoles(params),
  });
};
