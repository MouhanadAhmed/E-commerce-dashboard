import { useMemo, useState, useEffect, useRef } from 'react';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  useMaterialReactTable,
  MRT_TableOptions,
} from 'material-react-table';
import { Box, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { BranchOfProduct } from '../core/_models';
import { Branch } from '../../../Branch/branches-list/core/_models';


export default function BranchesForm({
  branchees,
  setUpdatedBranches,
  formik,
}: {
  branchees: BranchOfProduct[];
  setUpdatedBranches: any;
  formik: any;
}) {
  const [newBranches, setNewBranches] = useState<BranchOfProduct[]>(branchees);
  const previousPriceRef = useRef(formik.values.price);

  // Only update when branchees changes
  useEffect(() => {
    setNewBranches(branchees);
  }, [branchees]);

  // Replace the problematic useEffect with this:
  useEffect(() => {
    const updateBranchesFromPrice = () => {
      if (
        formik.values.price !== previousPriceRef.current &&
        newBranches.length > 0
      ) {
        const updatedBranches = newBranches.map((branch) => ({
          ...branch,
          price: formik.values.price?.toString() || '',
        }));

        setNewBranches(updatedBranches);
        setUpdatedBranches(updatedBranches);
        previousPriceRef.current = formik.values.price;
      }
    };

    // Use requestAnimationFrame to defer the update
    const rafId = requestAnimationFrame(updateBranchesFromPrice);
    return () => cancelAnimationFrame(rafId);
  }, [formik.values.price, setUpdatedBranches, newBranches.length]);

  // Helper function to get branch ID consistently
  const getBranchId = (branch: string | Branch): string => {
    if (typeof branch === 'string') {
      return branch;
    }
    return branch._id || (branch._id as string);
  };

  function updateOrPush(array: BranchOfProduct[], newObject: BranchOfProduct) {
    const newObjectBranchId = getBranchId(newObject.branch);
    const index = array.findIndex(
      (item) => getBranchId(item.branch) === newObjectBranchId
    );
    let updatedArray;

    if (index !== -1) {
      // Update existing item
      updatedArray = [...array];
      updatedArray[index] = newObject;
    } else {
      // Add new item
      updatedArray = [...array, newObject];
    }

    setNewBranches(updatedArray);
    setUpdatedBranches(updatedArray);
  }

  const columns = useMemo<MRT_ColumnDef<BranchOfProduct>[]>(
    () => [
      {
        accessorFn: (row) => getBranchId(row.branch),
        header: 'id',
        enableEditing: false,
      },
      {
        accessorFn: (row) => row.name,
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
                setNewBranches((prevBranches) => {
                  const currentBranchId = getBranchId(row.original.branch);
                  const updatedBranches = prevBranches.map((branch) =>
                    getBranchId(branch.branch) === currentBranchId
                      ? { ...branch, available: e.target.checked }
                      : branch
                  );
                  setUpdatedBranches(updatedBranches);
                  return updatedBranches;
                });
              }}
              id={getBranchId(row.original.branch)}
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

  const handleSaveBranch: MRT_TableOptions<BranchOfProduct>['onEditingRowSave'] =
    async ({ values, table, row }) => {
      values.branch = row.original.branch;
      updateOrPush(newBranches, values);
      table.setEditingRow(null);
    };

  const table = useMaterialReactTable({
    columns,
    data: newBranches,
    createDisplayMode: 'row',
    editDisplayMode: 'row',
    enableEditing: true,
    initialState: { columnVisibility: { id: false } },
    getRowId: (row) => getBranchId(row.branch),
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

export { BranchesForm };