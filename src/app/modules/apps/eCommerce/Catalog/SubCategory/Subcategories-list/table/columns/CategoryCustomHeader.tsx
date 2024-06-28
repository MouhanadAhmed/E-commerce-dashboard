import clsx from 'clsx'
import {FC, PropsWithChildren, useMemo} from 'react'
import {HeaderProps} from 'react-table'
import {useQueryRequest} from '../../core/QueryRequestProvider'
import { Categories } from '../../core/_models'
import { initialQueryState } from '../../../../../../../../../_metronic/helpers'

type Props = {
  className?: string
  title?: string
  tableProps: PropsWithChildren<HeaderProps<Categories>>
  name: string;
}
const CategoryCustomHeader: FC<Props> = ({className, title, tableProps}) => {
  const id = tableProps.column.id
  const {state, updateState} = useQueryRequest()

  const isSelectedForSorting = useMemo(() => {
    return state.sort && state.sort === id
  }, [state, id])
  const order: 'asc' | 'desc' | undefined = useMemo(() => state.order, [state])

  const sortColumn = () => {
    // avoid sorting for these columns
    if (id === 'actions' || id === 'selection') {
      return
    }
    
    if (!isSelectedForSorting) {
      // enable sort asc
      updateState({sort: id, order: 'asc', ...initialQueryState})
      return
    }

    if (isSelectedForSorting && order !== undefined) {
      if (order === 'asc') {
        // enable sort desc
        updateState({sort: id, order: 'desc', ...initialQueryState})
        return
      }

      // disable sort
      updateState({sort: undefined, order: undefined, ...initialQueryState})
    }
  }

  return (
    <th
      {...tableProps.column.getHeaderProps()}
      className={clsx(
        className,
        isSelectedForSorting && order !== undefined && `table-sort-${order}`
      )}
      style={{cursor: 'pointer'}}
      onClick={sortColumn}
    >
      {title}
    </th>
  )
}

export {CategoryCustomHeader}