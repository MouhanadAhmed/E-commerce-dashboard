// export {CategoriesesTable}
import { useEffect, useMemo, useState } from 'react';
import {useQueryResponseData,useQueryRefetch} from '../core/QueryResponseProvider'
import { useQueryResponseData as branchesData } from '../../../Branch/branches-list/core/QueryResponseProvider';
import {Categories} from '../core/_models'
import {
  type MRT_TableOptions,
  type MRT_ColumnDef,
  type MRT_Row,
  MaterialReactTable,
  useMaterialReactTable,
  MRT_TableContainer,
  // MRT_ActionMenuItem,
  // MRT_ToggleDensePaddingButton,
} from 'material-react-table';
// import { Divider } from '@mui/material';
import Select from 'react-select'
import { Box, Typography, Button, IconButton, Tooltip } from '@mui/material';
import { deleteCategory, deleteSelectedCategories, getAllProductsInCategory, updateCategory, updateSelectedCategories } from '../core/_requests';
import { useMutation,useQuery,useQueryClient } from 'react-query';
import { QUERIES } from '../../../../../../../../_metronic/helpers';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as Yup from 'yup'
import { Modal } from 'react-bootstrap'
import {useListView} from '../core/ListViewProvider'
// import { TablesWidget12 } from '../../../../../../../../_metronic/partials/widgets';
import { getArchivedBranches,getBranches } from '../../../Branch/branches-list/core/_requests';
import { CategoryProductsTable } from '../../products-list/categoryProductsTable';
import { CategorySubsTable } from '../../subCategories-list/categorySubsTable';
import { ArchivedCategoriesTable } from './ArchivedCategoriesTable';

