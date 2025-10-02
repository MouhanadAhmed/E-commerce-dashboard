import { useMemo, useState, useEffect, useRef } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  useMaterialReactTable,
  MRT_TableOptions,
} from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

type Branch = {
  branch: string;
  price?: string;
  available?: boolean;
  stock?: string;
  priceAfterDiscount?: string;
  priceAfterExpiresAt?: string;
  order?: string;
  sold?: string;
  _id: string;
  name?: string;
};

export default function BranchesForm({
  branchees,
  setUpdatedBranches,
  formik,
}: {
  branchees: Branch[];
  setUpdatedBranches: any;
  formik: any;
}) {
  const [newBranches, setNewBranches] = useState<Branch[]>(branchees);
  const previousPriceRef = useRef(formik.values.price);

  // Only update when branchees changes
  useEffect(() => {
    setNewBranches(branchees);
  }, [branchees]); // Removed newBranches dependency

  // Price update effect - use functional update to avoid stale state
  useEffect(() => {
    if (
      formik.values.price !== previousPriceRef.current &&
      newBranches.length > 0
    ) {
      setNewBranches((prevBranches) => {
        const updatedBranches = prevBranches.map((branch) => ({
          ...branch,
          price: formik.values.price?.toString() || "",
        }));

        setUpdatedBranches(updatedBranches);
        previousPriceRef.current = formik.values.price;
        return updatedBranches;
      });
    }
  }, [formik.values.price, setUpdatedBranches]); // Removed newBranches dependency

  function updateOrPush(array: Branch[], newObject: Branch) {
    const index = array.findIndex((item) => item.branch === newObject.branch);
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

  const columns = useMemo<MRT_ColumnDef<Branch>[]>(
    () => [
      {
        accessorFn: (row) =>
          row.branch._id != undefined ? row.branch._id : row.branch,
        header: "id",
        enableEditing: false,
      },
      {
        accessorFn: (row) =>
          row.name != undefined ? row.name : row.branch.name,
        header: "Name",
        enableEditing: false,
        size: 80,
      },
      {
        accessorKey: "price",
        header: "Price",
        muiEditTextFieldProps: {
          required: false,
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
        Cell: ({ cell, row }) => (
          <div className="form-check form-switch form-check-custom form-check-solid">
            <input
              className="form-check-input cursor-pointer"
              type="checkbox"
              checked={cell.getValue<boolean>()}
              onChange={(e) => {
                setNewBranches((prevBranches) => {
                  const updatedBranches = prevBranches.map((branch) =>
                    branch.branch === row.original.branch
                      ? { ...branch, available: e.target.checked }
                      : branch,
                  );
                  setUpdatedBranches(updatedBranches);
                  return updatedBranches;
                });
              }}
              id={cell.row.original._id}
            />
          </div>
        ),
      },
      {
        accessorKey: "stock",
        header: "Stock",
        muiEditTextFieldProps: {},
      },
      {
        accessorKey: "priceAfterDiscount",
        header: "Price After Discount",
        muiEditTextFieldProps: {},
      },
      {
        accessorKey: "priceAfterExpiresAt",
        header: "Discount Expiry",
        muiEditTextFieldProps: {},
      },
      {
        accessorKey: "order",
        header: "order",
        muiEditTextFieldProps: {},
      },
      {
        accessorKey: "sold",
        header: "sold",
        enableEditing: false,
        muiEditTextFieldProps: {},
      },
    ],
    [],
  );

  const handleSaveBranch: MRT_TableOptions<Branch>["onEditingRowSave"] =
    async ({ values, table, row }) => {
      values.branch = row.original.branch;
      updateOrPush(newBranches, values);
      table.setEditingRow(null);
    };

  const table = useMaterialReactTable({
    columns,
    data: newBranches,
    createDisplayMode: "row",
    editDisplayMode: "row",
    enableEditing: true,
    initialState: { columnVisibility: { id: false } },
    getRowId: (row) => row?.branch,
    onEditingRowSave: handleSaveBranch,
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
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
