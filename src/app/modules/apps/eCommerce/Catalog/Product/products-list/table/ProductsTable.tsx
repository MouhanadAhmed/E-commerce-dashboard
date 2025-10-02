// export {CategoriesesTable}
import { useEffect, useMemo, useRef, useState } from "react";
import {
  useQueryResponseData,
  useQueryRefetch,
} from "../core/QueryResponseProvider";
import { useQueryResponseData as branchesData } from "../../../Branch/branches-list/core/QueryResponseProvider";
import { useQueryResponseData as categoriesData } from "../../../Category/categories-list/core/QueryResponseProvider";
import { useQueryResponseData as subcategoriesData } from "../../../SubCategory/Subcategories-list/core/QueryResponseProvider";
import { useQueryResponseData as childSubCategoryData } from "../../../ChildSubCategory/ChildSubcategories-list/core/QueryResponseProvider";
import { useQueryResponseData as typesData } from "../../../Type/categories-list/core/QueryResponseProvider";
import { useQueryResponseData as extrasData } from "../../../Extra/categories-list/core/QueryResponseProvider";
import { Product } from "../core/_models";
import {
  type MRT_TableOptions,
  type MRT_ColumnDef,
  type MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
  // MRT_TableContainer,
  // MRT_ActionMenuItem,
  // MRT_ToggleDensePaddingButton,
} from "material-react-table";
// import { Divider } from '@mui/material';
import Select from "react-select";
import {
  Box,
  Button,
  IconButton,
  Input,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  deleteProduct,
  deleteSelectedProducts,
  updateProduct,
  updateSelectedProducts,
  duplicateProduct,
} from "../core/_requests";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { QUERIES } from "../../../../../../../../_metronic/helpers";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import * as Yup from "yup";
import { Modal } from "react-bootstrap";
import { useListView } from "../core/ListViewProvider";
// import { TablesWidget12 } from '../../../../../../../../_metronic/partials/widgets';
import {
  getArchivedBranches,
  getBranches,
} from "../../../Branch/branches-list/core/_requests";
// import { CategoryProductsTable } from '../../products-list/categoryProductsTable';
// import { CategorySubsTable } from '../../subCategories-list/categorySubsTable';
// import { ArchivedCategoriesTable } from './ArchivedCategoriesTable';
import {
  getArchivedCategories,
  getCategories,
} from "../../../Category/categories-list/core/_requests";
import {
  getArchivedSubCategories,
  getSubCategories,
} from "../../../SubCategory/Subcategories-list/core/_requests";
import {
  getArchivedChildSubCategories,
  getChildSubCategories,
} from "../../../ChildSubCategory/ChildSubcategories-list/core/_requests";
import {
  getArchivedExtras,
  getExtras,
} from "../../../Extra/categories-list/core/_requests";
import {
  getArchivedTypes,
  getTypes,
} from "../../../Type/categories-list/core/_requests";
import { Link } from "react-router-dom";
import { useQueryRequest } from "../core/QueryRequestProvider";

