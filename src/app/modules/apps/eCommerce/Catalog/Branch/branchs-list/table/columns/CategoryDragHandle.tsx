import { Sortable } from "@dnd-kit/sortable";
import { FC } from "react";



 const DragHandle: FC = () => (
    <Sortable>
      {({ attributes, listeners }) => (
        <span
          {...attributes}
          {...listeners}
          className="drag-handle-icon cursor-pointer"
        >
          ☰
        </span>
      )}
    </Sortable>
  );
  export {DragHandle}