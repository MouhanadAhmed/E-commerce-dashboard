import axios, { AxiosResponse } from "axios";
import {
  ID,
  Response,
  initialQueryRequest,
} from "../../../../../../../../_metronic/helpers";
import { TypesQueryResponse, Types } from "./_models";

// const {state} = useQueryRequest()
const API_URL = import.meta.env.VITE_APP_THEME_API_URL;
const TYPES_URL = `${API_URL}/type`;
const GET_TYPES_URL = `${API_URL}/type?deleted=false`;
const GET_ARCHIVED_TYPES_URL = `${API_URL}/type?deleted=true`;
let baseUrl = "";
// console.log("initialQueryRequest.state",initialQueryRequest.state)
if (
  initialQueryRequest.state &&
  typeof initialQueryRequest.state === "object"
) {
  const queryString = Object.entries(initialQueryRequest.state)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");
  baseUrl = GET_TYPES_URL + "&" + queryString;
}
const getTypes = (query?: string): Promise<TypesQueryResponse> => {
  // console.log(query);
  baseUrl = GET_TYPES_URL + "&" + query;
  return axios
    .get(`${query != undefined ? baseUrl : GET_TYPES_URL}`)
    .then((response) => {
      // console.log("_requests => Types",response.data.data)
      return response.data;
    });
};
const getArchivedTypes = (query?: string): Promise<TypesQueryResponse> => {
  // console.log(initialQueryRequest.state)
  return axios
    .get(`${query != undefined ? baseUrl : GET_ARCHIVED_TYPES_URL}`)
    .then((response) => {
      // console.log("_requests => archived Types",response.data.data)
      return response.data;
    });
};

const getTypeById = (id: ID): Promise<Types | undefined> => {
  return axios
    .get(`${TYPES_URL}/${id}`)
    .then((response: AxiosResponse<Response<Types>>) => response.data)
    .then((response: Response<Types>) => response.data);
};

const createType = (Category: Types): Promise<Types | undefined> => {
  return axios
    .post(TYPES_URL, Category)
    .then((response: AxiosResponse<Response<Types>>) => response.data)
    .then((response: Response<Types>) => response.data);
};

const updateType = (
  CategoryId: string | undefined,
  Category: object,
): Promise<Types | undefined> => {
  return axios
    .put(`${TYPES_URL}/${CategoryId}`, Category)
    .then((response: AxiosResponse<Response<Types>>) => response.data)
    .then((response: Response<Types>) => response.data);
};

const updateTypeOrder = (
  CategoryId: ID,
  Order: number,
): Promise<Types | undefined> => {
  return axios
    .patch(`${TYPES_URL}/${CategoryId}`, { order: Order })
    .then((response: AxiosResponse<Response<Types>>) => response.data)
    .then((response: Response<Types>) => response.data);
};

const deleteType = (userId: ID): Promise<void> => {
  return axios.delete(`${TYPES_URL}/${userId}`).then(() => {});
};

const deleteSelectedTypes = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => axios.delete(`${TYPES_URL}/${id}`));
  return axios.all(requests).then(() => {});
};

export {
  getTypes,
  getArchivedTypes,
  deleteType,
  deleteSelectedTypes,
  getTypeById,
  createType,
  updateType,
  updateTypeOrder,
};
