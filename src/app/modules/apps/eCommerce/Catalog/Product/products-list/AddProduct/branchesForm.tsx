import React, { useMemo, useState, useEffect } from 'react';
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

export default function BranchesForm({ branchees ,setUpdatedBranches }: { branchees: Branch[] ,setUpdatedBranches:any }) {
    // let initialBranches = [
    //     { branch: '6559c4abd057da4061a73efa' },
    //     { branch: '6559c51ad057da4061a73efc' },
    //     { branch: '665ece003817f2af2ecc2dc5' },
    // ];
    // console.log('branchees',branchees)

    const [newBranches, setNewBranches] = useState<Branch[]>(branchees);
    const [updated, setUpdated] = useState<boolean>(false);

    useEffect(() => {
        setNewBranches(branchees);
        // console.log('useEffect',newBranches)
    }, [branchees,newBranches]);

    function updateOrPush(array: Branch[], newObject: Branch) {
        // console.log('newObject',newObject)
        // console.log('newBranches',newBranches)
        const updatedArray = array.map(item => item.branch === newObject.branch ? newObject : item);
        const isExisting = array.findIndex(item => item.branch === newObject.branch);
        if (!isExisting) {
            // console.log('new')
            // updatedArray.push(newObject);
        }else {

            const index =  array.findIndex(item => item.branch === newObject.branch);
            newBranches.splice(index,1,newObject)
        }

        setNewBranches(updatedArray);
        setUpdatedBranches(updatedArray)
        // setUpdated(true)
        // // let updatedArray = [];
        // // updatedArray.push(newObject);
        // initialBranches[index]=newObject;
        // initialBranches.splice(index, 1,newObject);
        
        // updatedArray[index]=newObject;
        // console.log('newBranches in',newBranches)
        // console.log('updatedArray in',updatedArray)

        // setNewBranches(...updatedArray);
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
                Cell: ({ cell }) => (
                    <div className="form-check form-switch form-check-custom form-check-solid">
                        <input
                            className="form-check-input cursor-pointer"
                            type="checkbox"
                            defaultChecked={cell.getValue<boolean>()}
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
        // console.log('newBranches',newBranches)
        // console.log('newBranches out',newBranches)

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
