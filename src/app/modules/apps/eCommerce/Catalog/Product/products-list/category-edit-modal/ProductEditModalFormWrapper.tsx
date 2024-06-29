import {useQuery} from 'react-query'
import {useListView} from '../core/ListViewProvider'
import {getProductById} from '../core/_requests'
import { QUERIES, isNotEmpty } from '../../../../../../../../_metronic/helpers'
import { ProductEditModalForm } from './ProductEditModalForm'

const ProductEditModalFormWrapper = () => {
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
  const {
    isLoading,
    data: category,
    error,
  } = useQuery(
    `${QUERIES.PRODUCTS_LIST}-product-${itemIdForUpdate}`,
    () => {
      return getProductById(itemIdForUpdate)
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
    return <ProductEditModalForm isCategoryLoading={isLoading} category={{_id: undefined, available:true}} />
  }

  if (!isLoading && !error && category) {
    return <ProductEditModalForm isCategoryLoading={isLoading} category={category} />
  }

  return null
}

export {ProductEditModalFormWrapper}
