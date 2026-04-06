import { QueryKey } from "../constants/query-key";

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      invalidateQueries: QueryKey[];
    };
  }
}
