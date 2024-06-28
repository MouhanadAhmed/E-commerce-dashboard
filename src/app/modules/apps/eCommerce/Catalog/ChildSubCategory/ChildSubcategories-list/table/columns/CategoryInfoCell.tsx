
import clsx from 'clsx'
import {FC} from 'react'
import {SubCategories} from '../../core/_models'
import { toAbsoluteUrl } from '../../../../../../../../../_metronic/helpers'

type Props = {
  categories:SubCategories
}

const CategoryInfoCell: FC<SubCategories> = (categories) => (
  <div className='d-flex align-items-center'>
    {/* begin:: Avatar */}
    <div className='symbol symbol-circle symbol-50px overflow-hidden me-3'>
      <a href='#'>
        {categories.categories.imgCover ? (
          <div className='symbol-label'>
            <img src={categories?.categories.imgCover} alt={categories.categories.name} className='w-100' />
          </div>
        ) : (
          <div
            className={clsx(
              'symbol-label fs-3',
              // `bg-light-${user.initials?.state}`,
              // `text-${user.initials?.state}`
            )}
          >
            {/* {categories?.categories.name} */}
          </div>
        )}
      </a>
    </div>
        {console.log("UserInfoCell => SubCategories",categories)}
    <div className='d-flex flex-column'>
      <a href='#' className='text-gray-800 text-hover-primary mb-1'>
        {categories?.categories.name}

      </a>
      {/* <span>{categories?.categories.name}</span> */}
    </div>
  </div>
)

export {CategoryInfoCell}
