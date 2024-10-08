/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import {FC, useContext, useState, useEffect, useMemo} from 'react'
import {useQuery} from 'react-query'
import {
  createResponseContext,
  initialQueryResponse,
  initialQueryState,
  PaginationState,
  QUERIES,
  stringifyRequestQuery,
  WithChildren,
} from '../../../../../../../../_metronic/helpers'
import {useQueryRequest} from './QueryRequestProvider'
import { getArchivedProducts, getProducts } from './_requests'
import { Product } from './_models'

const QueryResponseContext = createResponseContext<Product>(initialQueryResponse)
const QueryResponseProvider: FC<WithChildren> = ({children}) => {
  const {state} = useQueryRequest()
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state))
  // const [searchQuery, setSearchQuery] = useState<string|null>()
  const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state])
  const [archivedQuery, setArchivedQuery] = useState<string>(stringifyRequestQuery(state))
  const updatedArchivedQuery = useMemo(() => stringifyRequestQuery(state), [state])

  useEffect(() => {
    if (query !== updatedQuery) {
      if(query.match(/search=([^&]*)/)){
        setQuery(query.replace(/search=/, 'keyword='));

      }
    // console.log('query',decodeURIComponent(query))

      // .replace(/search=/, 'keyword=')
      setQuery(decodeURIComponent(updatedQuery))
    }
  }, [updatedQuery])
  useEffect(() => {
    if (archivedQuery !== updatedArchivedQuery) {
      if(archivedQuery.match(/search=([^&]*)/)){
        setArchivedQuery(archivedQuery.replace(/search=/, 'keyword='))
      }
      // console.log('archivedQuery', decodeURIComponent(archivedQuery))
      setArchivedQuery(decodeURIComponent(updatedArchivedQuery))
    }
  }, [updatedArchivedQuery])
  const {
    isFetching: isFetchingCategories,
    refetch: refetchCategories,
    data: responseCategories,
  } = useQuery(
    `${QUERIES.PRODUCTS_LIST}-${query}`,
    () => {
      return getProducts(query)
    },
    {cacheTime: 0, keepPreviousData: true, refetchOnWindowFocus: false}
  )

  const {
    isFetching: isFetchingArchived,
    refetch: refetchArchived,
    data: responseArchived,
  } = useQuery(
    `${QUERIES.ARCHIVED_PRODUCTS_LIST}-${archivedQuery}`,
    () => getArchivedProducts(archivedQuery),
    { cacheTime: 0, keepPreviousData: true, refetchOnWindowFocus: false }
  )

  return (
    <QueryResponseContext.Provider value={{
      isLoading: isFetchingCategories || isFetchingArchived,
      refetch: () => { refetchCategories(); refetchArchived() },
      response: { active: responseCategories, archived: responseArchived },
      query,
      
      }}>
      {children}
    </QueryResponseContext.Provider>
  )
}

const useQueryResponse = () => useContext(QueryResponseContext)

const useQueryResponseData = () => {
  const {response} = useQueryResponse()
  if (!response) {
    return { active: [], archived: [] }
  }
  return {
    active: response?.active?.data || [],
    archived: response?.archived?.data || []
  }
}

const useQueryRefetch = () => {
  const { refetch } = useQueryResponse()
  return refetch
}

const useQueryResponsePagination = () => {
  const defaultPaginationState: PaginationState = {
    links: [],
    ...initialQueryState,
  }

  const {response} = useQueryResponse()
  if (!response || !response.payload || !response.payload.pagination) {
    return defaultPaginationState
  }

  return response.payload.pagination
}

const useQueryResponseLoading = (): boolean => {
  const {isLoading} = useQueryResponse()
  return isLoading
}

export {
  useQueryRefetch,
  QueryResponseProvider,
  useQueryResponse,
  useQueryResponseData,
  useQueryResponsePagination,
  useQueryResponseLoading,
}
