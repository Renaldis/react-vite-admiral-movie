import { updateUser } from "@/api/user";
import { TUserUpdateRequest } from "@/api/user/type";
import { useMutation } from "@/app/_hooks/request/use-mutation";

export const useUpdateUserMutation = (id: string) => {
  return useMutation({
    mutationKey: ["update-user", id],
    mutationFn: (data: TUserUpdateRequest) => updateUser(id, data),
  });
};
