import { useQuery } from "react-query";
import { useListView } from "../core/ListViewProvider";
import { getGroupById } from "../core/_requests";
import { QUERIES, isNotEmpty } from "../../../../../../../../_metronic/helpers";
import { GroupEditModalForm } from "./GroupEditModalForm";

const GroupEditModalFormWrapper = () => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView();
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate);
  const {
    isLoading,
    data: group,
    error,
  } = useQuery(
    `${QUERIES.GROUPS_LIST}-group-${itemIdForUpdate}`,
    () => {
      return getGroupById(itemIdForUpdate as string);
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
    return <GroupEditModalForm isGroupLoading={isLoading} group={null} />;
  }

  if (!isLoading && !error && group) {
    return <GroupEditModalForm isGroupLoading={isLoading} group={group} />;
  }

  return null;
};

export { GroupEditModalFormWrapper };
