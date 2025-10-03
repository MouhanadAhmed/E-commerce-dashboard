/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  FC,
  useContext,
  useState,
  useEffect,
  useMemo,
  createContext,
} from 'react';
import { useQuery } from 'react-query';
import {
  createResponseContext,
  initialQueryResponse,
  initialQueryState,
  PaginationState,
  QUERIES,
  stringifyRequestQuery,
  WithChildren,
} from '../../../../../../../../_metronic/helpers';
import { useQueryRequest } from './QueryRequestProvider';
import { getArchivedCategories, getCategories } from './_requests';
import { Categories } from './_models';

// Create separate contexts for active and archived categories
const ActiveCategoriesContext =
  createResponseContext<Categories>(initialQueryResponse);
const ArchivedCategoriesContext =
  createResponseContext<Categories>(initialQueryResponse);

// Active Categories Provider
const ActiveCategoriesProvider: FC<WithChildren> = ({ children }) => {
  const { state } = useQueryRequest();
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state));
  const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state]);

  useEffect(() => {
    if (query !== updatedQuery) {
      if (query.match(/search=([^&]*)/)) {
        setQuery(query.replace(/search=/, 'keyword='));
      }
      setQuery(decodeURIComponent(updatedQuery));
    }
  }, [updatedQuery]);

  const {
    isFetching,
    refetch,
    data: response,
  } = useQuery(
    `${QUERIES.CATEGORIES_LIST}-${query}`,
    () => getCategories(query),
    {
      cacheTime: 0,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <ActiveCategoriesContext.Provider
      value={{
        isLoading: isFetching,
        refetch,
        response,
        query,
      }}
    >
      {children}
    </ActiveCategoriesContext.Provider>
  );
};

// Archived Categories Provider
const ArchivedCategoriesProvider: FC<WithChildren> = ({ children }) => {
  const { state } = useQueryRequest();
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state));
  const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state]);

  useEffect(() => {
    if (query !== updatedQuery) {
      if (query.match(/search=([^&]*)/)) {
        setQuery(query.replace(/search=/, 'keyword='));
      }
      console.log('archivedQuery', decodeURIComponent(query));
      setQuery(decodeURIComponent(updatedQuery));
    }
  }, [updatedQuery]);

  const {
    isFetching,
    refetch,
    data: response,
  } = useQuery(
    `${QUERIES.ARCHIVED_CATEGORIES_LIST}-${query}`,
    () => getArchivedCategories(query),
    {
      cacheTime: 0,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <ArchivedCategoriesContext.Provider
      value={{
        isLoading: isFetching,
        refetch,
        response,
        query,
      }}
    >
      {children}
    </ArchivedCategoriesContext.Provider>
  );
};

// Main Query Response Provider (combines both)
const QueryResponseProvider: FC<WithChildren> = ({ children }) => {
  return (
    <ActiveCategoriesProvider>
      <ArchivedCategoriesProvider>{children}</ArchivedCategoriesProvider>
    </ActiveCategoriesProvider>
  );
};

// Active Categories Hooks
const useActiveCategories = () => useContext(ActiveCategoriesContext);

const useActiveCategoriesData = () => {
  const { response } = useActiveCategories();
  if (!response) {
    return [];
  }
  return response?.data || [];
};

const useActiveCategoriesPagination = () => {
  const defaultPaginationState: PaginationState = {
    links: [],
    ...initialQueryState,
  };

  const { response } = useActiveCategories();
  if (!response || !response.payload || !response.payload.pagination) {
    return defaultPaginationState;
  }

  return response.payload.pagination;
};

const useActiveCategoriesLoading = (): boolean => {
  const { isLoading } = useActiveCategories();
  return isLoading;
};

// Archived Categories Hooks
const useArchivedCategories = () => useContext(ArchivedCategoriesContext);

const useArchivedCategoriesData = () => {
  const { response } = useArchivedCategories();
  console.log('archived response', response);
  if (!response) {
    return [];
  }
  return response?.data || [];
};

const useArchivedCategoriesPagination = () => {
  const defaultPaginationState: PaginationState = {
    links: [],
    ...initialQueryState,
  };

  const { response } = useArchivedCategories();
  if (!response || !response.payload || !response.payload.pagination) {
    return defaultPaginationState;
  }

  return response.payload.pagination;
};

const useArchivedCategoriesLoading = (): boolean => {
  const { isLoading } = useArchivedCategories();
  return isLoading;
};

// Legacy hooks for backward compatibility
const useQueryResponse = () => {
  const active = useActiveCategories();
  const archived = useArchivedCategories();

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
  const activeData = useActiveCategoriesData();
  const archivedData = useArchivedCategoriesData();

  return {
    active: activeData,
    archived: archivedData,
  };
};

const useQueryActiveResponseData = () => {
  const activeData = useActiveCategoriesData();
  return {
    active: activeData,
  };
};

const useQueryResponsePagination = () => {
  return useActiveCategoriesPagination();
};

const useQueryResponseLoading = (): boolean => {
  const activeLoading = useActiveCategoriesLoading();
  const archivedLoading = useArchivedCategoriesLoading();
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
  useActiveCategories,
  useActiveCategoriesData,
  useActiveCategoriesPagination,
  useActiveCategoriesLoading,
  useArchivedCategories,
  useArchivedCategoriesData,
  useArchivedCategoriesPagination,
  useArchivedCategoriesLoading,
};
