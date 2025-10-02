import { ListViewProvider, useListView } from "./core/ListViewProvider";
import { QueryRequestProvider } from "./core/QueryRequestProvider";
import { QueryResponseProvider } from "./core/QueryResponseProvider";
import { GroupEditModal } from "./group-edit-modal/GroupEditModal";
import { KTCard } from "../../../../../../../_metronic/helpers";
import { ToolbarWrapper } from "../../../../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../../../../_metronic/layout/components/content";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
// import { GroupsOfOptionsListHeader } from './components/header/GroupsOfOptionsListHeader'
import { GroupTable } from "./table/GroupOfOptionsTable";
const GroupsOfOptionsList = () => {
  const { itemIdForUpdate } = useListView();
  return (
    <>
      <KTCard>
        {/* <GroupsOfOptionsListHeader /> */}
        <GroupTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <GroupEditModal />}
    </>
  );
};

const GroupOfOptionsListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <ToolbarWrapper />
        <Content>
          <DndProvider backend={HTML5Backend}>
            <GroupsOfOptionsList />
          </DndProvider>
        </Content>
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
);

export { GroupOfOptionsListWrapper };
