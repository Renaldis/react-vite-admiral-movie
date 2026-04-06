import { useQuery } from "@tanstack/react-query";
import { getMovies } from "@/api/movie";
import { TMovieQueryParams } from "@/api/movie/type";

export const useMoviesQuery = (params?: TMovieQueryParams) => {
  return useQuery({
    queryKey: ["movies", params],
    queryFn: () => getMovies(params),
  });
};
