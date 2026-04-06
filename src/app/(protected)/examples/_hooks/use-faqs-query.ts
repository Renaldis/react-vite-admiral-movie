import { useQuery } from "@/app/_hooks/request/use-query";

import { getFaqs } from "@/api/example";
import { TFilterFaq } from "@/api/example/type";

export const FAQS_QUERY_KEY = "get-faqs";

const useFaqsQuery = (params: TFilterFaq = {}) => {
  return useQuery({
    queryKey: [FAQS_QUERY_KEY, params],
    queryFn: () => getFaqs(params),
  });
};

export default useFaqsQuery;
