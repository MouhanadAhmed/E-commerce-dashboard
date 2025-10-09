// export {CategoriesesTable}
import { useEffect, useMemo, useRef, useState } from "react";
import {
  useQueryResponseData,
  useQueryRefetch,
} from "../core/QueryResponseProvider";
import { useActiveBranchesData as branchesData } from "../../../Branch/branches-list/core/QueryResponseProvider";
import { useActiveCategoriesData as categoriesData } from "../../../Category/categories-list/core/QueryResponseProvider";
import { useActiveSubCategoriesData as subcategoriesData } from "../../../SubCategory/Subcategories-list/core/QueryResponseProvider";
import { useActiveChildSubCategoriesData as childSubCategoryData } from "../../../ChildSubCategory/ChildSubcategories-list/core/QueryResponseProvider";
import { useActiveTypesData as typesData } from "../../../Type/types-list/core/QueryResponseProvider";
import { useActiveExtrasData as extrasData } from "../../../Extra/extra-list/core/QueryResponseProvider";
import { useActiveGroupsData as groupsData } from "../../../GroupOfOptions/groupOfOptions-list/core/QueryResponseProvider";
import { Product } from "../core/_models";
import {
  type MRT_TableOptions,
  type MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import Select from "react-select";
import { Box, Button, IconButton, TextField, Tooltip } from "@mui/material";
import {
  deleteProduct,
  deleteSelectedProducts,
  updateProduct,
  duplicateProduct,
} from "../core/_requests";
import { useMutation, useQueryClient } from "react-query";
import { QUERIES } from "../../../../../../../../_metronic/helpers";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsIcon from "@mui/icons-material/Settings";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { useListView } from "../core/ListViewProvider";
import { Link, useNavigate } from "react-router-dom";
import { useQueryRequest } from "../core/QueryRequestProvider";

const ProductsTable = () => {
  const duplicateRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { state, updateState } = useQueryRequest();
  const { selected, clearSelected } = useListView();
  const queryClient = useQueryClient();
  const { setItemIdForUpdate } = useListView();
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});
  const { active, archived } = useQueryResponseData();
  const branches = branchesData();
  const categories = categoriesData();
  const subcategories = subcategoriesData();
  const childSubCategories = childSubCategoryData();
  const extras = extrasData();
  const types = typesData();
  const groups = groupsData();
  const refetch = useQueryRefetch();
  const [trigger, setTrigger] = useState(false);
  const [activeProducts, setActiveProducts] = useState<Product[]>(
    active.data || []
  );
  const [archivedProducts, setArchivedProducts] = useState<Product[]>(
    () => archived.data || []
  );
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [showSubCategoriesModal, setShowSubCategoriesModal] = useState(false);
  const [CategoriesDelete, setCategoriesDelete] = useState<
    Product | undefined
  >();
  const [productToDuplicate, setProductToDuplicate] = useState<
    Product | undefined
  >();
  const [editBranch, setEditBranch] = useState<any[] | undefined>();
  const [editCategory, setEditCategory] = useState<any[] | undefined>();
  const [editSubCategory, setEditSubCategory] = useState<any[] | undefined>();
  const [editChildSubCategory, setEditChildSubCategory] = useState<
    any[] | undefined
  >();
  const [editGroups, setEditGroups] = useState<any[] | undefined>();
  const [book, setBook] = useState<any | undefined>();

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
  const memoizedChildSubCategories = useMemo(
    () =>
      childSubCategories.map((childSubCategory) => ({
        value: childSubCategory._id,
        label: childSubCategory.name,
      })),
    [childSubCategories]
  );
  const memoizedGroupsOfOptions = useMemo(
    () =>
      groups.map((group) => ({
        value: group._id,
        label: group.name,
      })),
    [groups]
  );
  const memoizedExtras = useMemo(
    () => extras.map((extra) => ({ value: extra._id, label: extra.name })),
    [extras]
  );
  const memoizedTypes = useMemo(
    () => types.map((type) => ({ value: type._id, label: type.name })),
    [types]
  );

  const columns = useMemo<MRT_ColumnDef<Product>[]>(
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
        header: "Short Description",
        size: 200,
        Cell: ({ cell }) => {
          const cellValue = cell.getValue() as string;
          if (!cellValue) return <span>-</span>;

          const tempElement = document.createElement("div");
          tempElement.innerHTML = cellValue;
          const innerText = tempElement.textContent || tempElement.innerText;
          const shortText = innerText.trim().substring(0, 100);
          return (
            <span>
              {shortText}
              {innerText.length > 100 ? "..." : ""}
            </span>
          );
        },
        muiEditTextFieldProps: {
          multiline: true,
          rows: 3,
        },
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
        accessorKey: "price",
        header: "Price",
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
        accessorKey: "showWeight",
        header: "Show Weight",
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
                  update: { showWeight: !cell.row.original.showWeight },
                })
              }
              id={cell.row.original._id}
            />
          </div>
        ),
      },
      {
        accessorKey: "fractionalQuantity",
        header: "Fractional Quantity",
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
                  update: {
                    fractionalQuantity: !cell.row.original.fractionalQuantity,
                  },
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
        Edit: ({ cell, row, table }) => {
          const branchs =
            cell.getValue<{ branch: { name: string; _id: string } }[]>();
          let defV = [];
          branchs.map((branch) => {
            defV.push({
              value: branch?.branch?._id,
              label: branch?.branch?.name,
            });
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
                setEditBranch(updatedBranches);
              }}
            />
          );
        },
        Cell: ({ cell }) => {
          const branchs = cell.getValue<{ branch: { name: string } }[]>();
          return (
            <>
              {branchs.map((branch, index) => (
                <span key={index} className="badge badge-secondary me-1">
                  {branch?.branch?.name}
                </span>
              ))}
            </>
          );
        },
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
          let defV = [];
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
                setEditCategory(updatedBranches);
              }}
            />
          );
        },
        Cell: ({ cell }) => {
          const categoriess = cell.getValue<{ category: { name: string } }[]>();
          return (
            <>
              {categoriess?.map((category, index) => (
                <span key={index} className="badge badge-warning me-1">
                  {category.category?.name}
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
          let defV = [];
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
                setEditSubCategory(updatedBranches);
              }}
            />
          );
        },
        Cell: ({ cell }) => {
          const categoriess =
            cell.getValue<{ subCategory: { name: string } }[]>();
          return (
            <>
              {categoriess?.map((subCategory, index) => (
                <span key={index} className="badge badge-primary me-1">
                  {subCategory?.subCategory?.name}
                </span>
              ))}
            </>
          );
        },
      },
      {
        accessorKey: "childSubCategory",
        header: "ChildSubCategory",
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
          const childsubcategories =
            cell.getValue<
              { childSubCategory: { name: string; _id: string } }[]
            >();
          let defV = [];
          childsubcategories.map((childSubCategory) => {
            defV.push({
              value: childSubCategory?.childSubCategory?._id,
              label: childSubCategory?.childSubCategory?.name,
            });
          });

          return (
            <Select
              className="react-select-styled"
              classNamePrefix="react-select"
              isMulti
              options={memoizedChildSubCategories}
              defaultValue={defV}
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
              onChange={(selected) => {
                const ChildSubCategories = selected
                  ? selected.map((option) => option.value)
                  : [];
                setEditChildSubCategory(ChildSubCategories);
              }}
            />
          );
        },
        Cell: ({ cell }) => {
          const categoriess =
            cell.getValue<{ childSubCategory: { name: string } }[]>();
          return (
            <>
              {categoriess?.map((childSubCategory, index) => (
                <span key={index} className="badge badge-primary me-1">
                  {childSubCategory?.childSubCategory?.name}
                </span>
              ))}
            </>
          );
        },
      },
      {
        accessorKey: "groupOfOptions",
        header: "GroupOfOptions",
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
          const groupOfOptions =
            cell.getValue<
              { groupOfOptions: { name: string; _id: string } }[]
            >();
          let defV = [];
          groupOfOptions.map((group) => {
            defV.push({
              value: group?.groupOfOptions?._id,
              label: group?.groupOfOptions?.name,
            });
          });

          return (
            <Select
              className="react-select-styled"
              classNamePrefix="react-select"
              isMulti
              options={memoizedGroupsOfOptions}
              defaultValue={defV}
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
              onChange={(selected) => {
                const groupsOfOptions = selected
                  ? selected.map((option) => option.value)
                  : [];
                setEditGroups(groupsOfOptions);
              }}
            />
          );
        },
        Cell: ({ cell }) => {
          const groups =
            cell.getValue<{ groupsOfOptions: { name: string } }[]>();
          return (
            <>
              {groups?.map((group, index) => (
                <span key={index} className="badge badge-primary me-1">
                  {group?.groupsOfOptions?.name}
                </span>
              ))}
            </>
          );
        },
      },
      {
        accessorKey: "book",
        header: "Book",
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
          const childsubcategories = {
            value: cell.getValue(),
            label: cell.getValue(),
          };

          return (
            <Select
              className="react-select-styled"
              classNamePrefix="react-select"
              // isMulti
              options={[
                { value: "regular", label: "regular" },
                { value: "book", label: "book" },
                { value: "only book", label: "only book" },
              ]}
              defaultValue={childsubcategories}
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
              onChange={(selected) => {
                setBook(selected);
              }}
            />
          );
        },
      },
    ],
    [
      validationErrors,
      memoizedBranches,
      memoizedCategories,
      memoizedSubCategories,
      memoizedChildSubCategories,
      memoizedExtras,
      memoizedTypes,
    ]
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
  //UPDATE Product
  const handleSaveCategories = async (originalRow) => {
    editCategoriesSchema
      .validate(originalRow.row.original)
      .catch((err) => setValidationErrors(err.message));
    setValidationErrors({});
    const updatedRowValues = {
      ...originalRow.values,
      branch: editBranch?.map((str) => ({ branch: str })), // assuming branch is an array of objects with value and label
      category: editCategory?.map((str) => ({ category: str })), // assuming branch is an array of objects with value and label
      subCategory: editSubCategory?.map((str) => ({ subCategory: str })), // assuming branch is an array of objects with value and label
      childSubCategory: editChildSubCategory?.map((str) => ({
        childSubCategory: str,
      })),
    };

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
  const openEditProductModal = (product: Product) => {
    console.log("Product being passed:", product);
    // Pass the full product data via route state
    navigate(`/apps/eCommerce/productForm/${product._id}`, {
      state: { product },
    });
  };
  const openAddProductModal = (id: string) => {
    if (id === "new") {
      navigate(`/apps/eCommerce/productForm/new`);
    } else {
      navigate(`/apps/eCommerce/productForm/${id}`);
    }
  };
  const handleClose = () => {
    setShowModal(false);
  };
  const deleteItem = useMutation(() => deleteProduct(CategoriesDelete as any), {
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      queryClient.invalidateQueries([`${QUERIES.CATEGORIES_LIST}`]);
      queryClient.invalidateQueries([`${QUERIES.ARCHIVED_CATEGORIES_LIST}`]);
      queryClient.refetchQueries([`${QUERIES.CATEGORIES_LIST}`]);
      queryClient.refetchQueries([`${QUERIES.ARCHIVED_CATEGORIES_LIST}`]);
      setTrigger(true);
    },
  });
  const duplicateItem = useMutation(
    () =>
      duplicateProduct(
        productToDuplicate?._id,
        Number(duplicateRef?.current?.value)
      ),
    {
      // 💡 response of the mutation is passed to onSuccess
      onSuccess: () => {
        // ✅ update detail view directly
        queryClient.invalidateQueries([`${QUERIES.PRODUCTS_LIST}`]);
        queryClient.invalidateQueries([`${QUERIES.ARCHIVED_PRODUCTS_LIST}`]);
        refetch();
        setTrigger(true);
        handleCloseSubCategoriesModal();
      },
    }
  );

  const deleteSelectedItems = useMutation(
    (ids: string[]) => deleteSelectedProducts(ids),
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
    ({ id, update }: { id: string; update: any }) => updateProduct(id, update),
    {
      // 💡 response of the mutation is passed to onSuccess
      onSuccess: () => {
        refetch();
        setTrigger(true);
      },
    }
  );

  const commonTableProps: Partial<MRT_TableOptions<Product>> & {
    columns: MRT_ColumnDef<Product>[];
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
    // Access the data property from the response objects
    setActiveProducts(active.data || []);
    setArchivedProducts(archived.data || []);
  }, [active.data, archived.data, trigger]);

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
    enablePagination: true,
    state: {
      columnOrder: [
        "mrt-row-select", //move the built-in selection column to the end of the table
        "mrt-row-drag",
        "order",
        "name",
        "description",
        "price",
        "mrt-row-expand",
        "branch",
        "category",
        "subCategory",
        "childSubCategory",
        "groupOfOptions",
        "available",
        "showWeight",
        "fractionalQuantity",
        "book",
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
    //custom expand button rotation
    muiExpandButtonProps: ({ row, table }) => ({
      onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }), //only 1 detail panel open at a time
      sx: {
        transform: row.getIsExpanded() ? "rotate(180deg)" : "rotate(-90deg)",
        transition: "transform 0.2s",
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
                {branch?.name}
              </span>
            ))}
          </div>
          <div>
            Categories :
            {row.original.category.map((category, index) => (
              <span key={index} className="badge badge-warning me-1">
                {category?.category?.name}
              </span>
            ))}
          </div>
          <div>
            subCategories :
            {row.original.subCategory.map((subCategory, index) => (
              <span key={index} className="badge badge-primary me-1">
                {subCategory?.subCategory?.name}
              </span>
            ))}
          </div>
          <div>
            childSubCategories :
            {row.original.childSubCategory.map((childSubCategory, index) => (
              <span key={index} className="badge badge-primary me-1">
                {childSubCategory?.childSubCategory?.name}
              </span>
            ))}
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

          setArchivedProducts((archivedProducts) => [
            ...archivedProducts,
            draggingRow!.original,
          ]);
          setActiveProducts((activeProducts) =>
            activeProducts.filter((d) => d !== draggingRow!.original)
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
          <Tooltip title="Add product">
            <button
              type="button"
              onClick={() => openAddProductModal("new")}
              className="rounded bg-primary rounded-circle p-0 border-0"
            >
              {/* Add Product */}
              <i className="fa-solid fa-plus text-white fa-2xl p-3"></i>
            </button>
          </Tooltip>
          <Tooltip title="Toggle Available">
            <button
              type="button"
              onClick={async () => {
                table.getSelectedRowModel().rows.map(async (item) => {
                  await updateCategoryAvailable.mutateAsync({
                    id: item.original._id,
                    update: { available: !item.original.available },
                  });
                });
                table.toggleAllRowsSelected(false);
              }}
              className="rounded bg-warning rounded-circle p-0 border-0"
            >
              <i className="fa-solid fa-eye text-white fa-2xl p-3"></i>
            </button>
          </Tooltip>
          <Tooltip title="Toggle Show Weight">
            <button
              type="button"
              onClick={async () => {
                table.getSelectedRowModel().rows.map(async (item) => {
                  await updateCategoryAvailable.mutateAsync({
                    id: item.original._id,
                    update: { showWeight: !item.original.showWeight },
                  });
                });
                table.toggleAllRowsSelected(false);
              }}
              className="rounded bg-info rounded-circle p-0 border-0"
            >
              <i className="fa-solid fa-weight-hanging text-white fa-2xl p-3"></i>
            </button>
          </Tooltip>
          <Tooltip title="Delete Selected">
            <button
              type="button"
              onClick={async () => {
                let selcetedIDs = [];
                table
                  .getSelectedRowModel()
                  .rows.map((item) => selcetedIDs.push(item.original._id));
                await deleteSelectedItems.mutateAsync(selcetedIDs);
                table.toggleAllRowsSelected(false);
              }}
              className="rounded bg-danger rounded-circle p-0 border-0"
            >
              {/* Add Product */}
              <i className="fa-solid fa-trash text-white fa-2xl p-3"></i>
            </button>
          </Tooltip>
        </Box>
      </>
    ),
    data: activeProducts,
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
          align: "center", //change head cell props
        },
      },
    },
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => openEditProductModal(row.original)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            color="error"
            onClick={() => {
              setCategoriesDelete(row.original);
              handleDeleteClick();
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Duplicate Product">
          <IconButton
            color="info"
            onClick={() => {
              setProductToDuplicate(row.original);
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
    data: archivedProducts,
    enableRowSelection: true,
    enableStickyHeader: true,
    enableCellActions: true,
    enableClickToCopy: "context-menu",
    enableEditing: true,
    editDisplayMode: "row",
    createDisplayMode: "row",
    enablePagination: true,
    rowPinningDisplayMode: "select-sticky",
    positionToolbarAlertBanner: "bottom",
    positionActionsColumn: "last",
    enableRowOrdering: true,
    enableSorting: false,
    enableExpandAll: false,
    rowCount: archived.total || 0,
    state: {
      columnOrder: [
        "mrt-row-select", //move the built-in selection column to the end of the table
        "mrt-row-drag",
        "order",
        "name",
        "description",
        "price",
        "mrt-row-expand",
        "branch",
        "category",
        "subCategory",
        "childSubCategory",
        "groupOfOptions",
        "available",
        "showWeight",
        "fractionalQuantity",
        "book",
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
        <div className="d-flex justify-content-evenly">
          <div>
            Branches :
            {row.original.branch.map((branch, index) => (
              <span key={index} className="badge badge-secondary me-1">
                {branch.name}
              </span>
            ))}
          </div>
          <div>
            Categories :
            {row.original.category.map((category, index) => (
              <span key={index} className="badge badge-warning me-1">
                {category.category?.name}
              </span>
            ))}
          </div>
          <div>
            subCategories :
            {row.original.subCategory.map((subCategory, index) => (
              <span key={index} className="badge badge-primary me-1">
                {subCategory?.subCategory?.name}
              </span>
            ))}
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

          setArchivedProducts((archivedProducts) => [
            ...archivedProducts,
            draggingRow!.original,
          ]);
          setActiveProducts((activeProducts) =>
            activeProducts.filter((d) => d !== draggingRow!.original)
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
          align: "center", //change head cell props
        },
      },
    },
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => openEditProductModal(row.original)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            color="error"
            onClick={() => {
              setCategoriesDelete(row.original);
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
              setCategoriesDelete(row.original);
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
              setProductToDuplicate(row.original);
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

        {/* <ArchivedCategoriesTable/> */}
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
            Arrange Procusts Order in {CategoriesDelete?.name} Category
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <CategoryProductsTable  id={CategoriesDelete?._id } /> */}
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

      {/* Arrange Duplicate Product Modal */}
      <Modal
        show={showSubCategoriesModal}
        onHide={handleCloseSubCategoriesModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Duplicate {productToDuplicate?.name} Product
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Box
            mb={2}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <TextField
              placeholder="Enter the number of copies"
              type="number"
              inputRef={duplicateRef}
              variant="outlined"
              className=" mx-2"
            />
            <button
              type="button"
              className="btn btn-primary "
              onClick={async () => {
                await duplicateItem.mutateAsync();
              }}
            >
              Add
            </button>
          </Box>
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

export { ProductsTable };
