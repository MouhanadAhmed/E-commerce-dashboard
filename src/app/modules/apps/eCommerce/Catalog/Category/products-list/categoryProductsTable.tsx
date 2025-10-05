import { useEffect, useMemo, useState } from "react";
import {
  useMaterialReactTable,
  type MRT_ColumnDef,
  MRT_TableContainer,
} from "material-react-table";
import { Products } from "../categories-list/core/_models";
import {
  getAllProductsInCategory,
  updateProductOrderInCategory,
} from "../categories-list/core/_requests";
import { useMutation } from "react-query";

const CategoryProductsTable = ({ id }: any) => {
  const [data, setData] = useState<Products[]>([]);
  const [triger, setTriger] = useState(false);

  const columns = useMemo<MRT_ColumnDef<Products>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "category.0.order",
        header: "Order",
      },
    ],
    [],
  );

  // Move the mutation outside the useEffect dependencies
  const updateProductOrderMutation = useMutation(
    ({ productId, order }: { productId: string; order: number }) =>
      updateProductOrderInCategory(id.id, productId, order),
    {
      onSuccess: () => {
        setTriger((prev) => !prev); // Toggle to trigger refetch
      },
    },
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response: any = await getAllProductsInCategory(id?.id);
        setData(response?.products || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, [id.id, triger]); // Removed updateProductOrder from dependencies

  const table = useMaterialReactTable({
    autoResetPageIndex: false,
    columns,
    data,
    enableRowOrdering: true,
    enableSorting: false,
    muiRowDragHandleProps: ({ table }) => ({
      onDragEnd: async () => {
        const { draggingRow, hoveredRow } = table.getState();
        if (hoveredRow && draggingRow) {
          await updateProductOrderMutation.mutateAsync({
            productId: draggingRow.original._id,
            order: hoveredRow.original?.category[0].order,
          });
        }
      },
    }),
  });

  return <MRT_TableContainer table={table} />;
};

export { CategoryProductsTable };
