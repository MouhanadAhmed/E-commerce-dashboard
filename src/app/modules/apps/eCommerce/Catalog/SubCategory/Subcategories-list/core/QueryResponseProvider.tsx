/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  FC,
  useContext,
  useState,
  useEffect,
  useMemo,
  createContext,
} from "react";
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
import { getArchivedSubCategories, getSubCategories } from "./_requests";
import { SubCategories } from "./_models";

// Create separate contexts for active and archived sub categories
const ActiveSubCategoriesContext =
  createResponseContext<SubCategories>(initialQueryResponse);
const ArchivedSubCategoriesContext =
  createResponseContext<SubCategories>(initialQueryResponse);

// Active Sub Categories Provider
const ActiveSubCategoriesProvider: FC<WithChildren & { fields?: string }> = ({
  children,
  fields,
}) => {
  const { state } = useQueryRequest();
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state));
  const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state]);

  useEffect(() => {
    if (query !== updatedQuery) {
      const normalized = updatedQuery.replace(/(^|&)search=/, "$1keyword=");
      if (query !== normalized) setQuery(normalized);
    }
  }, [updatedQuery, query]);

  const {
    isFetching,
    refetch,
    data: response,
  } = useQuery(
    `${QUERIES.SUB_CATEGORIES_LIST}-${query}`,
    () => {
      const effectiveQuery = fields
        ? [query, `fields=${fields}`].filter(Boolean).join("&")
        : query;
      return getSubCategories(effectiveQuery);
    },
    {
      cacheTime: 0,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <ActiveSubCategoriesContext.Provider
      value={{
        isLoading: isFetching,
        refetch,
        response,
        query,
      }}
    >
      {children}
    </ActiveSubCategoriesContext.Provider>
  );
};

// Archived Sub Categories Provider
const ArchivedSubCategoriesProvider: FC<WithChildren & { fields?: string }> = ({
  children,
  fields,
}) => {
  const { state } = useQueryRequest();
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state));
  const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state]);

  useEffect(() => {
    if (query !== updatedQuery) {
      const normalized = updatedQuery.replace(/(^|&)search=/, "$1keyword=");
      if (query !== normalized) setQuery(normalized);
    }
  }, [updatedQuery, query]);

  const {
    isFetching,
    refetch,
    data: response,
  } = useQuery(
    `${QUERIES.ARCHIVED_SUB_CATEGORIES_LIST}-${query}`,
    () => {
      const effectiveQuery = fields
        ? [query, `fields=${fields}`].filter(Boolean).join("&")
        : query;
      return getArchivedSubCategories(effectiveQuery);
    },
    {
      cacheTime: 0,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <ArchivedSubCategoriesContext.Provider
      value={{
        isLoading: isFetching,
        refetch,
        response,
        query,
      }}
    >
      {children}
    </ArchivedSubCategoriesContext.Provider>
  );
};

// Main Query Response Provider (combines both)
const QueryResponseProvider: FC<
  WithChildren & { includeArchived?: boolean; fields?: string }
> = ({ children, includeArchived = true, fields }) => {
  return (
    <ActiveSubCategoriesProvider fields={fields}>
      {includeArchived ? (
        <ArchivedSubCategoriesProvider fields={fields}>
          {children}
        </ArchivedSubCategoriesProvider>
      ) : (
        children
      )}
    </ActiveSubCategoriesProvider>
  );
};

// Active Sub Categories Hooks
const useActiveSubCategories = () => useContext(ActiveSubCategoriesContext);

const useActiveSubCategoriesData = () => {
  const { response } = useActiveSubCategories();
  if (!response) {
    return [];
  }
  return response?.data || [];
};

const useActiveSubCategoriesPagination = () => {
  const defaultPaginationState: PaginationState = {
    links: [],
    ...initialQueryState,
  };

  const { response } = useActiveSubCategories();
  if (!response || !response.payload || !response.payload.pagination) {
    return defaultPaginationState;
  }

  return response.payload.pagination;
};

const useActiveSubCategoriesLoading = (): boolean => {
  const { isLoading } = useActiveSubCategories();
  return isLoading;
};

// Archived Sub Categories Hooks
const useArchivedSubCategories = () => useContext(ArchivedSubCategoriesContext);

const useArchivedSubCategoriesData = () => {
  const { response } = useArchivedSubCategories();
  if (!response) {
    return [];
  }
  return response?.data || [];
};

const useArchivedSubCategoriesPagination = () => {
  const defaultPaginationState: PaginationState = {
    links: [],
    ...initialQueryState,
  };

  const { response } = useArchivedSubCategories();
  if (!response || !response.payload || !response.payload.pagination) {
    return defaultPaginationState;
  }

  return response.payload.pagination;
};

const useArchivedSubCategoriesLoading = (): boolean => {
  const { isLoading } = useArchivedSubCategories();
  return isLoading;
};

// Legacy hooks for backward compatibility
const useQueryResponse = () => {
  const active = useActiveSubCategories();
  const archived = useArchivedSubCategories();

  return {
    isLoading: active.isLoading || archived.isLoading,
    refetch: () => {
      active.refetch();
      archived.refetch();
    },
    response: {
      active: active.response,
      archived: archived.response,
    },
    activeResponse: active.response,
    query: active.query,
  };
};

const useQueryResponseData = () => {
  const activeData = useActiveSubCategoriesData();
  const archivedData = useArchivedSubCategoriesData();

  return {
    active: activeData,
    archived: archivedData,
  };
};

const useQueryActiveResponseData = () => {
  const activeData = useActiveSubCategoriesData();
  return {
    active: activeData,
  };
};

const useQueryResponsePagination = () => {
  return useActiveSubCategoriesPagination();
};

const useQueryResponseLoading = (): boolean => {
  const activeLoading = useActiveSubCategoriesLoading();
  const archivedLoading = useArchivedSubCategoriesLoading();
  return activeLoading || archivedLoading;
};

const useQueryRefetch = () => {
  const { refetch } = useQueryResponse();
  return refetch;
};

export {
  QueryResponseProvider,
  useQueryResponse,
  useQueryResponseData,
  useQueryResponsePagination,
  useQueryResponseLoading,
  useQueryRefetch,
  useQueryActiveResponseData,
  // New separate hooks
  useActiveSubCategories,
  useActiveSubCategoriesData,
  useActiveSubCategoriesPagination,
  useActiveSubCategoriesLoading,
  useArchivedSubCategories,
  useArchivedSubCategoriesData,
  useArchivedSubCategoriesPagination,
  useArchivedSubCategoriesLoading,
};
