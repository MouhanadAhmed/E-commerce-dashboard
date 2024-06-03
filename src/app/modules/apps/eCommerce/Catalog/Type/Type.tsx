import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../../../_metronic/layout/core'
import { CategoriesListWrapper } from './categories-list/CategoriesList'

const typesBreadcrumbs: Array<PageLink> = [
  {
    title: 'Types Management',
    path: '/apps/eCommerce/types',
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

const TypesPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='types'
          element={
            <>
              <PageTitle breadcrumbs={typesBreadcrumbs}>Types list</PageTitle>
              <CategoriesListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/eCommerce/types' />} />
    </Routes>
  )
}

export default TypesPage
