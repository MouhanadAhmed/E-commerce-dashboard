import { ListViewProvider, useListView } from "./core/ListViewProvider";
import { QueryRequestProvider } from "./core/QueryRequestProvider";
import { QueryResponseProvider } from "./core/QueryResponseProvider";
import { KTCard } from "../../../../../../../_metronic/helpers";
import { ToolbarWrapper } from "../../../../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../../../../_metronic/layout/components/content";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { BranchesTable } from "./table/BranchesTable";
import { BranchEditModal } from "./branch-edit-modal/BranchEditModal";
const BranchesList = () => {
  const { itemIdForUpdate } = useListView();
  return (
    <>
      <KTCard>
        <BranchesTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <BranchEditModal />}
    </>
  );
};

const BranchesListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <ToolbarWrapper />
        <Content>
          <DndProvider backend={HTML5Backend}>
            <BranchesList />
          </DndProvider>
        </Content>
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
);

export { BranchesListWrapper };
