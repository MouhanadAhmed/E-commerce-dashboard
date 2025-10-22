/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, FC } from "react";
import { WithChildren } from "../../../../../../../../_metronic/helpers";

type LocalListView = {
  itemIdForUpdate?: number;
  setItemIdForUpdate: (v?: number) => void;
};

const ListViewContext = createContext<LocalListView>({
  itemIdForUpdate: undefined,
  setItemIdForUpdate: () => {},
});

const ListViewProvider: FC<WithChildren> = ({ children }) => {
  const [itemIdForUpdate, setItemIdForUpdate] = useState<number | undefined>(
    undefined
  );
  return (
    <ListViewContext.Provider value={{ itemIdForUpdate, setItemIdForUpdate }}>
      {children}
    </ListViewContext.Provider>
  );
};

const useListView = () => useContext(ListViewContext);

export { ListViewProvider, useListView };
