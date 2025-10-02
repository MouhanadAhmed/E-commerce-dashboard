import { Response } from "../../../../../../../../_metronic/helpers";

export type Branch = {
  name: string;
  slug?: string;
  workingHours?: string;
  address?: string;
  imgCover?: string;
  phone?: string;
  gmap?: string;
  deleted?: boolean;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

export type BranchesQueryResponse = Response<Array<Branch>>;

export const initialBranch: Branch = {
  name: "طنطا -حسن رضوان",
  slug: "طنطا-حسن-رضوان",
  workingHours: "9am to 12am",
  address: "شارع حسن رضوان",
  phone: "0403333333",
  deleted: false,
  _id: "665d6c0ed7d6707aecdc33b6",
  createdAt: "2024-06-03T07:09:02.338Z",
  updatedAt: "2024-06-03T07:09:02.338Z",
  __v: 0,
};
