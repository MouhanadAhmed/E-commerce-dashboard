import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import { QueryRequestProvider as BranchRequest } from '../../Branch/branches-list/core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import { QueryResponseProvider as BranchQuery } from '../../Branch/branches-list/core/QueryResponseProvider'
import {CategoryEditModal} from './category-edit-modal/CategoryEditModal'
import { KTCard } from '../../../../../../../_metronic/helpers'
import { ToolbarWrapper } from '../../../../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../../../../_metronic/layout/components/content'
import { CategoriesListHeader } from './components/header/CategoriesListHeader'
import { CategoriesTable } from './table/CategoriesTable'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
const CategoriesList = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <KTCard>
        {/* <CategoriesListHeader /> */}
        <CategoriesTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <CategoryEditModal />}
    </>
  )
}

const CategoriesListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <BranchRequest>
      <BranchQuery>
      
      <ListViewProvider>
        <ToolbarWrapper />
        <DndProvider backend={HTML5Backend}>
        <Content>
          <CategoriesList />
        </Content>
          </DndProvider>
      </ListViewProvider>
      </BranchQuery>
      </BranchRequest>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {CategoriesListWrapper}
