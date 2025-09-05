import { useMemo, useState, useEffect, useRef } from 'react';
import {
    MaterialReactTable,
    type MRT_ColumnDef,
    useMaterialReactTable,
    MRT_TableOptions,
} from 'material-react-table';
import { Box, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

type Branch = {
    branch: string,
    price?: string,
    available?: boolean,
    stock?: string,
    priceAfterDiscount?: string,
    priceAfterExpiresAt?: string,
    order?: string,
    sold?: string,
    _id: string,
    name?: string,
}

export default function BranchesForm({ branchees ,setUpdatedBranches, formik }: { branchees: Branch[] ,setUpdatedBranches:any, formik: any }) {

    const [newBranches, setNewBranches] = useState<Branch[]>(branchees);
    const previousPriceRef = useRef(formik.values.price);
    // console.log('newBranches',newBranches)
    useEffect(() => {
        setNewBranches(branchees);
    }, [branchees,newBranches]);


useEffect(() => {
  // Only update if price actually changed and we have branches
  if (formik.values.price !== previousPriceRef.current && newBranches.length > 0) {
    const updatedBranches = newBranches.map(branch => ({
      ...branch,
      price: formik.values.price?.toString() || ''
    }));
    
    setNewBranches(updatedBranches);
    setUpdatedBranches(updatedBranches);
    
    // Update the ref with the new price
    previousPriceRef.current = formik.values.price;
  }
}, [formik.values.price, newBranches, setUpdatedBranches]);
    function updateOrPush(array: Branch[], newObject: Branch) {
        const updatedArray = array.map(item => item.branch === newObject.branch ? newObject : item);
        const isExisting = array.findIndex(item => item.branch === newObject.branch);
        if (!isExisting) {

        }else {

            const index =  array.findIndex(item => item.branch === newObject.branch);
            newBranches.splice(index,1,newObject)
        }

        setNewBranches(updatedArray);
        setUpdatedBranches(updatedArray)
    }

    const columns = useMemo<MRT_ColumnDef<Branch>[]>(
        () => [
            {
                // accessorKey: 'branch',
                accessorFn: (row) => row.branch._id !=undefined?row.branch._id:row.branch,
                header: 'id',
                enableEditing: false,
                
            },
            {
                // accessorKey: 'name',
                accessorFn: (row) => row.name !=undefined?row.name:row.branch.name,

                header: 'Name',
                enableEditing: false,
                size: 80,
            },
            {
                accessorKey: 'price',
                
                header: 'Price',
                muiEditTextFieldProps: {
                    required: false,
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
                Cell: ({ cell, row }) => (
                    <div className="form-check form-switch form-check-custom form-check-solid">
                        <input
                            className="form-check-input cursor-pointer"
                            type="checkbox"
                            checked={cell.getValue<boolean>()}
                            onChange={(e) => {
                                const updatedBranches = newBranches.map(branch => 
                                    branch.branch === row.original.branch 
                                        ? { ...branch, available: e.target.checked }
                                        : branch
                                );
                                setNewBranches(updatedBranches);
                                setUpdatedBranches(updatedBranches);
                            }}
                            id={cell.row.original._id}
                        />
                    </div>
                ),
            },
            {
                accessorKey: 'stock',
                header: 'Stock',
                muiEditTextFieldProps: {},
            },
            {
                accessorKey: 'priceAfterDiscount',
                header: 'Price After Discount',
                muiEditTextFieldProps: {},
            },
            {
                accessorKey: 'priceAfterExpiresAt',
                header: 'Discount Expiry',
                muiEditTextFieldProps: {},
            },
            {
                accessorKey: 'order',
                header: 'order',
                muiEditTextFieldProps: {},
            },
            {
                accessorKey: 'sold',
                header: 'sold',
                enableEditing: false,
                muiEditTextFieldProps: {},
            },
        ],
        []
    );

    const handleSaveBranch: MRT_TableOptions<Branch>['onEditingRowSave'] = async ({
        values,
        table,
        row,
    }) => {
        values.branch = row.original.branch;
        updateOrPush(newBranches, values);
        table.setEditingRow(null);
    };

    const table = useMaterialReactTable({
        columns,
        data:newBranches,
        createDisplayMode: 'row',
        editDisplayMode: 'row',
        enableEditing: true,
        initialState: { columnVisibility: { id: false } },
        getRowId: (row) => row?.branch,
        onEditingRowSave: handleSaveBranch,
        renderRowActions: ({ row, table }) => (
            <Box sx={{ display: 'flex', gap: '1rem' }}>
                <Tooltip title="Edit">
                    <IconButton onClick={() => table.setEditingRow(row)}>
                        <EditIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        ),
    });

    return <MaterialReactTable table={table} />;
}
