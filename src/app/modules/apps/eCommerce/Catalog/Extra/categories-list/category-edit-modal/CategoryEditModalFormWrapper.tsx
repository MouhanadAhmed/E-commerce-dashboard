import { useQuery } from "react-query";
import { useListView } from "../core/ListViewProvider";
import { getExtraById } from "../core/_requests";
import { QUERIES, isNotEmpty } from "../../../../../../../../_metronic/helpers";
import { CategoryEditModalForm } from "./CategoryEditModalForm";

const CategoryEditModalFormWrapper = () => {
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
      <CategoryEditModalForm
        isCategoryLoading={isLoading}
        category={{ _id: undefined, available: true }}
      />
    );
  }

  if (!isLoading && !error && category) {
    return (
      <CategoryEditModalForm
        isCategoryLoading={isLoading}
        category={category}
      />
    );
  }

  return null;
};

export { CategoryEditModalFormWrapper };
