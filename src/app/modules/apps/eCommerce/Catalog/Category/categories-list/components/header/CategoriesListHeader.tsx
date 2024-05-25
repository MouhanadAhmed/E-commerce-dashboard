import {useListView} from '../../core/ListViewProvider'
import {CategoriesListToolbar} from './CategoriesListToolbar'
import {UsersListGrouping} from './UsersListGrouping'
import {CategoriesListSearchComponent} from './CategoriesListSearchComponent'

const CategoriesListHeader = () => {
  const {selected} = useListView()
  return (
    <div className='card-header border-0 pt-6'>
      <CategoriesListSearchComponent />
      {/* begin::Card toolbar */}
      <div className='card-toolbar'>
        {/* begin::Group actions */}
        {selected.length > 0 ? <UsersListGrouping /> : <CategoriesListToolbar />}
        {/* end::Group actions */}
      </div>
      {/* end::Card toolbar */}
    </div>
  )
}

export {CategoriesListHeader}
