// export {CategoriesesTable}
import { useEffect, useMemo, useState } from 'react';
import {useQueryResponseData,useQueryRefetch} from '../core/QueryResponseProvider'
import { useQueryResponseData as branchesData } from '../../../Branch/branches-list/core/QueryResponseProvider';
import { useQueryResponseData as categoriesData } from '../../../Category/categories-list/core/QueryResponseProvider';
import {SubCategories} from '../core/_models'
import {
  type MRT_TableOptions,
  type MRT_ColumnDef,
  type MRT_Row,
  MaterialReactTable,
//   useMaterialReactTable,
//   MRT_TableContainer,
  MRT_ToolbarAlertBanner,
  useMaterialReactTable,
  MRT_TableContainer,
  MRT_TablePagination,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton
  // MRT_ActionMenuItem,
  // MRT_ToggleDensePaddingButton,
} from 'material-react-table';
// import { Divider } from '@mui/material';
import Select from 'react-select'
import { Box, Typography, Button, IconButton, Tooltip } from '@mui/material';
import { deleteSubCategory, deleteSelectedSubCategories, getAllProductsInSubCategory, updateSubCategory } from '../core/_requests';
import { useMutation,useQuery,useQueryClient } from 'react-query';
import { QUERIES } from '../../../../../../../../_metronic/helpers';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as Yup from 'yup'
import { Modal } from 'react-bootstrap'
import {useListView} from '../core/ListViewProvider'
// import { TablesWidget12 } from '../../../../../../../../_metronic/partials/widgets';
import { getArchivedBranches,getBranches } from '../../../Branch/branches-list/core/_requests';
import {  SubCategoryProductsTable } from '../../products-list/subCategoryProductsTable';
import { SubCategoryChildsTable } from '../../childSubCategories-list/subCategoryChildsTable';
import { getArchivedCategories, getCategories } from '../../../Category/categories-list/core/_requests';
// import { CategorySubsTable } from '../../subCategories-list/categorySubsTable';

const ArchivedSubCategoriesTable = () => {

  const {selected, clearSelected, } = useListView()
  const queryClient = useQueryClient();
  const {setItemIdForUpdate} = useListView()
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
  const {active,archived} = useQueryResponseData()
  const {active : activeBranches,archived : archivedBranches} = branchesData();
  const {active : activeCategories,archived : archivedCategories} = categoriesData();
  // console.log("activeBranches",[...activeBranches,...archivedBranches])
  const refetch = useQueryRefetch();
  const [trigger, setTrigger] = useState(false);
  // const isLoading = useQueryResponseLoading()
  const [activeCategorieses, setActiveCategorieses] = useState<SubCategories[]>(active);
  const [archivedCategorieses, setArchivedCategorieses] = useState<SubCategories[]>(() => archived);
  const [draggingRow, setDraggingRow] = useState<MRT_Row<SubCategories> | null>(null);
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false)
  const [showProductsModal, setShowProductsModal] = useState(false)
  const [showSubCategoriesModal, setShowSubCategoriesModal] = useState(false);
  const [CategoriesDelete,setCategoriesDelete] = useState();
  const[branches,setBranches]=useState([...activeBranches,...archivedBranches]);
  const[categories,setCategories]=useState([...activeCategories,...archivedCategories]);
  const [loading, setLoading] = useState(true);
  const [editBranch, setEditBranch]=useState();
  const [editCategory, setEditCategory]=useState();
  let enableQuery = CategoriesDelete?._id !== undefined? true:false
