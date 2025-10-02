import { useListView } from "../../core/ListViewProvider";
import { GroupsListToolbar } from "./GroupsListToolbar";
import { UsersListGrouping } from "./UsersListGrouping";
import { GroupsListSearchComponent } from "./GroupsListSearchComponent";

const GroupsListHeader = () => {
  const { selected } = useListView();
  return (
    <div className="card-header border-0 pt-6">
      <GroupsListSearchComponent />
      {/* begin::Card toolbar */}
      <div className="card-toolbar">
        {/* begin::Group actions */}
        {selected.length > 0 ? <UsersListGrouping /> : <GroupsListToolbar />}
        {/* end::Group actions */}
      </div>
      {/* end::Card toolbar */}
    </div>
  );
};

export { GroupsListHeader };
