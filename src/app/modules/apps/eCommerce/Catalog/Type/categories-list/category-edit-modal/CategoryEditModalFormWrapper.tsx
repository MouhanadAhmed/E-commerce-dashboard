import { useQuery } from "react-query";
import { useListView } from "../core/ListViewProvider";
import { getTypeById } from "../core/_requests";
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
    `${QUERIES.TYPES_LIST}-type-${itemIdForUpdate}`,
    () => {
      return getTypeById(itemIdForUpdate);
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
