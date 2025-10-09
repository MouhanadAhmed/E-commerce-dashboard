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
import { getArchivedExtras, getExtras } from "./_requests";
import { Extras } from "./_models";

// Create separate contexts for active and archived extras
const ActiveExtrasContext = createResponseContext<Extras>(initialQueryResponse);
const ArchivedExtrasContext =
  createResponseContext<Extras>(initialQueryResponse);

// Active Extras Provider
const ActiveExtrasProvider: FC<WithChildren & { fields?: string }> = ({
  children,
  fields,
}) => {
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
    `${QUERIES.EXTRAS_LIST}-${query}`,
    () => {
      const effectiveQuery = fields
        ? [decodeURIComponent(query), `fields=${fields}`]
            .filter(Boolean)
            .join("&")
        : decodeURIComponent(query);
      return getExtras(effectiveQuery);
    },
    {
      cacheTime: 0,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <ActiveExtrasContext.Provider
      value={{
        isLoading: isFetching,
        refetch,
        response,
        query,
      }}
    >
      {children}
    </ActiveExtrasContext.Provider>
  );
};

// Archived Extras Provider
const ArchivedExtrasProvider: FC<WithChildren & { fields?: string }> = ({
  children,
  fields,
}) => {
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
    `${QUERIES.ARCHIVED_EXTRAS_LIST}-${query}`,
    () => {
      const effectiveQuery = fields
        ? [decodeURIComponent(query), `fields=${fields}`]
            .filter(Boolean)
            .join("&")
        : decodeURIComponent(query);
      return getArchivedExtras(effectiveQuery);
    },
    {
      cacheTime: 0,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <ArchivedExtrasContext.Provider
      value={{
        isLoading: isFetching,
        refetch,
        response,
        query,
      }}
    >
      {children}
    </ArchivedExtrasContext.Provider>
  );
};

// Main Query Response Provider (combines both)
const QueryResponseProvider: FC<
  WithChildren & { includeArchived?: boolean; fields?: string }
> = ({ children, includeArchived = true, fields }) => {
  return (
    <ActiveExtrasProvider fields={fields}>
      {includeArchived ? (
        <ArchivedExtrasProvider fields={fields}>
          {children}
        </ArchivedExtrasProvider>
      ) : (
        children
      )}
    </ActiveExtrasProvider>
  );
};

// Active Extras Hooks
const useActiveExtras = () => useContext(ActiveExtrasContext);

const useActiveExtrasData = () => {
  const { response } = useActiveExtras();
  if (!response) {
    return [];
  }
  return response?.data || [];
};

const useActiveExtrasPagination = () => {
  const defaultPaginationState: PaginationState = {
    links: [],
    ...initialQueryState,
  };

  const { response } = useActiveExtras();
  if (!response || !response.payload || !response.payload.pagination) {
    return defaultPaginationState;
  }

  return response.payload.pagination;
};

const useActiveExtrasLoading = (): boolean => {
  const { isLoading } = useActiveExtras();
  return isLoading;
};

// Archived Extras Hooks
const useArchivedExtras = () => useContext(ArchivedExtrasContext);

const useArchivedExtrasData = () => {
  const { response } = useArchivedExtras();
  if (!response) {
    return [];
  }
  return response?.data || [];
};

const useArchivedExtrasPagination = () => {
  const defaultPaginationState: PaginationState = {
    links: [],
    ...initialQueryState,
  };

  const { response } = useArchivedExtras();
  if (!response || !response.payload || !response.payload.pagination) {
    return defaultPaginationState;
  }

  return response.payload.pagination;
};

const useArchivedExtrasLoading = (): boolean => {
  const { isLoading } = useArchivedExtras();
  return isLoading;
};

// Legacy hooks for backward compatibility
const useQueryResponse = () => {
  const active = useActiveExtras();
  const archived = useArchivedExtras();

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
  const activeData = useActiveExtrasData();
  const archivedData = useArchivedExtrasData();

  return {
    active: activeData,
    archived: archivedData,
  };
};

const useQueryActiveResponseData = () => {
  const activeData = useActiveExtrasData();
  return {
    active: activeData,
  };
};

const useQueryResponsePagination = () => {
  return useActiveExtrasPagination();
};

const useQueryResponseLoading = (): boolean => {
  const activeLoading = useActiveExtrasLoading();
  const archivedLoading = useArchivedExtrasLoading();
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
  useActiveExtras,
  useActiveExtrasData,
  useActiveExtrasPagination,
  useActiveExtrasLoading,
  useArchivedExtras,
  useArchivedExtrasData,
  useArchivedExtrasPagination,
  useArchivedExtrasLoading,
};
