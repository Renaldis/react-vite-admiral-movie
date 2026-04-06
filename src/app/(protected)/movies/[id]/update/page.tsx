import { message, Spin } from "antd";
import { useNavigate, useParams } from "react-router";
import { Page } from "admiral";

import { ROUTES } from "@/commons/constants/routes";
import { TResponseError } from "@/commons/types/response";

import MovieForm from "../../_components/form-movie";
import { TMovieFormData } from "../../_components/form-movie/schema";
import { useMovieQuery } from "../_hooks/use-movie-query";
import { useUpdateMovie } from "../../_hooks/use-update-movie";

export const Component = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const movieId = Number(id);

  const movieQuery = useMovieQuery(movieId);
  const updateMutation = useUpdateMovie();

  const breadcrumbs = [
    {
      label: "Movies",
      path: ROUTES.movies.list,
    },
    {
      label: "Update Movie",
      path: "",
    },
  ];

  if (movieQuery.isLoading) {
    return (
      <Page title="Update Movie" breadcrumbs={breadcrumbs} goBack={() => navigate(-1)}>
        <Spin />
      </Page>
    );
  }

  const movie = movieQuery.data;

  return (
    <Page title="Update Movie" breadcrumbs={breadcrumbs} goBack={() => navigate(-1)}>
      <MovieForm
        editForm
        loading={updateMutation.isPending}
        loadingData={movieQuery.isLoading}
        error={updateMutation.error as TResponseError | null}
        formProps={{
          initialValues: {
            title: movie?.title,
            overview: movie?.overview,
            poster_path: movie?.poster_path,
            release_date: movie?.release_date,
            vote_average: movie?.vote_average,
            genres: movie?.genres || [],
          },

          onFinish: (data: TMovieFormData) => {
            updateMutation.mutate(
              {
                id: movieId,
                data,
              },
              {
                onSuccess: () => {
                  message.success("Movie updated successfully");
                  navigate(ROUTES.movies.list);
                },
              },
            );
          },
        }}
      />
    </Page>
  );
};

export default Component;
