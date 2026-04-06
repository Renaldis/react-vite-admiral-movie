import { getRole } from "@/api/role";
import { useQuery } from "@/app/_hooks/request/use-query";
import { QUERY_KEY } from "@/commons/constants/query-key";

export const useGetDetailRole = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY.ROLES.DETAIL, id],
    queryFn: () => getRole(id),
  });
};
