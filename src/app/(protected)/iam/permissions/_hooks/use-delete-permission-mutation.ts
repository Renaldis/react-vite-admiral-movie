import { deletePermission } from "@/api/permission";
import { useMutation } from "@/app/_hooks/request/use-mutation";

export const useDeletePermissionMutation = () => {
  return useMutation({
    mutationKey: ["delete-permission"],
    mutationFn: deletePermission,
  });
};
