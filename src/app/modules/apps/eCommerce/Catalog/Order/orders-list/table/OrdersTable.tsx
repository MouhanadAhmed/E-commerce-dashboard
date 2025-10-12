import React, { useMemo, useRef, useEffect } from "react";
import { useQuery } from "react-query";
import {
  type MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { getOrders } from "../core/_requests";
import { stringifyRequestQuery } from "../../../../../../../../_metronic/helpers/crud-helper/helpers";
import { useQueryRequest } from "../core/QueryRequestProvider";
import { Order, OrdersQueryResponse } from "../core/_models";

const OrdersTable: React.FC = () => {
  const { state, updateState } = useQueryRequest();
  const query = useMemo(() => stringifyRequestQuery(state), [state]);

  const { data, isFetching, isError } = useQuery<OrdersQueryResponse>(
    ["orders", query],
    () => getOrders(query),
    { keepPreviousData: true }
  );

  // get normalized response from getOrders
  const orders: Order[] = (data as any)?.data ?? [];
  const respMeta: any =
    (data as any)?.raw?.payload?.pagination ??
    (data as any)?.raw?.payload ??
    (data as any)?.raw?.pagination ??
    null;

  const PAGE_SIZE = 10;

  // derive page index from server or provider (server pages are 1-based)
  const pageFromServer = Number(
    respMeta?.currentPage ?? respMeta?.page ?? state.page ?? 1
  );
  const initialPageIndex = Math.max(0, pageFromServer - 1);

  // try normalized total from our requester, fallback to raw payload
  const serverTotal = Number.isFinite(Number((data as any)?.total))
    ? Number((data as any).total)
    : undefined;

  // If server didn't provide total but returned a full page, allow the table to show a Next arrow
  const guessedRowCount =
    serverTotal ??
    (orders.length >= PAGE_SIZE
      ? PAGE_SIZE * (initialPageIndex + 2)
      : orders.length);

  const totalCount = serverTotal ?? guessedRowCount ?? 0;

  // Track whether the initial load has completed.
  // subsequent page changes.
  const initialLoadDoneRef = useRef(false);
  useEffect(() => {
    // When data arrives for the first time, mark initial load done.
    if (!initialLoadDoneRef.current && data !== undefined) {
      initialLoadDoneRef.current = true;
    }
  }, [data]);

  const showInitialLoading = isFetching && !initialLoadDoneRef.current;

  const columns = useMemo<MRT_ColumnDef<Order>[]>(
    () => [
      { accessorKey: "_id", header: "ID", size: 180 },
      { accessorKey: "orderNumber", header: "Order #", size: 90 },
      {
        accessorKey: "branch",
        header: "Branch",
        size: 160,
        Cell: ({ cell }) => {
          const branch = cell.getValue() as any;
          return String(branch?.name ?? branch ?? "—");
        },
      },
      {
        accessorKey: "user",
        header: "User",
        Cell: ({ cell, row }) => {
          const user = cell.getValue() as any;
          const guest = (row?.original as Order)?.guest;
          return String((user && (user.name ?? user)) ?? guest ?? "guest");
        },
      },
      {
        accessorKey: "cartItems",
        header: "Items",
        size: 80,
        Cell: ({ cell }) => {
          const v = cell.getValue() as any;
          return String(Array.isArray(v) ? v.length : 0);
        },
      },
      { accessorKey: "status", header: "Status" },
      { accessorKey: "paymentMethod", header: "Payment" },
      {
        accessorKey: "totalOrderPrice",
        header: "Total",
        Cell: ({ cell }) => `$${((cell.getValue() as number) ?? 0).toFixed(2)}`,
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        Cell: ({ cell }) =>
          new Date((cell.getValue() as string) ?? "").toLocaleDateString(),
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: orders,
    manualPagination: true,
    enablePagination: true,
    rowCount: serverTotal ?? totalCount,
    enableSorting: true,
    enableColumnFilters: false,
    onPaginationChange: (p: any) => {
      const next = typeof p === "function" ? p(table.getState().pagination) : p;
      const pageIndex =
        next?.pageIndex ??
        table.getState().pagination.pageIndex ??
        initialPageIndex;
      updateState({ page: String(pageIndex + 1), PageCount: PAGE_SIZE });
    },
    state: {
      pagination: {
        pageIndex: initialPageIndex,
        pageSize: PAGE_SIZE,
      },
      isLoading: showInitialLoading,
    },
    autoResetPageIndex: false,
    initialState: { showAlertBanner: isError },
    muiTableContainerProps: { sx: { minHeight: "320px" } },
    muiPaginationProps: { rowsPerPageOptions: [10] },
  });

  const currentPage = Number(state.page ?? 1);
  const totalPages = serverTotal
    ? Math.ceil(serverTotal / PAGE_SIZE)
    : Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const limit = PAGE_SIZE;

  return (
    <div>
      {isError && (
        <div className="p-4 text-center text-red-600">
          Error loading orders. Please try again.
        </div>
      )}

      <MaterialReactTable table={table} />
    </div>
  );
};

export default OrdersTable;
