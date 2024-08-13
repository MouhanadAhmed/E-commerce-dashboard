import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {UsersListHeader} from './components/header/UsersListHeader'
import {RolesTable} from './table/RolesTable'
import {PermEditModal} from './role-edit-modal/PermEditModal'
import {KTCard, KTCardBody} from '../../../../../_metronic/helpers'
import { ToolbarWrapper } from '../../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../../_metronic/layout/components/content'

const RolesList = () => {
  const {itemIdForUpdate} = useListView()
  return (
    <>
      <KTCard>
        <UsersListHeader />
        <RolesTable />
      </KTCard>
      {/* <KTCard>
        <KTCardBody>
          Role
        </KTCardBody>
      </KTCard> */}
      {itemIdForUpdate !== undefined && <PermEditModal />}
    </>
  )
}

const RolesListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <ToolbarWrapper />
        <Content>
          <RolesList />
        </Content>
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {RolesListWrapper}
