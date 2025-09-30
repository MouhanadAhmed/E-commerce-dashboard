import { useEffect, useMemo, useState } from 'react';
import {useQueryResponseData} from '../core/QueryResponseProvider'
import { GroupOfOptions } from '../core/_models'
import {
  type MRT_TableOptions,
  type MRT_ColumnDef,
  type MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Box, Typography, Button, IconButton, Tooltip } from '@mui/material';
import { deleteGroup, deleteSelectedGroups, updateGroup } from '../core/_requests';
import { useMutation,useQueryClient } from 'react-query';
import { QUERIES } from '../../../../../../../../_metronic/helpers';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as Yup from 'yup'
import { Modal } from 'react-bootstrap'
import {useListView} from '../core/ListViewProvider'

const GroupTable = () => {
  const {selected, clearSelected} = useListView()
  const queryClient = useQueryClient();
  const {setItemIdForUpdate} = useListView()
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
  const {active, archived} = useQueryResponseData()
  const [trigger, setTrigger] = useState(false);
  const [activeGroup, setActiveGroup] = useState<GroupOfOptions[]>(active);
  const [archivedGroup, setArchivedGroup] = useState<GroupOfOptions[]>(() => archived);
  const [draggingRow, setDraggingRow] = useState<MRT_Row<GroupOfOptions> | null>(null);
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false)
  const [groupDelete, setGroupDelete] = useState()

  const columns = useMemo<MRT_ColumnDef<GroupOfOptions>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.name,
          helperText: validationErrors?.name,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              name: undefined,
            }),
        },
      },
      {
        accessorKey: 'min',
        header: 'Minimum',
        muiEditTextFieldProps: {
          type: 'number',
          required: true,
          error: !!validationErrors?.min,
          helperText: validationErrors?.min,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              min: undefined,
            }),
        },
      },
      {
        accessorKey: 'order',
        header: 'Order',
        muiEditTextFieldProps: {
          type: 'number',
          required: true,
          error: !!validationErrors?.order,
          helperText: validationErrors?.order,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              order: undefined,
            }),
        },
      },
      {
        accessorKey: 'available',
        header: 'Available',
        Cell: ({ cell }) => (cell.getValue() ? 'Yes' : 'No'),
        editVariant: 'select',
        muiEditTextFieldProps: {
          select: true,
          error: !!validationErrors?.available,
          helperText: validationErrors?.available,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              available: undefined,
            }),
        },
        // Define the select options
        editSelectOptions: [
          { value: true, label: 'Yes' },
          { value: false, label: 'No' },
        ],
      }
    ],
    [validationErrors],
  );

  const editGroupSchema = Yup.object().shape({
    name: Yup.string()
      .min(1, 'Minimum 1 symbol')
      .required('Name is required'),
    min: Yup.number()
      .min(0, 'Minimum value is 0')
      .required('Minimum is required'),
    stock: Yup.number()
      .nullable()
      .min(0, 'Stock cannot be negative')
      .optional(),
    sold: Yup.number()
      .min(0, 'Sold cannot be negative')
      .required('Sold is required'),
    order: Yup.number()
      .min(0, 'Order cannot be negative')
      .required('Order is required'),
    available: Yup.boolean()
      .required('Availability is required'),
  })

  // UPDATE group
  const handleSaveGroup = async (originalRow: any) => {
    try {
      await editGroupSchema.validate(originalRow.row.original);
      setValidationErrors({});
      await updateGroupAvailable.mutateAsync({id: originalRow.row.original._id, update: originalRow.values});
      table1.setEditingRow(null);
    } catch (err: any) {
      setValidationErrors({ [err.path]: err.message });
    }
  };

  // DELETE action
  const handleDeleteClick = () => {
    setShowModal(true)
  }

  const handleConfirmDelete = async () => {
    await deleteItem.mutateAsync()
    setShowModal(false)
  }

  const openAddCategoryModal = () => {
    setItemIdForUpdate(null)
  }

  const handleClose = () => {
    setShowModal(false)
  }

  const deleteItem = useMutation(() => deleteGroup(groupDelete as string), {
    onSuccess: () => {
      queryClient.invalidateQueries([`${QUERIES.GROUPS_LIST}`])
      setTrigger(true)
    },
  })

  const deleteSelectedItems = useMutation((ids: string[]) => deleteSelectedGroups(ids), {
    onSuccess: () => {
      queryClient.invalidateQueries([`${QUERIES.GROUPS_LIST}`])
      setTrigger(true)
      clearSelected()
    },
  })

  const updateGroupAvailable = useMutation(({id, update}: any) => updateGroup(id, update), {
    onSuccess: () => {
      queryClient.invalidateQueries([`${QUERIES.GROUPS_LIST}`]);
    },
  })
  
  const commonTableProps: Partial<MRT_TableOptions<GroupOfOptions>> & {
    columns: MRT_ColumnDef<GroupOfOptions>[];
  } = {
    columns,
    enableRowDragging: true,
    enableFullScreenToggle: false,
    muiTableContainerProps: {
      sx: {
        minHeight: '320px',
      },
    },
    onDraggingRowChange: setDraggingRow,
    state: { draggingRow },
  };

  useEffect(() => {
    setActiveGroup(active);
    setArchivedGroup(archived);
  }, [active, archived, trigger])

  const table1 = useMaterialReactTable({
    ...commonTableProps,
    enableRowSelection: true,
    enableStickyHeader: true,
    enableCellActions: true,
    enableClickToCopy: 'context-menu',
    enableEditing: true,
    editDisplayMode: 'row',
    createDisplayMode: 'row', 
    rowPinningDisplayMode: 'select-sticky',
    positionToolbarAlertBanner: 'bottom',
    positionActionsColumn: 'last',
    
    state: {
      columnOrder: [
        'mrt-row-select',
        'mrt-row-drag',
        'name',
        'min',
        'order',
        'available',
      ],
    },
    
    renderTopToolbarCustomActions: ({ table }) => (
      <>
        <div className="card-header ribbon ribbon-start">
          <div className="ribbon-label ribbon ribbon-start bg-success">
            Active 
          </div>
        </div>
        <Box sx={{ display: 'flex', gap: '1rem', p: '4px', justifyContent: 'right' }}>
          <Button
            color="info"
            onClick={openAddCategoryModal}
            variant="contained"
          >
            Add Group
          </Button>
          <Button
            color="error"
            disabled={!table.getIsSomeRowsSelected()}
            onClick={async() => {
              let selectedIDs: string[] = [];
              table.getSelectedRowModel().rows.forEach((item) => {
                if (item.original._id) {
                  selectedIDs.push(item.original._id)
                }
              });
              await deleteSelectedItems.mutateAsync(selectedIDs)
            }}
            variant="contained"
          >
            Delete Selected
          </Button>
        </Box>
      </>
    ),
    data: activeGroup,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: (originalRow) => handleSaveGroup(originalRow),
    getRowId: (originalRow) => `table-1-${originalRow._id || originalRow.name}`,
    muiRowDragHandleProps: {
      onDragEnd: async() => {
        if (hoveredTable === 'table-2' && draggingRow) {
          await updateGroupAvailable.mutateAsync({id: draggingRow.original._id, update: {deleted: true}} as any)
          setArchivedGroup((archivedGroup) => [...archivedGroup, draggingRow.original]);
          setActiveGroup((activeGroup) => activeGroup.filter((d) => d._id !== draggingRow.original._id));
        }
        setHoveredTable(null);
      },
    },
    muiTablePaperProps: {
      onDragEnter: () => setHoveredTable('table-1'),
      sx: {
        outline: hoveredTable === 'table-1' ? '2px dashed green' : undefined,
      },
    },
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" 
            onClick={() => {setGroupDelete(row.original._id as any); handleDeleteClick() }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  });

  const table2 = useMaterialReactTable({
    ...commonTableProps,
    data: archivedGroup,
    defaultColumn: {
      size: 100,
    },
    state: {
      columnOrder: [
        'mrt-row-select',
        'mrt-row-drag',
        'name',
        'min',
        'order',
        'available',
      ],
    },
    getRowId: (originalRow) => `table-2-${originalRow._id || originalRow.name}`,
    muiRowDragHandleProps: {
      onDragEnd: async() => {
        if (hoveredTable === 'table-1' && draggingRow) {
          await updateGroupAvailable.mutateAsync({id: draggingRow.original._id, update: {deleted: false}} as any)
          setActiveGroup((activeGroup) => [...activeGroup, draggingRow.original]);
          setArchivedGroup((archivedGroup) => archivedGroup.filter((d) => d._id !== draggingRow.original._id));
        }
        setHoveredTable(null);
      },
    },
    muiTablePaperProps: {
      onDragEnter: () => setHoveredTable('table-2'),
      sx: {
        outline: hoveredTable === 'table-2' ? '2px dashed pink' : undefined,
      },
    },
    renderTopToolbarCustomActions: () => (
      <div className="card-header ribbon ribbon-start">
        <div className="ribbon-label ribbon ribbon-start bg-danger">
          Archive 
        </div>
      </div>
    ),
  });

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gap: '1rem',
          overflow: 'auto',
          p: '4px',
        }}
      >
        <MaterialReactTable table={table1} />
      </Box>
      <Box
        sx={{
          display: 'grid',
          gap: '1rem',
          overflow: 'auto',
          p: '4px',
        }}
      >
        <MaterialReactTable table={table2} />
      </Box>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
        <Modal.Footer>
          <Box sx={{ display: 'flex', gap: '1rem', p: '4px' }}>
            <Button color='info' variant="contained" onClick={handleClose}>
              Cancel
            </Button>
            <Button color='error' variant="contained" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </Box>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export {GroupTable};