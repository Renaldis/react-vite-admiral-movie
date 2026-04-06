import { TResponseError } from "@/commons/types/response";
import { useEffect } from "react";

export const useFormErrorHandling = (
  error?: TResponseError | null,
  onError?: (error: TResponseError["errors"][number]) => void,
) => {
  useEffect(() => {
    error?.errors?.forEach((value) => onError?.(value));
  }, [error]);
};
