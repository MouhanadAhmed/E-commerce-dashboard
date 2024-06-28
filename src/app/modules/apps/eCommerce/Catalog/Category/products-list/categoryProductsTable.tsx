import { useEffect, useMemo, useState } from 'react';
import {
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
  MRT_TableContainer,
} from 'material-react-table';
import { Products } from '../categories-list/core/_models';
import { getAllProductsInCategory, updateProductOrderInCategory } from '../categories-list/core/_requests';
import { useMutation } from 'react-query';

const CategoryProductsTable = (id:string) => {
    const [data, setData] = useState([]);
    const [triger,setTriger]= useState(false);
  const columns = useMemo<MRT_ColumnDef<Products>[]>(
    //column definitions...
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
      },
    //   {
    //     accessorKey: 'category.0.order',
    //     header: 'Order',
    //   },
   
    ],
    [],
    //end
  );

  const updateProductOrder = useMutation(({productId,order}) => updateProductOrderInCategory(id.id,productId,order), {
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      // queryClient.invalidateQueries([`${QUERIES.CATEGORIES_LIST}`]);
      // queryClient.invalidateQueries([`${QUERIES.ARCHIVED_CATEGORIES_LIST}`]);
      // queryClient.refetchQueries([`${QUERIES.CATEGORIES_LIST}`])
      // queryClient.refetchQueries([`${QUERIES.ARCHIVED_CATEGORIES_LIST}`])
    //   refetch();
      setTriger(true)

    },
  })

  useEffect(()=>{
    console.log('id',id.id)
    const fetchProducts = async()=>{
        await getAllProductsInCategory(id?.id)
        .catch((err)=> console.log(err))
        .then((res)=> setData(res?.products));
        // console.log(response.products)
        // setData(response.products);
    }
    fetchProducts()
  },[id?.id,triger,updateProductOrder])


  const table = useMaterialReactTable({
    autoResetPageIndex: false,
    columns,
    data,
    enableRowOrdering: true,
    enableSorting: false,
    muiRowDragHandleProps: ({ table }) => ({
      onDragEnd: async() => {
        const { draggingRow, hoveredRow } = table.getState();
        if (hoveredRow && draggingRow) {
            console.log('hoveredRow',hoveredRow.original?.category[0].order,'draggingRow',draggingRow.original._id)
            await updateProductOrder.mutateAsync({productId:draggingRow.original._id,order:hoveredRow.original?.category[0].order})
        }
        // if(product && productOrder) {await updateProductOrder.mutateAsync();}
      },
    }),
  });

  return <MRT_TableContainer table={table} />;
};

export  {CategoryProductsTable};
