import {useQuery} from 'react-query'
import {useListView} from '../core/ListViewProvider'
import {getCategoryById} from '../core/_requests'
import { QUERIES, isNotEmpty } from '../../../../../../../../_metronic/helpers'
import { BranchEditModalForm } from './BranchEditModalForm'

const BranchEditModalFormWrapper = () => {
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
  const {
    isLoading,
    data: category,
    error,
  } = useQuery(
    `${QUERIES.CATEGORIES_LIST}-category-${itemIdForUpdate}`,
    () => {
      return getCategoryById(itemIdForUpdate)
    },
    {
      cacheTime: 0,
      enabled: enabledQuery,
      onError: (err) => {
        setItemIdForUpdate(undefined)
        console.error(err)
      },
    }
  )

  if (!itemIdForUpdate) {
    return <BranchEditModalForm isCategoryLoading={isLoading} category={{_id: undefined, available:true}} />
  }

  if (!isLoading && !error && category) {
    return <BranchEditModalForm isCategoryLoading={isLoading} category={category} />
  }

  return null
}

export {BranchEditModalFormWrapper}
