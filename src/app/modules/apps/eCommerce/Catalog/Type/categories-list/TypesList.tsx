import { ListViewProvider, useListView } from "./core/ListViewProvider";
import { QueryRequestProvider } from "./core/QueryRequestProvider";
import { QueryResponseProvider } from "./core/QueryResponseProvider";
import { CategoryEditModal } from "./category-edit-modal/CategoryEditModal";
import { KTCard } from "../../../../../../../_metronic/helpers";
import { ToolbarWrapper } from "../../../../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../../../../_metronic/layout/components/content";
// import { CategoriesListHeader } from './components/header/CategoriesListHeader'
import { TypesTable } from "./table/TypesTable";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
const TypesList = () => {
  const { itemIdForUpdate } = useListView();
  return (
    <>
      <KTCard>
        {/* <CategoriesListHeader /> */}
        <TypesTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <CategoryEditModal />}
    </>
  );
};

const TypesListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <ToolbarWrapper />
        <Content>
          <DndProvider backend={HTML5Backend}>
            <TypesList />
          </DndProvider>
        </Content>
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
);

export { TypesListWrapper };
