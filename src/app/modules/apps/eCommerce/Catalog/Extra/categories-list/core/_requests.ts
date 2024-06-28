import axios, { AxiosResponse } from "axios";
import { ID, Response, initialQueryRequest,  } from "../../../../../../../../_metronic/helpers";
import { ExtrasQueryResponse, Extras } from "./_models";


// const {state} = useQueryRequest()
const API_URL = import.meta.env.VITE_APP_THEME_API_URL;
const EXTRAS_URL = `${API_URL}/productExtra`;
const GET_EXTRAS_URL = `${API_URL}/productExtra?deleted=false`;
const GET_ARCHIVED_EXTRAS_URL = `${API_URL}/productExtra?deleted=true`;
let baseUrl ="";
// console.log("initialQueryRequest.state",initialQueryRequest.state)
if (initialQueryRequest.state && typeof initialQueryRequest.state === 'object') {
  const queryString = Object.entries(initialQueryRequest.state)
  .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
  .join('&');
  baseUrl=GET_EXTRAS_URL+'&'+queryString
}
const getExtras = (query?:string): Promise<ExtrasQueryResponse> => {
  console.log(query);
  baseUrl=GET_EXTRAS_URL+'&'+query
  return axios
    .get(`${query !== undefined?baseUrl:GET_EXTRAS_URL}`)
    .then(((response) => {
      // console.log("_requests => Extras",response.data.data)
      return response.data}));
};
const getArchivedExtras = (query?:string): Promise<ExtrasQueryResponse> => {
  // console.log(initialQueryRequest.state)
  baseUrl=GET_ARCHIVED_EXTRAS_URL+'&'+query

  return axios
    .get(`${query !== undefined?baseUrl:GET_ARCHIVED_EXTRAS_URL}`)
    .then(((response) => {
      // console.log("_requests => Extras",response.data.data)
      return response.data}));
};

const getExtraById = (id: ID): Promise<Extras | undefined> => {
  return axios
    .get(`${EXTRAS_URL}/${id}`)
    .then((response: AxiosResponse<Response<Extras>>) => response.data)
    .then((response: Response<Extras>) => response.data);
};

const createExtra = (Category: Extras): Promise<Extras | undefined> => {
  return axios
    .post(EXTRAS_URL, Category)
    .then((response: AxiosResponse<Response<Extras>>) => response.data)
    .then((response: Response<Extras>) => response.data);
};

const updateExtra = (CategoryId: string| undefined,Category: object): Promise<Extras | undefined> => {
  return axios
    .put(`${EXTRAS_URL}/${CategoryId}`, Category)
    .then((response: AxiosResponse<Response<Extras>>) => response.data)
    .then((response: Response<Extras>) => response.data);
};

const updateExtraOrder = (CategoryId: ID,Order: number): Promise<Extras | undefined> => {
  return axios
    .patch(`${EXTRAS_URL}/${CategoryId}`, {order:Order})
    .then((response: AxiosResponse<Response<Extras>>) => response.data)
    .then((response: Response<Extras>) => response.data);
};

const deleteExtra = (userId: ID): Promise<void> => {
  return axios.delete(`${EXTRAS_URL}/${userId}`).then(() => {});
};

const deleteSelectedExtras = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => axios.delete(`${EXTRAS_URL}/${id}`));
  return axios.all(requests).then(() => {});
};

const updateSelectedExtras = (userIds: Array<ID>,Category: object): Promise<void> => {
  const requests = userIds.map((id) => axios.put(`${EXTRAS_URL}/${id}`, Category));
  return axios.all(requests).then(() => {});
};

export {
  updateSelectedExtras,
  getExtras,
  getArchivedExtras,
  deleteExtra,
  deleteSelectedExtras,
  getExtraById,
  createExtra,
  updateExtra,
  updateExtraOrder
};
