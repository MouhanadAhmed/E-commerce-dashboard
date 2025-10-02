import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import { PageLink, PageTitle } from "../../../../../../_metronic/layout/core";
import { SubCategoriesListWrapper } from "./Subcategories-list/SubCategoriesList";

const subCategoriesBreadcrumbs: Array<PageLink> = [
  {
    title: "SubCategory Management",
    path: "/apps/eCommerce/subCategories",
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

const SubCategoriesPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path="subCategories"
          element={
            <>
              <PageTitle breadcrumbs={subCategoriesBreadcrumbs}>
                SubCategories list
              </PageTitle>
              <SubCategoriesListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to="/apps/eCommerce/subCategories" />} />
    </Routes>
  );
};

export default SubCategoriesPage;
