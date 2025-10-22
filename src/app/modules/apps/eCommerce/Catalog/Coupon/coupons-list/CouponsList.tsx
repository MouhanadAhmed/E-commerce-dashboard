import React from "react";
import { ListViewProvider } from "./core/ListViewProvider";
import { KTCard } from "../../../../../../../_metronic/helpers";
import { ToolbarWrapper } from "../../../../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../../../../_metronic/layout/components/content";
import CouponsTable from "./table/CouponsTable";

import { QueryRequestProvider } from "./core/QueryRequestProvider";
import { QueryRequestProvider as CategoryRequest } from "../../Category/categories-list/core/QueryRequestProvider";
import { QueryResponseProvider as CategoryQuery } from "../../Category/categories-list/core/QueryResponseProvider";
import { QueryRequestProvider as SubCategoryRequest } from "../../SubCategory/Subcategories-list/core/QueryRequestProvider";
import { QueryResponseProvider as SubCategoryQuery } from "../../SubCategory/Subcategories-list/core/QueryResponseProvider";
import { QueryRequestProvider as ChildSubRequest } from "../../ChildSubCategory/ChildSubcategories-list/core/QueryRequestProvider";
import { QueryResponseProvider as ChildQuery } from "../../ChildSubCategory/ChildSubcategories-list/core/QueryResponseProvider";

const CouponsList = () => {
  return (
    <>
      <KTCard>
        <CouponsTable />
      </KTCard>

      {/* Archived coupons table */}
      <div style={{ marginTop: 16 }}>
        <KTCard>
          <CouponsTable deletedOnly />
        </KTCard>
      </div>
    </>
  );
};

const CouponsListWrapper = () => (
  <QueryRequestProvider>
    <CategoryRequest>
      <CategoryQuery includeArchived={false}>
        <SubCategoryRequest>
          <SubCategoryQuery includeArchived={false}>
            <ChildSubRequest>
              <ChildQuery includeArchived={false}>
                <ListViewProvider>
                  <ToolbarWrapper />
                  <Content>
                    <CouponsList />
                  </Content>
                </ListViewProvider>
              </ChildQuery>
            </ChildSubRequest>
          </SubCategoryQuery>
        </SubCategoryRequest>
      </CategoryQuery>
    </CategoryRequest>
  </QueryRequestProvider>
);

export { CouponsListWrapper };
