import {FC} from 'react'
import { SortableHandle } from 'react-sortable-hoc'



const DragHandle = SortableHandle(() => <span className="drag-handle-icon">☰</span>); 
const CategoryReOrderCell: FC = () => (
<DragHandle />
)

export {CategoryReOrderCell}
