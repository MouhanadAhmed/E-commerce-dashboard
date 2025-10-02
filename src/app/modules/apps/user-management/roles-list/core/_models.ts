import { ID, Response } from "../../../../../../_metronic/helpers";
export type Role = {
  _id?: ID;
  name?: string;
  deleted?: boolean;
  permissions?: {
    permission?: string;
    access: string[];
    _id?: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

export type RolesQueryResponse = Response<Array<Role>>;

export const initialRole: Role = {
  name: "admin",
};
