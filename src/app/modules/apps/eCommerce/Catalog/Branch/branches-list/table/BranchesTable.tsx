// export {BranchesTable}
import { useEffect, useMemo, useState } from "react";
import { useQueryResponseData } from "../core/QueryResponseProvider";
import { Branch } from "../core/_models";
import {
  type MRT_TableOptions,
  type MRT_ColumnDef,
  type MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import {
  deleteBranch,
  deleteSelectedBranches,
  updateBranch,
} from "../core/_requests";
import { useMutation, useQueryClient } from "react-query";
import { QUERIES } from "../../../../../../../../_metronic/helpers";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { useListView } from "../core/ListViewProvider";

const BranchesTable = () => {
  const { selected, clearSelected } = useListView();
  const queryClient = useQueryClient();
  const { setItemIdForUpdate } = useListView();
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});
  const { active, archived } = useQueryResponseData();
  const [trigger, setTrigger] = useState(false);
  const [activeBranches, setActiveBranches] = useState<Branch[]>(active);
  const [archivedBranches, setArchivedBranches] = useState<Branch[]>(
    () => archived,
  );
  const [draggingRow, setDraggingRow] = useState<MRT_Row<Branch> | null>(null);
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [branchDelete, setBranchDelete] = useState();
  const columns = useMemo<MRT_ColumnDef<Branch>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
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
        accessorKey: "workingHours",
        header: "Working Hours",
      },
      {
        accessorKey: "phone",
        header: "Phone",
      },
    ],
    [],
  );

  const editBranchSchema = Yup.object().shape({
    name: Yup.string().min(3, "Minimum 3 symbols").required("Name is required"),
    workingHours: Yup.string().min(3, "Minimum 3 symbols").optional(),
    address: Yup.string().min(3, "Minimum 3 symbols").optional(),
    imgCover: Yup.string().min(3, "Minimum 3 symbols").optional(),
    phone: Yup.array().of(Yup.string()).min(1, "Minimum 3 symbols").optional(),
    gmap: Yup.string().min(3, "Minimum 3 symbols").optional(),
  });
  //UPDATE branch
  const handleSaveBranch = async (originalRow) => {
    editBranchSchema
      .validate(originalRow.row.original)
      .catch((err) => setValidationErrors(err.message));
    setValidationErrors({});
    await updateBranchAvailable.mutateAsync({
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
  const deleteItem = useMutation(() => deleteBranch(branchDelete as string), {
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      queryClient.invalidateQueries([`${QUERIES.BRNACHES_LIST}`]);
      setTrigger(true);
    },
  });

  const deleteSelectedItems = useMutation(
    (ids: string[]) => deleteSelectedBranches(ids),
    {
      // 💡 response of the mutation is passed to onSuccess
      onSuccess: () => {
        // ✅ update detail view directly
        queryClient.invalidateQueries([`${QUERIES.BRNACHES_LIST}`]);
        setTrigger(true);
        clearSelected();
      },
    },
  );

  const updateBranchAvailable = useMutation(
    ({ id, update }: { id: string; update: Partial<Branch> }) =>
      updateBranch(id, update),
    {
      // 💡 response of the mutation is passed to onSuccess
      onSuccess: () => {
        // ✅ update detail view directly
        queryClient.invalidateQueries([`${QUERIES.BRNACHES_LIST}`]);
      },
    },
  );

  const commonTableProps: Partial<MRT_TableOptions<Branch>> & {
    columns: MRT_ColumnDef<Branch>[];
  } = {
    columns,
    enableRowDragging: true,
    enableFullScreenToggle: false,
    muiTableContainerProps: {
      sx: {
        minHeight: "320px",
      },
    },
    onDraggingRowChange: setDraggingRow,
    state: { draggingRow },
  };
  useEffect(() => {
    setActiveBranches(active);
    setArchivedBranches(archived);
  }, [active, archived, trigger]);
  const table1 = useMaterialReactTable({
    ...commonTableProps,
    enableRowSelection: true,
    enableStickyHeader: true,
    enableCellActions: true,
    enableClickToCopy: "context-menu",
    enableEditing: true,
    editDisplayMode: "row",
    createDisplayMode: "row",
    rowPinningDisplayMode: "select-sticky",
    positionToolbarAlertBanner: "bottom",
    positionActionsColumn: "last",

    state: {
      columnOrder: [
        "mrt-row-select", //move the built-in selection column to the end of the table
        "mrt-row-drag",
        "name",
        "workingHours",
        "phone",
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
            display: "flex",
            gap: "1rem",
            p: "4px",
            justifyContent: "right",
          }}
        >
          <Button
            color="info"
            onClick={openAddCategoryModal}
            variant="contained"
          >
            Add Branch
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
    data: activeBranches,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: (originalRow) => handleSaveBranch(originalRow),
    getRowId: (originalRow) => `table-1-${originalRow.name}`,
    muiRowDragHandleProps: {
      onDragEnd: async () => {
        if (hoveredTable === "table-2") {
          await updateBranchAvailable.mutateAsync({
            id: draggingRow?.original._id,
            update: { deleted: true },
          });

          setArchivedBranches((archivedBranches) => [
            ...archivedBranches,
            draggingRow!.original,
          ]);
          setActiveBranches((activeBranches) =>
            activeBranches.filter((d) => d !== draggingRow!.original),
          );
        }
        setHoveredTable(null);
      },
    },
    muiTablePaperProps: {
      onDragEnter: () => setHoveredTable("table-1"),
      sx: {
        outline: hoveredTable === "table-1" ? "2px dashed green" : undefined,
      },
    },
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            color="error"
            onClick={() => {
              setBranchDelete(row.original._id as any);
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
    enableRowSelection: true,
    enableStickyHeader: true,
    enableCellActions: true,
    enableClickToCopy: "context-menu",
    enableEditing: true,
    editDisplayMode: "row",
    createDisplayMode: "row",
    rowPinningDisplayMode: "select-sticky",
    positionToolbarAlertBanner: "bottom",
    positionActionsColumn: "last",
    data: archivedBranches,
    defaultColumn: {
      size: 100,
    },
    state: {
      columnOrder: [
        "mrt-row-select", //move the built-in selection column to the end of the table
        "mrt-row-drag",
        "name",
        "workingHours",
        "phone",
      ],
    },
    getRowId: (originalRow) => `table-2-${originalRow.name}`,
    muiRowDragHandleProps: {
      onDragEnd: async () => {
        if (hoveredTable === "table-1") {
          await updateBranchAvailable.mutateAsync({
            id: draggingRow?.original._id,
            update: { deleted: false },
          });
          setActiveBranches((activeBranches) => [
            ...activeBranches,
            draggingRow!.original,
          ]);
          setArchivedBranches((archivedBranches) =>
            archivedBranches.filter((d) => d !== draggingRow!.original),
          );
        }
        setHoveredTable(null);
      },
    },
    muiTablePaperProps: {
      onDragEnter: () => setHoveredTable("table-2"),
      sx: {
        outline: hoveredTable === "table-2" ? "2px dashed pink" : undefined,
      },
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <>
        <div className="card-header ribbon ribbon-start">
          <div className="ribbon-label ribbon ribbon-start bg-danger">
            Archive
          </div>
        </div>
        <Box
          sx={{
            display: "flex",
            gap: "1rem",
            p: "4px",
            justifyContent: "right",
          }}
        >
          <Button
            color="success"
            onClick={async () => {
              // let selcetedIDs =[];
              table.getSelectedRowModel().rows.map(async (item) => {
                await updateBranchAvailable.mutateAsync({
                  id: item.original._id,
                  update: { deleted: false },
                });
              });
              table.toggleAllRowsSelected(false);
            }}
            variant="contained"
          >
            Restore Selected
          </Button>
        </Box>
      </>
    ),
    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Restore">
          <IconButton
            color="error"
            onClick={async () => {
              await updateBranchAvailable.mutateAsync({
                id: row.original._id,
                update: { deleted: false },
              });
            }}
          >
            <RestoreFromTrashIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  });

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gap: "1rem",
          overflow: "auto",
          p: "4px",
        }}
      >
        <MaterialReactTable table={table1} />
      </Box>
      <Box
        sx={{
          display: "grid",
          gap: "1rem",
          overflow: "auto",
          p: "4px",
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
          <Box sx={{ display: "flex", gap: "1rem", p: "4px" }}>
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

export { BranchesTable };
