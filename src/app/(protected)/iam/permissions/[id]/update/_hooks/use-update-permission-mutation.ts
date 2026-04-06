import { updatePermission } from "@/api/permission";
import { TPermissionUpdateRequest } from "@/api/permission/type";
import { useMutation } from "@/app/_hooks/request/use-mutation";

export const useUpdatePermissionMutation = (id: string) => {
  return useMutation({
    mutationKey: ["update-permission", id],
    mutationFn: (data: TPermissionUpdateRequest) => updatePermission(id, data),
  });
};
