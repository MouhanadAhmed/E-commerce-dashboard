import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {SubCategoryEditModal} from './subCategory-edit-modal/SubCategoryEditModal'
import { KTCard } from '../../../../../../../_metronic/helpers'
import { ToolbarWrapper } from '../../../../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../../../../_metronic/layout/components/content'
import { SubCategoriesListHeader } from './components/header/SubCategoriesListHeader'
import { SubCategoriesTable } from './table/SubCategoriesTable'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
const SubCategoriesList = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <KTCard>
        <SubCategoriesListHeader />
        <SubCategoriesTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <SubCategoryEditModal />}
    </>
  )
}

const SubCategoriesListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <ToolbarWrapper />
        <Content>
        <DndProvider backend={HTML5Backend}>
          <SubCategoriesList />
          </DndProvider>
        </Content>
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {SubCategoriesListWrapper}
