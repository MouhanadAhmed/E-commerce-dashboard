import {FC} from 'react'

type Props = {
  description?: string
}

const CategoryDescCell: FC<Props> = ({description}) => (
  <> {description}</>
)

export {CategoryDescCell}
