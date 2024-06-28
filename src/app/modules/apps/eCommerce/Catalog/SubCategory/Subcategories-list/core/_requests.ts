import axios, { AxiosResponse } from "axios";
import { ID, Response, initialQueryRequest,  } from "../../../../../../../../_metronic/helpers";
import { SubCategoriesQueryResponse, SubCategories } from "./_models";


// const {state} = useQueryRequest()
const API_URL = import.meta.env.VITE_APP_THEME_API_URL;
const SUB_CATEGORY_URL = `${API_URL}/subCategory`;
const GET_SUB_CATEGORIES_URL = `${API_URL}/subCategory?deleted=false`;
const GET_ARCHIVED_SUB_CATEGORIES_URL = `${API_URL}/subCategory?deleted=true`;
let baseUrl ="";
console.log("initialQueryRequest.state",initialQueryRequest.state)
if (initialQueryRequest.state && typeof initialQueryRequest.state === 'object') {
  const queryString = Object.entries(initialQueryRequest.state)
  .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
  .join('&');
  baseUrl=GET_SUB_CATEGORIES_URL+'&'+queryString
}
const getSubCategories = (query?:string): Promise<SubCategoriesQueryResponse> => {
  // console.log(query);
  baseUrl=GET_SUB_CATEGORIES_URL+'&'+query
  return axios
    .get(`${query != undefined?baseUrl:GET_SUB_CATEGORIES_URL}`)
    .then(((response) => {
      // console.log("_requests => categories",response.data.data)
      return response.data}));
};
const getArchivedSubCategories = (query?:string): Promise<SubCategoriesQueryResponse> => {
  // console.log(initialQueryRequest.state)
  baseUrl=GET_ARCHIVED_SUB_CATEGORIES_URL+'&'+query

  return axios
    .get(`${query != undefined?baseUrl:GET_ARCHIVED_SUB_CATEGORIES_URL}`)
    .then(((response) => {
      console.log("_requests => subCategory",response.data.data)
      return response.data}));
};

const getSubCategoryById = (id: ID): Promise<SubCategories | undefined> => {
  return axios
    .get(`${SUB_CATEGORY_URL}/${id}`)
    .then((response: AxiosResponse<Response<SubCategories>>) => response.data)
    .then((response: Response<SubCategories>) => response.data);
};

const createSubCategory = (Category: SubCategories): Promise<SubCategories | undefined> => {
  return axios
    .post(SUB_CATEGORY_URL, Category)
    .then((response: AxiosResponse<Response<SubCategories>>) => response.data)
    .then((response: Response<SubCategories>) => response.data);
};

const updateSubCategory = (CategoryId: string| undefined,Category: object): Promise<SubCategories | undefined> => {
  return axios
    .put(`${SUB_CATEGORY_URL}/${CategoryId}`, Category)
    .then((response: AxiosResponse<Response<SubCategories>>) => response.data)
    .then((response: Response<SubCategories>) => response.data);
};

const updateSubCategoryOrder = (CategoryId: ID,Order: number): Promise<SubCategories | undefined> => {
  return axios
    .patch(`${SUB_CATEGORY_URL}/${CategoryId}`, {order:Order})
    .then((response: AxiosResponse<Response<SubCategories>>) => response.data)
    .then((response: Response<SubCategories>) => response.data);
};

const deleteSubCategory = (userId: ID): Promise<void> => {
  return axios.delete(`${SUB_CATEGORY_URL}/${userId}`).then(() => {});
};

const deleteSelectedSubCategories = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => axios.delete(`${SUB_CATEGORY_URL}/${id}`));
  return axios.all(requests).then(() => {});
};

const getAllProductsInSubCategory = (categoryId: string): Promise<[]> =>{
  return axios
  .get(`${API_URL}/product/subCategory/${categoryId}?fields=name,subCategory`)
  .then(((response) => {
    // console.log("_requests => categories",response.data.data)
    return response.data}));
}

const updateProductOrderInSubCategory = (categoryId: string,productId: string,order:number): Promise<[]> =>{
  return axios
  .put(`${API_URL}/product/subCategory/${productId}`,{order:order,SubCategory:categoryId})
}

const getAllChildsInSubCategory = (categoryId: string): Promise<[]> =>{
  return axios
  .get(`${API_URL}/childSubCategory/subCategory/${categoryId}?fields=name,subCategory`)
  .then(((response) => {
    // console.log("_requests => categories",response.data.data)
    return response.data}));
}
const updateChildSubOrderInSubCategory = (categoryId: string,productId: string,order:number): Promise<[]> =>{
  return axios
  .put(`${API_URL}/childSubCategory/subCategory/${productId}`,{order:order,subCategory:categoryId})
}

export {
  updateChildSubOrderInSubCategory,
  getAllChildsInSubCategory,
  updateProductOrderInSubCategory,
  getAllProductsInSubCategory,
  getSubCategories,
  getArchivedSubCategories,
  deleteSubCategory,
  deleteSelectedSubCategories,
  getSubCategoryById,
  createSubCategory,
  updateSubCategory,
  updateSubCategoryOrder
};
