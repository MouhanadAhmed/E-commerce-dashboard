import { useQuery } from "react-query";
import { useListView } from "../core/ListViewProvider";
import { getChildSubCategoryById } from "../core/_requests";
import { QUERIES, isNotEmpty } from "../../../../../../../../_metronic/helpers";
import { ChildSubCategoryEditModalForm } from "./ChildSubCategoryEditModalForm";

const ChildSubCategoryEditModalFormWrapper = () => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView();
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate);
  const {
    isLoading,
    data: category,
    error,
  } = useQuery(
    `${QUERIES.CHILD_SUB_CATEGORIES_LIST}-xhildsubcategory-${itemIdForUpdate}`,
    () => {
      return getChildSubCategoryById(itemIdForUpdate);
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
      <ChildSubCategoryEditModalForm
        isSubCategoryLoading={isLoading}
        subCategory={{ _id: undefined, available: true }}
      />
    );
  }

  if (!isLoading && !error && category) {
    return (
      <ChildSubCategoryEditModalForm
        isSubCategoryLoading={isLoading}
        subCategory={category}
      />
    );
  }

  return null;
};

export { ChildSubCategoryEditModalFormWrapper };
