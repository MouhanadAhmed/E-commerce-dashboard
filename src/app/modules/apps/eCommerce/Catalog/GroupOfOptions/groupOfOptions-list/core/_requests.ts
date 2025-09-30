import { ID } from './../../../../../../../../_metronic/helpers/crud-helper/models';
import axios, { AxiosResponse } from "axios";
import {  Response, initialQueryRequest,  } from "../../../../../../../../_metronic/helpers";
import { GroupsQueryResponse, GroupOfOptions } from "./_models";


// const {state} = useQueryRequest()
const API_URL = import.meta.env.VITE_APP_THEME_API_URL;
const GROUP_URL = `${API_URL}/groupOfOptions`;
const GET_GROUPS_URL = `${API_URL}/groupOfOptions?deleted=false`;
const GET_ARCHIVED_GROUPS_URL = `${API_URL}/groupOfOptions?deleted=true`;
let baseUrl ="";
// console.log("initialQueryRequest.state",initialQueryRequest.state)
if (initialQueryRequest.state && typeof initialQueryRequest.state === 'object') {
  const queryString = Object.entries(initialQueryRequest.state)
  .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
  .join('&');
  baseUrl=GET_GROUPS_URL+'&'+queryString
}
const getGroups = (query?:string): Promise<GroupsQueryResponse> => {
  // console.log(query);
  // if(query != undefined)
  baseUrl=GET_GROUPS_URL+'&'+query
  return axios
    .get(`${query != undefined?baseUrl:GET_GROUPS_URL}`)
    .then(((response) => {
      // console.log("_requests => categories",response.data.data)
      return response.data}));
};
const getArchivedGroups = (query?:string): Promise<GroupsQueryResponse> => {
  // console.log(initialQueryRequest.state)
  // console.log(query);
  baseUrl=GET_ARCHIVED_GROUPS_URL+'&'+query
  return axios
    .get(`${query != undefined?baseUrl:GET_ARCHIVED_GROUPS_URL}`)
    .then(((response) => {
      // console.log("_requests => Groups",response.data.data)
      return response.data}));
};

const getGroupById = (id: string): Promise<GroupOfOptions | undefined> => {
  return axios
    .get(`${GROUP_URL}/${id}`)
    .then((response: AxiosResponse<Response<GroupOfOptions>>) => response.data)
    .then((response: Response<GroupOfOptions>) => response.data);
};

const createGroup = (Group: GroupOfOptions): Promise<GroupOfOptions | undefined> => {
  return axios
    .post(GROUP_URL, Group)
    .then((response: AxiosResponse<Response<GroupOfOptions>>) => response.data)
    .then((response: Response<GroupOfOptions>) => response.data);
};

const updateGroup = (GroupId: string| undefined,Group: object): Promise<GroupOfOptions | undefined> => {
  return axios
    .put(`${GROUP_URL}/${GroupId}`, Group)
    .then((response: AxiosResponse<Response<GroupOfOptions>>) => response.data)
    .then((response: Response<GroupOfOptions>) => response.data);
};

const updateGroupOrder = (GroupId: string,Order: number): Promise<GroupOfOptions | undefined> => {
  return axios
    .patch(`${GROUP_URL}/${GroupId}`, {order:Order})
    .then((response: AxiosResponse<Response<GroupOfOptions>>) => response.data)
    .then((response: Response<GroupOfOptions>) => response.data);
};

const deleteGroup = (GroupId: string): Promise<void> => {
  return axios.delete(`${GROUP_URL}/${GroupId}`).then(() => {});
};

const deleteSelectedGroups = (GroupIds: Array<ID |string>): Promise<void> => {
  const requests = GroupIds.map((id) => axios.delete(`${GROUP_URL}/${id}`));
  return axios.all(requests).then(() => {});
};

export {
  getGroups,
  getArchivedGroups,
  deleteGroup,
  deleteSelectedGroups,
  getGroupById,
  createGroup,
  updateGroup,
  updateGroupOrder
};
