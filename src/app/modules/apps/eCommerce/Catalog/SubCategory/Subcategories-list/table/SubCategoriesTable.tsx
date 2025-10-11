// export {CategoriesesTable}
import { useEffect, useMemo, useState } from "react";
import {
  useQueryResponseData,
  useQueryRefetch,
  useActiveSubCategoriesLoading,
  useArchivedSubCategoriesLoading,
} from "../core/QueryResponseProvider";
import { useActiveBranchesData as branchesData } from "../../../Branch/branches-list/core/QueryResponseProvider";
import { useActiveCategoriesData as categoriesData } from "../../../Category/categories-list/core/QueryResponseProvider";
import { SubCategories } from "../core/_models";
import {
  type MRT_TableOptions,
  type MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import Select from "react-select";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import {
  deleteSubCategory,
  deleteSelectedSubCategories,
  updateSubCategory,
} from "../core/_requests";
import { useMutation, useQueryClient } from "react-query";
import { QUERIES } from "../../../../../../../../_metronic/helpers";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { useListView } from "../core/ListViewProvider";
import { SubCategoryProductsTable } from "../../products-list/subCategoryProductsTable";
import { SubCategoryChildsTable } from "../../childSubCategories-list/subCategoryChildsTable";

const SubCategoriesTable = () => {
  const { clearSelected } = useListView();
  const queryClient = useQueryClient();
  const { setItemIdForUpdate } = useListView();
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});
  const { active, archived } = useQueryResponseData();
  const branches = branchesData();
  const categories = categoriesData();

  const refetch = useQueryRefetch();
  const [activeCategorieses, setActiveCategorieses] =
    useState<SubCategories[]>(active);
  const [archivedCategorieses, setArchivedCategorieses] = useState<
    SubCategories[]
  >(() => archived);
  // keep local DnD working copies in sync with provider data
  useEffect(() => {
    setActiveCategorieses(active ?? []);
  }, [active]);
  useEffect(() => {
    setArchivedCategorieses(archived ?? []);
  }, [archived]);

  const [hoveredTable, setHoveredTable] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [showSubCategoriesModal, setShowSubCategoriesModal] = useState(false);
  const [CategoriesDelete, setCategoriesDelete] = useState();

  const [editBranch, setEditBranch] = useState();
  const [editCategory, setEditCategory] = useState();

  const isActiveLoading = useActiveSubCategoriesLoading();
  const isArchivedLoading = useArchivedSubCategoriesLoading();

  const memoizedBranches = useMemo(
    () => branches.map((branch) => ({ value: branch._id, label: branch.name })),
    [branches]
  );
  const memoizedCategories = useMemo(
    () =>
      categories.map((category) => ({
        value: category._id,
        label: category.name,
      })),
    [categories]
  );

  const columns = useMemo<MRT_ColumnDef<SubCategories>[]>(
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
              onClick={() =>
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
        accessorKey: "category",
        header: "Category",
        editVariant: "select",
        grow: true,
        size: 200,
        muiTableBodyCellProps: {
          align: "center",
        },
        muiTableHeadCellProps: {
          align: "center",
        },
        Edit: ({ cell, row, table }) => {
          const categories =
            cell.getValue<{ category: { name: string; _id: string } }[]>();
          const defV = [];
          categories.map((category) => {
            defV.push({
              value: category?.category?._id,
              label: category?.category?.name,
            });
          });

          return (
            <Select
              className="react-select-styled"
              classNamePrefix="react-select"
              isMulti
              options={memoizedCategories}
              defaultValue={defV}
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
              onChange={(selected) => {
                const updatedBranches = selected
                  ? selected.map((option) => option.value)
                  : [];
                setEditCategory(updatedBranches as any);
              }}
            />
          );
        },
        Cell: ({ cell }) => {
          const categoriess = cell.getValue<{ category: { name: string } }[]>();
          return (
            <>
              {categoriess?.map((category) => (
                <span className="badge badge-warning me-1">
                  {category.category.name}
                </span>
              ))}
            </>
          );
        },
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
        Edit: ({ cell, row, table }) => {
          const branchs =
            cell.getValue<{ branch: { name: string; _id: string } }[]>();
          const defV = [];
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
                setEditBranch(updatedBranches as any);
              }}
            />
            // )
          );
        },
        Cell: ({ cell }) => {
          const branchs = cell.getValue<{ branch: { name: string } }[]>();
          return (
            <>
              {branchs.map((branch) => (
                <span className="badge badge-secondary me-1">
                  {branch.branch.name}
                </span>
              ))}
            </>
          );
        },
      },
    ],
    [memoizedBranches, memoizedCategories, validationErrors]
  );

  const editSubCategoriesSchema = Yup.object().shape({
    name: Yup.string().min(3, "Minimum 3 symbols").required("Name is required"),
    description: Yup.string().min(3, "Minimum 3 symbols").optional(),
    imgCover: Yup.string().min(3, "Minimum 3 symbols").optional(),
    order: Yup.number().min(1, "Minimum order is 1").optional(),
    branch: Yup.array().of(Yup.string()).min(1, "Minimum 3 symbols").optional(),
    category: Yup.array()
      .of(Yup.string())
      .min(1, "Minimum 3 symbols")
      .optional(),
    available: Yup.boolean().optional(),
    deleted: Yup.boolean().optional(),
  });
  //UPDATE SubCategories
  const handleSaveCategories = async (originalRow) => {
    editSubCategoriesSchema
      .validate(originalRow.row.original)
      .catch((err) => setValidationErrors(err.message));
    setValidationErrors({});
    const updatedRowValues =
      editBranch && editCategory
        ? {
            ...originalRow.values,
            branch: (editBranch as any)?.map((str) => ({ branch: str })), // assuming branch is an array of objects with value and label
            category: (editCategory as any)?.map((str) => ({ category: str })), // assuming branch is an array of objects with value and label
          }
        : originalRow.values;

    await updateCategoryAvailable.mutateAsync({
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
  //Arrange SubCategories action
  const handleArrangeSubsClick = () => {
    setShowSubCategoriesModal(true);
  };
  const handleCloseSubCategoriesModal = () => {
    setShowSubCategoriesModal(false);
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
  const deleteItem = useMutation(
    () => deleteSubCategory(CategoriesDelete as string),
    {
      onSuccess: () => {
        // ✅ update detail view directly
        queryClient.invalidateQueries([`${QUERIES.SUB_CATEGORIES_LIST}`]);
        queryClient.invalidateQueries([
          `${QUERIES.ARCHIVED_SUB_CATEGORIES_LIST}`,
        ]);
        queryClient.refetchQueries([`${QUERIES.SUB_CATEGORIES_LIST}`]);
        queryClient.refetchQueries([`${QUERIES.ARCHIVED_SUB_CATEGORIES_LIST}`]);
      },
    }
  );

  const deleteSelectedItems = useMutation(
    (ids: string[]) => deleteSelectedSubCategories(ids),
    {
      onSuccess: () => {
        // ✅ update detail view directly
        queryClient.invalidateQueries([`${QUERIES.SUB_CATEGORIES_LIST}`]);
        queryClient.invalidateQueries([
          `${QUERIES.ARCHIVED_SUB_CATEGORIES_LIST}`,
        ]);
        refetch();
        clearSelected();
      },
    }
  );

  const updateCategoryAvailable = useMutation(
    ({ id, update }: { id: string; update: Partial<SubCategories> }) =>
      updateSubCategory(id, update),
    {
      onSuccess: () => {
        refetch();
      },
    }
  );

  const commonTableProps: Partial<MRT_TableOptions<SubCategories>> & {
    columns: MRT_ColumnDef<SubCategories>[];
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
    enableSorting: true,
    state: {
      columnOrder: [
        "mrt-row-select", //move the built-in selection column to the end of the table
        "mrt-row-drag",
        "name",
        "description",
        "order",
        "mrt-row-expand",
        "branch",
        "category",
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
    muiExpandButtonProps: ({ row, table }) => ({
      onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }), //only 1 detail panel open at a time
      sx: {
        transform: row.getIsExpanded() ? "rotate(180deg)" : "rotate(-90deg)",
        transition: "transform 0.2s",
      },
    }),
    renderDetailPanel: ({ row }) =>
      row.original.branch ? (
        <div className="d-flex justify-content-evenly">
          <div>
            {row.original.branch.map((branch, index) => (
              <span key={index} className="badge badge-secondary me-1">
                {branch.branch.name}
              </span>
            ))}
          </div>
          <div>
            {row.original.category.map((category, index) => {
              const label =
                typeof category.category === "string"
                  ? category.category
                  : category.category?.name;
              return (
                <span key={index} className="badge badge-warning me-1">
                  {label}
                </span>
              );
            })}
          </div>
        </div>
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
            activeCategorieses.filter((d) => d !== draggingRow!.original)
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
            Add SubCategory
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
              const selcetedIDs = [];
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
    getRowId: (originalRow) => `table-1-${originalRow._id}`,
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
              setCategoriesDelete(row.original._id as any);
              handleDeleteClick();
              // table.toggleAllRowsSelected(false)
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
              // table.toggleAllRowsSelected(false)
            }}
          >
            <i className="fa-brands fa-2xl text-primary fa-product-hunt"></i>
          </IconButton>
        </Tooltip>
        <Tooltip title="Arrange ChildSubCategories">
          <IconButton
            color="warning"
            onClick={() => {
              setCategoriesDelete(row.original as any);
              handleArrangeSubsClick();
              // table.toggleAllRowsSelected(false)
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
    enableSorting: true,
    state: {
      columnOrder: [
        "mrt-row-select", //move the built-in selection column to the end of the table
        "mrt-row-drag",
        "name",
        "description",
        "order",
        "mrt-row-expand",
        "branch",
        "category",
        "available",
      ],
      isLoading: isArchivedLoading,
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
        <div className="d-flex justify-content-evenly">
          <div>
            {row.original.branch.map((branch, index) => (
              <span key={index} className="badge badge-secondary me-1">
                {branch.branch.name}
              </span>
            ))}
          </div>
          <div>
            {row.original.category.map((category, index) => {
              const label =
                typeof category.category === "string"
                  ? category.category
                  : category.category?.name;
              return (
                <span key={index} className="badge badge-warning me-1">
                  {label}
                </span>
              );
            })}
          </div>
        </div>
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
            activeCategorieses.filter((d) => d !== draggingRow!.original)
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
            Delete Selected
          </Button>
        </Box>
      </>
    ),

    defaultColumn: {
      size: 100,
    },
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: (originalRow) => handleSaveCategories(originalRow),
    getRowId: (originalRow) => `table-2-${originalRow._id}`,
    muiTablePaperProps: {
      onDragEnter: () => setHoveredTable("table-2"),
      sx: {
        outline: hoveredTable === "table-2" ? "2px dashed pink" : undefined,
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
        <Tooltip title="Restore">
          <IconButton
            color="error"
            onClick={async () => {
              await updateCategoryAvailable.mutateAsync({
                id: row.original._id,
                update: { deleted: false },
              });
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
        <Tooltip title="Arrange ChildSubCategories">
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
      {CategoriesDelete && (
        <Modal show={showProductsModal} onHide={handleCloseProductsModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              Arrange Procusts Order in {(CategoriesDelete as any)?.name}{" "}
              SubCategory
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <SubCategoryProductsTable
              id={(CategoriesDelete as any)?._id as string}
            />
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
      )}

      {/* Arrange SubCategories Modal */}
      {CategoriesDelete && (
        <Modal
          show={showSubCategoriesModal}
          onHide={handleCloseSubCategoriesModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Arrange SubCategories Order in {(CategoriesDelete as any)?.name}{" "}
              Category
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <SubCategoryChildsTable
              id={(CategoriesDelete as any)?._id as string}
            />
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
      )}
    </>
  );
};

export { SubCategoriesTable };
