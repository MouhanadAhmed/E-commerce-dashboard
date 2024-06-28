import { FC, useEffect, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useListView } from '../../core/ListViewProvider'
import { useQueryResponse } from '../../core/QueryResponseProvider'
import { ID, KTIcon, QUERIES } from '../../../../../../../../../_metronic/helpers'
import { deleteSubCategory } from '../../core/_requests'
import { MenuComponent } from '../../../../../../../../../_metronic/assets/ts/components'
import { Modal, Button } from 'react-bootstrap'
// import 'bootstrap/dist/css/bootstrap.min.css'

type Props = {
  id: string | undefined,
  available: boolean,
}

const UserActionsCell: FC<Props> = ({ id }) => {
  const { setItemIdForUpdate, itemIdForUpdate } = useListView()
  const { query } = useQueryResponse()
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  const openEditModal = () => {
    setItemIdForUpdate(null)
    // setItemIdForUpdate({id});
    // console.log(id,itemIdForUpdate)
  }

  const deleteItem = useMutation(() => deleteSubCategory(id), {
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      queryClient.invalidateQueries([`${QUERIES.SUB_CATEGORIES_LIST}-${query}`])
    },
  })

  const handleDeleteClick = () => {
    setShowModal(true)
  }

  const handleConfirmDelete = async () => {
    await deleteItem.mutateAsync()
    setShowModal(false)
  }

  const handleClose = () => {
    setShowModal(false)
  }

  return (
    <>
      <div
        className='d-flex justify-content-center menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 py-4'
        data-kt-menu='true'
      >
        <div className='menu-item px-3'>
          <a className='menu-link px-3' defaultValue='edit' name="edit" onClick={openEditModal}>
            Edit
          </a>
        </div>
        <div className='menu-item px-3'>
          <a
            className='menu-link px-3'
            data-kt-users-table-filter='delete_row'
            onClick={handleDeleteClick}
            name="delete"
          >
            Delete
          </a>
        </div>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export { UserActionsCell }
