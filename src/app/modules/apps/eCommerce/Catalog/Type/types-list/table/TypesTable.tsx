// export {TypesTable}
import { useEffect, useMemo, useState } from 'react';
import { useQueryResponseData } from '../../types-list/core/QueryResponseProvider';
import { Types } from '../../types-list/core/_models';
import {
  type MRT_TableOptions,
  type MRT_ColumnDef,
  type MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Box, Typography, Button, IconButton, Tooltip } from '@mui/material';
import {
  deleteType,
  deleteSelectedTypes,
  updateType,
} from '../../types-list/core/_requests';
import { useMutation, useQueryClient } from 'react-query';
import { QUERIES } from '../../../../../../../../_metronic/helpers';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as Yup from 'yup';
import { Modal } from 'react-bootstrap';
import { useListView } from '../../types-list/core/ListViewProvider';

const TypesTable = () => {
  const { selected, clearSelected } = useListView();
  const queryClient = useQueryClient();
  const { setItemIdForUpdate } = useListView();
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});
  const { active, archived } = useQueryResponseData();
  const [trigger, setTrigger] = useState(false);
  const [activetypes, setActivetypes] = useState<Types[]>(active);
  const [archivedtypes, setArchivedtypes] = useState<Types[]>(
    () => archived
  );
  const [draggingRow, setDraggingRow] = useState<MRT_Row<Types> | null>(null);
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [typeDelete, settypeDelete] = useState();
  const columns = useMemo<MRT_ColumnDef<Types>[]>(
    //column definitions...
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
    ],
    []
  );

  const edittypeSchema = Yup.object().shape({
    name: Yup.string().min(3, 'Minimum 3 symbols').required('Name is required'),
  });
  //UPDATE Types
  const handleSavetype = async (originalRow) => {
    edittypeSchema
      .validate(originalRow.row.original)
      .catch((err) => setValidationErrors(err.message));
    setValidationErrors({});
    await updatetypeAvailable.mutateAsync({
      id: originalRow.row.original._id,
      update: originalRow.values,
    });
    table1.setEditingRow(null); //exit editing mode
  };

  //DELETE action
  const handleDeleteClick = () => {
    setShowModal(true);
  };
  const handleConfirmDelete = async () => {
    await deleteItem.mutateAsync();
    setShowModal(false);
  };
  const openAddCategoryModal = () => {
    setItemIdForUpdate(null);
  };
  const handleClose = () => {
    setShowModal(false);
  };
  const deleteItem = useMutation(() => deleteType(typeDelete as string), {
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      queryClient.invalidateQueries([`${QUERIES.TYPES_LIST}`]);
      setTrigger(true);
    },
  });

  const deleteSelectedItems = useMutation(
    (ids: string[]) => deleteSelectedTypes(ids),
    {
      // 💡 response of the mutation is passed to onSuccess
      onSuccess: () => {
        // ✅ update detail view directly
        queryClient.invalidateQueries([`${QUERIES.TYPES_LIST}`]);
        setTrigger(true);
        clearSelected();
      },
    }
  );

  const updatetypeAvailable = useMutation(
    ({ id, update }: { id: string; update: Partial<Types> }) => updateType(id, update),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([`${QUERIES.TYPES_LIST}`]);
      },
    }
  );

  const commonTableProps: Partial<MRT_TableOptions<Types>> & {
    columns: MRT_ColumnDef<Types>[];
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
    setActivetypes(active);
    setArchivedtypes(archived);
  }, [active, archived, trigger]);
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
        'mrt-row-select', //move the built-in selection column to the end of the table
        'mrt-row-drag',
        'name',
      ],
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <>
        <div className="card-header ribbon ribbon-start">
          <div className="ribbon-label ribbon ribbon-start bg-success">
            Active
          </div>
        </div>
        <Box
          sx={{
            display: 'flex',
            gap: '1rem',
            p: '4px',
            justifyContent: 'right',
          }}
        >
          <Button
            color="info"
            onClick={openAddCategoryModal}
            variant="contained"
          >
            Add Type
          </Button>
          <Button
            color="error"
            onClick={async () => {
              const selcetedIDs = [];
              table
                .getSelectedRowModel()
                .rows.map((item) => selcetedIDs.push(item.original._id));
              await deleteSelectedItems.mutateAsync(selcetedIDs);
            }}
            variant="contained"
          >
            Delete Selected
          </Button>
        </Box>
      </>
    ),
    data: activetypes,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: (originalRow) => handleSavetype(originalRow),
    getRowId: (originalRow) => `table-1-${originalRow.name}`,
    muiRowDragHandleProps: {
      onDragEnd: async () => {
        if (hoveredTable === 'table-2') {
          await updatetypeAvailable.mutateAsync({
            id: draggingRow?.original._id,
            update: { deleted: true },
          });

          setArchivedtypes((archivedtypes) => [
            ...archivedtypes,
            draggingRow!.original,
          ]);
          setActivetypes((activetypes) =>
            activetypes.filter((d) => d !== draggingRow!.original)
          );
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
          <IconButton
            color="error"
            onClick={() => {
              settypeDelete(row.original._id as any);
              handleDeleteClick();
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  });

  const table2 = useMaterialReactTable({
    ...commonTableProps,
    data: archivedtypes,
    defaultColumn: {
      size: 100,
    },
    state: {
      columnOrder: [
        'mrt-row-select', //move the built-in selection column to the end of the table
        'mrt-row-drag',
        'name',
      ],
    },
    getRowId: (originalRow) => `table-2-${originalRow.name}`,
    muiRowDragHandleProps: {
      onDragEnd: async () => {
        if (hoveredTable === 'table-1') {
          await updatetypeAvailable.mutateAsync({
            id: draggingRow?.original._id,
            update: { deleted: false },
          });
          setActivetypes((activetypes) => [
            ...activetypes,
            draggingRow!.original,
          ]);
          setArchivedtypes((archivedtypes) =>
            archivedtypes.filter((d) => d !== draggingRow!.original)
          );
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
            <Button color="info" variant="contained" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={handleConfirmDelete}
            >
              Delete
            </Button>
          </Box>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export { TypesTable };
