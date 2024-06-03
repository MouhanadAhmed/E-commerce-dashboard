import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../../../_metronic/layout/core'
import { CategoriesListWrapper } from './categories-list/CategoriesList'

const extrasBreadcrumbs: Array<PageLink> = [
  {
    title: 'Extras Management',
    path: '/apps/eCommerce/extras',
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

const ExtrasPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='extras'
          element={
            <>
              <PageTitle breadcrumbs={extrasBreadcrumbs}>Extras list</PageTitle>
              <CategoriesListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/eCommerce/extras' />} />
    </Routes>
  )
}

export default ExtrasPage
