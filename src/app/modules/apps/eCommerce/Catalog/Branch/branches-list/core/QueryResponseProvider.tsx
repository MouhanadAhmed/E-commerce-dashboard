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
import { getBranches, getArchivedBranches } from "./_requests";
import { Branch } from "./_models";

// Create separate contexts for active and archived branches
const ActiveBranchesContext =
  createResponseContext<Branch>(initialQueryResponse);
const ArchivedBranchesContext =
  createResponseContext<Branch>(initialQueryResponse);

// Active Branches Provider
const ActiveBranchesProvider: FC<WithChildren & { fields?: string }> = ({
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
    `${QUERIES.BRNACHES_LIST}-${query}`,
    () => {
      const effectiveQuery = fields
        ? [decodeURIComponent(query), `fields=${fields}`]
            .filter(Boolean)
            .join("&")
        : decodeURIComponent(query);
      return getBranches(effectiveQuery);
    },
    {
      cacheTime: 0,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <ActiveBranchesContext.Provider
      value={{
        isLoading: isFetching,
        refetch,
        response,
        query,
      }}
    >
      {children}
    </ActiveBranchesContext.Provider>
  );
};

// Archived Branches Provider
const ArchivedBranchesProvider: FC<WithChildren & { fields?: string }> = ({
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
    `${QUERIES.ARCHIVED_BRNACHES_LIST}-${query}`,
    () => {
      const effectiveQuery = fields
        ? [decodeURIComponent(query), `fields=${fields}`]
            .filter(Boolean)
            .join("&")
        : decodeURIComponent(query);
      return getArchivedBranches(effectiveQuery);
    },
    {
      cacheTime: 0,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <ArchivedBranchesContext.Provider
      value={{
        isLoading: isFetching,
        refetch,
        response,
        query,
      }}
    >
      {children}
    </ArchivedBranchesContext.Provider>
  );
};

// Main Query Response Provider (combines both)
const QueryResponseProvider: FC<
  WithChildren & { includeArchived?: boolean; fields?: string }
> = ({ children, includeArchived = true, fields }) => {
  return (
    <ActiveBranchesProvider fields={fields}>
      {includeArchived ? (
        <ArchivedBranchesProvider fields={fields}>
          {children}
        </ArchivedBranchesProvider>
      ) : (
        children
      )}
    </ActiveBranchesProvider>
  );
};

// Active Branches Hooks
const useActiveBranches = () => useContext(ActiveBranchesContext);

const useActiveBranchesData = () => {
  const { response } = useActiveBranches();
  if (!response) {
    return [];
  }
  return response?.data || [];
};

const useActiveBranchesPagination = () => {
  const defaultPaginationState: PaginationState = {
    links: [],
    ...initialQueryState,
  };

  const { response } = useActiveBranches();
  if (!response || !response.payload || !response.payload.pagination) {
    return defaultPaginationState;
  }

  return response.payload.pagination;
};

const useActiveBranchesLoading = (): boolean => {
  const { isLoading } = useActiveBranches();
  return isLoading;
};

// Archived Branches Hooks
const useArchivedBranches = () => useContext(ArchivedBranchesContext);

const useArchivedBranchesData = () => {
  const { response } = useArchivedBranches();
  if (!response) {
    return [];
  }
  return response?.data || [];
};

const useArchivedBranchesPagination = () => {
  const defaultPaginationState: PaginationState = {
    links: [],
    ...initialQueryState,
  };

  const { response } = useArchivedBranches();
  if (!response || !response.payload || !response.payload.pagination) {
    return defaultPaginationState;
  }

  return response.payload.pagination;
};

const useArchivedBranchesLoading = (): boolean => {
  const { isLoading } = useArchivedBranches();
  return isLoading;
};

// Legacy hooks for backward compatibility
const useQueryResponse = () => {
  const active = useActiveBranches();
  const archived = useArchivedBranches();

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
  const activeData = useActiveBranchesData();
  const archivedData = useArchivedBranchesData();

  return {
    active: activeData,
    archived: archivedData,
  };
};

const useQueryActiveResponseData = () => {
  const activeData = useActiveBranchesData();
  return {
    active: activeData,
  };
};

const useQueryResponsePagination = () => {
  return useActiveBranchesPagination();
};

const useQueryResponseLoading = (): boolean => {
  const activeLoading = useActiveBranchesLoading();
  const archivedLoading = useArchivedBranchesLoading();
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
  useActiveBranches,
  useActiveBranchesData,
  useActiveBranchesPagination,
  useActiveBranchesLoading,
  useArchivedBranches,
  useArchivedBranchesData,
  useArchivedBranchesPagination,
  useArchivedBranchesLoading,
};
