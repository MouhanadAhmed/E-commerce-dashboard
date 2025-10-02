import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import { PageLink, PageTitle } from "../../../../../../_metronic/layout/core";
import { GroupOfOptionsListWrapper } from "./groupOfOptions-list/GroupOfOptionsList";

const GroupOfOptionsBreadcrumbs: Array<PageLink> = [
  {
    title: "Group Of Options Management",
    path: "/apps/eCommerce/groupOfOptions",
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

const GroupOfOptionsPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path="groupOfOptions"
          element={
            <>
              <PageTitle breadcrumbs={GroupOfOptionsBreadcrumbs}>
                Group Of Options list
              </PageTitle>
              <GroupOfOptionsListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to="/apps/eCommerce/groupOfOptions" />} />
    </Routes>
  );
};

export default GroupOfOptionsPage;
