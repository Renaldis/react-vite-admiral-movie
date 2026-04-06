import { useState } from "react";
import { Button, Flex, message, Typography, Image } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { DataTable, Page } from "admiral";
import { generatePath, Link } from "react-router";

import { makeSource } from "@/utils/data-table";
import { ROUTES } from "@/commons/constants/routes";
import { useFilter } from "@/app/_hooks/datatable/use-filter";
import ModalAction from "@/app/_components/ui/modals/modal-action";

import { useMoviesQuery } from "./_hooks/use-movies-query";
import { useDeleteMovie } from "./_hooks/use-delete-movie";

type TMovie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
};

export const Component = () => {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { handleChange, pagination, filters } = useFilter();

  const moviesQuery = useMoviesQuery({
    ...pagination,
    ...filters,
  });

  const deleteMutation = useDeleteMovie();

  const columns: ColumnsType<TMovie> = [
    {
      title: "Poster",
      key: "poster",
      render: (_, record) => (
        <Image src={record.poster_path} width={60} style={{ borderRadius: 6 }} />
      ),
    },
    {
      dataIndex: "title",
      key: "title",
      title: "Title",
      render: (_, record) => (
        <Typography.Link>
          <Link
            to={generatePath(ROUTES.movies.detail, {
              id: record.id,
            })}
          >
            {record.title}
          </Link>
        </Typography.Link>
      ),
    },
    {
      dataIndex: "release_date",
      key: "release_date",
      title: "Release Date",
    },
    {
      dataIndex: "vote_average",
      key: "vote_average",
      title: "Rating",
      render: (val) => `⭐ ${val}`,
    },
    {
      key: "Action",
      title: "Action",
      render: (_, record) => (
        <Flex>
          <Link
            to={generatePath(ROUTES.movies.detail, {
              id: record.id,
            })}
          >
            <Button type="link" icon={<EyeOutlined />} />
          </Link>

          <Button
            type="link"
            icon={<DeleteOutlined style={{ color: "red" }} />}
            onClick={() => setDeleteId(record.id)}
          />

          <Link
            to={generatePath(ROUTES.movies.update, {
              id: record.id,
            })}
          >
            <Button type="link" icon={<EditOutlined />} />
          </Link>
        </Flex>
      ),
    },
  ];

  const breadcrumbs = [
    {
      label: "Movies",
      path: ROUTES.movies.list,
    },
  ];

  return (
    <Page title="Movies" breadcrumbs={breadcrumbs} topActions={<TopAction />} noStyle>
      <DataTable
        onChange={handleChange}
        rowKey="id"
        loading={moviesQuery.isLoading}
        source={makeSource(moviesQuery.data)}
        columns={columns}
        search={filters.search}
      />

      <ModalAction
        type="delete"
        title="Delete Movie"
        description="Are you sure you want to delete this movie?"
        open={!!deleteId}
        onCancel={() => setDeleteId(null)}
        onOk={async () => {
          if (!deleteId) return;
          await deleteMutation.mutateAsync(deleteId);
          message.success("Movie deleted");
          setDeleteId(null);
        }}
        centered
      />
    </Page>
  );
};

const TopAction = () => (
  <Link to={ROUTES.movies.create}>
    <Button icon={<PlusCircleOutlined />}>Add Movie</Button>
  </Link>
);

export default Component;
