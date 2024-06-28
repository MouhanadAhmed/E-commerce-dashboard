/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useContext, useState, useEffect, useMemo } from 'react'
import { useQuery } from 'react-query'
import {
  createResponseContext,
  initialQueryResponse,
  initialQueryState,
  PaginationState,
  QUERIES,
  stringifyRequestQuery,
  WithChildren,
} from '../../../../../../../../_metronic/helpers'
import { useQueryRequest } from './QueryRequestProvider'
import { getBranches, getArchivedBranches } from './_requests'
import { Branch } from './_models'

const QueryResponseContext = createResponseContext<Branch>(initialQueryResponse)
const QueryResponseProvider: FC<WithChildren> = ({ children }) => {
  const { state } = useQueryRequest()
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state))
  const [archivedQuery, setArchivedQuery] = useState<string>(stringifyRequestQuery(state))
  const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state])
  const updatedArchivedQuery = useMemo(() => stringifyRequestQuery(state), [state])

  useEffect(() => {
    if (query !== updatedQuery) {
      if(query.match(/search=([^&]*)/)){
        setQuery(query.replace(/search=/, 'keyword='))
      }
      console.log('query',   decodeURIComponent(query))
      setQuery(decodeURIComponent(updatedQuery))
    }
  }, [updatedQuery])

  useEffect(() => {
    if (archivedQuery !== updatedArchivedQuery) {
      if(archivedQuery.match(/search=([^&]*)/)){
        setArchivedQuery(archivedQuery.replace(/search=/, 'keyword='))
      }
      console.log('archivedQuery', decodeURIComponent(archivedQuery))
      setArchivedQuery(decodeURIComponent(updatedArchivedQuery))
    }
  }, [updatedArchivedQuery])

  const {
    isFetching: isFetchingBranches,
    refetch: refetchBranches,
    data: responseBranches,
  } = useQuery(
    `${QUERIES.BRNACHES_LIST}-${query}`,
    () => getBranches(query),
    { cacheTime: 0, keepPreviousData: true, refetchOnWindowFocus: false }
  )

  const {
    isFetching: isFetchingArchived,
    refetch: refetchArchived,
    data: responseArchived,
  } = useQuery(
    `${QUERIES.ARCHIVED_BRNACHES_LIST}-${archivedQuery}`,
    () => getArchivedBranches(archivedQuery),
    { cacheTime: 0, keepPreviousData: true, refetchOnWindowFocus: false }
  )

  return (
    <QueryResponseContext.Provider value={{
      isLoading: isFetchingBranches || isFetchingArchived,
      refetch: () => { refetchBranches(); refetchArchived() },
      response: { active: responseBranches, archived: responseArchived },
      query,
      
    }}>
      {children}
    </QueryResponseContext.Provider>
  )
}

const useQueryResponse = () => useContext(QueryResponseContext)

const useQueryResponseData = () => {
  const { response } = useQueryResponse()
  if (!response) {
    return { active: [], archived: [] }
  }
  return {
    active: response?.active?.data || [],
    archived: response?.archived?.data || []
  }
}

const useQueryResponsePagination = () => {
  const defaultPaginationState: PaginationState = {
    links: [],
    ...initialQueryState,
  }

  const { response } = useQueryResponse()
  if (!response || !response.active || !response.active.payload || !response.active.payload.pagination) {
    return defaultPaginationState
  }

  return response.active.payload.pagination
}

const useQueryResponseLoading = (): boolean => {
  const { isLoading } = useQueryResponse()
  return isLoading
}

export {
  QueryResponseProvider,
  useQueryResponse,
  useQueryResponseData,
  useQueryResponsePagination,
  useQueryResponseLoading,
}
// function stringIComponent(query: string): any {
//   throw new Error('Function not implemented.')
// }

