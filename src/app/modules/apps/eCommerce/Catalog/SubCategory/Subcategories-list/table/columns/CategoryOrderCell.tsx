import {FC} from 'react'

type Props = {
  order?: number
}

const CategoryOrderCell: FC<Props> = ({order}) => (
  <> {order}</>
)

export {CategoryOrderCell}
