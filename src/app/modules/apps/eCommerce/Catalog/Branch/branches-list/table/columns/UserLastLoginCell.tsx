import {FC} from 'react'

type Props = {
  updatedAt: Date
}

const UserLastLoginCell: FC<Props> = ({updatedAt}) => (
  <div className='badge badge-light fw-bolder'>{updatedAt}</div>
)

export {UserLastLoginCell}
