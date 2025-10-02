/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext, useState, useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import {
  createResponseContext,
  initialQueryResponse,
  initialQueryState,
  PaginationState,
  QUERIES,
  stringifyRequestQuery,
  WithChildren,
} from "../../../../../../../../_metronic/helpers";
import { useQueryRequest } from "./QueryRequestProvider";
import { getArchivedProducts, getProducts } from "./_requests";
import { Product } from "./_models";

const QueryResponseContext =
  createResponseContext<Product>(initialQueryResponse);
const QueryResponseProvider: FC<WithChildren> = ({ children }) => {
  const { state } = useQueryRequest();

  // Create separate query states for active and archived
  const [activeQuery, setActiveQuery] = useState<string>(
    stringifyRequestQuery({
      ...state,
      // Use active-specific pagination if available, fallback to general
      page: state.activePage || state.page || 1,
      pageSize: state.activePageSize || state.pageSize || 10,
    }),
  );

  const [archivedQuery, setArchivedQuery] = useState<string>(
    stringifyRequestQuery({
      ...state,
      // Use archived-specific pagination if available, fallback to general
      page: state.archivedPage || state.page || 1,
      pageSize: state.archivedPageSize || state.pageSize || 10,
    }),
  );

  // Update memo dependencies to include the specific pagination states
  const updatedActiveQuery = useMemo(
    () =>
      stringifyRequestQuery({
        ...state,
        page: state.activePage || state.page || 1,
        pageSize: state.activePageSize || state.pageSize || 10,
      }),
    [state, state.activePage, state.activePageSize],
  ); // Add specific dependencies

  const updatedArchivedQuery = useMemo(
    () =>
      stringifyRequestQuery({
        ...state,
        page: state.archivedPage || state.page || 1,
        pageSize: state.archivedPageSize || state.pageSize || 10,
      }),
    [state, state.archivedPage, state.archivedPageSize],
  ); // Add specific dependencies

  useEffect(() => {
    if (activeQuery !== updatedActiveQuery) {
      if (activeQuery.match(/search=([^&]*)/)) {
        setActiveQuery(activeQuery.replace(/search=/, "keyword="));
      }
      setActiveQuery(decodeURIComponent(updatedActiveQuery));
    }
  }, [updatedActiveQuery]);

  useEffect(() => {
    if (archivedQuery !== updatedArchivedQuery) {
      if (archivedQuery.match(/search=([^&]*)/)) {
        setArchivedQuery(archivedQuery.replace(/search=/, "keyword="));
      }
      setArchivedQuery(decodeURIComponent(updatedArchivedQuery));
    }
  }, [updatedArchivedQuery]);

  const {
    isFetching: isFetchingCategories,
    refetch: refetchCategories,
    data: responseCategories,
  } = useQuery(
    `${QUERIES.PRODUCTS_LIST}-${activeQuery}`, // Use activeQuery
    () => {
      return getProducts(activeQuery); // Use activeQuery
    },
    { cacheTime: 0, keepPreviousData: true, refetchOnWindowFocus: false },
  );

  const {
    isFetching: isFetchingArchived,
    refetch: refetchArchived,
    data: responseArchived,
  } = useQuery(
    `${QUERIES.ARCHIVED_PRODUCTS_LIST}-${archivedQuery}`, // Use archivedQuery
    () => getArchivedProducts(archivedQuery), // Use archivedQuery
    { cacheTime: 0, keepPreviousData: true, refetchOnWindowFocus: false },
  );

  return (
    <QueryResponseContext.Provider
      value={{
        isLoading: isFetchingCategories || isFetchingArchived,
        refetch: () => {
          refetchCategories();
          refetchArchived();
        },
        response: { active: responseCategories, archived: responseArchived },
        query: activeQuery, // You might want to keep this or remove it
      }}
    >
      {children}
    </QueryResponseContext.Provider>
  );
};

const useQueryResponse = () => useContext(QueryResponseContext);

const useQueryResponseData = () => {
  const { response } = useQueryResponse();
  if (!response) {
    return {
      active: { data: [], total: 0, page: 1, pageSize: 1000, totalPages: 0 },
      archived: { data: [], total: 0, page: 1, pageSize: 1000, totalPages: 0 },
    };
  }

  return {
    active: response?.active || {
      data: [],
      total: 0,
      page: 1,
      pageSize: 1000,
      totalPages: 0,
    },
    archived: response?.archived || {
      data: [],
      total: 0,
      page: 1,
      pageSize: 1000,
      totalPages: 0,
    },
  };
};

// Add separate pagination hooks for each table
const useQueryResponseActivePagination = () => {
  const { response } = useQueryResponse();

  if (!response || !response.active) {
    return {
      page: 1,
      pageSize: 1000,
      total: 0,
      totalPages: 0,
      links: [],
    };
  }

  return {
    page: response.active.page,
    pageSize: response.active.pageSize,
    total: response.active.total,
    totalPages: response.active.totalPages,
    links: [],
  };
};

const useQueryResponseArchivedPagination = () => {
  const { response } = useQueryResponse();

  if (!response || !response.archived) {
    return {
      page: 1,
      pageSize: 1000,
      total: 0,
      totalPages: 0,
      links: [],
    };
  }

  return {
    page: response.archived.page,
    pageSize: response.archived.pageSize,
    total: response.archived.total,
    totalPages: response.archived.totalPages,
    links: [],
  };
};

const useQueryRefetch = () => {
  const { refetch } = useQueryResponse();
  return refetch;
};

// Keep the old one for backward compatibility or remove it
const useQueryResponsePagination = () => {
  return useQueryResponseActivePagination();
};

const useQueryResponseLoading = (): boolean => {
  const { isLoading } = useQueryResponse();
  return isLoading;
};

export {
  useQueryRefetch,
  QueryResponseProvider,
  useQueryResponse,
  useQueryResponseData,
  useQueryResponsePagination,
  useQueryResponseActivePagination, // Export new hook
  useQueryResponseArchivedPagination, // Export new hook
  useQueryResponseLoading,
};
