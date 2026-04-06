import { updateRole } from "@/api/role";
import { TRoleUpdateRequest } from "@/api/role/type";
import { useMutation } from "@/app/_hooks/request/use-mutation";

export const queryKey = "update-role";

export const usePutUpdateRole = (id: string) => {
  return useMutation({
    mutationKey: [queryKey, id],
    mutationFn: (data: TRoleUpdateRequest) => updateRole(id, data),
  });
};
