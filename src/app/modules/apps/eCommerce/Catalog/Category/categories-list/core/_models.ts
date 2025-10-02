import { Response } from "../../../../../../../../_metronic/helpers";
import { Branch } from "../../../Branch/branches-list/core/_models";

export type Categories = {
  imgCover?: string;
  _id?: string;
  name?: string;
  slug?: string;
  description?: string;
  order?: number;
  branch?: [
    {
      _id?: string;
      branch: Branch;
      available: boolean;
      order: number;
    },
  ];
  available?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deleted?: boolean;
  __v?: number;
};

export type Products = {
  name?: string;
  _id?: string;
  category?: [
    {
      order?: number;
      id?: string | null;
    },
  ];
  id?: string | null;
};

export type CategoriesQueryResponse = Response<Array<Categories>>;

export const initialCategory: Categories = {
  _id: "66464d997a132b21c121e911",
  name: "اول قسم",
  slug: "اول-قسم",
  description: "وصف اول قسم",
  order: 1,
  branch: [
    {
      branch: {
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
      },
      available: true,
      order: 1,
      _id: "66464d997a132b21c121e912",
    },
  ],
  available: true,
  deleted: false,
  createdAt: "2024-05-16T18:16:57.462Z",
  updatedAt: "2024-05-16T18:16:57.462Z",
  __v: 0,
};
