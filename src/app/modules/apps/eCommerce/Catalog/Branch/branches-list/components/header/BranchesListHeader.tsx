import { useListView } from "../../core/ListViewProvider";
import { BranchesListToolbar } from "./BranchesListToolbar";
import { UsersListGrouping } from "./UsersListGrouping";
import { BranchesListSearchComponent } from "./BranchesListSearchComponent";

const BranchesListHeader = () => {
  const { selected } = useListView();
  return (
    <div className="card-header border-0 pt-6">
      <BranchesListSearchComponent />
      {/* begin::Card toolbar */}
      <div className="card-toolbar">
        {/* begin::Group actions */}
        {selected.length > 0 ? <UsersListGrouping /> : <BranchesListToolbar />}
        {/* end::Group actions */}
      </div>
      {/* end::Card toolbar */}
    </div>
  );
};

export { BranchesListHeader };
