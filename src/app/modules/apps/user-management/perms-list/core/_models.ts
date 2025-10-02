import { ID, Response } from "../../../../../../_metronic/helpers";
export type Permission = {
  _id?: ID;
  name?: string;
  deleted?: boolean;
  assignedTo?: {
    role?: string;
    _id?: string;
  }[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

export type PermissionsQueryResponse = Response<Array<Permission>>;

export const initialPermission: Permission = {
  name: "Payroll",
};
