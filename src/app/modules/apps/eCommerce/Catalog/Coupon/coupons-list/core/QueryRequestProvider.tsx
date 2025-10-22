/* eslint-disable react-refresh/only-export-components */
import { FC, useState, createContext, useContext } from "react";
import {
  QueryState,
  QueryRequestContextProps,
  initialQueryRequest,
  WithChildren,
} from "../../../../../../../../_metronic/helpers";

const QueryRequestContext =
  createContext<QueryRequestContextProps>(initialQueryRequest);

const QueryRequestProvider: FC<WithChildren> = ({ children }) => {
  // Ensure Coupons default page size is 10 to avoid large initial fetches (global default is 1000)
  const defaultState: QueryState = {
    ...initialQueryRequest.state,
    PageCount: 10,
    limit: 10,
  };
  const [state, setState] = useState<QueryState>(defaultState);
  const updateState = (updates: Partial<QueryState>) => {
    const updatedState = { ...state, ...updates } as QueryState;
    setState(updatedState);
  };
  return (
    <QueryRequestContext.Provider value={{ state, updateState }}>
      {children}
    </QueryRequestContext.Provider>
  );
};

const useQueryRequest = () => useContext(QueryRequestContext);
export { QueryRequestProvider, useQueryRequest };
