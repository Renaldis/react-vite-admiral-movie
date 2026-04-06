import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMovie } from "@/api/movie";
import { TMovieFormData } from "../_components/form-movie/schema";

export const useUpdateMovie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TMovieFormData }) => updateMovie(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
  });
};
