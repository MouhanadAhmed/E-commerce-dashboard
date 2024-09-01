import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {CategoryEditModal} from './order-edit-modal/CategoryEditModal'
// import { CategoriesListHeader } from './components/header/CategoriesListHeader'
import { OrdersTable } from './table/OrdersTable'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { KTCard } from '../../../../../../../../_metronic/helpers'
import { ToolbarWrapper } from '../../../../../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../../../../../_metronic/layout/components/content'
const OrdersList = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <KTCard>
        {/* <CategoriesListHeader /> */}
        <OrdersTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <CategoryEditModal />}
    </>
  )
}

const OrdersListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <ToolbarWrapper />
        <Content>
        <DndProvider backend={HTML5Backend}>
          <OrdersList />
          </DndProvider>
        </Content>
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {OrdersListWrapper}
