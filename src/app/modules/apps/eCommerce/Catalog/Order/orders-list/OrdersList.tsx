import { ListViewProvider } from "./core/ListViewProvider";
import {
  QueryRequestProvider,
  useQueryRequest,
} from "./core/QueryRequestProvider";
import { useEffect } from "react";
import { KTCard } from "../../../../../../../_metronic/helpers";
import { ToolbarWrapper } from "../../../../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../../../../_metronic/layout/components/content";
import OrdersTable from "./table/OrdersTable";

const OrdersList = () => {
  return (
    <>
      <KTCard>
        <OrdersTable />
      </KTCard>
    </>
  );
};

const OrdersListWrapper = () => (
  <QueryRequestProvider>
    <ListViewProvider>
      <ToolbarWrapper />
      <Content>
        <OrdersList />
      </Content>
    </ListViewProvider>
  </QueryRequestProvider>
);

export { OrdersListWrapper };
