import { createFaq } from "@/api/example";
import { useMutation } from "@/app/_hooks/request/use-mutation";

const CREATE_FAQ_MUTATION_KEY = "create-faq";

const useCreateFaq = () => {
  return useMutation({
    mutationKey: [CREATE_FAQ_MUTATION_KEY],
    mutationFn: createFaq,
  });
};

export default useCreateFaq;
