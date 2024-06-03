import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../../../_metronic/layout/core'
import { ChildSubCategoriesListWrapper } from './Subcategories-list/ChildSubCategoriesList'

const subCategoriesBreadcrumbs: Array<PageLink> = [
  {
    title: 'ChildSubCategory Management',
    path: '/apps/eCommerce/childSubCategories',
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

const ChildSubCategoriesPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='childSubCategories'
          element={
            <>
              <PageTitle breadcrumbs={subCategoriesBreadcrumbs}>ChildSubCategories list</PageTitle>
              <ChildSubCategoriesListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/eCommerce/childSubCategories' />} />
    </Routes>
  )
}

export default ChildSubCategoriesPage
