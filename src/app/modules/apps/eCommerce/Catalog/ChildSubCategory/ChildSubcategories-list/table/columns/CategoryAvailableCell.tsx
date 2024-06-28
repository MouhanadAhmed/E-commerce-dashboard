
import {FC, useEffect} from 'react'
import {useMutation, useQueryClient} from 'react-query'
import {useListView} from '../../core/ListViewProvider'
import {useQueryResponse} from '../../core/QueryResponseProvider'
import { ID, KTIcon, QUERIES } from '../../../../../../../../../_metronic/helpers'
import { updateSubCategory } from '../../core/_requests'
import { MenuComponent } from '../../../../../../../../../_metronic/assets/ts/components'

type Props = {
  id: string | undefined,
  available: boolean ,
}

const CategoryAvailableCell: FC<Props> = ({id,available}) => {
  const {setItemIdForUpdate,itemIdForUpdate} = useListView()
  const {query} = useQueryResponse()
  const queryClient = useQueryClient()
  // console.log(id)
  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  const openEditModal = () => {
    setItemIdForUpdate(null);
    // setItemIdForUpdate({id});
    // console.log(id,itemIdForUpdate)
  }

  const updateCategoryAvailable = useMutation(() => updateSubCategory(id,{available:!available}), {
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      queryClient.invalidateQueries([`${QUERIES.CATEGORIES_LIST}-${query}`])
    },
  })

  return (
    <>
      {/* <a
        href='#'
        className='btn btn-light btn-active-light-primary btn-sm'
        data-kt-menu-trigger='click'
        data-kt-menu-placement='bottom-end'
      >
        Actions
        <KTIcon iconName='down' className='fs-5 m-0' />
      </a> */}
      {/* begin::Menu */}
      <div
        className='d-flex justify-content-center menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7  py-4'
        data-kt-menu='true'
      >
        {/* begin::Menu item */}
        <div className='menu-item form-check form-switch px-3 d-flex justify-content-center align-items-center'>
          <input type="checkbox" name="available" className='mx-2 form-check-input' role="switch" id={id} defaultChecked={available} onClick={async () => await updateCategoryAvailable.mutateAsync()}/>
          {/* <label htmlFor="available">available</label> */}
        </div>
        {/* end::Menu item */}
        {/* begin::Menu item */}
   
        {/* end::Menu item */}

        {/* begin::Menu item */}
      
        {/* end::Menu item */}
      </div>
      {/* end::Menu */}
    </>
  )
}

export {CategoryAvailableCell}
