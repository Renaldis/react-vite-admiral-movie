import { createUser } from "@/api/user";
import { useMutation } from "@/app/_hooks/request/use-mutation";
import { QUERY_KEY } from "@/commons/constants/query-key";

export const useCreateUserMutation = () => {
  return useMutation({
    mutationKey: [QUERY_KEY.USERS.CREATE],
    mutationFn: createUser,
    meta: { invalidateQueries: [QUERY_KEY.USERS.LIST] },
  });
};
