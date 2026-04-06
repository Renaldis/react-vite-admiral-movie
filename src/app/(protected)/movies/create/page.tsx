import { Page } from "admiral";
import { useNavigate } from "react-router";
import { message } from "antd";

import { ROUTES } from "@/commons/constants/routes";

import MovieForm from "../_components/form-movie";
import { TMovieFormData } from "../_components/form-movie/schema";
import { useCreateMovie } from "../_hooks/use-create-movie";
import { TResponseError } from "@/commons/types/response";

export const Component = () => {
  const navigate = useNavigate();
  const createMutation = useCreateMovie();

  const breadcrumbs = [
    {
      label: "Movies",
      path: ROUTES.movies.list,
    },
    {
      label: "Create Movie",
      path: "",
    },
  ];

  return (
    <Page
      title="Create Movie"
      breadcrumbs={breadcrumbs}
      noStyle
      goBack={() => navigate(ROUTES.movies.list)}
    >
      <MovieForm
        error={createMutation.error as TResponseError | null}
        loading={createMutation.isPending}
        editForm={false}
        formProps={{
          onFinish: (data: TMovieFormData) => {
            createMutation.mutate(data, {
              onSuccess: () => {
                message.success("Movie created successfully");
                navigate(ROUTES.movies.list);
              },
            });
          },
        }}
      />
    </Page>
  );
};

export default Component;
