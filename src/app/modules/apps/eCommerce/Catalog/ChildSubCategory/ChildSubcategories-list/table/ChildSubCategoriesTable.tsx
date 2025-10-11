// export {CategoriesesTable}
import { useEffect, useMemo, useState } from "react";
import {
  useQueryResponseData,
  useQueryRefetch,
  useActiveChildSubCategoriesLoading,
  useArchivedChildSubCategoriesLoading,
} from "../core/QueryResponseProvider";
import { useActiveBranchesData as branchesData } from "../../../Branch/branches-list/core/QueryResponseProvider";
import { useActiveCategoriesData as categoriesData } from "../../../Category/categories-list/core/QueryResponseProvider";
import { useActiveSubCategoriesData as subcategoriesData } from "../../../SubCategory/Subcategories-list/core/QueryResponseProvider";
import { ChildSubCategories } from "../core/_models";
import {
  type MRT_TableOptions,
  type MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import Select from "react-select";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import {
  deleteChildSubCategory,
  deleteSelectedChildSubCategories,
  updateChildSubCategory,
} from "../core/_requests";
import { useMutation, useQueryClient } from "react-query";
import { QUERIES } from "../../../../../../../../_metronic/helpers";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { useListView } from "../core/ListViewProvider";
import { ChildSubCategoryProductsTable } from "../../products-list/ChildSubCategoryProductsTable";

const ChildSubCategoriesTable = () => {
  const { clearSelected } = useListView();
  const queryClient = useQueryClient();
  const { setItemIdForUpdate } = useListView();
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});
  const { active, archived } = useQueryResponseData();
  const branches = branchesData();
  const categories =
    categoriesData();
  const subcategories = subcategoriesData();
  const refetch = useQueryRefetch();
  const [trigger, setTrigger] = useState(false);
  const [activeCategorieses, setActiveCategorieses] =
    useState<ChildSubCategories[]>(active);
  const [archivedCategorieses, setArchivedCategorieses] = useState<
    ChildSubCategories[]
  >(() => archived);
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [CategoriesDelete, setCategoriesDelete] = useState();

  const isActiveLoading = useActiveChildSubCategoriesLoading();
  const isArchivedLoading = useArchivedChildSubCategoriesLoading()
  const [editBranch, setEditBranch] = useState();
  const [editCategory, setEditCategory] = useState();
  const [editSubCategory, setEditSubCategory] = useState();

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
  const memoizedSubCategories = useMemo(
    () =>
      subcategories.map((subCategory) => ({
        value: subCategory._id,
        label: subCategory.name,
      })),
    [subcategories]
  );

  const columns = useMemo<MRT_ColumnDef<ChildSubCategories>[]>(
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
            // )
          );
        },
        Cell: ({ row }) => {
          const categoriess = row.original.category;
          return (
            <>
              {categoriess?.map((category) => (
                <span key={category._id} className="badge badge-warning me-1">
                  {category.category.name}
                </span>
              ))}
            </>
          );
        },
      },
      {
        accessorKey: "subCategory",
        header: "SubCategory",
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
          const subcategories =
            cell.getValue<{ subCategory: { name: string; _id: string } }[]>();
          const defV = [];
          subcategories.map((subCategory) => {
            defV.push({
              value: subCategory?.subCategory?._id,
              label: subCategory?.subCategory?.name,
            });
          });
          return (
            <Select
              className="react-select-styled"
              classNamePrefix="react-select"
              isMulti
              options={memoizedSubCategories}
              defaultValue={defV}
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
              onChange={(selected) => {
                const updatedBranches = selected
                  ? selected.map((option) => option.value)
                  : [];
                setEditSubCategory(updatedBranches as any);
              }}
            />
          );
        },
        Cell: ({ row }) => {
          const categoriess =
            row.original.subCategory;
          return (
            <>
              {categoriess?.map((subCategory) => (
                <span key={subCategory._id} className="badge badge-primary me-1">
                  {subCategory?.subCategory?.name}
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
    [
      memoizedBranches,
      branches,
      validationErrors,
    ]
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
  //UPDATE ChildSubCategories
  const handleSaveCategories = async (originalRow) => {
    try {
      await editSubCategoriesSchema.validate(originalRow.row.original);
      setValidationErrors({});

      const updatedRowValues = {
        ...originalRow.values,
        branch: editBranch ? (editBranch as any).map((str) => ({ branch: str })) : [],
        category: editCategory
          ? (editCategory as any).map((str) => ({ category: str }))
          : [],
        subCategory: editSubCategory
          ? (editSubCategory as any).map((str) => ({ subCategory: str }))
          : [],
      };

      await updateCategoryAvailable.mutateAsync({
        id: originalRow.row.original._id,
        update: updatedRowValues,
      });
      table1.setEditingRow(null);
    } catch (err: any) {
      setValidationErrors({ [err.path]: err.message });
    }
  };

  //Arrange products action
  const handleArrangeProductsClick = () => {
    setShowProductsModal(true);
  };
  const handleCloseProductsModal = () => {
    setShowProductsModal(false);
  };
  //Arrange ChildSubCategories action

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
    () => deleteChildSubCategory(CategoriesDelete as string),
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
    }
  );

  const deleteSelectedItems = useMutation(
    (ids: string[]) => deleteSelectedChildSubCategories(ids),
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
    }
  );

  const updateCategoryAvailable = useMutation(
    ({ id, update }: { id: string; update: Partial<ChildSubCategories> }) => updateChildSubCategory(id, update),
    {
      onSuccess: () => {
        refetch();
        setTrigger(true);
      },
    }
  );

  const commonTableProps: Partial<MRT_TableOptions<ChildSubCategories>> & {
    columns: MRT_ColumnDef<ChildSubCategories>[];
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
    enableRowOrdering: true,
    enableSorting: true,
    enableExpandAll: true,
    state: {
      columnOrder: [
        'mrt-row-select', //move the built-in selection column to the end of the table
        'mrt-row-drag',
        'name',
        'description',
        'order',
        'mrt-row-expand',
        'branch',
        'category',
        'subCategory',
        'available',
      ],
      isLoading: isActiveLoading,
    },
    muiDetailPanelProps: () => ({
      sx: (theme) => ({
        backgroundColor:
          theme.palette.mode === 'dark'
            ? 'rgba(255,210,244,0.1)'
            : 'rgba(0,0,0,0.1)',
      }),
    }),
    //custom expand button rotation
    muiExpandButtonProps: ({ row, table }) => ({
      onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }), //only 1 detail panel open at a time
      sx: {
        transform: row.getIsExpanded() ? 'rotate(180deg)' : 'rotate(-90deg)',
        transition: 'transform 0.2s',
      },
    }),
    //conditionally render detail panel
    renderDetailPanel: ({ row }) =>
      row.original.branch ? (
        <div className="d-flex justify-content-evenly">
          <div>
            Branches :
            {row.original.branch.map((branch, index) => (
              <span key={index} className="badge badge-secondary me-1">
                {branch.branch.name}
              </span>
            ))}
          </div>
          <div>
            Categories :
            {row.original.category.map((category, index) => (
              <span key={index} className="badge badge-warning me-1">
                {category.category.name}
              </span>
            ))}
          </div>
          <div>
            subCategories :
            {row.original.subCategory.map((subCategory, index) => (
              <span key={index} className="badge badge-primary me-1">
                {subCategory.subCategory?.name}
              </span>
            ))}
          </div>
        </div>
      ) : null,
    muiRowDragHandleProps: ({ table }) => ({
      onDragEnd: async () => {
        const { draggingRow, hoveredRow } = table.getState();
        if (hoveredTable === 'table-2') {

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
          setHoveredTable(null);
        } else if (hoveredTable === 'table-1') {
          setHoveredTable(null);

          await updateCategoryAvailable.mutateAsync({
            id: draggingRow?.original._id,
            update: { order: hoveredRow?.original.order },
          });
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
            Add ChildSubCategory
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
    getRowId: (originalRow) => `table-1-${originalRow.name}`,
    muiTablePaperProps: {
      onDragEnter: () => setHoveredTable('table-1'),
      sx: {
        outline: hoveredTable === 'table-1' ? '2px dashed green' : undefined,
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
            }}
          >
            <i className="fa-brands fa-2xl text-primary fa-product-hunt"></i>
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
    enableExpandAll: true,
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
        "subCategory",
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
    //custom expand button rotation
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
            Branches :
            {row.original.branch.map((branch, index) => (
              <span key={index} className="badge badge-secondary me-1">
                {branch.branch?.name}
              </span>
            ))}
          </div>
          <div>
            Categories :
            {row.original.category?.map((category, index) => (
              <span key={index} className="badge badge-warning me-1">
                {category?.category?.name ?? "N/A"}
              </span>
            ))}
          </div>
          <div>
            subCategories :
            {row.original.subCategory?.map((subCategory, index) => (
              <span key={index} className="badge badge-primary me-1">
                {subCategory?.subCategory?.name ?? "N/A"}
              </span>
            ))}
          </div>
        </div>
      ) : null,
    muiRowDragHandleProps: ({ table }) => ({
      onDragEnd: async () => {
        const { draggingRow, hoveredRow } = table.getState();
        if (hoveredTable === "table-1") {

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
          setHoveredTable(null);
        } else if (hoveredTable === "table-2") {
          setHoveredTable(null);

          await updateCategoryAvailable.mutateAsync({
            id: draggingRow?.original._id,
            update: { order: hoveredRow?.original.order },
          });
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
            Arrange Procusts Order in {(CategoriesDelete as any)?.name} SubCategory
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ChildSubCategoryProductsTable id={(CategoriesDelete as any)?._id as string} />
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
    </>
  );
};

export { ChildSubCategoriesTable };