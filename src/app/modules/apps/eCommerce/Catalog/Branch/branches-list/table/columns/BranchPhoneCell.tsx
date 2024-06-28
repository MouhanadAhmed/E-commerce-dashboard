import {FC} from 'react'

type Props = {
  phone?: [string] | undefined
}

const BranchPhoneCell: FC<Props> = ({phone}) => (
  <> {phone}</>
)

export {BranchPhoneCell}
