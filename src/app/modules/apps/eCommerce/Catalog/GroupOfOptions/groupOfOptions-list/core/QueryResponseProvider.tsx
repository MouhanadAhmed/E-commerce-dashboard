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
import { getGroups, getArchivedGroups } from "./_requests";
import { GroupOfOptions } from "./_models";

// Create separate contexts for active and archived groups
const ActiveGroupsContext =
  createResponseContext<GroupOfOptions>(initialQueryResponse);
const ArchivedGroupsContext =
  createResponseContext<GroupOfOptions>(initialQueryResponse);

// Active Groups Provider
const ActiveGroupsProvider: FC<WithChildren & { fields?: string }> = ({
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
    `${QUERIES.GROUPS_LIST}-${query}`,
    () => {
      const effectiveQuery = fields
        ? [decodeURIComponent(query), `fields=${fields}`]
            .filter(Boolean)
            .join("&")
        : decodeURIComponent(query);
      return getGroups(effectiveQuery);
    },
    {
      cacheTime: 0,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <ActiveGroupsContext.Provider
      value={{
        isLoading: isFetching,
        refetch,
        response,
        query,
      }}
    >
      {children}
    </ActiveGroupsContext.Provider>
  );
};

// Archived Groups Provider
const ArchivedGroupsProvider: FC<WithChildren & { fields?: string }> = ({
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
    `${QUERIES.ARCHIVED_GROUPS_LIST}-${query}`,
    () => {
      const effectiveQuery = fields
        ? [decodeURIComponent(query), `fields=${fields}`]
            .filter(Boolean)
            .join("&")
        : decodeURIComponent(query);
      return getArchivedGroups(effectiveQuery);
    },
    {
      cacheTime: 0,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <ArchivedGroupsContext.Provider
      value={{
        isLoading: isFetching,
        refetch,
        response,
        query,
      }}
    >
      {children}
    </ArchivedGroupsContext.Provider>
  );
};

// Main Query Response Provider (combines both)
const QueryResponseProvider: FC<
  WithChildren & { includeArchived?: boolean; fields?: string }
> = ({ children, includeArchived = true, fields }) => {
  return (
    <ActiveGroupsProvider fields={fields}>
      {includeArchived ? (
        <ArchivedGroupsProvider fields={fields}>
          {children}
        </ArchivedGroupsProvider>
      ) : (
        children
      )}
    </ActiveGroupsProvider>
  );
};

// Active Groups Hooks
const useActiveGroups = () => useContext(ActiveGroupsContext);

const useActiveGroupsData = () => {
  const { response } = useActiveGroups();
  if (!response) {
    return [];
  }
  return response?.data || [];
};

const useActiveGroupsPagination = () => {
  const defaultPaginationState: PaginationState = {
    links: [],
    ...initialQueryState,
  };

  const { response } = useActiveGroups();
  if (!response || !response.payload || !response.payload.pagination) {
    return defaultPaginationState;
  }

  return response.payload.pagination;
};

const useActiveGroupsLoading = (): boolean => {
  const { isLoading } = useActiveGroups();
  return isLoading;
};

// Archived Groups Hooks
const useArchivedGroups = () => useContext(ArchivedGroupsContext);

const useArchivedGroupsData = () => {
  const { response } = useArchivedGroups();
  if (!response) {
    return [];
  }
  return response?.data || [];
};

const useArchivedGroupsPagination = () => {
  const defaultPaginationState: PaginationState = {
    links: [],
    ...initialQueryState,
  };

  const { response } = useArchivedGroups();
  if (!response || !response.payload || !response.payload.pagination) {
    return defaultPaginationState;
  }

  return response.payload.pagination;
};

const useArchivedGroupsLoading = (): boolean => {
  const { isLoading } = useArchivedGroups();
  return isLoading;
};

// Legacy hooks for backward compatibility
const useQueryResponse = () => {
  const active = useActiveGroups();
  const archived = useArchivedGroups();

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
  const activeData = useActiveGroupsData();
  const archivedData = useArchivedGroupsData();

  return {
    active: activeData,
    archived: archivedData,
  };
};

const useQueryActiveResponseData = () => {
  const activeData = useActiveGroupsData();
  return {
    active: activeData,
  };
};

const useQueryResponsePagination = () => {
  return useActiveGroupsPagination();
};

const useQueryResponseLoading = (): boolean => {
  const activeLoading = useActiveGroupsLoading();
  const archivedLoading = useArchivedGroupsLoading();
  return activeLoading || archivedLoading;
};

export {
  QueryResponseProvider,
  useQueryResponse,
  useQueryResponseData,
  useQueryResponsePagination,
  useQueryResponseLoading,
  useQueryActiveResponseData,
  // New separate hooks
  useActiveGroups,
  useActiveGroupsData,
  useActiveGroupsPagination,
  useActiveGroupsLoading,
  useArchivedGroups,
  useArchivedGroupsData,
  useArchivedGroupsPagination,
  useArchivedGroupsLoading,
};
