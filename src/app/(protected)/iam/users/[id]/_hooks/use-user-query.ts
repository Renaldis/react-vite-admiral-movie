import { getUser } from '@/api/user';
import { useQuery } from '@/app/_hooks/request/use-query';
import { QUERY_KEY } from '@/commons/constants/query-key';

export const useUserQuery = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEY.USERS.DETAIL, id],
    queryFn: () => getUser(id),
  });
};
