import {useListView} from '../../core/ListViewProvider'
import {BranchsListToolbar} from './BranchsListToolbar'
import {UsersListGrouping} from './UsersListGrouping'
import {BranchsListSearchComponent} from './BranchsListSearchComponent'

const BranchsListHeader = () => {
  const {selected} = useListView()
  return (
    <div className='card-header border-0 pt-6'>
      <BranchsListSearchComponent />
      {/* begin::Card toolbar */}
      <div className='card-toolbar'>
        {/* begin::Group actions */}
        {selected.length > 0 ? <UsersListGrouping /> : <BranchsListToolbar />}
        {/* end::Group actions */}
      </div>
      {/* end::Card toolbar */}
    </div>
  )
}

export {BranchsListHeader}
