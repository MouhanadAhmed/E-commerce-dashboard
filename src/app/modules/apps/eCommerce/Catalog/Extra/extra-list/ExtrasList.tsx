import { ListViewProvider, useListView } from "./core/ListViewProvider";
import { QueryRequestProvider } from "./core/QueryRequestProvider";
import { QueryResponseProvider } from "./core/QueryResponseProvider";
import { ExtraEditModal } from "./extra-edit-modal/ExtraEditModal";
import { KTCard } from "../../../../../../../_metronic/helpers";
import { ToolbarWrapper } from "../../../../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../../../../_metronic/layout/components/content";
import { ExtrasTable } from "./table/ExtrasTable";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
const ExtrasList = () => {
  const { itemIdForUpdate } = useListView();
  return (
    <>
      <KTCard>
        <ExtrasTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <ExtraEditModal />}
    </>
  );
};

const ExtrasListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <ToolbarWrapper />
        <Content>
          <DndProvider backend={HTML5Backend}>
            <ExtrasList />
          </DndProvider>
        </Content>
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
);

export { ExtrasListWrapper };
