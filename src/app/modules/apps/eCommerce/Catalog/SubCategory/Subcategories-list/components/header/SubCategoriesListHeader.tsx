import { useListView } from "../../core/ListViewProvider";
import { SubCategoriesListToolbar } from "./SubCategoriesListToolbar";
import { UsersListGrouping } from "./UsersListGrouping";
import { SubCategoriesListSearchComponent } from "./SubCategoriesListSearchComponent";

const SubCategoriesListHeader = () => {
  const { selected } = useListView();
  return (
    <div className="card-header border-0 pt-6">
      <SubCategoriesListSearchComponent />
      {/* begin::Card toolbar */}
      <div className="card-toolbar">
        {/* begin::Group actions */}
        {selected.length > 0 ? (
          <UsersListGrouping />
        ) : (
          <SubCategoriesListToolbar />
        )}
        {/* end::Group actions */}
      </div>
      {/* end::Card toolbar */}
    </div>
  );
};

export { SubCategoriesListHeader };
