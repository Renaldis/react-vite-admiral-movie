import { useQueryClient } from "@tanstack/react-query";

import { useMutation } from "@/app/_hooks/request/use-mutation";
import { deleteFaq } from "@/api/example";

import { FAQS_QUERY_KEY } from "./use-faqs-query";

const DELETE_FAQ_MUTATION_KEY = "delete-faq";

const useDeleteFaqMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [DELETE_FAQ_MUTATION_KEY],
    mutationFn: deleteFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FAQS_QUERY_KEY] });
    },
  });
};

export default useDeleteFaqMutation;
