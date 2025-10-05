import { ListViewProvider } from '../core/ListViewProvider';
import { QueryRequestProvider } from '../core/QueryRequestProvider';
import { QueryRequestProvider as BranchRequest } from '../../../Branch/branches-list/core/QueryRequestProvider';
import { QueryResponseProvider as BranchQuery } from '../../../Branch/branches-list/core/QueryResponseProvider';
import { QueryResponseProvider as CategoriesQuery } from '../../../Category/categories-list/core/QueryResponseProvider';
import { QueryResponseProvider as SubCategoriesQuery } from '../../../SubCategory/Subcategories-list/core/QueryResponseProvider';
import { QueryResponseProvider as ChildCategoriesQuery } from '../../../ChildSubCategory/ChildSubcategories-list/core/QueryResponseProvider';
import { QueryResponseProvider as TypesQuery } from '../../../Type/types-list/core/QueryResponseProvider';
import { QueryResponseProvider as ExtrasQuery } from '../../../Extra/extra-list/core/QueryResponseProvider';
import { ToolbarWrapper } from '../../../../../../../../_metronic/layout/components/toolbar';
import { Content } from '../../../../../../../../_metronic/layout/components/content';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ProductForm from './ProductForm';

const ProductFormWrapper = () => (
  <QueryRequestProvider>
      <BranchRequest>
        <BranchQuery>
          <CategoriesQuery>
            <SubCategoriesQuery>
              <ChildCategoriesQuery>
                <TypesQuery>
                  <ExtrasQuery>
                    <ListViewProvider>
                      <ToolbarWrapper />
                      <DndProvider backend={HTML5Backend}>
                        <Content>
                          <ProductForm />
                        </Content>
                      </DndProvider>
                    </ListViewProvider>
                  </ExtrasQuery>
                </TypesQuery>
              </ChildCategoriesQuery>
            </SubCategoriesQuery>
          </CategoriesQuery>
        </BranchQuery>
      </BranchRequest>
  </QueryRequestProvider>
);

export { ProductFormWrapper };
