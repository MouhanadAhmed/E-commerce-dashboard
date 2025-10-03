import { useQuery } from "react-query";
import { useListView } from "../core/ListViewProvider";
import { getExtraById } from "../core/_requests";
import { QUERIES, isNotEmpty } from "../../../../../../../../_metronic/helpers";
import { ExtraEditModalForm } from "./ExtraEditModalForm";

const ExtraEditModalFormWrapper = () => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView();
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate);
  const {
    isLoading,
    data: category,
    error,
  } = useQuery(
    `${QUERIES.EXTRAS_LIST}-extra-${itemIdForUpdate}`,
    () => {
      return getExtraById(itemIdForUpdate);
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
    return (
      <ExtraEditModalForm
        isExtraLoading={isLoading}
        category={{ _id: undefined, available: true }}
      />
    );
  }

  if (!isLoading && !error && category) {
    return (
      <ExtraEditModalForm
        isExtraLoading={isLoading}
        category={category}
      />
    );
  }

  return null;
};

export { ExtraEditModalFormWrapper };
