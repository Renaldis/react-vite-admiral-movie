import { useQuery } from "@tanstack/react-query";
import { getMovie } from "@/api/movie";

export const useMovieQuery = (id?: number) => {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovie(id!),
    enabled: !!id, // biar gak jalan kalau id undefined
  });
};
