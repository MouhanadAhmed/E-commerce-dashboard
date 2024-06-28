import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {CategoryEditModal} from './category-edit-modal/CategoryEditModal'
import { KTCard } from '../../../../../../../_metronic/helpers'
import { ToolbarWrapper } from '../../../../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../../../../_metronic/layout/components/content'
// import { CategoriesListHeader } from './components/header/CategoriesListHeader'
import { ExtrasTable } from './table/ExtrasTable'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
const ExtrasList = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <KTCard>
        {/* <CategoriesListHeader /> */}
        <ExtrasTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <CategoryEditModal />}
    </>
  )
}

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
)

export {ExtrasListWrapper}
