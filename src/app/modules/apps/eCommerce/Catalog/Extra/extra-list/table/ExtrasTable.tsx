import { useMemo, useState } from "react";
import {
  useQueryResponseData,
  useQueryRefetch,
  useActiveExtrasLoading,
  useArchivedExtrasLoading,
} from "../core/QueryResponseProvider";
import { Extras } from "../core/_models";
import {
  type MRT_TableOptions,
  type MRT_ColumnDef,
  type MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import {
  deleteExtra,
  deleteSelectedExtras,
  updateExtra,
} from "../core/_requests";
import { useMutation, useQueryClient } from "react-query";
import { QUERIES } from "../../../../../../../../_metronic/helpers";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { useListView } from "../core/ListViewProvider";
import Flatpickr from "react-flatpickr";

const ExtrasTable = () => {
  const { selected, clearSelected } = useListView();
  const queryClient = useQueryClient();
  const { setItemIdForUpdate } = useListView();
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});
  const { active, archived } = useQueryResponseData();

  const refetch = useQueryRefetch();
  const [trigger, setTrigger] = useState(false);

  const [hoveredTable, setHoveredTable] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [showSubExtrasModal, setShowSubExtrasModal] = useState(false);
  const [ExtrasDelete, setExtrasDelete] = useState();
  const [editExtra, setEditExtra] = useState();
  const isActiveLoading = useActiveExtrasLoading();
  const isArchivedLoading = useArchivedExtrasLoading();

  const columns = useMemo<MRT_ColumnDef<Extras>[]>(
    //column definitions...
    () => [
      {
        accessorKey: "name",
        header: "Name",
        size: 50,
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
        accessorKey: "description",
        header: "Description",
        size: 100,
      },
      {
        accessorKey: "order",
        header: "Order",
        size: 30,
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
      },
      {
        accessorKey: "available",
        header: "Available",
        size: 100,
        muiTableBodyCellProps: {
          align: "right",
        },
        muiTableHeadCellProps: {
          align: "left",
        },
        Cell: ({ cell }) => (
          <div className="form-check form-switch form-check-custom form-check-solid">
            <input
              className="form-check-input cursor-pointer"
              type="checkbox"
              checked={cell.getValue<boolean>()}
              onChange={() =>
                updateExtraAvailable.mutateAsync({
                  id: cell.row.original._id,
                  update: { available: !cell.row.original.available },
                })
              }
              id={cell.row.original._id}
            />
          </div>
        ),
      },
      {
        accessorKey: "price",
        header: "Price",
        size: 50,
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
        accessorKey: "stock",
        header: "Stock",
        size: 50,
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
        accessorKey: "qty",
        header: "Qty",
        size: 50,
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
        accessorKey: "sold",
        header: "Sold",
        size: 50,
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
        accessorKey: "priceAfterDiscount",
        header: "Price After Discount",
        size: 50,
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
        accessorKey: "priceAfterExpirest",
        header: "Discount Expiry",
        size: 50,
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
        Cell: ({ cell }) => (
          <span className={`badge `}>
            {cell?.getValue()
              ? new Date((cell?.getValue() as any))?.toLocaleDateString("en-US")
              : ""}
          </span>
        ),
        Edit: ({ cell, row, table }) => {
          return (
            <Flatpickr
              placeholder="Discount Expiry Date"
              value={cell.getValue()}
              options={{ dateFormat: "Y-m-d" }}
              onChange={(date) => setEditExtra(date[0].toISOString())}
              type="text"
              name="priceAfterExpirest"
              dateFormat="z"
              autoComplete="off"
            />
          );
        },
      },
    ],
    [validationErrors],
  );

  const editExtrasSchema = Yup.object().shape({
    order: Yup.number().min(0, "Order can't be negative"),
    name: Yup.string().min(3, "Minimum 3 symbols").required("Name is required"),
    description: Yup.string().min(3, "Minimum 3 symbols"),

    price: Yup.number().min(0).optional(),
    available: Yup.boolean().optional(),
    stock: Yup.string().optional(),
    qty: Yup.number().min(0).optional(),
    priceAfterDiscount: Yup.number().min(0).optional(),
    priceAfterExpirest: Yup.string().optional(),
    sold: Yup.string().min(0).optional(),
  });
  //UPDATE Extras
  const handleSaveExtras = async (originalRow) => {
    originalRow.values.stock = originalRow.values.stock
      ? originalRow.values.stock.toString()
      : "null";
    console.log("values", originalRow);
    editExtrasSchema
      .validate(originalRow.row.original)
      .catch((err) => setValidationErrors(err.message));
    setValidationErrors({});
    const updatedRowValues = {
      ...originalRow.values,
      priceAfterExpirest: editExtra,
    };

    await updateExtraAvailable.mutateAsync({
      id: originalRow.row.original._id,
      update: updatedRowValues,
    });
    table1.setEditingRow(null); //exit editing mode
  };

  //Arrange products action
  const handleArrangeProductsClick = () => {
    setShowProductsModal(true);
  };
  const handleCloseProductsModal = () => {
    setShowProductsModal(false);
  };
  //Arrange SubExtras action
  const handleArrangeSubsClick = () => {
    setShowSubExtrasModal(true);
  };
  const handleCloseSubExtrasModal = () => {
    setShowSubExtrasModal(false);
  };
  //DELETE action
  const handleDeleteClick = () => {
    setShowModal(true);
  };
  const handleConfirmDelete = async () => {
    await deleteItem.mutateAsync();
    setShowModal(false);
  };
  const openAddExtraModal = () => {
    setItemIdForUpdate(null);
  };
  const handleClose = () => {
    setShowModal(false);
  };
  const deleteItem = useMutation(
    () => deleteExtra(ExtrasDelete as string),
    {
      // 💡 response of the mutation is passed to onSuccess
      onSuccess: () => {
        // ✅ update detail view directly
        queryClient.invalidateQueries([`${QUERIES.CATEGORIES_LIST}`]);
        queryClient.invalidateQueries([`${QUERIES.ARCHIVED_CATEGORIES_LIST}`]);
        queryClient.refetchQueries([`${QUERIES.CATEGORIES_LIST}`]);
        queryClient.refetchQueries([`${QUERIES.ARCHIVED_CATEGORIES_LIST}`]);
        setTrigger(true);
      },
    },
  );

  const deleteSelectedItems = useMutation(
    (ids: string[]) => deleteSelectedExtras(ids),
    {
      // 💡 response of the mutation is passed to onSuccess
      onSuccess: () => {
        // ✅ update detail view directly
        queryClient.invalidateQueries([`${QUERIES.CATEGORIES_LIST}`]);
        queryClient.invalidateQueries([`${QUERIES.ARCHIVED_CATEGORIES_LIST}`]);
        refetch();

        setTrigger(true);
        clearSelected();
      },
    },
  );

  const updateExtraAvailable = useMutation(
    ({ id, update }: { id: string; update: Partial<Extras> }) => updateExtra(id, update),
    {
      onSuccess: () => {
        refetch();
        setTrigger(true);
      },
    },
  );

  const commonTableProps: Partial<MRT_TableOptions<Extras>> & {
    columns: MRT_ColumnDef<Extras>[];
  } = {
    columns,
    enableRowDragging: true,
    enableFullScreenToggle: false,
    muiTableContainerProps: {
      sx: {
        minHeight: "320px",
      },
    },
  };


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
    enableRowOrdering: true,
    enableSorting: false,
    enableExpandAll: false,
    state: {
      columnOrder: [
        "mrt-row-select", //move the built-in selection column to the end of the table
        "mrt-row-drag",
        "name",
        "description",
        "order",
        "mrt-row-expand",
        "price",
        "priceAfterDiscount",
        "priceAfterExpirest",
        "stock",
        "qty",
        "sold",
        "available",
      ],
      isLoading: isActiveLoading,
    },
    muiDetailPanelProps: () => ({
      sx: (theme) => ({
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(255,210,244,0.1)"
            : "rgba(0,0,0,0.1)",
      }),
    }),
    //custom expand button rotation
    muiExpandButtonProps: ({ row, table }) => ({
      onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }), //only 1 detail panel open at a time
      sx: {
        transform: row.getIsExpanded() ? "rotate(180deg)" : "rotate(-90deg)",
        transition: "transform 0.2s",
      },
    }),

    muiRowDragHandleProps: ({ table }) => ({
      onDragEnd: async () => {
        const { draggingRow, hoveredRow } = table.getState();
        if (hoveredTable === "table-2") {
          setHoveredTable(null);
          await updateExtraAvailable.mutateAsync({
            id: draggingRow?.original._id,
            update: { deleted: true },
          });
        } else if (hoveredRow && draggingRow) {
          await updateExtraAvailable.mutateAsync({
            id: draggingRow?.original._id,
            update: { order: hoveredRow?.original.order },
          });
          setHoveredTable(null);
        }
      },
    }),
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
            onClick={openAddExtraModal}
            variant="contained"
          >
            Add Extra
          </Button>
          <Button
            color="warning"
            onClick={async () => {
              table.getSelectedRowModel().rows.map(async (item) => {
                await updateExtraAvailable.mutateAsync({
                  id: item.original._id,
                  update: { available: !item.original.available },
                });
              });
              table.toggleAllRowsSelected(false);
            }}
            variant="contained"
          >
            Toggle Available
          </Button>
          <Button
            color="error"
            onClick={async () => {
              let selcetedIDs = [];
              table
                .getSelectedRowModel()
                .rows.map((item) => selcetedIDs.push(item.original._id));
              await deleteSelectedItems.mutateAsync(selcetedIDs);
              table.toggleAllRowsSelected(false);
            }}
            variant="contained"
          >
            Delete Selected
          </Button>
        </Box>
      </>
    ),
    data: active,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: (originalRow) => handleSaveExtras(originalRow),
    getRowId: (originalRow) => `table-1-${originalRow.name}`,
    muiTablePaperProps: {
      onDragEnter: () => setHoveredTable("table-1"),
      sx: {
        outline: hoveredTable === "table-1" ? "2px dashed green" : undefined,
      },
    },
    displayColumnDefOptions: {
      "mrt-row-actions": {
        muiTableHeadCellProps: {
          align: "center", //change head cell props
        },
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
              setExtrasDelete(row.original._id as any);
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
    data: archived,
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
    enableRowOrdering: true,
    enableSorting: false,
    enableExpandAll: false,
    state: {
      columnOrder: [
        'mrt-row-select',
        'mrt-row-drag',
        'name',
        'description',
        'order',
        'mrt-row-expand',
        // 'branch',
        'price',
        'priceAfterDiscount',
        'priceAfterExpirest',
        'stock',
        'qty',
        'sold',
        'available',
      ],
      isLoading: isArchivedLoading,
    },
    muiDetailPanelProps: () => ({
      sx: (theme) => ({
        backgroundColor:
          theme.palette.mode === 'dark'
            ? 'rgba(255,210,244,0.1)'
            : 'rgba(0,0,0,0.1)',
      }),
    }),
    muiExpandButtonProps: ({ row, table }) => ({
      onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }), //only 1 detail panel open at a time
      sx: {
        transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(-90deg)',
        transition: 'transform 0.2s',
      },
    }),

    muiRowDragHandleProps: ({ table }) => ({
      onDragEnd: async () => {
        const { draggingRow, hoveredRow } = table.getState();
        if (hoveredTable === 'table-1') {
          setHoveredTable(null);
          await updateExtraAvailable.mutateAsync({
            id: draggingRow?.original._id,
            update: { deleted: false },
          });
        } else if (hoveredRow && draggingRow) {
          await updateExtraAvailable.mutateAsync({
            id: draggingRow?.original._id,
            update: { order: hoveredRow?.original.order },
          });
          setHoveredTable(null);
        }
      },
    }),

    renderTopToolbarCustomActions: ({ table }) => (
      <>
        <div className="card-header ribbon ribbon-start">
          <div className="ribbon-label ribbon ribbon-start bg-danger">
            Archived
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
            color="warning"
            onClick={async () => {
              table.getSelectedRowModel().rows.map(async (item) => {
                await updateExtraAvailable.mutateAsync({
                  id: item.original._id,
                  update: { available: !item.original.available },
                });
              });
              table.toggleAllRowsSelected(false);
            }}
            variant="contained"
          >
            Toggle Available
          </Button>
          <Button
            color="error"
            onClick={async () => {
              table.getSelectedRowModel().rows.map(async (item) => {
                await updateExtraAvailable.mutateAsync({
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

    defaultColumn: {
      size: 100,
    },
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: (originalRow) => handleSaveExtras(originalRow),
    getRowId: (originalRow) => `table-2-${originalRow.name}`,
    muiTablePaperProps: {
      onDragEnter: () => setHoveredTable('table-2'),
      sx: {
        outline: hoveredTable === 'table-2' ? '2px dashed pink' : undefined,
      },
    },
    displayColumnDefOptions: {
      'mrt-row-actions': {
        muiTableHeadCellProps: {
          align: 'center', //change head cell props
        },
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
            onClick={async () => {
                await updateExtraAvailable.mutateAsync({
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
      {/* Delete Modal */}
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

      {/* Arrange Products Modal */}
      <Modal show={showProductsModal} onHide={handleCloseProductsModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            Arrange Procusts Order in {(ExtrasDelete as any)?.name} Extra
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        </Modal.Body>
        <Modal.Footer>
          <Box sx={{ display: "flex", gap: "1rem", p: "4px" }}>
            <Button
              color="info"
              variant="contained"
              onClick={handleCloseProductsModal}
            >
              Close
            </Button>
          </Box>
        </Modal.Footer>
      </Modal>

      {/* Arrange SubExtras Modal */}
      <Modal
        show={showSubExtrasModal}
        onHide={handleCloseSubExtrasModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Arrange SubExtras Order in {(ExtrasDelete as any)?.name} Extra
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        </Modal.Body>
        <Modal.Footer>
          <Box sx={{ display: "flex", gap: "1rem", p: "4px" }}>
            <Button
              color="info"
              variant="contained"
              onClick={handleCloseSubExtrasModal}
            >
              Close
            </Button>
          </Box>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export { ExtrasTable };
