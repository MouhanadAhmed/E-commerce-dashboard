import {useQuery} from 'react-query'
import {useListView} from '../core/ListViewProvider'
import {getBranchById} from '../core/_requests'
import { QUERIES, isNotEmpty } from '../../../../../../../../_metronic/helpers'
import { BranchEditModalForm } from './BranchEditModalForm'

const BranchEditModalFormWrapper = () => {
  const {itemIdForUpdate, setItemIdForUpdate} = useListView()
  const enabledQuery: boolean = isNotEmpty(itemIdForUpdate)
  const {
    isLoading,
    data: branch,
    error,
  } = useQuery(
    `${QUERIES.BRNACHES_LIST}-branch-${itemIdForUpdate}`,
    () => {
      return getBranchById(itemIdForUpdate as string)
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
    return <BranchEditModalForm isBranchLoading={isLoading} branch={{ name:""}} />
  }

  if (!isLoading && !error && branch) {
    return <BranchEditModalForm isBranchLoading={isLoading} branch={branch} />
  }

  return null
}

export {BranchEditModalFormWrapper}
