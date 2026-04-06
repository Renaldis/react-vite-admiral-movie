import { z } from "zod";

export const movieSchema = z.object({
  title: z.string().min(1, "Title wajib"),
  overview: z.string().min(5, "Overview minimal 5 karakter"),
  poster_path: z.string().url("Harus URL gambar"),
  backdrop_path: z.string().url().optional(),
  release_date: z.string(),
  vote_average: z.number().min(0).max(10),
  genres: z.array(z.string()).min(1),
});
