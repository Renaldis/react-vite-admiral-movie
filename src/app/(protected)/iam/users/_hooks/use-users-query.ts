import { getUsers } from "@/api/user";
import { TGetUsersParams } from "@/api/user/type";
import { useQuery } from "@/app/_hooks/request/use-query";
import { QUERY_KEY } from "@/commons/constants/query-key";

export const useUsersQuery = (params: TGetUsersParams) => {
  return useQuery({
    queryKey: [QUERY_KEY.USERS.LIST, params],
    queryFn: () => getUsers(params),
  });
};