// setBranches([...activeBranches,...archivedBranches]);
// console.log('branches',branches)
  // Fetch branches data
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const resActive = await getBranches();
        const resArchived = await getArchivedBranches();
        setBranches([...resActive.data, ...resArchived.data]);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };
    fetchBranches();
    const fetchCategories = async () => {
      try {
        const resActive = await getCategories();
        const resArchived = await getArchivedCategories();
        setCategories([...resActive.data, ...resArchived.data]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);
  const memoizedBranches = useMemo(() => branches.map(branch => ({ value: branch._id, label: branch.name })), [branches]);
  const memoizedCategories = useMemo(() => categories.map(category => ({ value: category._id, label: category.name })), [categories]);

  const columns = useMemo<MRT_ColumnDef<SubCategories>[]>(
    //column definitions...
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
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
        accessorKey: 'description',
        header: 'Description',
        size: 100, 
      },
      {
        accessorKey: 'order',
        header: 'Order',
        size: 30, 
        muiTableBodyCellProps: {
          align: 'center',
        },
        muiTableHeadCellProps: {
          align: 'center',
        },
      },
      {
        accessorKey: 'available',
        header: 'Available',
        size: 100, 
        muiTableBodyCellProps: {
          align: 'right',
        },
        muiTableHeadCellProps: {
          align: 'left',
        },
        Cell: ({ cell }) => (
          // <span className={`badge ${cell.getValue<boolean>() == true?'badge-success':'badge-danger'}`}>{cell.getValue<number>().toLocaleString()}</span>
          <div className="form-check form-switch form-check-custom form-check-solid">
          <input className="form-check-input cursor-pointer" type="checkbox" checked={cell.getValue<boolean>()} onClick={()=> updateCategoryAvailable.mutateAsync({id:cell.row.original._id,update:{available:!cell.row.original.available}})} id={cell.row.original._id}/>
          {/* {console.log('cell',cell.row.original)} */}
      </div>
        
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        editVariant: 'select',
        grow: true,
        size: 200, 
        muiTableBodyCellProps: {
          align: 'center',
        },
        muiTableHeadCellProps: {
          align: 'center',
        },
        Edit: ({cell, row, table}) => {
          const categories = cell.getValue<{ category: { name: string , _id:string} }[]>();
          console.log("categories from sub",categories)
          let defV =[]
          categories.map(category => {
            defV.push({value:category?.category?._id, label:category?.category?.name})
            
          })
          console.log('edit',defV)
          
          return (
            // loading ? (
            //   <div>Loading...</div>
            // ) : (
              <Select
                className='react-select-styled'
                classNamePrefix='react-select'
                isMulti
                options={memoizedCategories}
                defaultValue={defV}
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 9999 })
                }}
                onChange={(selected) => {
                  const updatedBranches = selected ? selected.map((option) => option.value  ) : [];
                 console.log('updatedBranches',updatedBranches)
                 setEditCategory(updatedBranches) 
                 // table.setEditingCell(row.id, 'branch', updatedBranches);
                }}
              />
            // )
          );
        },
        Cell: ({ cell }) => {
          const categoriess = cell.getValue<{ category: { name: string } }[]>();
          console.log('categoriess',categoriess)
          return (
            <>
              {categoriess?.map(category => <span className="badge badge-warning me-1">
              {category.category.name}
            </span>)}
            </>
            // <span className="badge badge-secondary">
            //   {branch.branch.name}
            // </span>
          );
        },
      },
      {
        accessorKey: 'branch',
        header: 'Branch',
        editVariant: 'select',
        grow: true,
        size: 200, 
        muiTableBodyCellProps: {
          align: 'center',
        },
        muiTableHeadCellProps: {
          align: 'center',
        },
        Edit: ({cell, row, table}) => {
          const branchs = cell.getValue<{ branch: { name: string , _id:string} }[]>();
          // console.log("branchs from sub",branchs)
          let defV =[]
          branchs.map(branch => {
            defV.push({value:branch.branch._id, label:branch.branch.name})
            
          })
          // console.log('edit',defV)
          
          return (
            // loading ? (
            //   <div>Loading...</div>
            // ) : (
              <Select
                className='react-select-styled'
                classNamePrefix='react-select'
                isMulti
                options={memoizedBranches}
                defaultValue={defV}
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 9999 })
                }}
                onChange={(selected) => {
                  const updatedBranches = selected ? selected.map((option) => option.value  ) : [];
                //  console.log('updatedBranches',updatedBranches)
                 setEditBranch(updatedBranches) 
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
              {branchs.map(branch => <span className="badge badge-secondary me-1">
              {branch.branch.name}
            </span>)}
            </>
            // <span className="badge badge-secondary">
            //   {branch.branch.name}
            // </span>
          );
        },
      },
    ],
    [memoizedBranches, activeBranches, archivedBranches, branches,validationErrors],
  );

  const editSubCategoriesSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .required('Name is required'),
      description: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .optional(),
      imgCover: Yup.string()
      .min(3, 'Minimum 3 symbols')
      .optional(),
      order: Yup.number()
      .min(1, 'Minimum order is 1')
      .optional(),
      branch: Yup.array().of(Yup.string())
      .min(1, 'Minimum 3 symbols')
      .optional(),
      category: Yup.array().of(Yup.string())
      .min(1, 'Minimum 3 symbols')
      .optional(),
      available: Yup.boolean()
      .optional(),
      deleted: Yup.boolean()
      .optional(),
  })
  //UPDATE SubCategories
  const handleSaveCategories  = async (originalRow) => {
    // console.log(originalRow)
     editSubCategoriesSchema.validate(originalRow.row.original)
    .catch((err)=> setValidationErrors(err.message))
    setValidationErrors({});
    const updatedRowValues = {
      ...originalRow.values,
      branch: editBranch?.map(str => ({ branch: str })), // assuming branch is an array of objects with value and label
      category: editCategory?.map(str => ({ category: str })), // assuming branch is an array of objects with value and label
    };
    // console.log(editCategory)

    await  updateCategoryAvailable.mutateAsync({id:originalRow.row.original._id,update:updatedRowValues});
    table1.setEditingRow(null); //exit editing mode
  };

  //Arrange products action
  const handleArrangeProductsClick = () => {
    setShowProductsModal(true)
  }
  const handleCloseProductsModal = () => {
    setShowProductsModal(false)
  }
  //Arrange SubCategories action
  const handleArrangeSubsClick = () => {
    setShowSubCategoriesModal(true)
  }
  const handleCloseSubCategoriesModal = () => {
    setShowSubCategoriesModal(false)
  }
  //DELETE action
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
  const deleteItem = useMutation(() => deleteSubCategory(CategoriesDelete as string), {
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      queryClient.invalidateQueries([`${QUERIES.CATEGORIES_LIST}`]);
      queryClient.invalidateQueries([`${QUERIES.ARCHIVED_CATEGORIES_LIST}`]);
      queryClient.refetchQueries([`${QUERIES.CATEGORIES_LIST}`])
      queryClient.refetchQueries([`${QUERIES.ARCHIVED_CATEGORIES_LIST}`])
      setTrigger(true)
    },
  })

  const deleteSelectedItems = useMutation((ids:string[]) => deleteSelectedSubCategories(ids), {
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      queryClient.invalidateQueries([`${QUERIES.CATEGORIES_LIST}`]);
      queryClient.invalidateQueries([`${QUERIES.ARCHIVED_CATEGORIES_LIST}`]);
      refetch();

      setTrigger(true)
      clearSelected()
    },
  })


  const updateCategoryAvailable = useMutation(({id,update}) => updateSubCategory(id,update), {
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      refetch();
      setTrigger(true)

    },
  })
  
  const commonTableProps: Partial<MRT_TableOptions<SubCategories>> & {
    columns: MRT_ColumnDef<SubCategories>[];
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
  useEffect(()=>{
      // console.log("Categoriese",active)
      setActiveCategorieses(active);
      setArchivedCategorieses(archived);
      console.log('archived',archived)
      setBranches([...activeBranches,...archivedBranches])
  },[active,archived, trigger,activeBranches,archivedBranches])
 

  const table = useMaterialReactTable({
    ...commonTableProps,
    data: archivedCategorieses,
    enableRowSelection: true,
    enableStickyHeader: true,
    enableCellActions: true,
    // enableClickToCopy: 'context-menu',
    enableEditing: true,
    editDisplayMode: 'row',
    createDisplayMode: 'row', 
    rowPinningDisplayMode: 'select-sticky',
    positionToolbarAlertBanner: 'bottom',
    positionActionsColumn:'last',
    enableRowOrdering: true,
    enableSorting: false,
    enableExpandAll: false,
    defaultColumn: {
      size: 100,
    },
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
          'available'
  
        ],
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
      renderDetailPanel: ({ row }) =>
        row.original.branch ? (
          <div className="d-flex justify-content-evenly">
          <div>
          {row.original.branch.map((branch,index) => <span key={index} className="badge badge-secondary me-1">
                {branch.branch.name}
              </span>)}
            </div>
          <div>
          {row.original.category.map((category,index) => <span key={index} className="badge badge-warning me-1">
                {category.category.name}
              </span>)}
            </div>
          
         
          </div>
        ) : null,
    
    
    
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave:(originalRow) => handleSaveCategories(originalRow),
    getRowId: (originalRow) => `table-${originalRow.name}`,

        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
              <Tooltip title="Edit">
                <IconButton onClick={() => table.setEditingRow(row)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton color="error" 
                onClick={() =>{
                  setCategoriesDelete(row.original._id);
                  handleDeleteClick(); 
                  // table.toggleAllRowsSelected(false) 
                }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Arrange products">
                <IconButton color="success" 
                onClick={() =>{
                  setCategoriesDelete(row.original);
                  handleArrangeProductsClick(); 
                  // table.toggleAllRowsSelected(false) 
                }}
                >
                  <i className="fa-brands fa-2xl text-primary fa-product-hunt"></i>
                </IconButton>
              </Tooltip>
              <Tooltip title="Arrange ChildSubCategories">
                <IconButton color="warning" 
                onClick={() =>{
                  setCategoriesDelete(row.original);
                  handleArrangeSubsClick();
                  // table.toggleAllRowsSelected(false) 
                }}
                >
                  <i className="fa-solid fa-layer-group text-warning"></i>
                </IconButton>
              </Tooltip>
            </Box>
          ),
        muiRowDragHandleProps: ({table}) =>  ({
            onDragEnd: () => {
              const { draggingRow, hoveredRow } = table.getState();
      
              console.log('draggingRow',draggingRow)
              console.log('hoveredRow',hoveredRow)
              if (draggingRow && hoveredRow) {
                   updateCategoryAvailable.mutateAsync({id:draggingRow?.original._id,update:{order:hoveredRow?.original.order}})
                // console.log('getRowId',draggingRow?.original._id)
                //  await updateCategoryAvailable.mutateAsync({id:draggingRow?.original._id,update:{deleted:false}})
                setActiveCategorieses((activeCategorieses) => [...activeCategorieses, draggingRow!.original]);
                setArchivedCategorieses((archivedCategorieses) => archivedCategorieses.filter((d) => d !== draggingRow!.original));
              }
            //   setHoveredTable(null);
            },
          }),
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
       sx={{  padding: '16px' }}
    >
      <Box
        sx={(theme) => ({
          display: 'flex',
          backgroundColor: 'inherit',
          borderRadius: '4px',
          flexDirection: 'row',
          gap: '16px',
          justifyContent: 'space-between',
          padding: '24px 16px',
          '@media max-width: 768px': {
            flexDirection: 'column',
          },
        })}
      >
        <span className="badge badge-danger">Archived</span>
       
        <Box sx={{ display: 'flex', gap: '1rem', p: '0px', justifyContent: 'right' }}>
         
      
          <Button
          color="warning"
          // disabled={!table.getIsSomeRowsSelected()}
          onClick={async() => {
            // let selcetedIDs =[];
            table.getSelectedRowModel().rows.map(async(item) =>{ 
              await updateCategoryAvailable.mutateAsync({id:item.original._id,update:{available:!item.original.available}})
              // selcetedIDs.push(item.original._id)
            })
            // console.log(selcetedIDs);
            // console.log(table.getState().rowSelection);
            // selected = selcetedIDs;
            //  await updateSelectedItems.mutateAsync(selcetedIDs);
            table.toggleAllRowsSelected(false) ;

          }}
          variant="contained"
        >
          Toggle Available
        </Button>
        <Button
          color="error"
          // disabled={!table.getIsSomeRowsSelected()}
          onClick={async() => {
            let selcetedIDs =[];
            table.getSelectedRowModel().rows.map((item) => selcetedIDs.push(item.original._id))
            // console.log(selcetedIDs);
            // console.log(table.getState().rowSelection);
            // selected = selcetedIDs;
             await deleteSelectedItems.mutateAsync(selcetedIDs);
            table.toggleAllRowsSelected(false) ;

          }}
          variant="contained"
        >
          Delete Selected
          
        </Button>
        </Box>
        <MRT_GlobalFilterTextField table={table} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MRT_ToggleFiltersButton table={table} />
          <MRT_ShowHideColumnsButton table={table} />
          <MRT_ToggleDensePaddingButton table={table} />
          <Tooltip title="Print">
            <IconButton onClick={() => window.print()}>
              {/* <PrintIcon /> */}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <MRT_TableContainer  table={table} />
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <MRT_TablePagination table={table} />
        </Box>
        <Box sx={{ display: 'grid', width: '100%' }}>
          <MRT_ToolbarAlertBanner stackAlertBanner table={table} />
        </Box>
      </Box>
    </Box>

      {/* Delete Modal */}
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

      {/* Arrange Products Modal */}
    <Modal show={showProductsModal} onHide={handleCloseProductsModal}>
        <Modal.Header closeButton>
          <Modal.Title>Arrange Procusts Order in {CategoriesDelete?.name} SubCategory</Modal.Title>
        </Modal.Header>
        <Modal.Body>      
          <SubCategoryProductsTable  id={CategoriesDelete?._id as string} />
        </Modal.Body>
        <Modal.Footer>
        <Box sx={{ display: 'flex', gap: '1rem', p: '4px' }}>

          <Button color='info' variant="contained" onClick={handleCloseProductsModal}>
            Close
          </Button>
        </Box>
        </Modal.Footer>
      </Modal>
      
      {/* Arrange SubCategories Modal */}
    <Modal show={showSubCategoriesModal} onHide={handleCloseSubCategoriesModal}>
        <Modal.Header closeButton>
          <Modal.Title>Arrange SubCategories Order in {CategoriesDelete?.name} Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>      
          <SubCategoryChildsTable  id={CategoriesDelete?._id as string} />
        </Modal.Body>
        <Modal.Footer>
        <Box sx={{ display: 'flex', gap: '1rem', p: '4px' }}>

          <Button color='info' variant="contained" onClick={handleCloseSubCategoriesModal}>
            Close
          </Button>
        </Box>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export  {ArchivedSubCategoriesTable};
