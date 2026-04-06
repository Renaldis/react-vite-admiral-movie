import { createRole } from "@/api/role";
import { TRoleCreateRequest } from "@/api/role/type";
import { useMutation } from "@/app/_hooks/request/use-mutation";

export const queryKey = "create-role";

export const usePostCreateRole = () => {
  return useMutation({
    mutationKey: [queryKey],
    mutationFn: (data: TRoleCreateRequest) => createRole(data),
  });
};
