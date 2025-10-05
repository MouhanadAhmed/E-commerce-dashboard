import axios, { AxiosResponse } from "axios";
import {
  ID,
  Response,
  initialQueryRequest,
} from "../../../../../../../../_metronic/helpers";
import { CategoriesQueryResponse, Categories } from "./_models";

const API_URL = import.meta.env.VITE_APP_THEME_API_URL;
const CATEGORY_URL = `${API_URL}/category`;
const GET_CATEGORIES_URL = `${API_URL}/category?deleted=false`;
const GET_ARCHIVED_CATEGORIES_URL = `${API_URL}/category?deleted=true`;
let baseUrl = "";
if (
  initialQueryRequest.state &&
  typeof initialQueryRequest.state === "object"
) {
  const queryString = Object.entries(initialQueryRequest.state)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`,
    )
    .join("&");
  baseUrl = GET_CATEGORIES_URL + "&" + queryString;
}
const getCategories = (query?: string): Promise<CategoriesQueryResponse> => {
  baseUrl = GET_CATEGORIES_URL + "&" + query;
  return axios
    .get(`${query != undefined ? baseUrl : GET_CATEGORIES_URL}`)
    .then((response) => {
      return response.data;
    });
};
const getArchivedCategories = (
  query?: string,
): Promise<CategoriesQueryResponse> => {
  baseUrl = GET_ARCHIVED_CATEGORIES_URL + "&" + query;
  return axios
    .get(`${query != undefined ? baseUrl : GET_ARCHIVED_CATEGORIES_URL}`)
    .then((response) => {
      return response.data;
    });
};

const getCategoryById = (id: ID): Promise<Categories | undefined> => {
  return axios
    .get(`${CATEGORY_URL}/${id}`)
    .then((response: AxiosResponse<Response<Categories>>) => response.data)
    .then((response: Response<Categories>) => response.data);
};

const createCategory = (
  Category: Categories,
): Promise<Categories | undefined> => {
  return axios
    .post(CATEGORY_URL, Category)
    .then((response: AxiosResponse<Response<Categories>>) => response.data)
    .then((response: Response<Categories>) => response.data);
};

const updateCategory = (
  CategoryId: string | undefined,
  Category: object,
): Promise<Categories | undefined> => {
  return axios
    .put(`${CATEGORY_URL}/${CategoryId}`, Category)
    .then((response: AxiosResponse<Response<Categories>>) => response.data)
    .then((response: Response<Categories>) => response.data);
};

const updateCategoryOrder = (
  CategoryId: ID,
  Order: number,
): Promise<Categories | undefined> => {
  return axios
    .patch(`${CATEGORY_URL}/${CategoryId}`, { order: Order })
    .then((response: AxiosResponse<Response<Categories>>) => response.data)
    .then((response: Response<Categories>) => response.data);
};

const deleteCategory = (userId: ID): Promise<void> => {
  return axios.delete(`${CATEGORY_URL}/${userId}`).then(() => {});
};

const restoreCategory = (userId: ID): Promise<void> => {
  return axios
    .put(`${CATEGORY_URL}/${userId}`, { deleted: false })
    .then(() => {});
};

const deleteSelectedCategories = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => axios.delete(`${CATEGORY_URL}/${id}`));
  return axios.all(requests).then(() => {});
};
const updateSelectedCategories = (
  userIds: Array<ID>,
  Category: object,
): Promise<void> => {
  const requests = userIds.map((id) =>
    axios.put(`${CATEGORY_URL}/${id}`, Category),
  );
  return axios.all(requests).then(() => {});
};

const getAllProductsInCategory = (categoryId: string): Promise<[]> => {
  return axios
    .get(`${API_URL}/product/category/${categoryId}?fields=name,category`)
    .then((response) => {
      return response.data;
    });
};

const updateProductOrderInCategory = (
  categoryId: string,
  productId: string,
  order: number,
): Promise<[]> => {
  return axios.put(`${API_URL}/product/category/${productId}`, {
    order: order,
    Category: categoryId,
  });
};

const getAllSubCategoriesInCategory = (categoryId: string): Promise<[]> => {
  return axios
    .get(`${API_URL}/subCategory/category/${categoryId}?fields=name,category`)
    .then((response) => {
      return response.data;
    });
};

const updateSubCategoryOrderInCategory = (
  categoryId: string,
  productId: string,
  order: number,
): Promise<[]> => {
  return axios.put(`${API_URL}/subCategory/category/${productId}`, {
    order: order,
    category: categoryId,
  });
};

export {
  updateSubCategoryOrderInCategory,
  getAllSubCategoriesInCategory,
  updateProductOrderInCategory,
  getAllProductsInCategory,
  getCategories,
  getArchivedCategories,
  deleteCategory,
  deleteSelectedCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  updateCategoryOrder,
  updateSelectedCategories,
  restoreCategory,
};
