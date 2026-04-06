import { getRoleOptions } from "@/api/options/role";
import { useQuery } from "@/app/_hooks/request/use-query";

export const useRolesOptionQuery = () => {
  return useQuery({
    queryKey: ["roles-option"],
    queryFn: getRoleOptions,
    select: (data) =>
      data.data.items.map((item) => ({ value: item.id, label: item.name })),
  });
};
