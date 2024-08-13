import {Column} from 'react-table'
import {UserInfoCell} from './UserInfoCell'
// import {UserLastLoginCell} from './UserLastLoginCell'
import {UserPhoneCell, UserTwoStepsCell} from './UserPhoneCell'
import {UserActionsCell} from './UserActionsCell'
import {UserSelectionCell} from './UserSelectionCell'
import {UserCustomHeader} from './UserCustomHeader'
import {UserSelectionHeader} from './UserSelectionHeader'
import {Role} from '../../core/_models'
import { UserCreatedAtCell } from './UserCreatedAtCell '

const usersColumns: ReadonlyArray<Column<Role>> = [
  // {
  //   Header: (props) => <UserSelectionHeader tableProps={props} />,
  //   id: 'selection',
  //   Cell: ({...props}) => <UserSelectionCell id={props.data[props.row.index]._id} />,
  // },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Name' className='min-w-125px' />,
    id: 'name',
    Cell: ({...props}) => <UserInfoCell Role={props.data[props.row.index].name} />,
  },
  // {
  //   Header: (props) => <UserCustomHeader tableProps={props} title='Role' className='min-w-125px' />,
  //   accessor: 'role',
  // },
  // {
  //   Header: (props) => (
  //     <UserCustomHeader tableProps={props} title='Last login' className='min-w-125px' />
  //   ),
  //   id: 'lastLogin',
  //   Cell: ({...props}) => <UserLastLoginCell lastLogin={props.data[props.row.index].lastLogin} />,
  // },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Permissions' className='min-w-125px' />
    ),
    id: 'perm',
    Cell: ({...props}) => <UserPhoneCell phone={props.data[props.row.index].permissions} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='available' className='min-w-125px' />,
    id: 'Archived',
    Cell: ({...props}) => <UserInfoCell Role={props.data[props.row.index].deleted ==true?<span className="badge  badge-success">true</span>:<span className="badge  badge-danger">false</span>} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Created date' className='min-w-125px' />
    ),
    id: 'createdAt',
    Cell: ({...props}) => <UserCreatedAtCell last_login={new Date(props.data[props.row.index].createdAt).toLocaleString('en-GB', {day:'numeric', month: 'long', year:'numeric'})} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Actions' className='text-end min-w-100px' />
    ),
    id: 'actions',
    Cell: ({...props}) => <UserActionsCell id={props.data[props.row.index]._id} />,
  },
]

export {usersColumns}
