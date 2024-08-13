import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../../../_metronic/layout/core'
import { PermissionsListWrapper } from './PermsList'

const permsBreadcrumbs: Array<PageLink> = [
  {
    title: 'Permissions Management',
    path: '/apps/user-management/permissions',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const PermsPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='permissions'
          element={
            <>
              <PageTitle breadcrumbs={permsBreadcrumbs}>Permissions list</PageTitle>
              <PermissionsListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/user-management/permissions' />} />
    </Routes>
  )
}

export default PermsPage
