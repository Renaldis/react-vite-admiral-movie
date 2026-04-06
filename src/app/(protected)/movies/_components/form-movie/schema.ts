import { z } from "zod";

export const movieSchema = z.object({
  title: z.string().min(1),
  overview: z.string().optional(),
  poster_path: z.string().url(),
  release_date: z.string(),
  vote_average: z.number().min(0).max(10),
  genres: z.array(z.string()).optional(),
});

export type TMovieFormData = z.infer<typeof movieSchema>;
