import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../../../_metronic/layout/core'
import { ProductsListWrapper } from './products-list/ProductsList'

const productsBreadcrumbs: Array<PageLink> = [
  {
    title: 'Product Management',
    path: '/apps/eCommerce/products',
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

const ProductsPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='products'
          element={
            <>
              <PageTitle breadcrumbs={productsBreadcrumbs}>Products list</PageTitle>
              <ProductsListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/eCommerce/products' />} />
    </Routes>
  )
}

export default ProductsPage
