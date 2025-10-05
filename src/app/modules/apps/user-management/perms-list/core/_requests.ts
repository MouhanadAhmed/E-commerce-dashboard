import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../../_metronic/helpers";
import { Permission, PermissionsQueryResponse } from "./_models";

const API_URL = import.meta.env.VITE_APP_THEME_API_URL;
const USER_URL = `${API_URL}/permission`;
const GET_USERS_URL = `${API_URL}/permission`;
let baseUrl = "";
const getPermissions = async (
  query?: string,
): Promise<PermissionsQueryResponse> => {
  baseUrl = GET_USERS_URL + "?" + query;
  const d = await axios.get(`${query != undefined ? baseUrl : GET_USERS_URL}`);
  return d.data;
};

const getPermissionById = (id: ID): Promise<Permission | undefined> => {
  return axios
    .get(`${USER_URL}/${id}`)
    .then((response: AxiosResponse<Response<Permission>>) => response.data)
    .then((response: Response<Permission>) => response.Permission);
};

const createPermission = (
  Permission: Permission,
): Promise<Permission | undefined> => {
  return axios
    .post(USER_URL, { name: Permission.name })
    .then((response: AxiosResponse<Response<Permission>>) => response.data)
    .then((response: Response<Permission>) => response.data);
};

const updatePermission = (
  Permission: Permission,
): Promise<Permission | undefined> => {
  return axios
    .put(`${USER_URL}/${Permission._id}`, { name: Permission.name })
    .then((response: AxiosResponse<Response<Permission>>) => response.data)
    .then((response: Response<Permission>) => response.data);
};

const deletePermission = (userId: ID): Promise<void> => {
  return axios.delete(`${USER_URL}/${userId}`).then(() => {});
};

const deleteSelectedPermissions = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => axios.delete(`${USER_URL}/${id}`));
  return axios.all(requests).then(() => {});
};

export {
  getPermissions,
  deletePermission,
  deleteSelectedPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
};
