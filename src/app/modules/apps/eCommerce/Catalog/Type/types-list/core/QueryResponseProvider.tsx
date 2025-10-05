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
import { getArchivedTypes, getTypes } from './_requests';
import { Types } from './_models';

// Create separate contexts for active and archived types
const ActiveTypesContext = createResponseContext<Types>(initialQueryResponse);
const ArchivedTypesContext = createResponseContext<Types>(initialQueryResponse);

// Active Types Provider
const ActiveTypesProvider: FC<WithChildren> = ({ children }) => {
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
  } = useQuery(`${QUERIES.TYPES_LIST}-${query}`, () => getTypes(query), {
    cacheTime: 0,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  return (
    <ActiveTypesContext.Provider
      value={{
        isLoading: isFetching,
        refetch,
        response,
        query,
      }}
    >
      {children}
    </ActiveTypesContext.Provider>
  );
};

// Archived Types Provider
const ArchivedTypesProvider: FC<WithChildren> = ({ children }) => {
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
    `${QUERIES.ARCHIVED_TYPES_LIST}-${query}`,
    () => getArchivedTypes(),
    {
      cacheTime: 0,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <ArchivedTypesContext.Provider
      value={{
        isLoading: isFetching,
        refetch,
        response,
        query,
      }}
    >
      {children}
    </ArchivedTypesContext.Provider>
  );
};

// Main Query Response Provider (combines both)
const QueryResponseProvider: FC<WithChildren> = ({ children }) => {
  return (
    <ActiveTypesProvider>
      <ArchivedTypesProvider>{children}</ArchivedTypesProvider>
    </ActiveTypesProvider>
  );
};

// Active Types Hooks
const useActiveTypes = () => useContext(ActiveTypesContext);

const useActiveTypesData = () => {
  const { response } = useActiveTypes();
  if (!response) {
    return [];
  }
  return response?.data || [];
};

const useActiveTypesPagination = () => {
  const defaultPaginationState: PaginationState = {
    links: [],
    ...initialQueryState,
  };

  const { response } = useActiveTypes();
  if (!response || !response.payload || !response.payload.pagination) {
    return defaultPaginationState;
  }

  return response.payload.pagination;
};

const useActiveTypesLoading = (): boolean => {
  const { isLoading } = useActiveTypes();
  return isLoading;
};

// Archived Types Hooks
const useArchivedTypes = () => useContext(ArchivedTypesContext);

const useArchivedTypesData = () => {
  const { response } = useArchivedTypes();
  if (!response) {
    return [];
  }
  return response?.data || [];
};

const useArchivedTypesPagination = () => {
  const defaultPaginationState: PaginationState = {
    links: [],
    ...initialQueryState,
  };

  const { response } = useArchivedTypes();
  if (!response || !response.payload || !response.payload.pagination) {
    return defaultPaginationState;
  }

  return response.payload.pagination;
};

const useArchivedTypesLoading = (): boolean => {
  const { isLoading } = useArchivedTypes();
  return isLoading;
};

// Legacy hooks for backward compatibility
const useQueryResponse = () => {
  const active = useActiveTypes();
  const archived = useArchivedTypes();

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
  const activeData = useActiveTypesData();
  const archivedData = useArchivedTypesData();

  return {
    active: activeData,
    archived: archivedData,
  };
};

const useQueryActiveResponseData = () => {
  const activeData = useActiveTypesData();
  return {
    active: activeData,
  };
};

const useQueryResponsePagination = () => {
  return useActiveTypesPagination();
};

const useQueryResponseLoading = (): boolean => {
  const activeLoading = useActiveTypesLoading();
  const archivedLoading = useArchivedTypesLoading();
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
  useActiveTypes,
  useActiveTypesData,
  useActiveTypesPagination,
  useActiveTypesLoading,
  useArchivedTypes,
  useArchivedTypesData,
  useArchivedTypesPagination,
  useArchivedTypesLoading,
};