const CategoriesTable = () => {

  const {selected, clearSelected, } = useListView()
  const queryClient = useQueryClient();
  const {setItemIdForUpdate} = useListView()
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
  const {active,archived} = useQueryResponseData()
  const {active : activeBranches,archived : archivedBranches} = branchesData();
  // console.log("activeBranches",[...activeBranches,...archivedBranches])
  const refetch = useQueryRefetch();
  const [trigger, setTrigger] = useState(false);
  // const isLoading = useQueryResponseLoading()
  const [activeCategorieses, setActiveCategorieses] = useState<Categories[]>(active);
  const [archivedCategorieses, setArchivedCategorieses] = useState<Categories[]>(() => archived);
  const [draggingRow, setDraggingRow] = useState<MRT_Row<Categories> | null>(null);
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false)
  const [showProductsModal, setShowProductsModal] = useState(false)
  const [showSubCategoriesModal, setShowSubCategoriesModal] = useState(false);
  const [CategoriesDelete,setCategoriesDelete] = useState();
  const[branches,setBranches]=useState([...activeBranches,...archivedBranches]);
  const [loading, setLoading] = useState(true);
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
  }, []);
  const memoizedBranches = useMemo(() => branches.map(branch => ({ value: branch._id, label: branch.name })), [branches]);

  const columns = useMemo<MRT_ColumnDef<Categories>[]>(
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
                 setEditCategory(updatedBranches) 
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

  const editCategoriesSchema = Yup.object().shape({
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
      available: Yup.boolean()
      .optional(),
      deleted: Yup.boolean()
      .optional(),
  })
  //UPDATE Categories
  const handleSaveCategories  = async (originalRow) => {
    // console.log(originalRow)
     editCategoriesSchema.validate(originalRow.row.original)
    .catch((err)=> setValidationErrors(err.message))
    setValidationErrors({});
    const updatedRowValues = {
      ...originalRow.values,
      branch: editCategory.map(str => ({ branch: str })), // assuming branch is an array of objects with value and label
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
  const deleteItem = useMutation(() => deleteCategory(CategoriesDelete as string), {
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

  const deleteSelectedItems = useMutation((ids:string[]) => deleteSelectedCategories(ids), {
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
  const updateCategoryAvailable = useMutation(({id,update}) => updateCategory(id,update), {
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      // queryClient.invalidateQueries([`${QUERIES.CATEGORIES_LIST}`]);
      // queryClient.invalidateQueries([`${QUERIES.ARCHIVED_CATEGORIES_LIST}`]);
      // queryClient.refetchQueries([`${QUERIES.CATEGORIES_LIST}`])
      // queryClient.refetchQueries([`${QUERIES.ARCHIVED_CATEGORIES_LIST}`])
      refetch();
      setTrigger(true)

    },
  })
  
  const commonTableProps: Partial<MRT_TableOptions<Categories>> & {
    columns: MRT_ColumnDef<Categories>[];
  } = {
    columns,
    enableRowDragging: true,
    enableFullScreenToggle: false,
    muiTableContainerProps: {
      sx: {
        minHeight: '320px',
      },
    },
    // onDraggingRowChange: setDraggingRow,
    // state: { draggingRow },
  };
  useEffect(()=>{
      // console.log("Categoriese",active)
      setActiveCategorieses(active);
      setArchivedCategorieses(archived);
      // console.log('brnaches',activeBranches)
      setBranches([...activeBranches,...archivedBranches])
  },[active,archived, trigger,activeBranches,archivedBranches])
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
    enableClickToCopy: 'context-menu',
    enableEditing: true,
    editDisplayMode: 'row',
    createDisplayMode: 'row', 
    rowPinningDisplayMode: 'select-sticky',
    positionToolbarAlertBanner: 'bottom',
    positionActionsColumn:'last',
    enableRowOrdering: true,
    enableSorting: false,
    enableExpandAll: false,
    state: {
      columnOrder: [
        'mrt-row-select', //move the built-in selection column to the end of the table
        'mrt-row-drag',
        'name',
        'description',
        'order',
        'mrt-row-expand',
        'branch',
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
        <>
        {row.original.branch.map(branch => <span className="badge badge-secondary me-1">
              {branch.branch.name}
            </span>)}
        </>
      ) : null,
      muiRowDragHandleProps: ({ table }) => ({
      onDragEnd: async() => {
        const { draggingRow, hoveredRow } = table.getState();
        // console.log('hoveredRow',hoveredRow)
        if (hoveredTable === 'table-2') {
          // console.log('draggingRow',draggingRow)
          setHoveredTable(null);
          await updateCategoryAvailable.mutateAsync({id:draggingRow?.original._id,update:{deleted:true}})

          setArchivedCategorieses((archivedCategorieses) => [...archivedCategorieses, draggingRow!.original]);
          setActiveCategorieses((activeCategorieses) => activeCategorieses.filter((d) => d !== draggingRow!.original));
        }else if (hoveredRow && draggingRow) {
          
          // console.log('hoveredRow',hoveredRow)
        // console.log('draggingRow',draggingRow)
          await updateCategoryAvailable.mutateAsync({id:draggingRow?.original._id,update:{order:hoveredRow?.original.order}})
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
      <Box sx={{ display: 'flex', gap: '1rem', p: '4px', justifyContent: 'right' }}>
             
             {/* <Typography color="success.main" component="span" variant="h4">
        Active List
      </Typography> */}
        <Button
          color="info"
          onClick={openAddCategoryModal}
          variant="contained"
        >
          Add Category
        </Button>
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
      </>
    ),
    data: activeCategorieses,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave:(originalRow) => handleSaveCategories(originalRow),
    getRowId: (originalRow) => `table-1-${originalRow.name}`,
    // muiRowDragHandleProps: {
    //   onDragEnd: async() => {
    //     if (hoveredTable === 'table-2') {
    //       await updateCategoryAvailable.mutateAsync({id:draggingRow?.original._id,update:{deleted:true}})

    //       setArchivedCategorieses((archivedCategorieses) => [...archivedCategorieses, draggingRow!.original]);
    //       setActiveCategorieses((activeCategorieses) => activeCategorieses.filter((d) => d !== draggingRow!.original));
    //     }
    //     setHoveredTable(null);
    //   },
    // },
    muiTablePaperProps: {
      onDragEnter: () => setHoveredTable('table-1'),
      sx: {
        outline: hoveredTable === 'table-1' ? '2px dashed green' : undefined,
      },
    },
    displayColumnDefOptions: {
      'mrt-row-actions': {
        // size: 50, //set custom width
        muiTableHeadCellProps: {
          align: 'center', //change head cell props
        },
      },},
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
        <Tooltip title="Arrange SubCategories">
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
  });

  const table2 = useMaterialReactTable({
    ...commonTableProps,
    data: archivedCategorieses,
    enableRowSelection: true,
    enableStickyHeader: true,
    enableCellActions: true,
    enableClickToCopy: 'context-menu',
    enableEditing: true,
    editDisplayMode: 'row',
    createDisplayMode: 'row', 
    rowPinningDisplayMode: 'select-sticky',
    positionToolbarAlertBanner: 'bottom',
    positionActionsColumn:'last',
    enableRowOrdering: true,
    enableSorting: false,
    enableExpandAll: false,
    state: {
      columnOrder: [
        'mrt-row-select', //move the built-in selection column to the end of the table
        'mrt-row-drag',
        'name',
        'description',
        'order',
        'mrt-row-expand',
        'branch',
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
        <>
        {row.original.branch.map(branch => <span className="badge badge-secondary me-1">
              {branch.branch.name}
            </span>)}
        </>
      ) : null,
    
      muiRowDragHandleProps: ({ table }) => ({
        onDragEnd: async() => {
          const { draggingRow, hoveredRow } = table.getState();
          // console.log('hoveredRow',hoveredRow)
          if (hoveredTable === 'table-1') {
            // console.log('draggingRow',draggingRow)
            setHoveredTable(null);
            await updateCategoryAvailable.mutateAsync({id:draggingRow?.original._id,update:{deleted:false}})
  
            setArchivedCategorieses((archivedCategorieses) => [...archivedCategorieses, draggingRow!.original]);
            setActiveCategorieses((activeCategorieses) => activeCategorieses.filter((d) => d !== draggingRow!.original));
          }else if (hoveredRow && draggingRow) {
            
            // console.log('hoveredRow',hoveredRow)
          // console.log('draggingRow',draggingRow)
            await updateCategoryAvailable.mutateAsync({id:draggingRow?.original._id,update:{order:hoveredRow?.original.order}})
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
        <Box sx={{ display: 'flex', gap: '1rem', p: '4px', justifyContent: 'right' }}>
               
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
        </>
      ),

      
    defaultColumn: {
      size: 100,
    },
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave:(originalRow) => handleSaveCategories(originalRow),
    getRowId: (originalRow) => `table-2-${originalRow.name}`,
    muiTablePaperProps: {
      onDragEnter: () => setHoveredTable('table-2'),
      sx: {
        outline: hoveredTable === 'table-2' ? '2px dashed pink' : undefined,
      },
    },
    displayColumnDefOptions: {
      'mrt-row-actions': {
        // size: 350, //set custom width
        muiTableHeadCellProps: {
          align: 'center', //change head cell props
        },
      },},
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
          <Tooltip title="Arrange SubCategories">
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
  });


  return (
    <>
    
    <Box
      sx={{
        display: 'grid',
        // gridTemplateColumns: { xs: 'auto', lg: '1fr 1fr' },
        gap: '1rem',
        overflow: 'auto',
        p: '4px',
      }}
    >
      <MaterialReactTable  table={table1} />
    </Box>
    <Box
      sx={{
        display: 'grid',
        // gridTemplateColumns: { xs: 'auto', lg: '1fr 1fr' },
        gap: '1rem',
        overflow: 'auto',
        p: '4px',
      }}
    >
      <MaterialReactTable  table={table2} />

      {/* <ArchivedCategoriesTable/> */}
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
          <Modal.Title>Arrange Procusts Order in {CategoriesDelete?.name} Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>      
          <CategoryProductsTable  id={CategoriesDelete?._id } />
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
          <CategorySubsTable  id={CategoriesDelete?._id } />
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

export  {CategoriesTable};
