import { supabase } from "@/libs/supabase/client";
import { TMovieQueryParams } from "./type";

// let movies = [
//   {
//     id: 1,
//     title: "Avengers: Endgame",
//     overview: "After the devastating events of Infinity War...",
//     poster_path: "https://upload.wikimedia.org/wikipedia/id/0/0d/Avengers_Endgame_poster.jpg",
//     backdrop_path: "https://image.tmdb.org/t/p/w780/backdrop_avengers.jpg",
//     release_date: "2019-04-26",
//     vote_average: 8.4,
//     genres: ["Action", "Adventure"],
//   },
//   {
//     id: 2,
//     title: "The Batman",
//     overview: "Batman ventures into Gotham City's underworld...",
//     poster_path:
//       "https://m.media-amazon.com/images/S/pv-target-images/3de84cca07fc963b66a01a5465c2638066119711e89c707ce952555783dd4b4f.jpg",
//     backdrop_path: "https://image.tmdb.org/t/p/w780/backdrop_batman.jpg",
//     release_date: "2022-03-04",
//     vote_average: 7.8,
//     genres: ["Crime", "Drama"],
//   },
// ];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// export const getMovies = async (params?: any) => {
//   const page = params?.page ?? 1;
//   const per_page = params?.per_page ?? 10;
//   const total = movies.length;

//   return {
//     status_code: 200,
//     version: "1.0",
//     data: {
//       items: movies,
//       meta: {
//         page,
//         per_page,
//         total,
//         total_page: Math.ceil(total / per_page),
//       },
//     },
//   };
// };
export const getMovies = async (params?: TMovieQueryParams) => {
  const page = params?.page ?? 1;
  const per_page = params?.per_page ?? 10;

  const from = (page - 1) * per_page;
  const to = from + per_page - 1;

  let query = supabase.from("movies").select("*", { count: "exact" });

  if (params?.search) {
    query = query.or(`title.ilike.%${params.search}%,overview.ilike.%${params.search}%`);
  }

  const { data, error, count } = await query.range(from, to);

  if (error) throw error;

  return {
    status_code: 200,
    version: "1.0",
    data: {
      items: data,
      meta: {
        page,
        per_page,
        total: count || 0,
        total_page: Math.ceil((count || 0) / per_page),
      },
    },
  };
};

export const getMovie = async (id: number) => {
  const { data, error } = await supabase.from("movies").select("*").eq("id", id).single();

  if (error) throw error;

  return data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createMovie = async (payload: any) => {
  const { data, error } = await supabase.from("movies").insert([payload]).select().single();

  if (error) throw error;

  return data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateMovie = async (id: number, payload: any) => {
  const { data, error } = await supabase
    .from("movies")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const deleteMovie = async (id: number) => {
  const { error } = await supabase.from("movies").delete().eq("id", id);

  if (error) throw error;

  return true;
};
