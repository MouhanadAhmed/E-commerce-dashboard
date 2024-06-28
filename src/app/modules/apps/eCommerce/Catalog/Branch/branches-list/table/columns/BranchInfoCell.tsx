
import clsx from 'clsx'
import {FC} from 'react'

type Props ={
  branch:{

    imgCover?:string,
    name:string
  }
}


const BranchInfoCell: FC<Props> = ({branch}) => (
  <div className='d-flex align-items-center'>
    {/* begin:: Avatar */}
    <div className='symbol symbol-circle symbol-50px overflow-hidden me-3'>
      <a href='#'>
        {branch?.imgCover ? (
          <div className='symbol-label'>
            <img src={branch?.imgCover} alt={branch.name} className='w-100' />
          </div>
        ) : (
          <div
            className={clsx(
              'symbol-label fs-3',
              // `bg-light-${user.initials?.state}`,
              // `text-${user.initials?.state}`
            )}
          >
            {/* {branch?.branch.name} */}
          </div>
        )}
      </a>
    </div>
        {/* {console.log("UserInfoCell => Branch",branch)} */}
    <div className='d-flex flex-column'>
      <a href='#' className='text-gray-800 text-hover-primary mb-1'>
        {branch.name}

      </a>
      {/* <span>{branch?.branch.name}</span> */}
    </div>
  </div>
)

export {BranchInfoCell}
