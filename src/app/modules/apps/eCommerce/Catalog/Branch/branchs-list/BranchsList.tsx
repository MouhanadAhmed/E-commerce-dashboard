import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {CategoryEditModal} from './branch-edit-modal/CategoryEditModal'
import { KTCard } from '../../../../../../../_metronic/helpers'
import { ToolbarWrapper } from '../../../../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../../../../_metronic/layout/components/content'
import { BranchsListHeader } from './components/header/BranchsListHeader'
import { BranchsTable } from './table/BranchsTable'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
const BranchsList = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <KTCard>
        <BranchsListHeader />
        <BranchsTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <CategoryEditModal />}
    </>
  )
}

const BranchsListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <ToolbarWrapper />
        <Content>
        <DndProvider backend={HTML5Backend}>
          <BranchsList />
          </DndProvider>
        </Content>
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {BranchsListWrapper}
