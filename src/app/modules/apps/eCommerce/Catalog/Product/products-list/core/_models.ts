import { Branch } from "../../../Branch/branches-list/core/_models";
import { Categories } from "../../../Category/categories-list/core/_models";
import { ChildSubCategories } from "../../../ChildSubCategory/ChildSubcategories-list/core/_models";
import { Extras } from "../../../Extra/extra-list/core/_models";
import { GroupOfOptions } from "../../../GroupOfOptions/groupOfOptions-list/core/_models";
import { SubCategories } from "../../../SubCategory/Subcategories-list/core/_models";
import { Types } from "../../../Type/types-list/core/_models";

export type Product = {
  imgCover?: { _id?: string; url: string }[];
  _id?: string;
  name?: string;
  slug?: string;
  description?: string;
  shortDesc?: string;
  metaTags?: string[];
  category?: category[];
  subCategory?: subCategory[];
  childSubCategory?: childSubCategory[];
  types?: Types[];
  stock?: string;
  price?: string;
  order?: string;
  branch?: BranchOfProduct[];
  priceAfterDiscount?: string;
  // Per-branch derived arrays from backend (used to prefill form)
  branchStock?: { branch: string; stock?: string }[];
  branchAvailable?: { branch: string; available?: boolean }[];
  branchPrice?: { branch: string; price?: string }[];
  branchPriceAfterDiscount?: { branch: string; priceAfterDiscount?: string }[];
  extras?: {
    _id?: string;
    id?: string;
    extra?: Extras;
    order?: string;
  }[];
  descTableName?: string;
  descTable?: {
    _id?: string;
    id?: string;
    name?: string;
    value?: string;
    order?: string;
  }[];
  images?: string[];
  weight?: string;
  showWeight?: boolean;
  book?: string;
  groupOfOptions?: {
    _id?: string;
    id?: string;
    order?: string;
    optionGroup?: GroupOfOptions;
  }[];
  minQty?: string;
  quantity?: string;
  fractionalQuantity: boolean;
  dimensions?: string;
  rewardPoint?: string;
  sold?: string;
  available?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deleted?: boolean;
  parentAvailable?: boolean;
  __v?: string;
  id?: string;
};

export type Products = {
  name?: string;
  _id?: string;
  category?: [
    {
      order?: string;
      id?: string | null;
    }
  ];
  id?: string | null;
};

type category = {
  category?: Categories;
  order?: string;
  _id?: string;
  id?: string;
};
type subCategory = {
  subCategory?: SubCategories;
  order?: string;
  _id?: string;
  id?: string;
};
type childSubCategory = {
  childSubCategory?: ChildSubCategories;
  order?: string;
  _id?: string;
  id?: string;
};

export type BranchOfProduct = {
  branch: string;
  price?: string;
  available?: boolean;
  stock?: string;
  priceAfterDiscount?: string;
  priceAfterExpiresAt?: string;
  order?: string;
  sold?: string;
  _id?: string;
  name?: string;
};

export type ProductsQueryResponse = {
  data: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export interface ProductFormValues {
  _id?: string;
  name: string;
  slug?: string;
  description?: string;
  shortDesc?: string;
  imgCover?: string; // Different from Product type
  metaTags?: string[];
  price?: string;
  showWeight?: boolean;
  weight?: string;
  dimensions?: string;
  quantity?: string;
  fractionalQuantity: boolean;
  minQty?: string;
  stock?: string;
  sold?: string;
  book?: string;
  extras?: any[]; // Select values before transformation
  types?: any[]; // Select values before transformation
  descTableName?: string;
  available?: boolean;
  deleted?: boolean;
  order?: string;
  category?: any[]; // Select values before transformation
  subCategory?: any[]; // Select values before transformation
  childSubCategory?: any[]; // Select values before transformation
  groupOfOptions?: any[];
  branch?: any[];
  images?: string[];
  descTable?: any[];
}

export const initialProduct: Product = {
  name: "",
  description: "",
  shortDesc: "",

  stock: "null",
  available: true,
  price: "",

  priceAfterDiscount: "",

  descTableName: "",
  fractionalQuantity: false,
  weight: "",
  showWeight: false,
  book: "",

  minQty: "",
  dimensions: "",
  rewardPoint: "",
  sold: "",
  deleted: false,
  parentAvailable: true,
};
