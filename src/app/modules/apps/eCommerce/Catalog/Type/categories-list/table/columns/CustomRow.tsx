import clsx from 'clsx';
import { FC, useEffect, useRef, useState, useCallback } from 'react';
import { Row } from 'react-table';
import { Categories } from '../../core/_models';
import { useMutation, useQueryClient } from 'react-query';
import { useQueryResponse } from '../../core/QueryResponseProvider';
import { updateCategory, updateCategoryOrder } from '../../core/_requests';
import { QUERIES } from '../../../../../../../../../_metronic/helpers';
import { SortableContainer, SortableElement, SortEnd } from 'react-sortable-hoc';
import { arrayMoveImmutable as arrayMove } from 'array-move';

type Props = {
  row: Row<Categories>;
}

const CustomRow: FC<Props> = ({ row }) => {
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Categories>>({});
  const [rows, setRows] = useState<Row<Categories>[]>([row]); // Initialize rows state with the provided row

  const exceptionIds = ['selection', "reOrder", 'actions', 'available', 'edit', 'delete', undefined];
  const rowRef = useRef<HTMLTableRowElement>(null);
  const { query } = useQueryResponse();
  const queryClient = useQueryClient();

  const handleEditClick = (rowId: string, columnId: string): void => {
    if (exceptionIds.includes(columnId)) {
      return;
    }
    setEditRowId(rowId);
    setEditFormData(row.original);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    console.log("name",name,'value',value )
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const removeUnwantedKeys = (data: Partial<Categories>) => {
    const keysToRemove = ["_id", "slug", "deleted", "createdAt", "updatedAt", "__v", "branch"];
    const cleanData: Partial<Categories> = { ...data };
    keysToRemove.forEach(key => {
      delete cleanData[key as keyof Partial<Categories>];
    });
    return cleanData;
  };

  const updateItem = useMutation(
    (data: { id: string, updatedData: Partial<Categories> }) => updateCategory(data.id, data.updatedData), {
      onSuccess: () => {
        queryClient.invalidateQueries([`${QUERIES.CATEGORIES_LIST}-${query}`]);
      },
    }
  );

  const handleClickOutside = useCallback(async (event: MouseEvent) => {
    if (rowRef.current && !rowRef.current.contains(event.target as Node)) {
      setEditRowId(null);
      const cleanedData = removeUnwantedKeys(editFormData);
      await updateItem.mutateAsync({ id: editFormData._id as string, updatedData: cleanedData });
    }
  }, [editFormData, updateItem]);

  useEffect(() => {
    if (editRowId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editRowId, handleClickOutside]);

  const SortableItem = SortableElement(({ row }: { row: Row<Categories> }) => (
    <tr
      {...row.getRowProps()}
      ref={rowRef}
      id={row.original._id}
      onClick={(e) => { handleEditClick(row.original._id, (e.target as HTMLElement).dataset.columnId as string) }}
    >
      {row.cells.map((cell) => (
        <td
          {...cell.getCellProps()}
          className={clsx({ 'text-end min-w-100px text-center': cell.column.id === 'actions' }) + clsx({ 'min-w-25px px-8': cell.column.id === 'order' })}
          data-column-id={cell.column.id}
        >
          {editRowId === row.original._id && !exceptionIds.includes(cell.column.id) ? (
            <input
              type="text"
              name={cell.column.id}
              defaultValue={editFormData[cell.column.id as keyof Categories] as string || ''}
              onBlurCapture={handleInputChange}
              // onChange={handleInputChange}
              className='text-end w-50px text-center'
            />
          ) : (
            cell.render('Cell')
          )}
        </td>
      ))}
    </tr>
  ));

  const SortableList = SortableContainer(({ items }: { items: Row<Categories>[] }) => (
    <>
    
      {items.map((item, index) => (
        <SortableItem key={`item-${item.original._id}`} index={index} row={item} className='w-100' />
      ))}
    </>
  ));

  const updateOrderMutation = useMutation(
    ({ id, newOrder }: { id: string, newOrder: number }) => updateCategoryOrder(id, newOrder),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([`${QUERIES.CATEGORIES_LIST}-${query}`]);
      },
    }
  );

  const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    const newRows = arrayMove(rows, oldIndex, newIndex);
    setRows(newRows);

    // Update the order for the dragged category only
    const movedRow = newRows[newIndex];
    updateOrderMutation.mutate({ id: movedRow.original._id, newOrder: newIndex + 1 });
  };

  return (
    
    <SortableList items={rows} onSortEnd={onSortEnd} useDragHandle  />
  );
}

export { CustomRow };
