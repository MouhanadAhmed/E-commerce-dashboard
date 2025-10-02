import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../../_metronic/helpers";
import { Role, RolesQueryResponse } from "./_models";

const API_URL = import.meta.env.VITE_APP_THEME_API_URL;
const ROLES_URL = `${API_URL}/role`;
const GET_ROLES_URL = `${API_URL}/role`;
let baseUrl = "";
const getRoles = async (query?: string): Promise<RolesQueryResponse> => {
  console.log("query", query, query?.length);
  baseUrl = GET_ROLES_URL + "?" + query;
  const d = await axios.get(`${query != undefined ? baseUrl : GET_ROLES_URL}`);
  return d.data;
};

const getRoleById = (id: ID): Promise<Role | undefined> => {
  return axios
    .get(`${ROLES_URL}/${id}`)
    .then((response: AxiosResponse<Response<Role>>) => response.data)
    .then((response: Response<Role>) => response.Role);
};

const createRole = (Role: Role): Promise<Role | undefined> => {
  return axios
    .post(ROLES_URL, Role)
    .then((response: AxiosResponse<Response<Role>>) => response.data)
    .then((response: Response<Role>) => response.data);
};

const updateRole = (Role: Role): Promise<Role | undefined> => {
  return axios
    .put(`${ROLES_URL}/${Role._id}`, { name: Role.name })
    .then((response: AxiosResponse<Response<Role>>) => response.data)
    .then((response: Response<Role>) => response.data);
};

const deleteRole = (userId: ID): Promise<void> => {
  return axios.delete(`${ROLES_URL}/${userId}`).then(() => {});
};

const deleteSelectedRoles = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => axios.delete(`${ROLES_URL}/${id}`));
  return axios.all(requests).then(() => {});
};

export {
  getRoles,
  deleteRole,
  deleteSelectedRoles,
  getRoleById,
  createRole,
  updateRole,
};
