import { useListView } from "../../core/ListViewProvider";
import { ExtrasListToolbar } from "./ExtraListToolbar";
import { UsersListGrouping } from "./UsersListGrouping";
import { ExtrasListSearchComponent } from "./ExtraListSearchComponent";

const ExtrasListHeader = () => {
  const { selected } = useListView();
  return (
    <div className="card-header border-0 pt-6">
      <ExtrasListSearchComponent />
      {/* begin::Card toolbar */}
      <div className="card-toolbar">
        {/* begin::Group actions */}
        {selected.length > 0 ? (
          <UsersListGrouping />
        ) : (
          <ExtrasListToolbar />
        )}
        {/* end::Group actions */}
      </div>
      {/* end::Card toolbar */}
    </div>
  );
};

export { ExtrasListHeader };
