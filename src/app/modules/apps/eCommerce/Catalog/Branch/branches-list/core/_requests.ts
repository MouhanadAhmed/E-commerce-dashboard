import { ID } from "./../../../../../../../../_metronic/helpers/crud-helper/models";
import axios, { AxiosResponse } from "axios";
import {
  Response,
  initialQueryRequest,
} from "../../../../../../../../_metronic/helpers";
import { BranchesQueryResponse, Branch } from "./_models";

// const {state} = useQueryRequest()
const API_URL = import.meta.env.VITE_APP_THEME_API_URL;
const BRANCH_URL = `${API_URL}/branch`;
const GET_BRANCHES_URL = `${API_URL}/branch?deleted=false`;
const GET_ARCHIVED_BRANCHES_URL = `${API_URL}/branch?deleted=true`;
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
  baseUrl = GET_BRANCHES_URL + "&" + queryString;
}
const getBranches = (query?: string): Promise<BranchesQueryResponse> => {
  // console.log(query);
  // if(query != undefined)
  baseUrl = GET_BRANCHES_URL + "&" + query;
  return axios
    .get(`${query != undefined ? baseUrl : GET_BRANCHES_URL}`)
    .then((response) => {
      // console.log("_requests => categories",response.data.data)
      return response.data;
    });
};
const getArchivedBranches = (
  query?: string,
): Promise<BranchesQueryResponse> => {
  // console.log(initialQueryRequest.state)
  // console.log(query);
  baseUrl = GET_ARCHIVED_BRANCHES_URL + "&" + query;
  return axios
    .get(`${query != undefined ? baseUrl : GET_ARCHIVED_BRANCHES_URL}`)
    .then((response) => {
      // console.log("_requests => Branches",response.data.data)
      return response.data;
    });
};

const getBranchById = (id: string): Promise<Branch | undefined> => {
  return axios
    .get(`${BRANCH_URL}/${id}`)
    .then((response: AxiosResponse<Response<Branch>>) => response.data)
    .then((response: Response<Branch>) => response.data);
};

const createBranch = (Branch: Branch): Promise<Branch | undefined> => {
  return axios
    .post(BRANCH_URL, Branch)
    .then((response: AxiosResponse<Response<Branch>>) => response.data)
    .then((response: Response<Branch>) => response.data);
};

const updateBranch = (
  BranchId: string | undefined,
  Branch: object,
): Promise<Branch | undefined> => {
  return axios
    .put(`${BRANCH_URL}/${BranchId}`, Branch)
    .then((response: AxiosResponse<Response<Branch>>) => response.data)
    .then((response: Response<Branch>) => response.data);
};

const updateBranchOrder = (
  BranchId: string,
  Order: number,
): Promise<Branch | undefined> => {
  return axios
    .patch(`${BRANCH_URL}/${BranchId}`, { order: Order })
    .then((response: AxiosResponse<Response<Branch>>) => response.data)
    .then((response: Response<Branch>) => response.data);
};

const deleteBranch = (BranchId: string): Promise<void> => {
  return axios.delete(`${BRANCH_URL}/${BranchId}`).then(() => {});
};

const deleteSelectedBranches = (
  BranchIds: Array<ID | string>,
): Promise<void> => {
  const requests = BranchIds.map((id) => axios.delete(`${BRANCH_URL}/${id}`));
  return axios.all(requests).then(() => {});
};

export {
  getBranches,
  getArchivedBranches,
  deleteBranch,
  deleteSelectedBranches,
  getBranchById,
  createBranch,
  updateBranch,
  updateBranchOrder,
};
