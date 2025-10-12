import axios from "axios";

const API_URL = import.meta.env.VITE_APP_THEME_API_URL;
const ORDER_URL = `${API_URL}/order`;

export const getOrders = async (query = "") => {
  const url = `${ORDER_URL}${query ? `?${query}` : ""}`;
  const { data } = await axios.get(url);

  const payload = data?.payload ?? data;
  const pagination = payload?.pagination ?? {};

  const total =
    pagination?.totalItems ??
    pagination?.total ??
    data?.totalItems ??
    data?.total ??
    payload?.totalItems ??
    payload?.total ??
    null;

  const currentPage =
    pagination?.currentPage ??
    pagination?.page ??
    data?.currentPage ??
    data?.page ??
    1;
  const pageSize =
    pagination?.limit ??
    pagination?.items_per_page ??
    data?.limit ??
    data?.pageSize ??
    10;
  const totalPages =
    pagination?.totalPages ??
    pagination?.total_pages ??
    data?.totalPages ??
    data?.total_pages ??
    null;

  return {
    data: payload?.data ?? data?.data ?? [],
    total: total ?? undefined,
    page: currentPage,
    pageSize,
    totalPages,
    raw: data,
  };
};
