import { ID } from "./../../../../../../../../_metronic/helpers/crud-helper/models";
import axios, { AxiosResponse } from "axios";
import {
  Response,
  initialQueryRequest,
} from "../../../../../../../../_metronic/helpers";
import { GroupsQueryResponse, GroupOfOptions, Option } from "./_models";

// const {state} = useQueryRequest()
const API_URL = import.meta.env.VITE_APP_THEME_API_URL;
const GROUP_URL = `${API_URL}/groupOfOptions`;
const GET_GROUPS_URL = `${API_URL}/groupOfOptions?deleted=false`;
const GET_ARCHIVED_GROUPS_URL = `${API_URL}/groupOfOptions?deleted=true`;
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
  baseUrl = GET_GROUPS_URL + "&" + queryString;
}
const getGroups = (query?: string): Promise<GroupsQueryResponse> => {
  baseUrl = GET_GROUPS_URL + "&" + query;
  return axios
    .get(`${query != undefined ? baseUrl : GET_GROUPS_URL}`)
    .then((response) => {
      return response.data;
    });
};
const getArchivedGroups = (query?: string): Promise<GroupsQueryResponse> => {
  baseUrl = GET_ARCHIVED_GROUPS_URL + "&" + query;
  return axios
    .get(`${query != undefined ? baseUrl : GET_ARCHIVED_GROUPS_URL}`)
    .then((response) => {
      return response.data;
    });
};

const getGroupById = (id: string): Promise<GroupOfOptions | undefined> => {
  return axios
    .get(`${GROUP_URL}/${id}`)
    .then((response: AxiosResponse<Response<GroupOfOptions>>) => response.data)
    .then((response: Response<GroupOfOptions>) => response.data);
};

const createGroup = (
  Group: Partial<GroupOfOptions>,
): Promise<GroupOfOptions | undefined> => {
  return axios
    .post(GROUP_URL, Group)
    .then((response: AxiosResponse<any>) => {
      // Handle the specific response structure where group is under 'groupOfOptions' key
      if (response.data.groupOfOptions) {
        return response.data.groupOfOptions;
      } else if (response.data.data) {
        // Fallback to standard structure

        return response.data.data;
      } else {
        console.warn("Unexpected response structure:", response.data);
        return response.data;
      }
    })
    .catch((error) => {
      console.error("Create group error:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
      }
      throw error;
    });
};

const updateGroup = (
  GroupId: string | undefined,
  Group: object,
): Promise<GroupOfOptions | undefined> => {
  return axios
    .put(`${GROUP_URL}/${GroupId}`, Group)
    .then((response: AxiosResponse<any>) => {
      // Handle the specific response structure where group is under 'groupOfOptions' key
      if (response.data.groupOfOptions) {
        return response.data.groupOfOptions;
      } else if (response.data.data) {
        // Fallback to standard structure

        return response.data.data;
      } else {
        console.warn("Unexpected response structure:", response.data);
        return response.data;
      }
    })
    .catch((error) => {
      console.error("Update group error:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
      }
      throw error;
    });
};

const updateGroupOrder = (
  GroupId: string,
  Order: number,
): Promise<GroupOfOptions | undefined> => {
  return axios
    .patch(`${GROUP_URL}/${GroupId}`, { order: Order })
    .then((response: AxiosResponse<Response<GroupOfOptions>>) => response.data)
    .then((response: Response<GroupOfOptions>) => response.data);
};

const deleteGroup = (GroupId: string): Promise<void> => {
  return axios.delete(`${GROUP_URL}/${GroupId}`).then(() => {});
};

const deleteSelectedGroups = (GroupIds: Array<ID | string>): Promise<void> => {
  const requests = GroupIds.map((id) => axios.delete(`${GROUP_URL}/${id}`));
  return axios.all(requests).then(() => {});
};

const getOptions = (): Promise<string[]> => {
  return axios
    .get(`${API_URL}/option`)
    .then((response: AxiosResponse<Response<string[]>>) => response.data)
    .then((response: Response<string[]>) => response.data);
};

const getOptionById = (id: ID): Promise<string | undefined> => {
  return axios
    .get(`${API_URL}/option/${id}`)
    .then((response: AxiosResponse<Response<string>>) => response.data)
    .then((response: Response<string>) => response.data);
};

// Option CRUD operations
const createOption = (
  option: Omit<Option, "_id" | "createdAt" | "updatedAt" | "__v">,
): Promise<Option | undefined> => {
  return axios
    .post(`${API_URL}/option`, option)
    .then((response: AxiosResponse<Response<Option>>) => {
      return response.data;
    })
    .then((response: Response<Option>) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Create option error:", error);

      throw error;
    });
};

const updateOption = (
  optionId: string,
  option: Omit<Option, "_id" | "createdAt" | "updatedAt" | "__v">,
): Promise<Option | undefined> => {
  return axios
    .put(`${API_URL}/option/${optionId}`, option)
    .then((response: AxiosResponse<Response<Option>>) => response.data)
    .then((response: Response<Option>) => response.data);
};

const deleteOption = (optionId: string): Promise<void> => {
  return axios.delete(`${API_URL}/option/${optionId}`).then(() => {});
};

const getOptionsByGroupId = (groupId: string): Promise<Option[]> => {
  return axios
    .get(`${API_URL}/option/${groupId}`)
    .then((response: AxiosResponse<Response<Option[]>>) => response.data)
    .then((response: Response<Option[]>) => response.data);
};

export {
  getGroups,
  getArchivedGroups,
  deleteGroup,
  deleteSelectedGroups,
  getGroupById,
  createGroup,
  updateGroup,
  updateGroupOrder,
  getOptions,
  getOptionById,
  createOption,
  updateOption,
  deleteOption,
  getOptionsByGroupId,
};
