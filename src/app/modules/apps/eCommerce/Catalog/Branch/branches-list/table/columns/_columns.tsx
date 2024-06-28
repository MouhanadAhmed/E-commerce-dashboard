import {Column} from 'react-table'
import {BranchActionsCell} from './BranchActionsCell'
import {UserSelectionCell} from './UserSelectionCell'
import {BranchCustomHeader} from './BranchCustomHeader'
import {UserSelectionHeader} from './UserSelectionHeader'
import {Branch} from '../../core/_models'
import { BranchPhoneCell } from './BranchPhoneCell'
import {  BranchWorkingHoursCell } from './BranchWorkingHoursCell'
import { BranchAvailableCell } from './BranchAvailableCell'
import { BranchInfoCell } from './BranchInfoCell'

          
const usersColumns: ReadonlyArray<Column<Branch>> = [
  {
    Header: (props) => <UserSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({...props}) => <UserSelectionCell id={props.data[props.row.index]._id} />,
  },
  {
    Header: (props) => <BranchCustomHeader tableProps={props} title='Name' name="name" className='min-w-125px' />,
    id: 'name',
    
    Cell: ({...props}) => <BranchInfoCell   branch={props.data[props.row.index]} />,
  },
  {
    Header: (props) => <BranchCustomHeader tableProps={props} title='workingHours' name='workingHours' className='min-w-25px ' />,
    id: 'workingHours',
    Cell: ({...props}) => <BranchWorkingHoursCell workingHours={props.data[props.row.index].workingHours} />,
  },
  {
    Header: (props) => (
      <BranchCustomHeader tableProps={props} title='phone' name='phone' className='min-w-125px' />
    ),
    id: 'phone',
    Cell: ({...props}) => <BranchPhoneCell phone={props.data[props.row.index].phone} />,
  },
  // {
  //   Header: (props) => (
  //     <BranchCustomHeader tableProps={props} title='updatedAt' className='min-w-125px' />
  //   ),
  //   id: 'updatedAt',
  //   Cell: ({...props}) => <UserLastLoginCell updatedAt={props.data[props.row.index].updatedAt} />,
  // },
  // {
  //   Header: (props) => (
  //     <BranchCustomHeader tableProps={props} title='Joined day' className='min-w-125px' />
  //   ),
  //   accessor: 'joined_day',
  // },
  {
    Header: (props) => (
      <BranchCustomHeader tableProps={props} title='Actions' name='Actions' className='text-center  min-w-100px' />
    ),
    id: 'actions',
    Cell: ({...props}) => <BranchActionsCell id={props.data[props.row.index]._id}  />,
  },
  {
    Header: (props) => (
      <BranchCustomHeader tableProps={props} title='available'name='available' className='text-center  min-w-100px' />
    ),
    id: 'available',
    Cell: ({...props}) => <BranchAvailableCell id={props.data[props.row.index]._id} deleted={props.data[props.row.index].deleted} />,
  },
]

export {usersColumns}
