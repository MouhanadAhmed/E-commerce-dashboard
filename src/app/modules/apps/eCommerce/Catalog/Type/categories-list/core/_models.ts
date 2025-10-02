import { Response } from "../../../../../../../../_metronic/helpers";

export type Types = {
  imgCover?: string;
  _id?: string;
  name?: string;
  slug?: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
  deleted?: boolean;
  __v?: number;
};

export type TypesQueryResponse = Response<Array<Types>>;

export const initialCategory: Types = {
  deleted: false,
  _id: "655b0bb77a23fe0ef32ff354",
  name: "type1",
  order: 1,
  createdAt: "2023-11-20T07:33:11.990Z",
  updatedAt: "2023-11-20T07:33:11.990Z",
  __v: 0,
};
