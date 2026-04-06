import { deleteRole } from "@/api/role";
import { useMutation } from "@/app/_hooks/request/use-mutation";
import { QUERY_KEY } from "@/commons/constants/query-key";

export const useDeleteRole = () => {
  return useMutation({
    mutationKey: [QUERY_KEY.ROLES.DELETE],
    mutationFn: deleteRole,
    meta: { invalidateQueries: [QUERY_KEY.ROLES.LIST] },
  });
};
