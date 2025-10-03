import { Response } from "../../../../../../../../_metronic/helpers";
import { Branch } from "../../../Branch/branches-list/core/_models";
import { Categories } from "../../../Category/categories-list/core/_models";
import { SubCategories } from "../../../SubCategory/Subcategories-list/core/_models";

export type ChildSubCategories = {
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
  parentAvailable?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deleted?: boolean;
  __v?: number;
  category?: [
    {
      category?: Categories;
      available: boolean;
      order: number;
    },
  ];
  subCategory?: [
    {
      subCategory?: SubCategories;
      available: boolean;
      order: number;
    },
  ];
};

export type ChildSubCategoriesQueryResponse = Response<
  Array<ChildSubCategories>
>;

export const initialCategory: ChildSubCategories = {
  _id: "66464d997a132b21c121e911",
  name: "اول قسم",
  slug: "اول-قسم",
  description: "وصف اول قسم",
  order: 1,
  available: true,
  deleted: false,
  createdAt: "2024-05-16T18:16:57.462Z",
  updatedAt: "2024-05-16T18:16:57.462Z",
  __v: 0,
};
