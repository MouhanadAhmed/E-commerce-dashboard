import { Response } from "../../../../../../../../_metronic/helpers";

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
      branch: string;
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
      category?: string;
      available: boolean;
      order: number;
    },
  ];
  subCategory?: [
    {
      subCategory?: string;
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
  branch: [
    {
      branch: "6559c51ad057da4061a73efc",
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
  category: [
    {
      category: "6560a826d746be4e85f35055",
      available: true,
      order: 1,
    },
  ],
};
