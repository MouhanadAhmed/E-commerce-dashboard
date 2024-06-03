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
import { getSubCategories } from './_requests'
import { SubCategories } from './_models'

const QueryResponseContext = createResponseContext<SubCategories>(initialQueryResponse)
const QueryResponseProvider: FC<WithChildren> = ({children}) => {
  const {state} = useQueryRequest()
  const [query, setQuery] = useState<string>(stringifyRequestQuery(state))
  const [searchQuery, setSearchQuery] = useState<string|null>()
  const updatedQuery = useMemo(() => stringifyRequestQuery(state), [state])

  useEffect(() => {
    if (query !== updatedQuery) {
      if(query.match(/search=([^&]*)/)){
        setQuery(query.replace(/search=/, 'keyword='));

      }
    console.log('query',decodeURIComponent(query))

      // .replace(/search=/, 'keyword=')
      setQuery(decodeURIComponent(updatedQuery))
    }
  }, [updatedQuery])
  // useEffect(()=>{
    
  //   console.log('query',query, typeof stringifyRequestQuery(state))
  //   const searchQueryStr = stringifyRequestQuery(state).match(/search=([^&]*)/);
  //   setSearchQuery(searchQueryStr? searchQueryStr[1] : null)
  //   console.log('searchQuery',searchQuery)
  // },[query])
  const {
    isFetching,
    refetch,
    data: response,
  } = useQuery(
    `${QUERIES.SUB_CATEGORIES_LIST}-${query}`,
    () => {
      return getSubCategories(query)
    },
    {cacheTime: 0, keepPreviousData: true, refetchOnWindowFocus: false}
  )

  return (
    <QueryResponseContext.Provider value={{isLoading: isFetching, refetch, response, query}}>
      {children}
    </QueryResponseContext.Provider>
  )
}

const useQueryResponse = () => useContext(QueryResponseContext)

const useQueryResponseData = () => {
  const {response} = useQueryResponse()
  if (!response) {
    return []
  }

  return response?.data || []
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
  QueryResponseProvider,
  useQueryResponse,
  useQueryResponseData,
  useQueryResponsePagination,
  useQueryResponseLoading,
}
