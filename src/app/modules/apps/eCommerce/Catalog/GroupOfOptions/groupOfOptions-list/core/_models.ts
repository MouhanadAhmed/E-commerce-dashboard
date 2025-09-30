import { Response } from "../../../../../../../../_metronic/helpers";

export type GroupOfOptions = {
  min: number;
  deleted: boolean;
  _id: string;
  name: string;
  slug: string;
  available: boolean;
  stock: number | null;
  sold: number;
  order: number;
  createdAt: string;
  updatedAt: string;
  __v: 0;
};

export type Option = {
  _id?: string;
  name: string;
  price: number;
  available: boolean;
  isDefault: boolean;
  groupId: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

export type GroupsQueryResponse = Response<Array<GroupOfOptions>>;
export type OptionsQueryResponse = Response<Array<Option>>;

export const initialGroupOfOptions: GroupOfOptions = {
  min: 0,
  deleted: false,
  _id: "655b18a5f1827b633973a295",
  name: "اول جروب",
  slug: "اول-جروب",
  available: true,
  stock: null,
  sold: 0,
  order: 1,
  createdAt: "2023-11-20T08:28:21.324Z",
  updatedAt: "2023-11-20T08:28:21.324Z",
  __v: 0,
};
