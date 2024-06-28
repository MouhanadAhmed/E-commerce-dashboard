import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {ChildSubCategoryEditModal} from './childSubCategory-edit-modal/ChildSubCategoryEditModal'
import { KTCard } from '../../../../../../../_metronic/helpers'
import { ToolbarWrapper } from '../../../../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../../../../_metronic/layout/components/content'
import { ChildSubCategoriesListHeader } from './components/header/ChildSubCategoriesListHeader'
import { ChildSubCategoriesTable } from './table/ChildSubCategoriesTable'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { QueryRequestProvider as BranchRequest } from '../../Branch/branches-list/core/QueryRequestProvider'
import { QueryResponseProvider as BranchQuery } from '../../Branch/branches-list/core/QueryResponseProvider'
const ChildSubCategoriesList = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <KTCard>
        {/* <ChildSubCategoriesListHeader /> */}
        <ChildSubCategoriesTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <ChildSubCategoryEditModal />}
    </>
  )
}

const ChildSubCategoriesListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <BranchRequest>
      <BranchQuery>

      <ListViewProvider>
        <ToolbarWrapper />
        <Content>
        <DndProvider backend={HTML5Backend}>
          <ChildSubCategoriesList />
          </DndProvider>
        </Content>
      </ListViewProvider>
      </BranchQuery>
      </BranchRequest>

    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {ChildSubCategoriesListWrapper}
