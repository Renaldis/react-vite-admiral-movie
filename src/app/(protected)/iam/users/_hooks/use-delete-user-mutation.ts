import { deleteUser } from "@/api/user";
import { useMutation } from "@/app/_hooks/request/use-mutation";
import { QUERY_KEY } from "@/commons/constants/query-key";

export const useDeleteUserMutation = () => {
  return useMutation({
    mutationKey: [QUERY_KEY.USERS.DELETE],
    mutationFn: deleteUser,
    meta: { invalidateQueries: [QUERY_KEY.USERS.LIST] },
  });
};
