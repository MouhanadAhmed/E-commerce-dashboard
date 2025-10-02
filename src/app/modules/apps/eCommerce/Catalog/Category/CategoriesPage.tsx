import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import { PageLink, PageTitle } from "../../../../../../_metronic/layout/core";
import { CategoriesListWrapper } from "./categories-list/CategoriesList";

const categoriesBreadcrumbs: Array<PageLink> = [
  {
    title: "Category Management",
    path: "/apps/eCommerce/categories",
    isSeparator: false,
    isActive: false,
  },
  {
    title: "",
    path: "",
    isSeparator: true,
    isActive: false,
  },
];

const CategoriesPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path="categories"
          element={
            <>
              <PageTitle breadcrumbs={categoriesBreadcrumbs}>
                Categories list
              </PageTitle>
              <CategoriesListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to="/apps/eCommerce/categories" />} />
    </Routes>
  );
};

export default CategoriesPage;
