import { useEffect, useMemo, useState } from "react";
import {
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
  MRT_TableContainer,
} from "material-react-table";
import { useMutation } from "react-query";
import { Products } from "../../Category/categories-list/core/_models";
import {
  getAllProductsInSubCategory,
  updateProductOrderInSubCategory,
} from "../Subcategories-list/core/_requests";

const SubCategoryProductsTable = ({id}: {id: string}) => {
  const [data, setData] = useState([]);
  const [triger, setTriger] = useState(false);
  const columns = useMemo<MRT_ColumnDef<Products>[]>(
    //column definitions...
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "subCategory.0.order",
        header: "Order",
      },
    ],
    [],
    //end
  );

  const updateProductOrder = useMutation(
    ({ productId, order }: { productId: string; order: number }) =>
      updateProductOrderInSubCategory(id, productId, order),
    {
      // 💡 response of the mutation is passed to onSuccess
      onSuccess: () => {
        setTriger(true);
      },
    },
  );
  
  useEffect(() => {
    const fetchProducts = async () => {
      await getAllProductsInSubCategory(id)
        .catch((err) => console.error(err))
        .then((res: any) => setData(res?.products));

    };
    fetchProducts();
  }, [id, triger]);

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

          await updateProductOrder.mutateAsync({
            productId: draggingRow.original._id,
            order: hoveredRow.original?.subCategory[0].order,
          });
        }
      },
    }),
  });

  return <MRT_TableContainer table={table} />;
};

export { SubCategoryProductsTable };
