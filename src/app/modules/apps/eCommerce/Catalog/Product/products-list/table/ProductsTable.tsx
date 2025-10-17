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
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { useListView } from "../core/ListViewProvider";
import { useNavigate } from "react-router-dom";
import { useQueryRequest } from "../core/QueryRequestProvider";
import { useTenantNavigation } from "../../../../../../../routing/useTenantNavigation";

const ProductsTable = () => {
  const duplicateRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { getTenantPath } = useTenantNavigation();
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

  const getLabel = (
    maybe: any,
    lookup?: { value: string; label: string }[]
  ) => {
    if (maybe == null) return "";

    const isHex24 = (s: string) => /^[0-9a-fA-F]{24}$/.test(s);

    // If it's already a string, try to find in lookup or return as is (but avoid raw ids)
    if (typeof maybe === "string") {
      if (lookup) {
        const found = lookup.find((l) => l.value === maybe);
        return found ? found.label : isHex24(maybe) ? "" : maybe;
      }
      return isHex24(maybe) ? "" : maybe;
    }

    // If it's an object with name property
    if (typeof maybe === "object") {
      // Handle nested objects like {branch: {_id: "...", name: "..."}}
      if (maybe.name && typeof maybe.name === "string") {
        return maybe.name;
      }

      // localized name object
      if (maybe.name && typeof maybe.name === "object") {
        if (maybe.name.en) return maybe.name.en;
        if (maybe.name.ar) return maybe.name.ar;
        const first = Object.values(maybe.name).find(
          (v) => typeof v === "string"
        );
        if (first) return first as string;
      }

      // Handle objects with _id - check lookup first, avoid showing raw _id
      if (maybe._id && lookup) {
        const found = lookup.find((l) => l.value === maybe._id);
        if (found) return found.label;
      }

      if (maybe._id) return maybe._id; //  exposing raw IDs

      // Final fallback
      return String(maybe);
    }

    return String(maybe);
  };

  const columns = useMemo<MRT_ColumnDef<Product>[]>(
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
        accessorKey: "types",
        header: "Types",
        size: 120,
        Cell: ({ cell }) => {
          const val = cell.getValue() as any[] | undefined;
          if (!val || val.length === 0) return <span>-</span>;
          const labels = val.map((t) => t?.name).filter(Boolean);
          return (
            <span>
              {labels.slice(0, 2).join(", ")}
              {labels.length > 2 ? "..." : ""}
            </span>
          );
        },
      },
      {
        accessorKey: "weight",
        header: "Weight",
        size: 80,
      },
      {
        accessorKey: "dimensions",
        header: "Dims",
        size: 80,
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
          const branchs = cell.getValue<any[]>();
          if (!branchs || branchs.length === 0) return <span>-</span>;
          return (
            <>
              {branchs.map((branch, index) => {
                const maybe = branch?.branch ?? branch;
                const label = getLabel(maybe, memoizedBranches);
                return (
                  <span key={index} className="badge badge-secondary me-1">
                    {label}
                  </span>
                );
              })}
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
          const defV = extractDefaultOptions(
            categories,
            "category",
            memoizedCategories
          );

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
          const categoriess = cell.getValue<any[]>();
          if (!categoriess || categoriess.length === 0) return <span>-</span>;
          const labels = categoriess
            .map((c) => getLabel(c?.category ?? c, memoizedCategories))
            .filter(Boolean) as string[];
          const visible = labels.slice(0, 3);
          const overflow = labels.length - visible.length;
          return (
            <Tooltip title={labels.join(", ")}>
              <div>
                {visible.map((label, idx) => (
                  <span key={idx} className="badge badge-secondary me-1">
                    {label}
                  </span>
                ))}
                {overflow > 0 && (
                  <span className="badge badge-secondary">+{overflow}</span>
                )}
              </div>
            </Tooltip>
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
          const defV = extractDefaultOptions(
            subcategories,
            "subCategory",
            memoizedSubCategories
          );

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
          const categoriess = cell.getValue<any[]>();
          if (!categoriess || categoriess.length === 0) return <span>-</span>;
          const labels = categoriess
            .map((s) => getLabel(s?.subCategory ?? s, memoizedSubCategories))
            .filter(Boolean) as string[];
          const visible = labels.slice(0, 3);
          const overflow = labels.length - visible.length;
          return (
            <Tooltip title={labels.join(", ")}>
              <div>
                {visible.map((label, idx) => (
                  <span key={idx} className="badge badge-secondary me-1">
                    {label}
                  </span>
                ))}
                {overflow > 0 && (
                  <span className="badge badge-secondary">+{overflow}</span>
                )}
              </div>
            </Tooltip>
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
          const defV = extractDefaultOptions(
            childsubcategories,
            "childSubCategory",
            memoizedChildSubCategories
          );

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
          const categoriess = cell.getValue<any[]>();
          if (!categoriess || categoriess.length === 0) return <span>-</span>;
          const labels = categoriess
            .map((cs) =>
              getLabel(cs?.childSubCategory ?? cs, memoizedChildSubCategories)
            )
            .filter(Boolean) as string[];
          const visible = labels.slice(0, 3);
          const overflow = labels.length - visible.length;
          return (
            <Tooltip title={labels.join(", ")}>
              <div>
                {visible.map((label, idx) => (
                  <span key={idx} className="badge badge-secondary me-1">
                    {label}
                  </span>
                ))}
                {overflow > 0 && (
                  <span className="badge badge-secondary">+{overflow}</span>
                )}
              </div>
            </Tooltip>
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
          const groupOfOptions = cell.getValue<
            {
              optionGroup?: { name: string; _id: string };
              groupOfOptions?: any;
            }[]
          >();
          // support nested shapes that use `optionGroup` inside the array items
          const defV = extractDefaultOptions(
            groupOfOptions,
            "optionGroup",
            memoizedGroupsOfOptions
          );

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
          const groups = cell.getValue<any[]>();
          if (!groups || groups.length === 0) return <span>-</span>;
          const labels = groups
            .map((g) => {
              const item = g?.optionGroup;
              return getLabel(item, memoizedGroupsOfOptions);
            })
            .filter(Boolean) as string[];
          const visible = labels.slice(0, 3);
          const overflow = labels.length - visible.length;
          return (
            <Tooltip title={labels.join(", ")}>
              <div>
                {visible.map((label, idx) => (
                  <span key={idx} className="badge badge-secondary me-1">
                    {label}
                  </span>
                ))}
                {overflow > 0 && (
                  <span className="badge badge-secondary">+{overflow}</span>
                )}
              </div>
            </Tooltip>
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
                // selection handled on save; noop here to avoid unused state
                void selected;
              }}
            />
          );
        },
        Cell: ({ cell }) => {
          const v = cell.getValue() as string | undefined;
          return <span>{v ?? "-"}</span>;
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
      memoizedGroupsOfOptions,
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

  const handleSaveCategories = async (originalRow) => {
    editCategoriesSchema
      .validate(originalRow.row.original)
      .catch((err) => setValidationErrors(err.message));
    setValidationErrors({});
    const updatedRowValues = {
      ...originalRow.values,
      branch: editBranch?.map((str) => ({ branch: str })),
      category: editCategory?.map((str) => ({ category: str })),
      subCategory: editSubCategory?.map((str) => ({ subCategory: str })),
      childSubCategory: editChildSubCategory?.map((str) => ({
        childSubCategory: str,
      })),
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
  const handleDeleteClick = () => {
    setShowModal(true);
  };
  const handleConfirmDelete = async () => {
    await deleteItem.mutateAsync();
    setShowModal(false);
  };
  const openEditProductModal = (product: Product) => {
    navigate(getTenantPath(`/apps/eCommerce/productForm/${product._id}`), {
      state: { product },
    });
  };
  const openAddProductModal = (id: string) => {
    if (id === "new") {
      navigate(getTenantPath(`/apps/eCommerce/productForm/new`));
    } else {
      navigate(getTenantPath(`/apps/eCommerce/productForm/${id}`));
    }
  };
  const handleClose = () => {
    setShowModal(false);
  };
  const deleteItem = useMutation(() => deleteProduct(CategoriesDelete as any), {
    onSuccess: () => {
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
      onSuccess: () => {
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
      onSuccess: () => {
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
        "mrt-row-select",
        "mrt-row-drag",
        "order",
        "name",
        "description",
        "price",
        "types",
        "weight",
        "dimensions",
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
      onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }),
      sx: {
        transform: row.getIsExpanded() ? "rotate(180deg)" : "rotate(-90deg)",
        transition: "transform 0.2s",
      },
    }),
    renderDetailPanel: ({ row }) => {
      const p = row.original;
      if (!p) return null;
      const thumbnail = p.imgCover?.[0]?.url || p.images?.[0];
      const shortDesc = (() => {
        const src = p.shortDesc || p.description || "";
        const el = document.createElement("div");
        el.innerHTML = src;
        return (el.textContent || el.innerText || "").trim().substring(0, 300);
      })();

      return (
        <div
          className="d-flex justify-content-between align-items-start"
          style={{ gap: 12 }}
        >
          <div style={{ minWidth: 140 }}>
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={p.name}
                style={{ width: 140, height: "auto", borderRadius: 8 }}
              />
            ) : (
              <div
                style={{
                  width: 140,
                  height: 100,
                  background: "#f3f3f3",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                No image
              </div>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 8 }}>
              <strong>{p.name}</strong>
            </div>

            <div
              style={{
                display: "flex",
                gap: 16,
                marginBottom: 8,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div style={{ fontSize: 12, color: "#666" }}>Price</div>
                <div>
                  <strong>
                    {p.price ?? "-"} {p.price && "EGP"}
                  </strong>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  Price After Discount
                </div>
                <div>
                  <strong>{p.priceAfterDiscount ?? "-"}</strong>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#666" }}>Stock</div>
                <div>{p.stock ?? "-"}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#666" }}>Min Qty</div>
                <div>{p.minQty ?? "-"}</div>
              </div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: "#666" }}>Description</div>
              <div>
                {shortDesc}
                {(p.shortDesc || p.description)?.length > 300 ? "..." : ""}
              </div>
            </div>
          </div>
        </div>
      );
    },
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
                const selcetedIDs = [];
                table
                  .getSelectedRowModel()
                  .rows.map((item) => selcetedIDs.push(item.original._id));
                await deleteSelectedItems.mutateAsync(selcetedIDs);
                table.toggleAllRowsSelected(false);
              }}
              className="rounded bg-danger rounded-circle p-0 border-0"
            >
              <i className="fa-solid fa-trash text-white fa-2xl p-3"></i>
            </button>
          </Tooltip>
        </Box>
      </>
    ),
    data: activeProducts,
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
          align: "center",
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
        "mrt-row-select",
        "mrt-row-drag",
        "order",
        "name",
        "description",
        "price",
        "types",
        "weight",
        "dimensions",
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
      onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }),
      sx: {
        transform: row.getIsExpanded() ? "rotate(180deg)" : "rotate(-90deg)",
        transition: "transform 0.2s",
      },
    }),
    renderDetailPanel: ({ row }) => {
      const p = row.original;
      if (!p) return null;
      const thumbnail = p.imgCover?.[0]?.url || p.images?.[0];
      const shortDesc = (() => {
        const src = p.shortDesc || p.description || "";
        const el = document.createElement("div");
        el.innerHTML = src;
        return (el.textContent || el.innerText || "").trim().substring(0, 300);
      })();

      return (
        <div
          className="d-flex justify-content-between align-items-start"
          style={{ gap: 12 }}
        >
          <div style={{ minWidth: 140 }}>
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={p.name}
                style={{ width: 140, height: "auto", borderRadius: 8 }}
              />
            ) : (
              <div
                style={{
                  width: 140,
                  height: 100,
                  background: "#f3f3f3",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                No image
              </div>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 8 }}>
              <strong>{p.name}</strong>
              <div style={{ fontSize: 12, color: "#666" }}>
                ID: {p._id} {p.slug ? `· ${p.slug}` : null}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 16,
                marginBottom: 8,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div style={{ fontSize: 12, color: "#666" }}>Price</div>
                <div>
                  <strong>
                    {p.price ?? "-"} {p.price && "EGP"}
                  </strong>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#666" }}>
                  Price After Discount
                </div>
                <div>
                  <strong>{p.priceAfterDiscount ?? "-"}</strong>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "#666" }}>Stock</div>
                <div>{p.stock ?? "-"}</div>
              </div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: "#666" }}>Description</div>
              <div>
                {shortDesc}
                {(p.shortDesc || p.description)?.length > 300 ? "..." : ""}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {p.category?.map((c, i) => {
                const label = getLabel(c?.category ?? c, memoizedCategories);
                return (
                  <span key={i} className="badge badge-warning me-1">
                    {label}
                  </span>
                );
              })}
              {p.subCategory?.map((s, i) => {
                const label = getLabel(
                  s?.subCategory ?? s,
                  memoizedSubCategories
                );
                return (
                  <span key={"s-" + i} className="badge badge-primary me-1">
                    {label}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      );
    },

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
          align: "center",
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

      <Modal show={showProductsModal} onHide={handleCloseProductsModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            Arrange Products Order in {CategoriesDelete?.name} Category
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* arrange products UI placeholder - implement as needed */}
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

function extractDefaultOptions(
  items: any[] | undefined,
  key: string,
  options: { value: string; label: string }[]
): { value: string; label: string }[] {
  if (!items || !Array.isArray(items)) return [];

  const isHex24 = (s: any) =>
    typeof s === "string" && /^[0-9a-fA-F]{24}$/.test(s);

  const mapped = items
    .map((item) => {
      // If item is a string ID
      if (typeof item === "string") {
        const found = options.find((o) => o.value === item);
        return found ?? { value: item, label: isHex24(item) ? "—" : item };
      }

      // If item has the nested key (e.g. { category: { _id, name } })
      const nested = item?.[key];
      if (nested) {
        // nested can be a string id or an object
        if (typeof nested === "string") {
          const found = options.find((o) => o.value === nested);
          return (
            found ?? { value: nested, label: isHex24(nested) ? "—" : nested }
          );
        }
        const id = nested._id ?? nested.id ?? nested.value;
        const name = nested.name ?? nested.label;
        if (id) {
          const found = options.find((o) => o.value === id);
          return (
            found ?? {
              value: id,
              label: String(name ?? (isHex24(id) ? "—" : id)),
            }
          );
        }
      }

      // Fallback: item itself may have _id/name structure
      const id = item._id ?? item.id ?? item.value;
      const name = item.name ?? item.label;
      if (id) {
        const found = options.find((o) => o.value === id);
        return (
          found ?? {
            value: id,
            label: String(name ?? (isHex24(id) ? "—" : id)),
          }
        );
      }

      return null;
    })
    .filter(Boolean) as { value: string; label: string }[];

  // remove any entries with empty label
  return mapped.filter((m) => m.label && String(m.label).trim() !== "");
}

export { ProductsTable };
