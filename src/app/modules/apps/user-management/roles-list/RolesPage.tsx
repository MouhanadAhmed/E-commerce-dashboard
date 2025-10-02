import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import { PageLink, PageTitle } from "../../../../../_metronic/layout/core";
import { RolesListWrapper } from "./RolesList";

const rolesBreadcrumbs: Array<PageLink> = [
  {
    title: "Roles Management",
    path: "/apps/user-management/roles",
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

const RolesPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path="roles"
          element={
            <>
              <PageTitle breadcrumbs={rolesBreadcrumbs}>Roles list</PageTitle>
              <RolesListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to="/apps/user-management/roles" />} />
    </Routes>
  );
};

export default RolesPage;
