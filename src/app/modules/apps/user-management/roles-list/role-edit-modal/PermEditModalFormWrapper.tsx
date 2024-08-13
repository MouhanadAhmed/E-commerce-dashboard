import {useQuery} from 'react-query'
import {PermEditModalForm} from './PermEditModalForm'
import {isNotEmpty, QUERIES} from '../../../../../../_metronic/helpers'
import {useListView} from '../core/ListViewProvider'
import {getRoleById} from '../core/_requests'

const PermEditModalFormWrapper = () => {
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
  const {
    isLoading,
    data: user,
    error,
  } = useQuery(
    `${QUERIES.ROLES_LIST}-role-${itemIdForUpdate}`,
    () => {
      return getRoleById(itemIdForUpdate)
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
    return <PermEditModalForm isUserLoading={isLoading}  />
  }

  if (!isLoading && !error && user) {
    return <PermEditModalForm isUserLoading={isLoading} Role={user} />
  }

  return null
}

export {PermEditModalFormWrapper}
