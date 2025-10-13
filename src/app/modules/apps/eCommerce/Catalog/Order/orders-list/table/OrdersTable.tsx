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
  const query = useMemo(() => {
    const base = stringifyRequestQuery(state);
    const f = (state as any).filter ?? {};
    const parts: string[] = [base];
    if (f.branch) parts.push(`branch=${encodeURIComponent(f.branch)}`);
    if (f.orderNumber)
      parts.push(`orderNumber=${encodeURIComponent(f.orderNumber)}`);
    return parts.filter(Boolean).join("&");
  }, [state]);

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
        Cell: ({ cell }) => `${((cell.getValue() as number) ?? 0).toFixed(2)}`,
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
    enableSorting: false,
    enableColumnFilters: true,
    enableExpandAll: false,
    muiDetailPanelProps: () => ({
      sx: (theme) => ({
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(255,210,244,0.03)"
            : "rgba(0,0,0,0.03)",
      }),
    }),
    muiExpandButtonProps: ({ row, table }) => ({
      onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }),
      sx: {
        transform: row.getIsExpanded() ? "rotate(180deg)" : "rotate(-90deg)",
        transition: "transform 0.2s",
      },
    }),
    // place expand button next to Items column and show only items on expand
    displayColumnDefOptions: {
      // keep actions column default, but ensure expand column is narrow
      "mrt-row-actions": {
        muiTableHeadCellProps: { align: "center" },
      },
      "mrt-row-expand": {
        muiTableHeadCellProps: { sx: { width: 48 } },
      },
    },
    renderDetailPanel: ({ row }) => {
      const o = row.original as Order | undefined;
      if (!o) return null;

      const items = Array.isArray(o.cartItems) ? o.cartItems : [];

      // Simplified helpers assuming the API response shape you provided.
      // Cart item: it
      // Product details: it.product.product
      const safeLabel = (it: any) => {
        return (
          it?.product?.product?.name ??
          it?.product?.name ??
          it?.name ??
          String(it?._id ?? "-")
        );
      };

      const safePrice = (it: any) => {
        const p =
          it?.product?.product?.price ?? it?.product?.price ?? it?.price ?? 0;
        const num = Number(p) || 0;
        return `$${num.toFixed(2)}`;
      };

      const safeQty = (it: any) =>
        Number(it?.product?.quantity ?? it?.quantity ?? 1);

      // extras live either on the cart item (it.extra), on it.product.extra or on it.product.product.extras
      const getExtras = (it: any) => {
        const sources: any[] = [];
        if (Array.isArray(it?.product?.product?.extras))
          sources.push(...it.product.product.extras);
        if (Array.isArray(it?.product?.extra))
          sources.push(...it.product.extra);
        if (Array.isArray(it?.extra)) sources.push(...it.extra);

        return sources
          .map((e: any) => {
            const candidate = e?.extra ?? e;
            const name = candidate?.name ?? candidate?.title ?? null;
            const price =
              candidate?.price ??
              candidate?.priceAfterDiscount ??
              candidate?.priceAfterExpirest ??
              null;
            if (!name) return null;
            return {
              name: String(name),
              price: price != null ? Number(price) : undefined,
            };
          })
          .filter(Boolean) as Array<{ name: string; price?: number }>;
      };

      const getItemTotal = (it: any) => {
        // prefer explicit productTotal if provided by the API
        if (it?.productTotal != null)
          return `$${Number(it.productTotal).toFixed(2)}`;
        if (it?.product?.product?.productTotal != null)
          return `$${Number(it.product.product.productTotal).toFixed(2)}`;

        const unit =
          Number(
            it?.product?.product?.price ?? it?.product?.price ?? it?.price ?? 0
          ) || 0;
        const qty = Number(it?.product?.quantity ?? it?.quantity ?? 1) || 1;
        const extras = getExtras(it);
        const extrasSum = extras.reduce(
          (s, e) => s + (Number(e.price) || 0),
          0
        );
        return `$${(unit * qty + extrasSum).toFixed(2)}`;
      };

      return (
        <div style={{ padding: 12 }}>
          {items.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {items.map((it: any, i: number) => {
                const extras = getExtras(it);
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                      padding: 10,
                      borderRadius: 8,
                      background: "rgba(0,0,0,0.02)",
                    }}
                  >
                    {/* Left: Name and Extras */}
                    <div style={{ flex: 1, minWidth: 260 }}>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          alignItems: "baseline",
                        }}
                      >
                        <div style={{ fontSize: 12, color: "#666", width: 56 }}>
                          Name:
                        </div>
                        <div style={{ fontWeight: 600 }}>
                          {String(safeLabel(it))}
                        </div>
                      </div>

                      <div
                        style={{
                          marginTop: 6,
                          display: "flex",
                          gap: 6,
                          flexWrap: "wrap",
                          alignItems: "center",
                        }}
                      >
                        <div style={{ fontSize: 12, color: "#666", width: 56 }}>
                          Extras:
                        </div>
                        <div
                          style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
                        >
                          {extras.length > 0 ? (
                            extras.map((ex, idx) => (
                              <span
                                key={idx}
                                className="badge badge-secondary me-1"
                                style={{ fontSize: 11 }}
                              >
                                {ex.name}
                                {ex.price != null
                                  ? ` · ${Number(ex.price).toFixed(2)}`
                                  : ""}
                              </span>
                            ))
                          ) : (
                            <div style={{ color: "#666" }}>-</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Middle: Qty and Unit */}
                    <div
                      style={{
                        width: 140,
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <div style={{ display: "flex", gap: 8 }}>
                        <div style={{ fontSize: 12, color: "#666", width: 56 }}>
                          Qty:
                        </div>
                        <div style={{ fontWeight: 600 }}>
                          {String(safeQty(it))}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <div style={{ fontSize: 12, color: "#666", width: 56 }}>
                          Unit:
                        </div>
                        <div>{String(safePrice(it))}</div>
                      </div>
                    </div>

                    {/* Right: Total */}
                    <div
                      style={{
                        width: 140,
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <div style={{ fontSize: 12, color: "#666" }}>Total:</div>
                      <div style={{ fontWeight: 700 }}>
                        {String(getItemTotal(it))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ color: "#666" }}>No items</div>
          )}
        </div>
      );
    },
    onPaginationChange: (p: any) => {
      const next = typeof p === "function" ? p(table.getState().pagination) : p;
      const pageIndex =
        next?.pageIndex ??
        table.getState().pagination.pageIndex ??
        initialPageIndex;
      updateState({ page: String(pageIndex + 1), PageCount: PAGE_SIZE });
    },
    state: {
      columnOrder: [
        "_id",
        "orderNumber",
        "branch",
        "user",
        "cartItems",
        "mrt-row-expand",
        "status",
        "paymentMethod",
        "totalOrderPrice",
        "createdAt",
      ],
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
