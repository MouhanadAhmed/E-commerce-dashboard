
import clsx from 'clsx'
import {FC} from 'react'
import {Categories} from '../../core/_models'
import { toAbsoluteUrl } from '../../../../../../../../../_metronic/helpers'

type Props = {
  Categories: Categories
}

const CategoryInfoCell: FC<Props> = ({Categories}) => (
  <div className='d-flex align-items-center'>
    {/* begin:: Avatar */}
    <div className='symbol symbol-circle symbol-50px overflow-hidden me-3'>
      <a href='#'>
        {/* {category.imgCover ? (
          <div className='symbol-label'>
            <img src={toAbsoluteUrl(`media/${category.imgCover}`)} alt={category.name} className='w-100' />
          </div>
        ) : (
          <div
            className={clsx(
              'symbol-label fs-3',
              `bg-light-${category.available}`,
              `text-${category.available}`
            )}
          >
            {category.available}
          </div>
        )} */}
      </a>
    </div>
        {console.log("UserInfoCell => Categories",Categories)}
    <div className='d-flex flex-column'>
      <a href='#' className='text-gray-800 text-hover-primary mb-1'>
        {Categories?.name}

      </a>
      {/* <span>{Categories?.description}</span> */}
    </div>
  </div>
)

export {CategoryInfoCell}
