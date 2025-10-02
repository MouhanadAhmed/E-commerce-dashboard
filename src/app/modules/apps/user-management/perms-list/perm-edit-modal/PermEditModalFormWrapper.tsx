import { useQuery } from "react-query";
import { PermEditModalForm } from "./PermEditModalForm";
import { isNotEmpty, QUERIES } from "../../../../../../_metronic/helpers";
import { useListView } from "../core/ListViewProvider";
import { getPermissionById } from "../core/_requests";

const PermEditModalFormWrapper = () => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView();
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate);
  const {
    isLoading,
    data: user,
    error,
  } = useQuery(
    `${QUERIES.PERMISSIONS_LIST}-permission-${itemIdForUpdate}`,
    () => {
      return getPermissionById(itemIdForUpdate);
    },
    {
      cacheTime: 0,
      enabled: enabledQuery,
      onError: (err) => {
        setItemIdForUpdate(undefined);
        console.error(err);
      },
    },
  );

  if (!itemIdForUpdate) {
    return <PermEditModalForm isUserLoading={isLoading} />;
  }

  if (!isLoading && !error && user) {
    return <PermEditModalForm isUserLoading={isLoading} Permission={user} />;
  }

  return null;
};

export { PermEditModalFormWrapper };
