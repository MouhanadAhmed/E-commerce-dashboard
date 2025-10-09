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
import {
  getChildSubCategories,
  getArchivedChildSubCategories,
} from "./_requests";
import { ChildSubCategories } from "./_models";

// Create separate contexts for active and archived child sub categories
const ActiveChildSubCategoriesContext =
  createResponseContext<ChildSubCategories>(initialQueryResponse);
const ArchivedChildSubCategoriesContext =
  createResponseContext<ChildSubCategories>(initialQueryResponse);

// Active Child Sub Categories Provider
const ActiveChildSubCategoriesProvider: FC<
  WithChildren & { fields?: string }
> = ({ children, fields }) => {
  const { state } = useQueryRequest();
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state));
  const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state]);

  useEffect(() => {
    if (query !== updatedQuery) {
      if (query.match(/search=([^&]*)/)) {
        setQuery(query.replace(/search=/, "keyword="));
      }
      setQuery(decodeURIComponent(updatedQuery));
    }
  }, [updatedQuery]);

  const {
    isFetching,
    refetch,
    data: response,
  } = useQuery(
    `${QUERIES.CHILD_SUB_CATEGORIES_LIST}-${query}`,
    () => {
      const effectiveQuery = fields
        ? [decodeURIComponent(query), `fields=${fields}`]
            .filter(Boolean)
            .join("&")
        : decodeURIComponent(query);
      return getChildSubCategories(effectiveQuery);
    },
    {
      cacheTime: 0,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <ActiveChildSubCategoriesContext.Provider
      value={{
        isLoading: isFetching,
        refetch,
        response,
        query,
      }}
    >
      {children}
    </ActiveChildSubCategoriesContext.Provider>
  );
};

// Archived Child Sub Categories Provider
const ArchivedChildSubCategoriesProvider: FC<
  WithChildren & { fields?: string }
> = ({ children, fields }) => {
  const { state } = useQueryRequest();
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state));
  const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state]);

  useEffect(() => {
    if (query !== updatedQuery) {
      if (query.match(/search=([^&]*)/)) {
        setQuery(query.replace(/search=/, "keyword="));
      }
      setQuery(decodeURIComponent(updatedQuery));
    }
  }, [updatedQuery]);

  const {
    isFetching,
    refetch,
    data: response,
  } = useQuery(
    `${QUERIES.ARCHIVED_CHILD_SUB_CATEGORIES_LIST}-${query}`,
    () => {
      const effectiveQuery = fields
        ? [decodeURIComponent(query), `fields=${fields}`]
            .filter(Boolean)
            .join("&")
        : decodeURIComponent(query);
      return getArchivedChildSubCategories(effectiveQuery);
    },
    {
      cacheTime: 0,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <ArchivedChildSubCategoriesContext.Provider
      value={{
        isLoading: isFetching,
        refetch,
        response,
        query,
      }}
    >
      {children}
    </ArchivedChildSubCategoriesContext.Provider>
  );
};

// Main Query Response Provider (combines both)
const QueryResponseProvider: FC<
  WithChildren & { includeArchived?: boolean; fields?: string }
> = ({ children, includeArchived = true, fields }) => {
  return (
    <ActiveChildSubCategoriesProvider fields={fields}>
      {includeArchived ? (
        <ArchivedChildSubCategoriesProvider fields={fields}>
          {children}
        </ArchivedChildSubCategoriesProvider>
      ) : (
        children
      )}
    </ActiveChildSubCategoriesProvider>
  );
};

// Active Child Sub Categories Hooks
const useActiveChildSubCategories = () =>
  useContext(ActiveChildSubCategoriesContext);

const useActiveChildSubCategoriesData = () => {
  const { response } = useActiveChildSubCategories();
  if (!response) {
    return [];
  }
  return response?.data || [];
};

const useActiveChildSubCategoriesPagination = () => {
  const defaultPaginationState: PaginationState = {
    links: [],
    ...initialQueryState,
  };

  const { response } = useActiveChildSubCategories();
  if (!response || !response.payload || !response.payload.pagination) {
    return defaultPaginationState;
  }

  return response.payload.pagination;
};

const useActiveChildSubCategoriesLoading = (): boolean => {
  const { isLoading } = useActiveChildSubCategories();
  return isLoading;
};

// Archived Child Sub Categories Hooks
const useArchivedChildSubCategories = () =>
  useContext(ArchivedChildSubCategoriesContext);

const useArchivedChildSubCategoriesData = () => {
  const { response } = useArchivedChildSubCategories();
  if (!response) {
    return [];
  }
  return response?.data || [];
};

const useArchivedChildSubCategoriesPagination = () => {
  const defaultPaginationState: PaginationState = {
    links: [],
    ...initialQueryState,
  };

  const { response } = useArchivedChildSubCategories();
  if (!response || !response.payload || !response.payload.pagination) {
    return defaultPaginationState;
  }

  return response.payload.pagination;
};

const useArchivedChildSubCategoriesLoading = (): boolean => {
  const { isLoading } = useArchivedChildSubCategories();
  return isLoading;
};

// Legacy hooks for backward compatibility
const useQueryResponse = () => {
  const active = useActiveChildSubCategories();
  const archived = useArchivedChildSubCategories();

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
  const activeData = useActiveChildSubCategoriesData();
  const archivedData = useArchivedChildSubCategoriesData();

  return {
    active: activeData,
    archived: archivedData,
  };
};

const useQueryActiveResponseData = () => {
  const activeData = useActiveChildSubCategoriesData();
  return {
    active: activeData,
  };
};

const useQueryResponsePagination = () => {
  return useActiveChildSubCategoriesPagination();
};

const useQueryResponseLoading = (): boolean => {
  const activeLoading = useActiveChildSubCategoriesLoading();
  const archivedLoading = useArchivedChildSubCategoriesLoading();
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
  useActiveChildSubCategories,
  useActiveChildSubCategoriesData,
  useActiveChildSubCategoriesPagination,
  useActiveChildSubCategoriesLoading,
  useArchivedChildSubCategories,
  useArchivedChildSubCategoriesData,
  useArchivedChildSubCategoriesPagination,
  useArchivedChildSubCategoriesLoading,
};
