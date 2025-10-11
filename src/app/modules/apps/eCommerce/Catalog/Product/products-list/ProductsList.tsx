import { ListViewProvider, useListView } from "./core/ListViewProvider";
import { QueryRequestProvider } from "./core/QueryRequestProvider";
import { QueryRequestProvider as BranchRequest } from "../../Branch/branches-list/core/QueryRequestProvider";
import { QueryResponseProvider } from "./core/QueryResponseProvider";
import { QueryResponseProvider as BranchQuery } from "../../Branch/branches-list/core/QueryResponseProvider";
import { QueryRequestProvider as CategoryRequest } from "../../Category/categories-list/core/QueryRequestProvider";
import { QueryResponseProvider as CategoryQuery } from "../../Category/categories-list/core/QueryResponseProvider";
import { QueryRequestProvider as SubCategoryRequest } from "../../SubCategory/Subcategories-list/core/QueryRequestProvider";
import { QueryResponseProvider as SubCategoryQuery } from "../../SubCategory/Subcategories-list/core/QueryResponseProvider";
import { QueryRequestProvider as ChildSubRequest } from "../../ChildSubCategory/ChildSubcategories-list/core/QueryRequestProvider";
import { QueryResponseProvider as ChildQuery } from "../../ChildSubCategory/ChildSubcategories-list/core/QueryResponseProvider";
import { QueryRequestProvider as TypeRequest } from "../../Type/types-list/core/QueryRequestProvider";
import { QueryResponseProvider as TypeQuery } from "../../Type/types-list/core/QueryResponseProvider";
import { QueryRequestProvider as ExtraRequest } from "../../Extra/extra-list/core/QueryRequestProvider";
import { QueryResponseProvider as ExtraQuery } from "../../Extra/extra-list/core/QueryResponseProvider";
import { QueryRequestProvider as GroupRequest } from "../../GroupOfOptions/groupOfOptions-list/core/QueryRequestProvider";
import { QueryResponseProvider as GroupQuery } from "../../GroupOfOptions/groupOfOptions-list/core/QueryResponseProvider";

import { KTCard } from "../../../../../../../_metronic/helpers";
import { ToolbarWrapper } from "../../../../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../../../../_metronic/layout/components/content";
import { ProductsTable } from "./table/ProductsTable";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
const ProductsList = () => {
  const { itemIdForUpdate } = useListView();
  return (
    <>
      <KTCard>
        {/* <CategoriesListHeader /> */}
        <ProductsTable />
      </KTCard>
    </>
  );
};

const ProductsListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <BranchRequest>
        <BranchQuery includeArchived={false}>
          <CategoryRequest>
            <CategoryQuery includeArchived={false}>
              <SubCategoryRequest>
                <SubCategoryQuery includeArchived={false}>
                  <ChildSubRequest>
                    <ChildQuery includeArchived={false}>
                      <TypeRequest>
                        <TypeQuery includeArchived={false}>
                          <ExtraRequest>
                            <ExtraQuery includeArchived={false}>
                              <GroupRequest>
                                <GroupQuery includeArchived={false}>
                                  <ListViewProvider>
                                    <ToolbarWrapper />
                                    <DndProvider backend={HTML5Backend}>
                                      <Content>
                                        <ProductsList />
                                      </Content>
                                    </DndProvider>
                                  </ListViewProvider>
                                </GroupQuery>
                              </GroupRequest>
                            </ExtraQuery>
                          </ExtraRequest>
                        </TypeQuery>
                      </TypeRequest>
                    </ChildQuery>
                  </ChildSubRequest>
                </SubCategoryQuery>
              </SubCategoryRequest>
            </CategoryQuery>
          </CategoryRequest>
        </BranchQuery>
      </BranchRequest>
    </QueryResponseProvider>
  </QueryRequestProvider>
);

export { ProductsListWrapper };