const ProductsTable = () => {
  const duplicateRef = useRef<HTMLInputElement>(null);
  const { selected, clearSelected } = useListView();
  const queryClient = useQueryClient();
  const { setItemIdForUpdate } = useListView();
  const { state, updateState } = useQueryRequest();
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});
  const { active, archived } = useQueryResponseData();
  const { active: activeBranches, archived: archivedBranches } = branchesData();
  const { active: activeCategories, archived: archivedCategories } =
    categoriesData();
  const { active: activeSubCategories, archived: archivedSubCategories } =
    subcategoriesData();
  const {
    active: activeChildSubCategories,
    archived: archivedChildSubCategories,
  } = childSubCategoryData();
  const { active: activeExtras, archived: archivedExtras } = extrasData();
  const { active: activeTypes, archived: archivedTypes } = typesData();
  // console.log("activeBranches",[...activeBranches,...archivedBranches])
  const refetch = useQueryRefetch();
  const [trigger, setTrigger] = useState(false);
  // const isLoading = useQueryResponseLoading()
  const [activeProducts, setActiveProducts] = useState<Product[]>(
    active.data || []
  );
  const [archivedProducts, setArchivedProducts] = useState<Product[]>(
    () => archived.data || []
  );
  const [draggingRow, setDraggingRow] = useState<MRT_Row<Product> | null>(null);
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
  const [branches, setBranches] = useState([
    ...activeBranches,
    ...archivedBranches,
  ]);
  const [categories, setCategories] = useState([
    ...activeCategories,
    ...archivedCategories,
  ]);
  const [subcategories, setSubCategories] = useState([
    ...activeSubCategories,
    ...archivedSubCategories,
  ]);
  const [childSubCategories, setChildSubCategories] = useState([
    ...activeChildSubCategories,
    ...archivedChildSubCategories,
  ]);
  const [extras, setExtras] = useState([...activeExtras, ...archivedExtras]);
  const [types, setTypes] = useState([...activeTypes, ...archivedTypes]);
  const [loading, setLoading] = useState(true);
  const [editBranch, setEditBranch] = useState<any[] | undefined>();
  const [editCategory, setEditCategory] = useState<any[] | undefined>();
  const [editSubCategory, setEditSubCategory] = useState<any[] | undefined>();
  const [editChildSubCategory, setEditChildSubCategory] = useState<
    any[] | undefined
  >();
  const [editExtra, setEditExtra] = useState<any[] | undefined>();
  const [editType, setEditType] = useState<any[] | undefined>();
  const [book, setBook] = useState<any | undefined>();

  // Fetch branches data
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const resActive = await getBranches();
        const resArchived = await getArchivedBranches();
        setBranches([...resActive.data, ...resArchived.data]);
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };
    fetchBranches();
    const fetchCategories = async () => {
      try {
        const resActive = await getCategories();
        const resArchived = await getArchivedCategories();
        setCategories([...resActive.data, ...resArchived.data]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
    const fetchSubCategories = async () => {
      try {
        const resActive = await getSubCategories();
        const resArchived = await getArchivedSubCategories();
        setSubCategories([...resActive.data, ...resArchived.data]);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };
    fetchSubCategories();
    const fetchChildSubCategories = async () => {
      try {
        const resActive = await getChildSubCategories();
        const resArchived = await getArchivedChildSubCategories();
        setChildSubCategories([...resActive.data, ...resArchived.data]);
      } catch (error) {
        console.error("Error fetching childsubcategories:", error);
      }
    };
    fetchChildSubCategories();
    const fetchExtras = async () => {
      try {
        const resActive = await getExtras();
        const resArchived = await getArchivedExtras();
        setExtras([...resActive.data, ...resArchived.data]);
      } catch (error) {
        console.error("Error fetching extras:", error);
      }
    };
    fetchExtras();
    const fetchTypes = async () => {
      try {
        const resActive = await getTypes();
        const resArchived = await getArchivedTypes();
        setTypes([...resActive.data, ...resArchived.data]);
      } catch (error) {
        console.error("Error fetching types:", error);
      }
    };
    fetchTypes();
  }, []);

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
  const memoizedExtras = useMemo(
    () => extras.map((extra) => ({ value: extra._id, label: extra.name })),
    [extras]
  );
  const memoizedTypes = useMemo(
    () => types.map((type) => ({ value: type._id, label: type.name })),
    [types]
  );

  const parser = new DOMParser();
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
          // console.log('doc',innerText.trim())
          // Show only first 100 characters to simulate short description
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
          // <span className={`badge ${cell.getValue<boolean>() == true?'badge-success':'badge-danger'}`}>{cell.getValue<number>().toLocaleString()}</span>
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
            {/* {console.log('cell',cell.row.original)} */}
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
          // <span className={`badge ${cell.getValue<boolean>() == true?'badge-success':'badge-danger'}`}>{cell.getValue<number>().toLocaleString()}</span>
          <div className="form-check form-switch form-check-custom form-check-solid">
            <input
              className="form-check-input cursor-pointer"
              type="checkbox"
              checked={cell.getValue<boolean>()}
              onClick={() =>
                updateCategoryAvailable.mutateAsync({
                  id: cell.row.original._id,
                  update: { showWeight: !cell.row.original.showWeight },
                })
              }
              id={cell.row.original._id}
            />
            {/* {console.log('cell',cell.row.original)} */}
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
          // console.log('edit',defV)

          return (
            // loading ? (
            //   <div>Loading...</div>
            // ) : (
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
                //  console.log('updatedBranches',updatedBranches)
                setEditBranch(updatedBranches);
                // table.setEditingCell(row.id, 'branch', updatedBranches);
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
                  {branch?.branch?.name}
                </span>
              ))}
            </>
            // <span className="badge badge-secondary">
            //   {branch.branch.name}
            // </span>
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
          // console.log("categories from sub",categories)
          let defV = [];
          categories.map((category) => {
            defV.push({
              value: category?.category?._id,
              label: category?.category?.name,
            });
          });
          console.log("edit", defV);

          return (
            // loading ? (
            //   <div>Loading...</div>
            // ) : (
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
                //  console.log('updatedBranches',updatedBranches)
                setEditCategory(updatedBranches);
                // table.setEditingCell(row.id, 'branch', updatedBranches);
              }}
            />
            // )
          );
        },
        Cell: ({ cell }) => {
          const categoriess = cell.getValue<{ category: { name: string } }[]>();
          // console.log('categoriess',categoriess)
          return (
            <>
              {categoriess?.map((category) => (
                <span className="badge badge-warning me-1">
                  {category.category?.name}
                </span>
              ))}
            </>
            // <span className="badge badge-secondary">
            //   {branch.branch.name}
            // </span>
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
          console.log("subcategories from child", subcategories);
          let defV = [];
          subcategories.map((subCategory) => {
            defV.push({
              value: subCategory?.subCategory?._id,
              label: subCategory?.subCategory?.name,
            });
          });
          // console.log('edit',defV)

          return (
            // loading ? (
            //   <div>Loading...</div>
            // ) : (
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
                //  console.log('updatedBranches',updatedBranches)
                setEditSubCategory(updatedBranches);
                // table.setEditingCell(row.id, 'branch', updatedBranches);
              }}
            />
            // )
          );
        },
        Cell: ({ cell }) => {
          const categoriess =
            cell.getValue<{ subCategory: { name: string } }[]>();
          // console.log('categoriess',categoriess)
          return (
            <>
              {categoriess?.map((subCategory) => (
                <span className="badge badge-primary me-1">
                  {subCategory?.subCategory?.name}
                </span>
              ))}
            </>
            // <span className="badge badge-secondary">
            //   {branch.branch.name}
            // </span>
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
          // console.log("subcategories from child",subcategories)
          let defV = [];
          childsubcategories.map((childSubCategory) => {
            defV.push({
              value: childSubCategory?.childSubCategory?._id,
              label: childSubCategory?.childSubCategory?.name,
            });
          });
          // console.log('edit',defV)

          return (
            // loading ? (
            //   <div>Loading...</div>
            // ) : (
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
                //  console.log('updatedBranches',updatedBranches)
                setEditChildSubCategory(ChildSubCategories);
                // table.setEditingCell(row.id, 'branch', updatedBranches);
              }}
            />
            // )
          );
        },
        Cell: ({ cell }) => {
          const categoriess =
            cell.getValue<{ childSubCategory: { name: string } }[]>();
          // console.log('categoriess',categoriess)
          return (
            <>
              {categoriess?.map((childSubCategory) => (
                <span className="badge badge-primary me-1">
                  {childSubCategory?.childSubCategory?.name}
                </span>
              ))}
            </>
            // <span className="badge badge-secondary">
            //   {branch.branch.name}
            // </span>
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
          // console.log("subcategories from child",subcategories)
          let defV = [];
          // childsubcategories.map(childSubCategory => {
          //   defV.push({value:childSubCategory?.childSubCategory?._id, label:childSubCategory?.childSubCategory?.name})

          // })
          // console.log('edit',defV)

          return (
            // loading ? (
            //   <div>Loading...</div>
            // ) : (
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
                //  console.log('updatedBranches',updatedBranches)
                setBook(selected);
                // table.setEditingCell(row.id, 'branch', updatedBranches);
              }}
            />
            // )
          );
        },
        Cell: ({ cell }) => {
          // const categoriess = cell.getValue();
          // console.log('categoriess',categoriess)
          return (
            <>
              <span className="badge badge-primary me-1">
                {cell.getValue() as string}
              </span>
            </>
            // <span className="badge badge-secondary">
            //   {branch.branch.name}
            // </span>
          );
        },
      },
      // {
      //   accessorKey: 'extras',
      //   header: 'Extras',
      //   editVariant: 'select',
      //   grow: true,
      //   size: 200,
      //   muiTableBodyCellProps: {
      //     align: 'center',
      //   },
      //   muiTableHeadCellProps: {
      //     align: 'center',
      //   },
      //   Edit: ({cell, row, table}) => {
      //     const extras = cell.getValue<{ extras: { name: string , _id:string} }[]>();
      //     // console.log("subcategories from child",subcategories)
      //     let defV =[]
      //     extras.map(extra => {
      //       defV.push({value:extra?.extra?._id, label:extra?.extra?.name})

      //     })
      //     // console.log('edit',defV)

      //     return (
      //       // loading ? (
      //       //   <div>Loading...</div>
      //       // ) : (
      //         <Select
      //           className='react-select-styled'
      //           classNamePrefix='react-select'
      //           isMulti
      //           options={memoizedExtras}
      //           defaultValue={defV}
      //           menuPortalTarget={document.body}
      //           styles={{
      //             menuPortal: base => ({ ...base, zIndex: 9999 })
      //           }}
      //           onChange={(selected) => {
      //             const Extras = selected ? selected.map((option) => option.value  ) : [];
      //           //  console.log('updatedBranches',updatedBranches)
      //           setEditExtra(Extras)
      //            // table.setEditingCell(row.id, 'branch', updatedBranches);
      //           }}
      //         />
      //       // )
      //     );
      //   },
      //   Cell: ({ cell }) => {
      //     const extras = cell.getValue<{ extras: { name: string } }[]>();
      //     // console.log('categoriess',categoriess)
      //     return (
      //       <>
      //         {extras?.map(extra => <span className="badge badge-primary me-1">
      //         {extra?.extra?.name}
      //       </span>)}
      //       </>
      //       // <span className="badge badge-secondary">
      //       //   {branch.branch.name}
      //       // </span>
      //     );
      //   },
      // },
      // {
      //   accessorKey: 'types',
      //   header: 'Types',
      //   editVariant: 'select',
      //   grow: true,
      //   size: 200,
      //   muiTableBodyCellProps: {
      //     align: 'center',
      //   },
      //   muiTableHeadCellProps: {
      //     align: 'center',
      //   },
      //   Edit: ({cell, row, table}) => {
      //     const types = cell.getValue<{ types: { name: string , _id:string} }[]>();
      //     // console.log("subcategories from child",subcategories)
      //     let defV =[]
      //     types.map(type => {
      //       defV.push({value:type?._id, label:type?.name})

      //     })
      //     // console.log('edit',defV)

      //     return (
      //       // loading ? (
      //       //   <div>Loading...</div>
      //       // ) : (
      //         <Select
      //           className='react-select-styled'
      //           classNamePrefix='react-select'
      //           isMulti
      //           options={memoizedTypes}
      //           defaultValue={defV}
      //           menuPortalTarget={document.body}
      //           styles={{
      //             menuPortal: base => ({ ...base, zIndex: 9999 })
      //           }}
      //           onChange={(selected) => {
      //             const updatedTypes = selected ? selected.map((option) => option.value  ) : [];
      //           //  console.log('updatedBranches',updatedBranches)
      //           setEditType(updatedTypes)
      //            // table.setEditingCell(row.id, 'branch', updatedBranches);
      //           }}
      //         />
      //       // )
      //     );
      //   },
      //   Cell: ({ cell }) => {
      //     const itemTypes = cell.getValue<{ types: { name: string } }[]>();
      //     // console.log('categoriess',categoriess)
      //     return (
      //       <>
      //         {itemTypes?.map(type => <span className="badge badge-primary me-1">
      //         {type?.name}
      //       </span>)}
      //       </>
      //       // <span className="badge badge-secondary">
      //       //   {branch.branch.name}
      //       // </span>
      //     );
      //   },
      // },
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
    // console.log(originalRow)
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
      // extras: editExtra?.map(str => ({ extra: str })),
      // types: editType,
    };
    // console.log(editCategory)

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
    () => deleteProduct(CategoriesDelete as string),
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

  // const {
  //   isLoading,
  //   data: productsData,
  //   error,
  // } = useQuery(
  //   `${QUERIES.CATEGORIES_LIST}-products-${CategoriesDelete?._id}`,
  //   () => {
  //     return getAllProductsInCategory(CategoriesDelete?._id)
  //   },
  //   {
  //     cacheTime: 0,
  //     enabled: enableQuery,
  //     onError: (err) => {
  //       // setItemIdForUpdate(undefined)
  //       console.error(err)
  //     },
  //   }
  // )
  // console.log(active)
  const updateCategoryAvailable = useMutation(
    ({ id, update }: { id: string; update: any }) => updateProduct(id, update),
    {
      // 💡 response of the mutation is passed to onSuccess
      onSuccess: () => {
        // ✅ update detail view directly
        // queryClient.invalidateQueries([`${QUERIES.CATEGORIES_LIST}`]);
        // queryClient.invalidateQueries([`${QUERIES.ARCHIVED_CATEGORIES_LIST}`]);
        // queryClient.refetchQueries([`${QUERIES.CATEGORIES_LIST}`])
        // queryClient.refetchQueries([`${QUERIES.ARCHIVED_CATEGORIES_LIST}`])
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
    // onDraggingRowChange: setDraggingRow,
    // state: { draggingRow },
  };
  useEffect(() => {
    // Access the data property from the response objects
    setActiveProducts(active.data || []);
    setArchivedProducts(archived.data || []);
    setBranches([...activeBranches, ...archivedBranches]);
  }, [active.data, archived.data, trigger, activeBranches, archivedBranches]);
  // useEffect(() => {
  //   const getAvBranches = async () => {
  //     try {
  //       const res = await getBranches();
  //       const res2 = await getArchivedBranches();
  //       setBranches([...res.data, ...res2.data]);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching branches:", error);
  //       setLoading(false);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   getAvBranches();
  // }, []);
  // console.log('brenacj',branches.map(branch => ({ value: branch._id, label: branch.name })))
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
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
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
        // 'extras',
        // 'types',
        "available",
        "showWeight",
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
        // <Box
        //   sx={{
        //     display: 'grid',
        //     margin: 'auto',
        //     gridTemplateColumns: '1fr 1fr',
        //     width: '100%',
        //   }}
        // >

        //   {/* <Typography>Address: {row.original.name}</Typography> */}
        //   {/* <Typography>City: {row.original.description}</Typography> */}
        //   {/* <Typography>State: {row.original.state}</Typography>
        //   <Typography>Country: {row.original.country}</Typography> */}
        // </Box>
        <div className="d-flex justify-content-evenly">
          <div>
            Branches :
            {row.original.branch.map((branch, index) => (
              <span key={index} className="badge badge-secondary me-1">
                {branch?.branch?.name}
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
          {/* <div>
          extras : 
        {row.original.extras.map((extra,index) => <span key={index} className="badge badge-primary me-1">
              {extra?.extra?.name}
            </span>)}
          </div>
        <div>
          types : 
        {row.original.types.map((type,index) => <span key={index} className="badge badge-primary me-1">
              {type?.name}
            </span>)}
          </div> */}
        </div>
      ) : null,
    muiRowDragHandleProps: ({ table }) => ({
      onDragEnd: async () => {
        const { draggingRow, hoveredRow } = table.getState();
        // console.log('hoveredRow',hoveredRow)
        if (hoveredTable === "table-2") {
          // console.log('draggingRow',draggingRow)
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
          // console.log('hoveredRow',hoveredRow)
          // console.log('draggingRow',draggingRow)
          await updateCategoryAvailable.mutateAsync({
            id: draggingRow?.original._id,
            update: { order: hoveredRow?.original.order },
          });
          setHoveredTable(null);
          // setTrigger(true)
          // data.splice(
          // (hoveredRow as MRT_Row<Person>).index,
          // 0,
          // data.splice(draggingRow.index, 1)[0],
          // );
          // setData([...data]);
        }
      },
    }),
    // pinnedColumn:'selection',
    // positionSelectionColumn:'first',
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
          {/* <Typography color="success.main" component="span" variant="h4">
        Active List
      </Typography> */}
          <Tooltip title="Add product">
            <button
              type="button"
              onClick={openAddCategoryModal}
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
          {/* <Button
          color="warning"
          onClick={async() => {
            table.getSelectedRowModel().rows.map(async(item) =>{ 
              await updateCategoryAvailable.mutateAsync({id:item.original._id,update:{available:!item.original.available}})
            })
            table.toggleAllRowsSelected(false) ;
          }}
          variant="contained"
        >
          Toggle Available
        </Button> */}
          {/* <Button
          color="error"
          onClick={async() => {
            let selcetedIDs =[];
            table.getSelectedRowModel().rows.map((item) => selcetedIDs.push(item.original._id))
             await deleteSelectedItems.mutateAsync(selcetedIDs);
            table.toggleAllRowsSelected(false) ;

          }}
          variant="contained"
        >
          Delete Selected
          
        </Button> */}
        </Box>
      </>
    ),
    data: activeProducts,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: (originalRow) => handleSaveCategories(originalRow),
    getRowId: (originalRow) => `table-1-${originalRow.name}`,
    // muiRowDragHandleProps: {
    //   onDragEnd: async() => {
    //     if (hoveredTable === 'table-2') {
    //       await updateCategoryAvailable.mutateAsync({id:draggingRow?.original._id,update:{deleted:true}})

    //       setArchivedProducts((archivedProducts) => [...archivedProducts, draggingRow!.original]);
    //       setActiveProducts((activeProducts) => activeProducts.filter((d) => d !== draggingRow!.original));
    //     }
    //     setHoveredTable(null);
    //   },
    // },
    muiTablePaperProps: {
      onDragEnter: () => setHoveredTable("table-1"),
      sx: {
        outline: hoveredTable === "table-1" ? "2px dashed green" : undefined,
      },
    },
    displayColumnDefOptions: {
      "mrt-row-actions": {
        // size: 50, //set custom width
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
              setCategoriesDelete(row.original);
              handleDeleteClick();
              // table.toggleAllRowsSelected(false)
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit product Forum">
          <Link to={`/apps/eCommerce/productForm/${row.original._id}`}>
            <IconButton
              color="info"
              onClick={() => {
                console.log("row.original", row.original);

                // setCategoriesDelete(row.original);
                // handleArrangeProductsClick();
                // table.toggleAllRowsSelected(false)
              }}
            >
              {/* <i className="fa-brands fa-2xl text-primary fa-product-hunt"></i> */}
              <SettingsIcon />
            </IconButton>
          </Link>
        </Tooltip>
        <Tooltip title="Duplicate Product">
          <IconButton
            color="info"
            onClick={() => {
              // setProductToDuplicate(row.original._id);
              // handleArrangeSubsClick();
              // table.toggleAllRowsSelected(false)
              console.log("row.original._id", row.original._id);
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
    // Add pagination props:
    enablePagination: true,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
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
        "order",
        "name",
        "description",
        "price",
        "mrt-row-expand",
        "branch",
        "category",
        "subCategory",
        "childSubCategory",
        // 'extras',
        // 'types',
        "available",
        "showWeight",
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
        // <Box
        //   sx={{
        //     display: 'grid',
        //     margin: 'auto',
        //     gridTemplateColumns: '1fr 1fr',
        //     width: '100%',
        //   }}
        // >

        //   {/* <Typography>Address: {row.original.name}</Typography> */}
        //   {/* <Typography>City: {row.original.description}</Typography> */}
        //   {/* <Typography>State: {row.original.state}</Typography>
        //   <Typography>Country: {row.original.country}</Typography> */}
        // </Box>
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
        // console.log('hoveredRow',hoveredRow)
        if (hoveredTable === "table-1") {
          // console.log('draggingRow',draggingRow)
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
          // console.log('hoveredRow',hoveredRow)
          // console.log('draggingRow',draggingRow)
          await updateCategoryAvailable.mutateAsync({
            id: draggingRow?.original._id,
            update: { order: hoveredRow?.original.order },
          });
          setHoveredTable(null);
          // setTrigger(true)
          // data.splice(
          // (hoveredRow as MRT_Row<Person>).index,
          // 0,
          // data.splice(draggingRow.index, 1)[0],
          // );
          // setData([...data]);
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
          {/* <Typography color="success.main" component="span" variant="h4">
          Active List
        </Typography> */}
          {/* <Button
            color="info"
            onClick={openAddCategoryModal}
            variant="contained"
          >
            Add Category
          </Button> */}
          <Button
            color="warning"
            // disabled={!table.getIsSomeRowsSelected()}
            onClick={async () => {
              // let selcetedIDs =[];
              table.getSelectedRowModel().rows.map(async (item) => {
                await updateCategoryAvailable.mutateAsync({
                  id: item.original._id,
                  update: { available: !item.original.available },
                });
                // selcetedIDs.push(item.original._id)
              });
              // console.log(selcetedIDs);
              // console.log(table.getState().rowSelection);
              // selected = selcetedIDs;
              //  await updateSelectedItems.mutateAsync(selcetedIDs);
              table.toggleAllRowsSelected(false);
            }}
            variant="contained"
          >
            Toggle Available
          </Button>
          <Button
            color="error"
            // disabled={!table.getIsSomeRowsSelected()}
            onClick={async () => {
              let selcetedIDs = [];
              table
                .getSelectedRowModel()
                .rows.map((item) => selcetedIDs.push(item.original._id));
              // console.log(selcetedIDs);
              // console.log(table.getState().rowSelection);
              // selected = selcetedIDs;
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
        // size: 350, //set custom width
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
              setCategoriesDelete(row.original);
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
              setCategoriesDelete(row.original);
              handleArrangeProductsClick();
              // table.toggleAllRowsSelected(false)
            }}
          >
            <i className="fa-brands fa-2xl text-primary fa-product-hunt"></i>
          </IconButton>
        </Tooltip>
        <Tooltip title="Arrange SubCategories">
          <IconButton
            color="warning"
            onClick={() => {
              console.log("row.original._id", row.original._id);
              setProductToDuplicate(row.original);
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

  return (
    <>
      <Box
        sx={{
          display: "grid",
          // gridTemplateColumns: { xs: 'auto', lg: '1fr 1fr' },
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
          // gridTemplateColumns: { xs: 'auto', lg: '1fr 1fr' },
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
                // handleAddItems
                await duplicateItem.mutateAsync();
                // duplicateItem(duplicateRef?.current?.value)
                console.log("duplicateRef", duplicateRef?.current?.value);
                console.log("productToDuplicate", productToDuplicate);
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
