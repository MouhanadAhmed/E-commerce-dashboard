import axios, { AxiosResponse } from "axios";
import { ID, Response, initialQueryRequest } from "../../../../../../../../_metronic/helpers";
import { CategoriesQueryResponse, Categories } from "./_models";


// const {state} = useQueryRequest()
const API_URL = import.meta.env.VITE_APP_THEME_API_URL;
const CATEGORY_URL = `${API_URL}/category`;
const GET_CATEGORIES_URL = `${API_URL}/category?deleted=false`;
const GET_ARCHIVED_CATEGORIES_URL = `${API_URL}/category?deleted=true`;
let baseUrl ="";
if (initialQueryRequest.state && typeof initialQueryRequest.state === 'object') {
  const queryString = Object.entries(initialQueryRequest.state)
  .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
  .join('&');
  baseUrl=GET_CATEGORIES_URL+'&'+queryString
}
const getCategories = (): Promise<CategoriesQueryResponse> => {
  // console.log(initialQueryRequest.state)
  return axios
    .get(`${baseUrl?baseUrl:GET_CATEGORIES_URL}`)
    .then(((response) => {
      console.log("_requests => categories",response.data.data)
      return response.data}));
};
const getArchivedCategories = (): Promise<CategoriesQueryResponse> => {
  // console.log(initialQueryRequest.state)
  return axios
    .get(`${baseUrl?baseUrl:GET_ARCHIVED_CATEGORIES_URL}`)
    .then(((response) => {
      console.log("_requests => categories",response.data.data)
      return response.data}));
};

const getCategoryById = (id: ID): Promise<Categories | undefined> => {
  return axios
    .get(`${CATEGORY_URL}/${id}`)
    .then((response: AxiosResponse<Response<Categories>>) => response.data)
    .then((response: Response<Categories>) => response.data);
};

const createCategory = (Category: Categories): Promise<Categories | undefined> => {
  return axios
    .post(CATEGORY_URL, Category)
    .then((response: AxiosResponse<Response<Categories>>) => response.data)
    .then((response: Response<Categories>) => response.data);
};

const updateCategory = (CategoryId: ID,Category: object): Promise<Categories | undefined> => {
  return axios
    .put(`${CATEGORY_URL}/${CategoryId}`, Category)
    .then((response: AxiosResponse<Response<Categories>>) => response.data)
    .then((response: Response<Categories>) => response.data);
};

const updateCategoryOrder = (CategoryId: ID,Order: number): Promise<Categories | undefined> => {
  return axios
    .patch(`${CATEGORY_URL}/${CategoryId}`, {order:Order})
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
  getArchivedCategories,
  deleteCategory,
  deleteSelectedCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  updateCategoryOrder
};
