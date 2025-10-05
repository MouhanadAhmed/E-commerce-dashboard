import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import {
  PageLink,
  PageTitle,
} from "../../../../../../../../_metronic/layout/core";
import { ProductFormWrapper } from "./ProductFormWrapper";

const productsBreadcrumbs: Array<PageLink> = [
  {
    title: "Product Form",
    path: "/apps/eCommerce/productForm/:id",
    isSeparator: false,
    isActive: false,
  },
  {
    title: "Products Form",
    path: "",
    isSeparator: true,
    isActive: false,
  },
];

const AddProductsPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path="productForm/:id"
          element={
            <>
              <PageTitle breadcrumbs={productsBreadcrumbs}>
                Products Form
              </PageTitle>

              <ProductFormWrapper />
            </>
          }
        />
      </Route>
      <Route
        index
        element={<Navigate to="/apps/eCommerce/productForm/:id" />}
      />
    </Routes>
  );
};

export default AddProductsPage;
