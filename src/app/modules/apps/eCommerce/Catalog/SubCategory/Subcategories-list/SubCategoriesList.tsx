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
import { QueryRequestProvider as BranchRequest } from '../../Branch/branches-list/core/QueryRequestProvider'
import { QueryResponseProvider as BranchQuery } from '../../Branch/branches-list/core/QueryResponseProvider'
import { QueryResponseProvider  as CategoryQuery} from '../../Category/categories-list/core/QueryResponseProvider'
import { QueryRequestProvider  as CategoryRequest } from '../../Category/categories-list/core/QueryRequestProvider'
const SubCategoriesList = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <KTCard>
        {/* <SubCategoriesListHeader /> */}
        <SubCategoriesTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <SubCategoryEditModal />}
    </>
  )
}

const SubCategoriesListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
    <BranchRequest>
    <BranchQuery>
    <CategoryRequest>
    <CategoryQuery>
    
      <ListViewProvider>
        <ToolbarWrapper />
        <Content>
        <DndProvider backend={HTML5Backend}>
          <SubCategoriesList />
          </DndProvider>
        </Content>
      </ListViewProvider>
    </CategoryQuery>
    </CategoryRequest>
    </BranchQuery>
    </BranchRequest>

    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {SubCategoriesListWrapper}
