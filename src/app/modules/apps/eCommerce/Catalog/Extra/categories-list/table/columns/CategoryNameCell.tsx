import {FC} from 'react'

type Props = {
  name?: string
}

const CategoryNameCell: FC<Props> = ({name}) => (
  <> {name}</>
)

export {CategoryNameCell}
