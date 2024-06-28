
import {FC, useEffect} from 'react'
import {useMutation, useQueryClient} from 'react-query'
import {useQueryResponse} from '../../core/QueryResponseProvider'
import {  QUERIES } from '../../../../../../../../../_metronic/helpers'
import { updateBranch } from '../../core/_requests'
import { MenuComponent } from '../../../../../../../../../_metronic/assets/ts/components'

type Props = {
  id: string | undefined,
  deleted: boolean | undefined,
}

const BranchAvailableCell: FC<Props> = ({id,deleted}) => {
  const {query} = useQueryResponse()
  const queryClient = useQueryClient()
  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

 

  const updateBranchAvailable = useMutation(() => updateBranch(id,{deleted:!deleted}), {
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      queryClient.invalidateQueries([`${QUERIES.BRNACHES_LIST}-${query}`]);
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
          <input type="checkbox" name="available" className='mx-2 form-check-input' role="switch" id={id} defaultChecked={deleted?deleted:false} onClick={async () => await updateBranchAvailable.mutateAsync()}/>
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

export {BranchAvailableCell}
