import { Descriptions, Image, Spin, Typography } from "antd";
import { useNavigate, useParams } from "react-router";
import { Page } from "admiral";

import { ROUTES } from "@/commons/constants/routes";
import { useMovieQuery } from "../_hooks/use-movie-query";

export const Component = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const movieId = Number(id);

  const movieQuery = useMovieQuery(movieId);

  const breadcrumbs = [
    {
      label: "Movies",
      path: ROUTES.movies.list,
    },
    {
      label: "Detail Movie",
      path: "",
    },
  ];

  if (movieQuery.isLoading) {
    return (
      <Page title="Detail Movie" breadcrumbs={breadcrumbs} goBack={() => navigate(-1)}>
        <Spin />
      </Page>
    );
  }

  const movie = movieQuery.data;

  return (
    <Page title="Detail Movie" breadcrumbs={breadcrumbs} goBack={() => navigate(-1)}>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Poster">
          <Image src={movie?.poster_path} width={200} />
        </Descriptions.Item>

        <Descriptions.Item label="Title">
          <Typography.Text strong>{movie?.title}</Typography.Text>
        </Descriptions.Item>

        <Descriptions.Item label="Release Date">{movie?.release_date}</Descriptions.Item>

        <Descriptions.Item label="Rating">⭐ {movie?.vote_average}</Descriptions.Item>

        <Descriptions.Item label="Overview">{movie?.overview || "-"}</Descriptions.Item>

        <Descriptions.Item label="Genres">
          {movie?.genres?.length ? movie.genres.join(", ") : "-"}
        </Descriptions.Item>
      </Descriptions>
    </Page>
  );
};

export default Component;
