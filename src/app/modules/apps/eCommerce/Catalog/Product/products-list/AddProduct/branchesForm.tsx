import { useMemo, useState, useEffect, useRef } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  useMaterialReactTable,
  MRT_TableOptions,
} from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { BranchOfProduct } from "../core/_models";

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

  useEffect(() => {
    setNewBranches(branchees);
  }, [branchees]);

  useEffect(() => {
    const updateBranchesFromPrice = () => {
      if (
        formik.values.price !== previousPriceRef.current &&
        newBranches.length > 0
      ) {
        const updatedBranches = newBranches.map((branch) => ({
          ...branch,
          price: formik.values.price?.toString() || "",
        }));

        setNewBranches(updatedBranches);
        setUpdatedBranches(updatedBranches);
        previousPriceRef.current = formik.values.price;
      }
    };

    const rafId = requestAnimationFrame(updateBranchesFromPrice);
    return () => cancelAnimationFrame(rafId);
  }, [formik.values.price, setUpdatedBranches, newBranches.length]);

  const getBranchId = (branch: string | { _id?: string }): string => {
    if (typeof branch === "string") return branch;
    return branch._id ?? "";
  };

  function updateOrPush(array: BranchOfProduct[], newObject: BranchOfProduct) {
    const newObjectBranchId = getBranchId(newObject.branch);
    const index = array.findIndex(
      (item) => getBranchId(item.branch) === newObjectBranchId
    );
    let updatedArray;

    if (index !== -1) {
      updatedArray = [...array];
      updatedArray[index] = newObject;
    } else {
      updatedArray = [...array, newObject];
    }

    setNewBranches(updatedArray);
    setUpdatedBranches(updatedArray);
  }

  const columns = useMemo<MRT_ColumnDef<BranchOfProduct>[]>(
    () => [
      {
        accessorFn: (row) => getBranchId(row.branch),
        header: "id",
        enableEditing: false,
      },
      {
        accessorKey: "name",
        header: "Name",
        enableEditing: false,
      },
      {
        accessorKey: "price",
        header: "Price",
      },
      {
        accessorKey: "available",
        header: "Available",
        Cell: ({ cell, row }) => (
          <div className="form-check form-switch form-check-custom form-check-solid">
            <input
              className="form-check-input cursor-pointer"
              type="checkbox"
              checked={cell.getValue<boolean>()}
              onChange={(e) => {
                setNewBranches((prev) => {
                  const currentBranchId = getBranchId(row.original.branch);
                  const updated = prev.map((branch) =>
                    getBranchId(branch.branch) === currentBranchId
                      ? { ...branch, available: e.target.checked }
                      : branch
                  );
                  setUpdatedBranches(updated);
                  return updated;
                });
              }}
              id={getBranchId(row.original.branch)}
            />
          </div>
        ),
        Edit: ({ cell, row, table }) => {
          const [checked, setChecked] = useState(
            cell.getValue<boolean>() ?? true
          );

          return (
            <div className="form-check form-switch form-check-custom form-check-solid">
              <input
                className="form-check-input cursor-pointer"
                type="checkbox"
                checked={checked}
                onChange={(e) => {
                  const newValue = e.target.checked;
                  setChecked(newValue);
                  row._valuesCache.available = newValue;
                }}
                id={`edit-${
                  row.original.branch ? getBranchId(row.original.branch) : "new"
                }`}
              />
            </div>
          );
        },
      },
      { accessorKey: "stock", header: "Stock" },
      { accessorKey: "priceAfterDiscount", header: "Price After Discount" },
      { accessorKey: "priceAfterExpiresAt", header: "Discount Expiry" },
      { accessorKey: "order", header: "Order" },
      { accessorKey: "sold", header: "Sold", enableEditing: false },
    ],
    []
  );

  const handleSaveBranch: MRT_TableOptions<BranchOfProduct>["onEditingRowSave"] =
    async ({ values, table, row }) => {
      values.branch = row.original.branch;
      // Ensure available is properly set
      if (values.available === undefined) {
        values.available = row.original.available ?? true;
      }
      updateOrPush(newBranches, values);
      table.setEditingRow(null);
    };

  const table = useMaterialReactTable({
    columns,
    data: newBranches,
    editDisplayMode: "row",
    enableEditing: true,
    enableRowActions: true,
    enableRowSelection: false,
    getRowId: (row) => getBranchId(row.branch),
    onEditingRowSave: handleSaveBranch,
    initialState: { columnVisibility: { id: false } },
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

export { BranchesForm };
