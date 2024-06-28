import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../../../_metronic/layout/core'
import { BranchesListWrapper } from './branches-list/BranchesList'

const branchsBreadcrumbs: Array<PageLink> = [
  {
    title: 'Branch Management',
    path: '/apps/eCommerce/branches',
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

const BranchesPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='branches'
          element={
            <>
              <PageTitle breadcrumbs={branchsBreadcrumbs}>Branch list</PageTitle>
              <BranchesListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/eCommerce/branches' />} />
    </Routes>
  )
}

export default BranchesPage
