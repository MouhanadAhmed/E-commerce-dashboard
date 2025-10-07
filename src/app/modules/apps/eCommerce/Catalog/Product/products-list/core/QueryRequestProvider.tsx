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
  const [state, setState] = useState({
    ...initialQueryRequest.state,
    activePage: 1,
    activePageSize: 10,
    archivedPage: 1,
    archivedPageSize: 10,
  });

  const updateState = (updates: any) => {
    const updatedState = { ...state, ...updates } as QueryState;
    setState(updatedState as any);
  };

  return (
    <QueryRequestContext.Provider value={{ state, updateState }}>
      {children}
    </QueryRequestContext.Provider>
  );
};

const useQueryRequest = () => useContext(QueryRequestContext);
export { QueryRequestProvider, useQueryRequest };
