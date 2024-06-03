import {Column} from 'react-table'
import {CategoryNameCell} from './CategoryNameCell'
import {UserActionsCell} from './CategoryActionsCell'
import {UserSelectionCell} from './UserSelectionCell'
import {CategoryCustomHeader} from './CategoryCustomHeader'
import {UserSelectionHeader} from './UserSelectionHeader'
import {Categories} from '../../core/_models'
import { CategoryDescCell } from './CategoryDescCell'
import { CategoryOrderCell } from './CategoryOrderCell'
import { CategoryAvailableCell } from './CategoryAvailableCell'
import { CategoryReOrderCell } from './CategoryReOrderCell'
import { CategoryInfoCell } from './CategoryInfoCell'

          
const usersColumns: ReadonlyArray<Column<Categories>> = [
  {
    Header: (props) => <UserSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({...props}) => <UserSelectionCell id={props.data[props.row.index]._id} />,
  },
  {
    Header: (props) => <CategoryCustomHeader tableProps={props} title='reOrder' name='reOrder' className='min-w-25px ' />,
    id: 'reOrder',
    Cell: () => <CategoryReOrderCell  />,
  },
  {
    Header: (props) => <CategoryCustomHeader tableProps={props} title='Name' name="name" className='min-w-100px' />,
    id: 'name',
    
    Cell: ({...props}) => <CategoryInfoCell   categories={props.data[props.row.index]} />,
  },
  {
    Header: (props) => <CategoryCustomHeader tableProps={props} title='order' name='order' className='min-w-25px ' />,
    id: 'order',
    Cell: ({...props}) => <CategoryOrderCell order={props.data[props.row.index].order} />,
  },
  {
    Header: (props) => (
      <CategoryCustomHeader tableProps={props} title='description' name='description' className='min-w-125px' />
    ),
    id: 'description',
    Cell: ({...props}) => <CategoryDescCell description={props.data[props.row.index].description} />,
  },
  // {
  //   Header: (props) => (
  //     <CategoryCustomHeader tableProps={props} title='updatedAt' className='min-w-125px' />
  //   ),
  //   id: 'updatedAt',
  //   Cell: ({...props}) => <UserLastLoginCell updatedAt={props.data[props.row.index].updatedAt} />,
  // },
  // {
  //   Header: (props) => (
  //     <CategoryCustomHeader tableProps={props} title='Joined day' className='min-w-125px' />
  //   ),
  //   accessor: 'joined_day',
  // },
  {
    Header: (props) => (
      <CategoryCustomHeader tableProps={props} title='Actions' name='Actions' className='text-center  min-w-100px' />
    ),
    id: 'actions',
    Cell: ({...props}) => <UserActionsCell id={props.data[props.row.index]._id} available={props.data[props.row.index].available} />,
  },
  {
    Header: (props) => (
      <CategoryCustomHeader tableProps={props} title='available'name='available' className='text-center  min-w-100px' />
    ),
    id: 'available',
    Cell: ({...props}) => <CategoryAvailableCell id={props.data[props.row.index]._id} available={props.data[props.row.index].available} />,
  },
]

export {usersColumns}
