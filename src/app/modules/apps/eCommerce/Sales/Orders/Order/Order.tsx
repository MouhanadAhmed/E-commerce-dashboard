import {Route, Routes, Outlet, Navigate} from 'react-router-dom'
import { OrdersListWrapper } from './orders-list/OrdersList'
import { PageLink, PageTitle } from '../../../../../../../_metronic/layout/core'

const ordersBreadcrumbs: Array<PageLink> = [
  {
    title: 'Orders Management',
    path: '/apps/eCommerce/orders',
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

const OrdersPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path='orders'
          element={
            <>
              <PageTitle breadcrumbs={ordersBreadcrumbs}>Orders list</PageTitle>
              <OrdersListWrapper />
            </>
          }
        />
      </Route>
      <Route index element={<Navigate to='/apps/eCommerce/orders' />} />
    </Routes>
  )
}

export default OrdersPage
