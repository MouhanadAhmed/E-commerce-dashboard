import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import { PageLink, PageTitle } from "../../../../../../_metronic/layout/core";
import { CouponsListWrapper } from "./coupons-list/CouponsList";

const couponsBreadcrumbs: Array<PageLink> = [
  {
    title: "Coupon Management",
    path: "/apps/eCommerce/coupons",
    isSeparator: false,
    isActive: false,
  },
  { title: "", path: "", isSeparator: true, isActive: false },
];

const CouponsPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path="coupons"
          element={
            <>
              <PageTitle breadcrumbs={couponsBreadcrumbs}>
                Coupon list
              </PageTitle>
              <CouponsListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to="/apps/eCommerce/coupons" />} />
    </Routes>
  );
};

export default CouponsPage;
