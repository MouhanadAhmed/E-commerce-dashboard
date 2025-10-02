import axios, { AxiosResponse } from "axios";
import {
  ID,
  Response,
  initialQueryRequest,
} from "../../../../../../../../_metronic/helpers";
import { ProductsQueryResponse, Product } from "./_models";

// const {state} = useQueryRequest()
const API_URL = import.meta.env.VITE_APP_THEME_API_URL;
const PRODUCT_URL = `${API_URL}/product`;
const GET_PRODUCTS_URL = `${API_URL}/product?deleted=false`;
const GET_ARCHIVED_PRODUCTS_URL = `${API_URL}/product?deleted=true`;
let baseUrl = "";
// console.log("initialQueryRequest.state",initialQueryRequest.state)
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
  baseUrl = GET_PRODUCTS_URL + "&" + queryString;
}
const getProducts = (query?: string): Promise<ProductsQueryResponse> => {
  baseUrl = GET_PRODUCTS_URL + "&" + query;
  return axios
    .get(`${query != undefined ? baseUrl : GET_PRODUCTS_URL}`)
    .then((response) => {
      // Return both data and pagination info
      return {
        data: response.data.data, // The actual products array
        total: response.data.totalItems, // Total records
        page: response.data.currentPage, // Current page
        pageSize: response.data.limit, // Page size
        totalPages: response.data.totalPages, // Total pages
      };
    });
};

const getArchivedProducts = (
  query?: string,
): Promise<ProductsQueryResponse> => {
  baseUrl = GET_ARCHIVED_PRODUCTS_URL + "&" + query;
  return axios
    .get(`${query != undefined ? baseUrl : GET_ARCHIVED_PRODUCTS_URL}`)
    .then((response) => {
      return {
        data: response.data.data, // The actual products array
        total: response.data.totalItems, // Total records
        page: response.data.currentPage, // Current page
        pageSize: response.data.limit, // Page size
        totalPages: response.data.totalPages, // Total pages
      };
    });
};

const getProductById = async (id: ID) => {
  const response = await axios.get(`${PRODUCT_URL}/${id}`);
  const response_1 = response.data;
  console.log("res", response);
  return response_1.Product;
};

const createProduct = (Category: Product): Promise<Product | undefined> => {
  return axios
    .post(PRODUCT_URL, Category)
    .then((response: AxiosResponse<Response<Product>>) => response.data)
    .then((response: Response<Product>) => response.data);
};

const updateProduct = (
  CategoryId: string | undefined,
  Category: object,
): Promise<Product | undefined> => {
  return axios
    .put(`${PRODUCT_URL}/${CategoryId}`, Category)
    .then((response: AxiosResponse<Response<Product>>) => response.data)
    .then((response: Response<Product>) => response.data);
};

const updateProductOrder = (
  CategoryId: ID,
  Order: number,
): Promise<Product | undefined> => {
  return axios
    .patch(`${PRODUCT_URL}/${CategoryId}`, { order: Order })
    .then((response: AxiosResponse<Response<Product>>) => response.data)
    .then((response: Response<Product>) => response.data);
};

const deleteProduct = (userId: ID): Promise<void> => {
  return axios.delete(`${PRODUCT_URL}/${userId}`).then(() => {});
};

const deleteSelectedProducts = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => axios.delete(`${PRODUCT_URL}/${id}`));
  return axios.all(requests).then(() => {});
};
const updateSelectedProducts = (
  userIds: Array<ID>,
  Category: object,
): Promise<void> => {
  const requests = userIds.map((id) =>
    axios.put(`${PRODUCT_URL}/${id}`, Category),
  );
  return axios.all(requests).then(() => {});
};

const getAllProductsInCategory = (categoryId: string): Promise<[]> => {
  return axios
    .get(`${API_URL}/product/category/${categoryId}?fields=name,category`)
    .then((response) => {
      // console.log("_requests => Product",response.data.data)
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
      // console.log("_requests => Product",response.data.data)
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

const duplicateProduct = (productId: string, number: number): Promise<[]> => {
  return axios.post(`${API_URL}/product/duplicate`, {
    id: productId,
    number: number,
  });
};
export {
  duplicateProduct,
  updateSubCategoryOrderInCategory,
  getAllSubCategoriesInCategory,
  updateProductOrderInCategory,
  getAllProductsInCategory,
  getProducts,
  getArchivedProducts,
  deleteProduct,
  deleteSelectedProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductOrder,
  updateSelectedProducts,
};
