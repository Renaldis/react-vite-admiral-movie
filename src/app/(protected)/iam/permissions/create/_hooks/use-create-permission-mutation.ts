import { createPermission } from "@/api/permission";
import { useMutation } from "@/app/_hooks/request/use-mutation";

export const useCreatePermissionMutation = () => {
  return useMutation({
    mutationKey: ["create-permission"],
    mutationFn: createPermission,
  });
};
