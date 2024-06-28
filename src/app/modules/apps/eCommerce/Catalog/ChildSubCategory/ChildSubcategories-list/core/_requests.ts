import axios, { AxiosResponse } from "axios";
import { ID, Response, initialQueryRequest,  } from "../../../../../../../../_metronic/helpers";
import { ChildSubCategoriesQueryResponse, ChildSubCategories } from "./_models";


// const {state} = useQueryRequest()
const API_URL = import.meta.env.VITE_APP_THEME_API_URL;
const CHILD_SUB_CATEGORY_URL = `${API_URL}/childSubCategory`;
const GET_CHILD_SUB_CATEGORIES_URL = `${API_URL}/childSubCategory?deleted=false`;
const GET_CHILD_ARCHIVED_SUB_CATEGORIES_URL = `${API_URL}/childSubCategory?deleted=true`;
let baseUrl ="";
console.log("initialQueryRequest.state",initialQueryRequest.state)
if (initialQueryRequest.state && typeof initialQueryRequest.state === 'object') {
  const queryString = Object.entries(initialQueryRequest.state)
  .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
  .join('&');
  baseUrl=GET_CHILD_SUB_CATEGORIES_URL+'&'+queryString
}
const getChildSubCategories = (query?:string): Promise<ChildSubCategoriesQueryResponse> => {
  // console.log(query);
  baseUrl=GET_CHILD_SUB_CATEGORIES_URL+'&'+query
  return axios
    .get(`${query != undefined?baseUrl:GET_CHILD_SUB_CATEGORIES_URL}`)
    .then(((response) => {
      // console.log("_requests => categories",response.data.data)
      return response.data}));
};
const getArchivedChildSubCategories = (query?:string): Promise<ChildSubCategoriesQueryResponse> => {
  // console.log(initialQueryRequest.state)
  baseUrl=GET_CHILD_ARCHIVED_SUB_CATEGORIES_URL+'&'+query
  return axios
    .get(`${query != undefined?baseUrl:GET_CHILD_ARCHIVED_SUB_CATEGORIES_URL}`)
    .then(((response) => {
      console.log("_requests => subCategory",response.data.data)
      return response.data}));
};

const getChildSubCategoryById = (id: ID): Promise<ChildSubCategories | undefined> => {
  return axios
    .get(`${CHILD_SUB_CATEGORY_URL}/${id}`)
    .then((response: AxiosResponse<Response<ChildSubCategories>>) => response.data)
    .then((response: Response<ChildSubCategories>) => response.data);
};

const createChildSubCategory = (Category: ChildSubCategories): Promise<ChildSubCategories | undefined> => {
  return axios
    .post(CHILD_SUB_CATEGORY_URL, Category)
    .then((response: AxiosResponse<Response<ChildSubCategories>>) => response.data)
    .then((response: Response<ChildSubCategories>) => response.data);
};

const updateChildSubCategory = (CategoryId: string| undefined,Category: object): Promise<ChildSubCategories | undefined> => {
  return axios
    .put(`${CHILD_SUB_CATEGORY_URL}/${CategoryId}`, Category)
    .then((response: AxiosResponse<Response<ChildSubCategories>>) => response.data)
    .then((response: Response<ChildSubCategories>) => response.data);
};

const updateChildSubCategoryOrder = (CategoryId: ID,Order: number): Promise<ChildSubCategories | undefined> => {
  return axios
    .patch(`${CHILD_SUB_CATEGORY_URL}/${CategoryId}`, {order:Order})
    .then((response: AxiosResponse<Response<ChildSubCategories>>) => response.data)
    .then((response: Response<ChildSubCategories>) => response.data);
};

const deleteChildSubCategory = (userId: ID): Promise<void> => {
  return axios.delete(`${CHILD_SUB_CATEGORY_URL}/${userId}`).then(() => {});
};

const deleteSelectedChildSubCategories = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => axios.delete(`${CHILD_SUB_CATEGORY_URL}/${id}`));
  return axios.all(requests).then(() => {});
};

const getAllProductsInChildSubCategory = (categoryId: string): Promise<[]> =>{
  return axios
  .get(`${API_URL}/product/childSubCategory/${categoryId}?fields=name,childSubCategory`)
  .then(((response) => {
    // console.log("_requests => categories",response.data.data)
    return response.data}));
}

const updateProductOrderInChildSubCategory = (categoryId: string,productId: string,order:number): Promise<[]> =>{
  return axios
  .put(`${API_URL}/product/childSubCategory/${productId}`,{order:order,ChildSubCategory:categoryId})
}


export {
  updateProductOrderInChildSubCategory,
  getAllProductsInChildSubCategory,
  getChildSubCategories,
  getArchivedChildSubCategories,
  deleteChildSubCategory,
  deleteSelectedChildSubCategories,
  getChildSubCategoryById,
  createChildSubCategory,
  updateChildSubCategory,
  updateChildSubCategoryOrder
};
