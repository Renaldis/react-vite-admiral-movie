import { updateFaq } from "@/api/example";
import { TFaqRequest } from "@/api/example/type";
import { useMutation } from "@/app/_hooks/request/use-mutation";

const UPDATE_FAQ_MUTATION_KEY = "update-faq";

const useUpdateFaqMutation = (id: string) => {
  return useMutation({
    mutationKey: [UPDATE_FAQ_MUTATION_KEY, { id }],
    mutationFn: (req: TFaqRequest) => updateFaq({ id }, req),
  });
};

export default useUpdateFaqMutation;
