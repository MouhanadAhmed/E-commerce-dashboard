import {useQuery} from 'react-query'
import {useListView} from '../core/ListViewProvider'
import {getSubCategoryById} from '../core/_requests'
import { QUERIES, isNotEmpty } from '../../../../../../../../_metronic/helpers'
import { SubCategoryEditModalForm } from './SubCategoryEditModalForm'

const SubCategoryEditModalFormWrapper = () => {
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
  const {
    isLoading,
    data: category,
    error,
  } = useQuery(
    `${QUERIES.CATEGORIES_LIST}-category-${itemIdForUpdate}`,
    () => {
      return getSubCategoryById(itemIdForUpdate)
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
    return <SubCategoryEditModalForm isSubCategoryLoading={isLoading} subCategory={{_id: undefined, available:true}} />
  }

  if (!isLoading && !error && category) {
    return <SubCategoryEditModalForm isSubCategoryLoading={isLoading} subCategory={category} />
  }

  return null
}

export {SubCategoryEditModalFormWrapper}
