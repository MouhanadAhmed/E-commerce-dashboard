import { Column } from "react-table";
import { UserInfoCell } from "./UserInfoCell";
// import {UserLastLoginCell} from './UserLastLoginCell'
// import {UserPhoneCell, UserTwoStepsCell} from './UserPhoneCell'
import { UserActionsCell } from "./UserActionsCell";
import { UserSelectionCell } from "./UserSelectionCell";
import { UserCustomHeader } from "./UserCustomHeader";
import { UserSelectionHeader } from "./UserSelectionHeader";
import { Permission } from "../../core/_models";
import { UserCreatedAtCell } from "./UserCreatedAtCell ";

const usersColumns: ReadonlyArray<Column<Permission>> = [
  // {
  //   Header: (props) => <UserSelectionHeader tableProps={props} />,
  //   id: 'selection',
  //   Cell: ({...props}) => <UserSelectionCell id={props.data[props.row.index]._id} />,
  // },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="Name"
        className="min-w-125px"
      />
    ),
    id: "name",
    Cell: ({ ...props }) => (
      <UserInfoCell Permission={props.data[props.row.index]} />
    ),
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
  // {
  //   Header: (props) => (
  //     <UserCustomHeader tableProps={props} title='Phone' className='min-w-125px' />
  //   ),
  //   id: 'phone',
  //   Cell: ({...props}) => <UserPhoneCell phone={props.data[props.row.index].phone} />,
  // },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="Created date"
        className="min-w-125px"
      />
    ),
    id: "createdAt",
    Cell: ({ ...props }) => (
      <UserCreatedAtCell
        last_login={new Date(
          props.data[props.row.index].createdAt,
        ).toLocaleString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      />
    ),
  },
  {
    Header: (props) => (
      <UserCustomHeader
        tableProps={props}
        title="Actions"
        className="text-end min-w-100px"
      />
    ),
    id: "actions",
    Cell: ({ ...props }) => (
      <UserActionsCell id={props.data[props.row.index]._id} />
    ),
  },
];

export { usersColumns };
