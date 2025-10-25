import React, { useMemo, useRef, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
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
  const queryClient = useQueryClient();
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

  // API base used by mutations and for fetching full order on-demand
  const API_URL = import.meta.env.VITE_APP_THEME_API_URL;
  const ORDER_URL = `${API_URL}/order`;

  // Lazy detail renderer: if the order from the list doesn't include adminNotes,
  // fetch the full order on expand and render adminNotes + items.
  const OrderDetail: React.FC<{ order: Order }> = ({ order }) => {
    const [fullOrder, setFullOrder] = useState<any>(order);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showRaw, setShowRaw] = useState(false);

    useEffect(() => {
      let cancelled = false;
      const hasNotes =
        Array.isArray((order as any)?.adminNotes) &&
        (order as any).adminNotes.length > 0;
      if (!hasNotes) {
        setLoading(true);
        setError(null);
        axios
          .get(`${ORDER_URL}/${order._id}`)
          .then((resp) => {
            if (cancelled) return;
            // try several response shapes
            const payload =
              resp?.data?.raw?.payload ??
              resp?.data?.payload ??
              resp?.data ??
              null;
            if (payload) setFullOrder(payload);
          })
          .catch((err) => {
            if (cancelled) return;
            setError(String(err?.message ?? err));
          })
          .finally(() => {
            if (!cancelled) setLoading(false);
          });
      }
      return () => {
        cancelled = true;
      };
    }, [order]);

    const o = fullOrder as any;

    // derive notes: prefer explicit adminNotes array, otherwise try to extract
    // notes from changeLog entries where changes.adminNotes is present (legacy)
    const derivedNotes: Array<any> = (() => {
      // prefer explicit adminNotes array
      if (Array.isArray(o?.adminNotes) && o.adminNotes.length > 0) {
        return o.adminNotes
          .map((n: any) => ({
            note: n?.note,
            name: n?.name ?? "-",
            time: n?.time ?? n?.createdAt ?? null,
          }))
          .filter(Boolean)
          .filter((n: any) => String(n.note ?? "").trim().length > 0);
      }

      if (!Array.isArray(o?.changeLog)) return [];
      try {
        const fromLog = o.changeLog
          .map((c: any) => {
            const raw = c?.changes?.adminNotes ?? c?.changes?.note ?? null;
            if (!raw) return null;
            return {
              note: raw,
              name: c.adminName ?? c.adminId ?? "-",
              time: c.modifiedAt ?? c.createdAt ?? null,
            };
          })
          .filter(Boolean)
          .filter((n: any) => String(n.note ?? "").trim().length > 0);

        if (fromLog.length > 0) return fromLog;

        // Heuristic fallback: scan changes object recursively for the first non-empty string value
        const heuristics: Array<any> = [];
        const findString = (v: any): string | null => {
          if (v == null) return null;
          if (typeof v === "string") return v;
          if (typeof v === "object") {
            for (const k of Object.keys(v)) {
              try {
                const found = findString(v[k]);
                if (found && String(found).trim().length > 0) return found;
              } catch (e) {
                // ignore
              }
            }
          }
          return null;
        };

        for (const c of o.changeLog) {
          try {
            const found = findString(c?.changes);
            if (found && String(found).trim().length > 0) {
              heuristics.push({
                note: found,
                name: c.adminName ?? c.adminId ?? "-",
                time: c.modifiedAt ?? c.createdAt ?? null,
              });
            }
          } catch (e) {
            // ignore per-entry errors
          }
        }

        return heuristics.filter(
          (n: any) => String(n.note ?? "").trim().length > 0
        );
      } catch (e) {
        return [];
      }
    })();

    if (loading) return <div style={{ padding: 12 }}>Loading details...</div>;
    if (error)
      return (
        <div style={{ padding: 12, color: "#b00020" }}>
          Error loading order details: {error}
        </div>
      );

    // reuse the existing detail UI from the original implementation
    const items = Array.isArray(o.cartItems) ? o.cartItems : [];

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

    const getExtras = (it: any) => {
      const sources: any[] = [];
      if (Array.isArray(it?.product?.product?.extras))
        sources.push(...it.product.product.extras);
      if (Array.isArray(it?.product?.extra)) sources.push(...it.product.extra);
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
      const extrasSum = extras.reduce((s, e) => s + (Number(e.price) || 0), 0);
      return `$${(unit * qty + extrasSum).toFixed(2)}`;
    };

    return (
      <div style={{ padding: 12 }}>
        {/* Admin notes section: show derived notes (prefer adminNotes, fallback to changeLog) */}
        {derivedNotes.length > 0 ? (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Admin Notes</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {derivedNotes.map((n: any, idx: number) => (
                <div
                  key={n._id || n.time || idx}
                  style={{
                    background: "rgba(0,0,0,0.02)",
                    padding: 8,
                    borderRadius: 6,
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{n.name ?? "-"}</div>
                  <div
                    style={{
                      marginTop: 6,
                      color: "#222",
                      fontSize: 14,
                      whiteSpace: "pre-wrap",
                      overflowWrap: "break-word",
                      direction: "rtl",
                    }}
                  >
                    {n.note ?? "(no note)"}
                  </div>
                  {n.time && (
                    <div style={{ marginTop: 6, fontSize: 11, color: "#666" }}>
                      {new Date(n.time).toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Admin Notes</div>
            <div style={{ color: "#666", marginBottom: 8 }}>
              No admin notes found in the order payload.
            </div>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setShowRaw((s) => !s)}
            >
              {showRaw ? "Hide raw payload" : "Show raw payload"}
            </button>
            {showRaw && (
              <pre
                style={{
                  marginTop: 8,
                  maxHeight: 240,
                  overflow: "auto",
                  background: "#f8f9fa",
                  padding: 8,
                  borderRadius: 6,
                }}
              >
                {JSON.stringify(o, null, 2)}
              </pre>
            )}
          </div>
        )}

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
  };

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
      {
        id: "action",
        header: "Action",
        size: 120,
        Cell: ({ row }) => {
          const o = row.original as Order;
          if (!o) return null;
          return (
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="btn btn-sm btn-light"
                title="Edit"
                onClick={(e) => {
                  e.stopPropagation();
                  // open edit modal for this order
                  setSelectedOrder(o);
                  setAdminNote("");
                  setSelectedStatus(o.status ?? "");
                  setShowEditModal(true);
                }}
              >
                <i className="fa-solid fa-pen-to-square"></i>
              </button>
            </div>
          );
        },
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

      return <OrderDetail order={o} />;
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

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [adminNote, setAdminNote] = useState<string>("");

  const updateStatusMutation = useMutation(
    ({ id, status }: { id: string; status: string }) =>
      axios.patch(`${ORDER_URL}/${id}`, { status }),
    {
      onSuccess: () => queryClient.invalidateQueries(["orders"]),
    }
  );

  const updateAdminNoteMutation = useMutation(
    ({ id, note }: { id: string; note: string }) =>
      // backend expects { note: "..." }
      axios.put(`${ORDER_URL}/${id}`, { note: note }),
    {
      onSuccess: () => queryClient.invalidateQueries(["orders"]),
    }
  );

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

      {/* Edit modal for updating status / admin note */}
      <div>
        {/* simple bootstrap modal markup to match project */}
        <div
          className={`modal fade ${showEditModal ? "show d-block" : ""}`}
          tabIndex={-1}
          role="dialog"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Order</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedOrder(null);
                  }}
                />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="">(no change)</option>
                    <option value="accepted">Accepted</option>
                    <option value="pending">Pending</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Admin Note</label>
                  <textarea
                    className="form-control"
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedOrder(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={async () => {
                    if (!selectedOrder) return;
                    try {
                      if (
                        selectedStatus &&
                        selectedStatus !== selectedOrder.status
                      ) {
                        await updateStatusMutation.mutateAsync({
                          id: selectedOrder._id,
                          status: selectedStatus,
                        });
                      }
                      // send the admin note exactly as entered (allow whitespace)
                      if (adminNote !== "") {
                        await updateAdminNoteMutation.mutateAsync({
                          id: selectedOrder._id,
                          note: adminNote,
                        });
                      }
                    } finally {
                      setShowEditModal(false);
                      setSelectedOrder(null);
                    }
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersTable;
