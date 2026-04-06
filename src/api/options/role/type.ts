import { TResponsePaginate } from "@/commons/types/response";

type TRoleOption = {
  id: number;
  name: string;
};

export type TRoleOptionResponse = TResponsePaginate<TRoleOption>;
