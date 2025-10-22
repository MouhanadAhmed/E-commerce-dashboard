import React, { useMemo, useRef, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  type MRT_ColumnDef,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { getCoupons } from "../core/_requests";
import { stringifyRequestQuery } from "../../../../../../../../_metronic/helpers/crud-helper/helpers";
import { useQueryRequest } from "../core/QueryRequestProvider";
import { Coupon, CouponsQueryResponse } from "../core/_models";
import { Box, Tooltip } from "@mui/material";
import { Modal } from "react-bootstrap";
import { deleteCoupon, createCoupon } from "../core/_requests";
import Select from "react-select";
import {
  useActiveCategories,
  useActiveCategoriesData,
} from "../../../Category/categories-list/core/QueryResponseProvider";
import { getCategories } from "../../../Category/categories-list/core/_requests";
import {
  useActiveSubCategories,
  useActiveSubCategoriesData,
} from "../../../SubCategory/Subcategories-list/core/QueryResponseProvider";
import {
  useActiveChildSubCategories,
  useActiveChildSubCategoriesData,
} from "../../../ChildSubCategory/ChildSubcategories-list/core/QueryResponseProvider";
import { getChildSubCategories } from "../../../ChildSubCategory/ChildSubcategories-list/core/_requests";
import { getSubCategories } from "../../../SubCategory/Subcategories-list/core/_requests";

type CouponsTableProps = {
  deletedOnly?: boolean;
};

const CouponsTable: React.FC<CouponsTableProps> = ({ deletedOnly = false }) => {
  const { state, updateState } = useQueryRequest();
  const query = useMemo(() => {
    const base = stringifyRequestQuery(state);
    const f = (state as any).filter ?? {};
    const parts: string[] = [base];
    if (f.branch) parts.push(`branch=${encodeURIComponent(f.branch)}`);
    // if this table is for archived/deleted coupons, request deleted=true
    if (deletedOnly) parts.push(`deleted=true`);
    return parts.filter(Boolean).join("&");
  }, [state]);

  const { data, isFetching, isError } = useQuery<CouponsQueryResponse>(
    ["coupons", query],
    () => getCoupons(query),
    { keepPreviousData: true, refetchOnWindowFocus: false }
  );

  const queryClient = useQueryClient();
  const deleteSelectedMutation = useMutation(
    (ids: string[]) => Promise.all(ids.map((id) => deleteCoupon(id))),
    {
      onSuccess: () => {
        // invalidate coupons list so it refetches
        queryClient.invalidateQueries(["coupons"]);
      },
    }
  );

  const deleteOneMutation = useMutation((id: string) => deleteCoupon(id), {
    onSuccess: () => queryClient.invalidateQueries(["coupons"]),
  });
  const updateMutation = useMutation(
    ({ id, body }: { id: string; body: any }) =>
      // lazy import updateCoupon from requests
      import("../core/_requests").then((m) => m.updateCoupon(id, body)),
    { onSuccess: () => queryClient.invalidateQueries(["coupons"]) }
  );

  const [editingId, setEditingId] = useState<string | null>(null);

  // Create modal state + form fields
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState<any>({
    code: "",
    type: "percentage",
    discount: "",
    expiresAt: "",
    minAmount: "",
    maxAmount: "",
    limit: "",
    validFor: "all",
    appliedOn: [] as string[],
  });

  const createMutation = useMutation((body: any) => createCoupon(body), {
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
      setShowCreateModal(false);
      setForm({
        code: "",
        type: "percentage",
        discount: "",
        expiresAt: "",
        minAmount: "",
        maxAmount: "",
        limit: "",
        validFor: "all",
        appliedOn: [],
      });
    },
  });

  // providers for category/subcategory/childsubcategory selection
  const categories = useActiveCategoriesData();
  const subcategories = useActiveSubCategoriesData();
  const childSubCategories = useActiveChildSubCategoriesData();

  // context hooks give us access to refetch so we can load data when modal opens
  const categoriesCtx = useActiveCategories();
  const subCategoriesCtx = useActiveSubCategories();
  const childSubCategoriesCtx = useActiveChildSubCategories();

  const categoryOptions = (categories || []).map((c: any) => ({
    value: c._id,
    label: c.name || c._id,
  }));
  const subcategoryOptions = (subcategories || []).map((c: any) => ({
    value: c._id,
    label: c.name || c._id,
  }));
  const childSubcategoryOptions = (childSubCategories || []).map((c: any) => ({
    value: c._id,
    label: c.name || c._id,
  }));

  // Remote-fetched options (fallback if providers are empty)
  const [remoteCategoryOptions, setRemoteCategoryOptions] = useState<any[]>([]);
  const [remoteSubcategoryOptions, setRemoteSubcategoryOptions] = useState<
    any[]
  >([]);
  const [remoteChildOptions, setRemoteChildOptions] = useState<any[]>([]);

  const normalizeResponseItems = (res: any): any[] => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (res.data && Array.isArray(res.data)) return res.data;
    if (res.payload && res.payload.data && Array.isArray(res.payload.data))
      return res.payload.data;
    return [];
  };

  const fetchRemoteList = async (type: string) => {
    try {
      if (type === "subcategory") {
        const res = await getSubCategories();
        const items = normalizeResponseItems(res);
        setRemoteSubcategoryOptions(
          (items || []).map((c: any) => ({
            value: c._id,
            label: c.name || c._id,
          }))
        );
      } else if (type === "childsubcategory") {
        const res = await getChildSubCategories();
        const items = normalizeResponseItems(res);
        setRemoteChildOptions(
          (items || []).map((c: any) => ({
            value: c._id,
            label: c.name || c._id,
          }))
        );
      } else {
        const res = await getCategories();
        const items = normalizeResponseItems(res);
        setRemoteCategoryOptions(
          (items || []).map((c: any) => ({
            value: c._id,
            label: c.name || c._id,
          }))
        );
      }
    } catch (err) {}
  };

  // When the create modal opens or validFor changes, ensure the relevant list is fetched
  const fetchedRef = useRef({
    categories: false,
    subcategories: false,
    child: false,
  });

  useEffect(() => {
    if (!showCreateModal) return;

    // determine which list we need based on validFor; if validFor is 'all', no list is required
    const typeNeeded =
      form.validFor === "subcategory"
        ? "subcategory"
        : form.validFor === "childsubcategory"
        ? "childsubcategory"
        : form.validFor === "all"
        ? null
        : "category";

    if (!typeNeeded) return;

    (async () => {
      try {
        // only refetch provider if we haven't fetched this list before
        if (typeNeeded === "category" && !fetchedRef.current.categories) {
          if (categoriesCtx?.refetch) await categoriesCtx.refetch();
          if ((categories || []).length === 0) {
            await fetchRemoteList("category");
          }
          fetchedRef.current.categories = true;
        }

        if (typeNeeded === "subcategory" && !fetchedRef.current.subcategories) {
          if (subCategoriesCtx?.refetch) await subCategoriesCtx.refetch();
          if ((subcategories || []).length === 0) {
            await fetchRemoteList("subCategory");
          }
          fetchedRef.current.subcategories = true;
        }

        if (typeNeeded === "childsubcategory" && !fetchedRef.current.child) {
          if (childSubCategoriesCtx?.refetch)
            await childSubCategoriesCtx.refetch();
          if ((childSubCategories || []).length === 0) {
            await fetchRemoteList("childSubCategory");
          }
          fetchedRef.current.child = true;
        }
      } catch (e) {}
    })();
  }, [showCreateModal, form.validFor]);

  // get normalized response from getCoupons
  const coupons: Coupon[] = (data as any)?.data ?? [];

  const filteredCoupons: Coupon[] = useMemo(() => {
    if (deletedOnly) return coupons;
    return (coupons || []).filter((c) => !(c as any)?.deleted);
  }, [coupons, deletedOnly]);
  // fixed validFor options (canonical keys) — values are normalized to lowercase
  const validForOptions = [
    "category",
    "subCategory",
    "childSubCategory",
    "boxCategory",
    "product",
    "boxSubCategory",
    "boxProduct",
    "all",
  ];

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
    (filteredCoupons.length >= PAGE_SIZE
      ? PAGE_SIZE * (initialPageIndex + 2)
      : filteredCoupons.length);

  const totalCount = serverTotal ?? guessedRowCount ?? 0;

  // Determine visible row count (what the UI should show) — for the main
  // coupons table (deletedOnly=false) we want to exclude deleted items.
  // If the server provides a precise total for deleted items we could
  // subtract it, but most backends don't. Prefer a conservative client-side
  // approach: if serverTotal exists but there's no deleted-count metadata,
  // fall back to the length of the filtered page(s) we have.
  const visibleRowCount: number = useMemo(() => {
    if (deletedOnly)
      return Number.isFinite(Number(serverTotal))
        ? serverTotal!
        : guessedRowCount ?? 0;
    if (Number.isFinite(Number(serverTotal))) {
      // try metadata keys that might convey deleted counts
      const deletedCount = Number(
        (data as any)?.raw?.payload?.deletedCount ??
          (data as any)?.raw?.deletedCount ??
          NaN
      );
      if (Number.isFinite(deletedCount))
        return Math.max(0, serverTotal! - deletedCount);
      // No reliable metadata — use what we actually have locally
      return filteredCoupons.length;
    }
    return guessedRowCount ?? 0;
  }, [deletedOnly, serverTotal, guessedRowCount, filteredCoupons, data]);

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

  const columns = useMemo<MRT_ColumnDef<Coupon>[]>(
    () => [
      { accessorKey: "_id", header: "ID", size: 180 },
      { accessorKey: "code", header: "Code", size: 140 },
      { accessorKey: "type", header: "Type" },
      {
        accessorKey: "discount",
        header: "Discount",
        Cell: ({ cell }) => String(cell.getValue() ?? "-"),
      },
      { accessorKey: "expiresAt", header: "Expires At" },
      { accessorKey: "minAmount", header: "Min Amount" },
      { accessorKey: "maxAmount", header: "Max Amount" },
      { accessorKey: "limit", header: "Limit" },
      { accessorKey: "validFor", header: "Valid For" },
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
          const o = row.original as Coupon;
          if (!o) return null;
          return (
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="btn "
                title="Edit"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingId(o._id ?? null);
                  setForm({
                    code: o.code ?? "",
                    type: o.type ?? "percentage",
                    discount: o.discount != null ? String(o.discount) : "",
                    expiresAt: o.expiresAt ?? "",
                    minAmount: o.minAmount != null ? String(o.minAmount) : "",
                    maxAmount: o.maxAmount != null ? String(o.maxAmount) : "",
                    limit: o.limit != null ? Number(o.limit) : 0,
                    validFor:
                      (o.validFor && (o.validFor as string).toLowerCase()) ||
                      "category",
                    appliedOn: Array.isArray(o.appliedOn) ? o.appliedOn : [],
                  });
                  setShowCreateModal(true);
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
    data: filteredCoupons,
    manualPagination: true,
    enablePagination: true,
    enableRowSelection: true,
    rowCount: visibleRowCount ?? serverTotal ?? totalCount,
    enableSorting: false,
    enableColumnFilters: true,
    // rows are not expandable
    // use _id as stable row id
    getRowId: (originalRow) => `coupon-${originalRow._id}`,
    // no detail panel or expand button — rows are not expandable
    displayColumnDefOptions: {
      // keep row select column styling
      "mrt-row-select": {
        muiTableHeadCellProps: { sx: { width: 48 } },
        muiTableBodyCellProps: { sx: { width: 48 } },
      },
      /* actions handled inline via the `action` column */
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <>
        <div className="card-header ribbon ribbon-start">
          <div className="ribbon-label ribbon ribbon-start bg-success">
            {deletedOnly ? "Archived Coupons" : "Coupons"}
          </div>
        </div>
        <Box
          sx={{
            display: "flex",
            gap: "1rem",
            p: "4px",
            justifyContent: "right",
          }}
        >
          <Tooltip title="Add coupon">
            <button
              type="button"
              onClick={() => {
                // ensure we're not in editing mode when opening create modal
                setEditingId(null);
                setShowCreateModal(true);
              }}
              className="rounded bg-primary rounded-circle p-0 border-0"
            >
              <i className="fa-solid fa-plus text-white fa-2xl p-3"></i>
            </button>
          </Tooltip>
          <Tooltip title="Delete Selected">
            <button
              type="button"
              onClick={async () => {
                const selcetedIDs: string[] = [];
                table
                  .getSelectedRowModel()
                  .rows.map((item) => selcetedIDs.push(item.original._id));
                if (selcetedIDs.length === 0) return;
                await deleteSelectedMutation.mutateAsync(selcetedIDs);
                table.toggleAllRowsSelected(false);
              }}
              className="rounded bg-danger rounded-circle p-0 border-0"
            >
              <i className="fa-solid fa-trash text-white fa-2xl p-3"></i>
            </button>
          </Tooltip>
        </Box>
      </>
    ),
    /* detail panel removed — rows are not expandable */
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
        "mrt-row-select",
        "_id",
        "code",
        "type",
        "discount",
        "expiresAt",
        "minAmount",
        "maxAmount",
        "limit",
        "validFor",
        "createdAt",
        "action",
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
  const totalPages = Number.isFinite(Number(visibleRowCount))
    ? Math.max(1, Math.ceil(visibleRowCount / PAGE_SIZE))
    : serverTotal
    ? Math.ceil(serverTotal / PAGE_SIZE)
    : Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const limit = PAGE_SIZE;

  return (
    <div>
      {isError && (
        <div className="p-4 text-center text-red-600">
          Error loading coupons. Please try again.
        </div>
      )}

      <MaterialReactTable table={table} />

      <Modal
        show={showCreateModal}
        onHide={() => {
          setShowCreateModal(false);
          setEditingId(null);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? "Edit Coupon" : "Add Coupon"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="form-label">Code</label>
            <input
              className="form-control"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Type</label>
            <select
              className="form-select"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="percentage">Percentage</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Discount</label>
            <input
              className="form-control"
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Expires At</label>
            <input
              type="date"
              className="form-control"
              value={
                form.expiresAt
                  ? new Date(form.expiresAt).toISOString().slice(0, 10)
                  : ""
              }
              onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Min Amount</label>
            <input
              className="form-control"
              value={form.minAmount}
              onChange={(e) => setForm({ ...form, minAmount: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Max Amount</label>
            <input
              className="form-control"
              value={form.maxAmount}
              onChange={(e) => setForm({ ...form, maxAmount: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Limit</label>
            <input
              type="number"
              className="form-control"
              value={form.limit}
              onChange={(e) =>
                setForm({
                  ...form,
                  limit: e.target.value === "" ? 0 : Number(e.target.value),
                })
              }
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Valid For</label>
            <select
              className="form-select"
              value={form.validFor}
              onChange={(e) => setForm({ ...form, validFor: e.target.value })}
            >
              {validForOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          {form.validFor !== "all" && (
            <div className="mb-3">
              <label className="form-label">Applied On (select multiple)</label>
              <Select
                isMulti
                options={
                  form.validFor === "subCategory"
                    ? subcategoryOptions.length > 0
                      ? subcategoryOptions
                      : remoteSubcategoryOptions
                    : form.validFor === "childSubCategory"
                    ? childSubcategoryOptions.length > 0
                      ? childSubcategoryOptions
                      : remoteChildOptions
                    : categoryOptions.length > 0
                    ? categoryOptions
                    : remoteCategoryOptions
                }
                value={(form.appliedOn || [])
                  .map((id) => {
                    const source =
                      form.validFor === "subCategory"
                        ? subcategoryOptions.length > 0
                          ? subcategoryOptions
                          : remoteSubcategoryOptions
                        : form.validFor === "childSubCategory"
                        ? childSubcategoryOptions.length > 0
                          ? childSubcategoryOptions
                          : remoteChildOptions
                        : categoryOptions.length > 0
                        ? categoryOptions
                        : remoteCategoryOptions;
                    return source.find((opt: any) => opt.value === id);
                  })
                  .filter(Boolean)}
                onChange={(selected) =>
                  setForm({
                    ...form,
                    appliedOn: (selected || []).map((s: any) => s.value),
                  })
                }
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setShowCreateModal(false);
              setEditingId(null);
            }}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={async () => {
              const body: any = {
                code: form.code,
                type: form.type,
                discount: form.discount,
                expiresAt: form.expiresAt,
                minAmount: form.minAmount,
                maxAmount: form.maxAmount,
                limit: form.limit,
                // map UI key to backend enum; default to sending value unchanged if no mapping
                validFor: validForOptions[form.validFor] || form.validFor,
              };
              if (form.appliedOn && form.appliedOn.length > 0)
                body.appliedOn = form.appliedOn;
              try {
                if (editingId) {
                  await updateMutation.mutateAsync({ id: editingId, body });
                  // close modal after successful update
                  setShowCreateModal(false);
                } else {
                  await createMutation.mutateAsync(body);
                }
              } finally {
                setEditingId(null);
              }
            }}
          >
            Save
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CouponsTable;
