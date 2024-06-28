import {FC} from 'react'

type Props = {
  workingHours?: string
}

const BranchWorkingHoursCell: FC<Props> = ({workingHours}) => (
  <> {workingHours}</>
)

export {BranchWorkingHoursCell}
