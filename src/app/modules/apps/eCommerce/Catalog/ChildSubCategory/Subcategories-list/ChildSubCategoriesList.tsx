import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {SubCategoryEditModal} from './subCategory-edit-modal/SubCategoryEditModal'
import { KTCard } from '../../../../../../../_metronic/helpers'
import { ToolbarWrapper } from '../../../../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../../../../_metronic/layout/components/content'
import { ChildSubCategoriesListHeader } from './components/header/ChildSubCategoriesListHeader'
import { ChildSubCategoriesTable } from './table/ChildSubCategoriesTable'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
const ChildSubCategoriesList = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <KTCard>
        <ChildSubCategoriesListHeader />
        <ChildSubCategoriesTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <SubCategoryEditModal />}
    </>
  )
}

const ChildSubCategoriesListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <ToolbarWrapper />
        <Content>
        <DndProvider backend={HTML5Backend}>
          <ChildSubCategoriesList />
          </DndProvider>
        </Content>
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {ChildSubCategoriesListWrapper}
