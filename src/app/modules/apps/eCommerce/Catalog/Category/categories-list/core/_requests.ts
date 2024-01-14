import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../../../../_metronic/helpers";
import { CategoriesQueryResponse, Categories } from "./_models";

const API_URL = import.meta.env.VITE_APP_THEME_API_URL;
const CATEGORY_URL = `${API_URL}/category`;
const GET_CATEGORIES_URL = `${API_URL}/category`;

const getCategories = (): Promise<CategoriesQueryResponse> => {
  return axios
    .get(`${GET_CATEGORIES_URL}`)
    .then(((response) => response.Categories));
};

const getCategoryById = (id: ID): Promise<Categories | undefined> => {
  return axios
    .get(`${CATEGORY_URL}/${id}`)
    .then((response: AxiosResponse<Response<Categories>>) => response.data)
    .then((response: Response<Categories>) => response.data);
};

const createCategory = (Category: Categories): Promise<Categories | undefined> => {
  return axios
    .put(CATEGORY_URL, Category)
    .then((response: AxiosResponse<Response<Categories>>) => response.data)
    .then((response: Response<Categories>) => response.data);
};

const updateCategory = (Category: Categories): Promise<Categories | undefined> => {
  return axios
    .post(`${CATEGORY_URL}/${Category._id}`, Category)
    .then((response: AxiosResponse<Response<Categories>>) => response.data)
    .then((response: Response<Categories>) => response.data);
};

const deleteCategory = (userId: ID): Promise<void> => {
  return axios.delete(`${CATEGORY_URL}/${userId}`).then(() => {});
};

const deleteSelectedCategories = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => axios.delete(`${CATEGORY_URL}/${id}`));
  return axios.all(requests).then(() => {});
};

export {
  getCategories,
  deleteCategory,
  deleteSelectedCategories,
  getCategoryById,
  createCategory,
  updateCategory,
};
