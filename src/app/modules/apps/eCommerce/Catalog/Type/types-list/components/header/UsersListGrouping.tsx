import { useQueryClient, useMutation } from 'react-query';
import { useListView } from '../../../types-list/core/ListViewProvider';
import { useQueryResponse } from '../../../types-list/core/QueryResponseProvider';
import { QUERIES } from '../../../../../../../../../_metronic/helpers';
import { deleteSelectedCategories } from '../../../types-list/core/_requests';

const UsersListGrouping = () => {
  const { selected, clearSelected } = useListView();
  const queryClient = useQueryClient();
  const { query } = useQueryResponse();

  const deleteSelectedItems = useMutation(
    () => deleteSelectedCategories(selected),
    {
      // 💡 response of the mutation is passed to onSuccess
      onSuccess: () => {
        // ✅ update detail view directly
        queryClient.invalidateQueries([`${QUERIES.USERS_LIST}-${query}`]);
        clearSelected();
      },
    }
  );

  return (
    <div className="d-flex justify-content-end align-items-center">
      <div className="fw-bolder me-5">
        <span className="me-2">{selected.length}</span> Selected
      </div>

      <button
        type="button"
        className="btn btn-danger"
        onClick={async () => await deleteSelectedItems.mutateAsync()}
      >
        Delete Selected
      </button>
    </div>
  );
};

export { UsersListGrouping };
