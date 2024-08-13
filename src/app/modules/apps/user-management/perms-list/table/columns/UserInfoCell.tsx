
import {FC} from 'react'
import {Permission} from '../../core/_models'

type Props = {
  Permission: Permission
}

const UserInfoCell: FC<Props> = ({Permission}) => (
  <div className='d-flex align-items-center'>
    {/* begin:: Avatar */}
    {/* <div className='symbol symbol-circle symbol-50px overflow-hidden me-3'>
      <a href='#'>
        {Permission.profilePic ? (
          <div className='symbol-label'>
            <img src={toAbsoluteUrl(`media/${Permission.profilePic}`)} alt={Permission.name} className='w-100' />
          </div>
        ) : (
          <div
            className={clsx(
              'symbol-label fs-3',
              `bg-light-100`,
              `text-danger`
            )}
          >
            {Permission?.name[0]?.toUpperCase()}
          </div>
        )}
      </a>
    </div> */}
    <div className='d-flex flex-column'>
      {/* <a href='#' className='text-gray-800 text-hover-primary mb-1'> */}
        {Permission.name}
      {/* </a> */}
    </div>
  </div>
)

export {UserInfoCell}
