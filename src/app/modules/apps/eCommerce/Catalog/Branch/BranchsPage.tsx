import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../../../_metronic/layout/core'
import { BranchsListWrapper } from './branchs-list/BranchsList'

const branchsBreadcrumbs: Array<PageLink> = [
  {
    title: 'Branch Management',
    path: '/apps/eCommerce/branchs',
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

const BranchsPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='branchs'
          element={
            <>
              <PageTitle breadcrumbs={branchsBreadcrumbs}>Branch list</PageTitle>
              <BranchsListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/eCommerce/branchs' />} />
    </Routes>
  )
}

export default BranchsPage
