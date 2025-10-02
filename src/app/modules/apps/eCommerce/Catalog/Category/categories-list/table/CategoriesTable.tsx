// export {CategoriesesTable}
import { useEffect, useMemo, useState } from "react";
import {
  useQueryResponseData,
  useQueryRefetch,
} from "../core/QueryResponseProvider";
import { useQueryActiveResponseData as branchesData } from "../../../Branch/branches-list/core/QueryResponseProvider";
import { Categories } from "../core/_models";
import {
  type MRT_TableOptions,
  type MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import Select from "react-select";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import {
  deleteCategory,
  deleteSelectedCategories,
  updateCategory,
  restoreCategory,
} from "../core/_requests";
import { useMutation, useQueryClient } from "react-query";
import { QUERIES } from "../../../../../../../../_metronic/helpers";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { useListView } from "../core/ListViewProvider";

import { CategoryProductsTable } from "../../products-list/categoryProductsTable";
import { CategorySubsTable } from "../../subCategories-list/categorySubsTable";

const CategoriesTable = () => {
  const { clearSelected } = useListView();
  const queryClient = useQueryClient();
  const { setItemIdForUpdate } = useListView();
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});
  const { active, archived } = useQueryResponseData();
  const { active: activeBranches } = branchesData();
  const refetch = useQueryRefetch();
  const [trigger, setTrigger] = useState(false);
  const [activeCategorieses, setActiveCategorieses] =
    useState<Categories[]>(active);
  const [archivedCategorieses, setArchivedCategorieses] = useState<
    Categories[]
  >(() => archived);

  const [hoveredTable, setHoveredTable] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("delete");
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [showSubCategoriesModal, setShowSubCategoriesModal] = useState(false);
  const [CategoriesDelete, setCategoriesDelete] = useState();
  const [branches, setBranches] = useState([...activeBranches]);
  const [editCategory, setEditCategory] = useState<string[]>();

  const memoizedBranches = useMemo(
    () => branches.map((branch) => ({ value: branch._id, label: branch.name })),
    [branches],
  );

  const columns = useMemo<MRT_ColumnDef<Categories>[]>(
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
                updateCategoryAvailable.mutateAsync({
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
        accessorKey: "branch",
        header: "Branch",
        editVariant: "select",
        grow: true,
        size: 200,
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
        Edit: ({ cell }) => {
          const branchs =
            cell.getValue<{ branch: { name: string; _id: string } }[]>();
          let defV = [];
          branchs.map((branch) => {
            defV.push({ value: branch.branch._id, label: branch.branch.name });
          });

          return (
            <Select
              className="react-select-styled"
              classNamePrefix="react-select"
              isMulti
              options={memoizedBranches}
              defaultValue={defV}
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
              onChange={(selected) => {
                const updatedBranches = selected
                  ? selected.map((option) => option.value)
                  : [];
                setEditCategory(updatedBranches);
              }}
            />
          );
        },
        Cell: ({ row }) => {
          return (
            <>
              {row.original.branch.map((branch) => (
                <span key={branch._id} className="badge badge-secondary me-1">
                  {branch.branch.name}
                </span>
              ))}
            </>
          );
        },
      },
    ],
    [memoizedBranches, activeBranches, branches, validationErrors],
  );

  const editCategoriesSchema = Yup.object().shape({
    name: Yup.string().min(3, "Minimum 3 symbols").required("Name is required"),
    description: Yup.string().min(3, "Minimum 3 symbols").optional(),
    imgCover: Yup.string().min(3, "Minimum 3 symbols").optional(),
    order: Yup.number().min(1, "Minimum order is 1").optional(),
    branch: Yup.array().of(Yup.string()).min(1, "Minimum 3 symbols").optional(),
    available: Yup.boolean().optional(),
    deleted: Yup.boolean().optional(),
  });
  const handleSaveCategories = async (originalRow) => {
    editCategoriesSchema
      .validate(originalRow.row.original)
      .catch((err) => setValidationErrors(err.message));
    setValidationErrors({});
    const updatedRowValues = {
      ...originalRow.values,
      branch: editCategory.map((str) => ({ branch: str })), // assuming branch is an array of objects with value and label
    };

    await updateCategoryAvailable.mutateAsync({
      id: originalRow.row.original._id,
      update: updatedRowValues,
    });
    table1.setEditingRow(null);
  };

  const handleArrangeProductsClick = () => {
    setShowProductsModal(true);
  };
  const handleCloseProductsModal = () => {
    setShowProductsModal(false);
  };
  const handleArrangeSubsClick = () => {
    setShowSubCategoriesModal(true);
  };
  const handleCloseSubCategoriesModal = () => {
    setShowSubCategoriesModal(false);
  };
  const handleDeleteClick = (type: string) => {
    setModalType(type);
    setShowModal(true);
  };
  const handleConfirmDelete = async () => {
    await deleteItem.mutateAsync();
    setShowModal(false);
  };

  const handleConfirmRestore = async () => {
    await restoreItem.mutateAsync();
    setShowModal(false);
  };
  const openAddCategoryModal = () => {
    setItemIdForUpdate(null);
  };
  const handleClose = () => {
    setShowModal(false);
  };
  const deleteItem = useMutation(
    () => deleteCategory(CategoriesDelete as string),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([`${QUERIES.CATEGORIES_LIST}`]);
        queryClient.invalidateQueries([`${QUERIES.ARCHIVED_CATEGORIES_LIST}`]);
        queryClient.refetchQueries([`${QUERIES.CATEGORIES_LIST}`]);
        queryClient.refetchQueries([`${QUERIES.ARCHIVED_CATEGORIES_LIST}`]);
        setTrigger(true);
      },
    },
  );

  const restoreItem = useMutation(
    () => restoreCategory(CategoriesDelete as string),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([`${QUERIES.CATEGORIES_LIST}`]);
        queryClient.invalidateQueries([`${QUERIES.ARCHIVED_CATEGORIES_LIST}`]);
        queryClient.refetchQueries([`${QUERIES.CATEGORIES_LIST}`]);
        queryClient.refetchQueries([`${QUERIES.ARCHIVED_CATEGORIES_LIST}`]);
        setTrigger(true);
      },
    },
  );

  const deleteSelectedItems = useMutation(
    (ids: string[]) => deleteSelectedCategories(ids),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([`${QUERIES.CATEGORIES_LIST}`]);
        queryClient.invalidateQueries([`${QUERIES.ARCHIVED_CATEGORIES_LIST}`]);
        refetch();

        setTrigger(true);
        clearSelected();
      },
    },
  );

  const updateCategoryAvailable = useMutation(
    (data: { id: string | undefined; update: object }) =>
      updateCategory(data.id, data.update),
    {
      onSuccess: () => {
        refetch();
        setTrigger(true);
      },
    },
  );

  const commonTableProps: Partial<MRT_TableOptions<Categories>> & {
    columns: MRT_ColumnDef<Categories>[];
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
  useEffect(() => {
    setActiveCategorieses(active);
    setArchivedCategorieses(archived);
    setBranches([...activeBranches]);
  }, [active, archived, trigger, activeBranches]);

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
        "mrt-row-select",
        "mrt-row-drag",
        "name",
        "description",
        "order",
        "mrt-row-expand",
        "branch",
        "available",
      ],
    },
    muiDetailPanelProps: () => ({
      sx: (theme) => ({
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(255,210,244,0.1)"
            : "rgba(0,0,0,0.1)",
      }),
    }),
    muiExpandButtonProps: ({ row, table }) => ({
      onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }),
      sx: {
        transform: row.getIsExpanded() ? "rotate(180deg)" : "rotate(-90deg)",
        transition: "transform 0.2s",
      },
    }),
    renderDetailPanel: ({ row }) =>
      row.original.branch ? (
        <>
          {row.original.branch.map((branch) => (
            <span key={branch._id} className="badge badge-secondary me-1">
              {branch.branch.name}
            </span>
          ))}
        </>
      ) : null,
    muiRowDragHandleProps: ({ table }) => ({
      onDragEnd: async () => {
        const { draggingRow, hoveredRow } = table.getState();
        if (hoveredTable === "table-2") {
          setHoveredTable(null);
          await updateCategoryAvailable.mutateAsync({
            id: draggingRow?.original._id,
            update: { deleted: true },
          });

          setArchivedCategorieses((archivedCategorieses) => [
            ...archivedCategorieses,
            draggingRow!.original,
          ]);
          setActiveCategorieses((activeCategorieses) =>
            activeCategorieses.filter((d) => d !== draggingRow!.original),
          );
        } else if (hoveredRow && draggingRow) {
          await updateCategoryAvailable.mutateAsync({
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
            onClick={openAddCategoryModal}
            variant="contained"
          >
            Add Category
          </Button>
          <Button
            color="warning"
            onClick={async () => {
              table.getSelectedRowModel().rows.map(async (item) => {
                await updateCategoryAvailable.mutateAsync({
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
    data: activeCategorieses,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: (originalRow) => handleSaveCategories(originalRow),
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
          align: "center",
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
              setCategoriesDelete(row.original._id as any);
              handleDeleteClick("delete");
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Arrange products">
          <IconButton
            color="success"
            onClick={() => {
              setCategoriesDelete(row.original as any);
              handleArrangeProductsClick();
            }}
          >
            <i className="fa-brands fa-2xl text-primary fa-product-hunt"></i>
          </IconButton>
        </Tooltip>
        <Tooltip title="Arrange SubCategories">
          <IconButton
            color="warning"
            onClick={() => {
              setCategoriesDelete(row.original as any);
              handleArrangeSubsClick();
            }}
          >
            <i className="fa-solid fa-layer-group text-warning"></i>
          </IconButton>
        </Tooltip>
      </Box>
    ),
  });

  const table2 = useMaterialReactTable({
    ...commonTableProps,
    data: archivedCategorieses,
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
        "branch",
        "available",
      ],
    },
    muiDetailPanelProps: () => ({
      sx: (theme) => ({
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(255,210,244,0.1)"
            : "rgba(0,0,0,0.1)",
      }),
    }),
    muiExpandButtonProps: ({ row, table }) => ({
      onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }), //only 1 detail panel open at a time
      sx: {
        transform: row.getIsExpanded() ? "rotate(180deg)" : "rotate(-90deg)",
        transition: "transform 0.2s",
      },
    }),
    renderDetailPanel: ({ row }) =>
      row.original.branch ? (
        <>
          {row.original.branch.map((branch) => (
            <span key={branch._id} className="badge badge-secondary me-1">
              {branch.branch.name}
            </span>
          ))}
        </>
      ) : null,

    muiRowDragHandleProps: ({ table }) => ({
      onDragEnd: async () => {
        const { draggingRow, hoveredRow } = table.getState();
        if (hoveredTable === "table-1") {
          setHoveredTable(null);
          await updateCategoryAvailable.mutateAsync({
            id: draggingRow?.original._id,
            update: { deleted: false },
          });

          setArchivedCategorieses((archivedCategorieses) => [
            ...archivedCategorieses,
            draggingRow!.original,
          ]);
          setActiveCategorieses((activeCategorieses) =>
            activeCategorieses.filter((d) => d !== draggingRow!.original),
          );
        } else if (hoveredRow && draggingRow) {
          await updateCategoryAvailable.mutateAsync({
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
            display: "flex",
            gap: "1rem",
            p: "4px",
            justifyContent: "right",
          }}
        >
          <Button
            color="warning"
            onClick={async () => {
              // let selcetedIDs =[];
              table.getSelectedRowModel().rows.map(async (item) => {
                await updateCategoryAvailable.mutateAsync({
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
              // let selcetedIDs =[];
              table.getSelectedRowModel().rows.map(async (item) => {
                await updateCategoryAvailable.mutateAsync({
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
    onEditingRowSave: (originalRow) => handleSaveCategories(originalRow),
    getRowId: (originalRow) => `table-2-${originalRow.name}`,
    muiTablePaperProps: {
      onDragEnter: () => setHoveredTable("table-2"),
      sx: {
        outline: hoveredTable === "table-2" ? "2px dashed pink" : undefined,
      },
    },
    displayColumnDefOptions: {
      "mrt-row-actions": {
        muiTableHeadCellProps: {
          align: "center",
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
        <Tooltip title="Restore">
          <IconButton
            color="error"
            onClick={() => {
              setCategoriesDelete(row.original._id as any);
              handleDeleteClick("restore");
            }}
          >
            <RestoreFromTrashIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Arrange products">
          <IconButton
            color="success"
            onClick={() => {
              setCategoriesDelete(row.original as any);
              handleArrangeProductsClick();
            }}
          >
            <i className="fa-brands fa-2xl text-primary fa-product-hunt"></i>
          </IconButton>
        </Tooltip>
        <Tooltip title="Arrange SubCategories">
          <IconButton
            color="warning"
            onClick={() => {
              setCategoriesDelete(row.original as any);
              handleArrangeSubsClick();
            }}
          >
            <i className="fa-solid fa-layer-group text-warning"></i>
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
          <Modal.Title>
            {modalType === "delete"
              ? "Confirm Deletion"
              : "Confirm Restoration"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === "delete"
            ? "Are you sure you want to delete this item?"
            : "Are you sure you want to restore this item?"}
        </Modal.Body>
        <Modal.Footer>
          <Box sx={{ display: "flex", gap: "1rem", p: "4px" }}>
            <Button color="info" variant="contained" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              color={modalType === "delete" ? "error" : "success"}
              variant="contained"
              onClick={
                modalType === "delete"
                  ? handleConfirmDelete
                  : handleConfirmRestore
              }
              startIcon={
                modalType === "delete" ? (
                  <DeleteIcon />
                ) : (
                  <RestoreFromTrashIcon />
                )
              }
            >
              {modalType === "delete" ? "Delete" : "Restore"}
            </Button>
          </Box>
        </Modal.Footer>
      </Modal>

      {/* Arrange Products Modal */}
      <Modal show={showProductsModal} onHide={handleCloseProductsModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            Arrange Procusts Order in{" "}
            {CategoriesDelete && (CategoriesDelete as Categories)?.name}{" "}
            Category
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {CategoriesDelete && (
            <CategoryProductsTable id={(CategoriesDelete as Categories)?._id} />
          )}
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

      {/* Arrange SubCategories Modal */}
      <Modal
        show={showSubCategoriesModal}
        onHide={handleCloseSubCategoriesModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Arrange SubCategories Order in{" "}
            {CategoriesDelete && (CategoriesDelete as Categories)?.name}{" "}
            Category
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {CategoriesDelete && (
            <CategorySubsTable id={(CategoriesDelete as Categories)?._id} />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Box sx={{ display: "flex", gap: "1rem", p: "4px" }}>
            <Button
              color="info"
              variant="contained"
              onClick={handleCloseSubCategoriesModal}
            >
              Close
            </Button>
          </Box>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export { CategoriesTable };
