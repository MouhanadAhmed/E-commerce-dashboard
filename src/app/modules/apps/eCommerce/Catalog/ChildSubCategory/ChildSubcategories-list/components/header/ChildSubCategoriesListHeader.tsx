import { useListView } from "../../core/ListViewProvider";
import { ChildSubCategoriesListToolbar } from "./ChildSubCategoriesListToolbar";
import { UsersListGrouping } from "./UsersListGrouping";
import { ChildSubCategoriesListSearchComponent } from "./ChildSubCategoriesListSearchComponent";

const ChildSubCategoriesListHeader = () => {
  const { selected } = useListView();
  return (
    <div className="card-header border-0 pt-6">
      <ChildSubCategoriesListSearchComponent />
      {/* begin::Card toolbar */}
      <div className="card-toolbar">
        {/* begin::Group actions */}
        {selected.length > 0 ? (
          <UsersListGrouping />
        ) : (
          <ChildSubCategoriesListToolbar />
        )}
        {/* end::Group actions */}
      </div>
      {/* end::Card toolbar */}
    </div>
  );
};

export { ChildSubCategoriesListHeader };
