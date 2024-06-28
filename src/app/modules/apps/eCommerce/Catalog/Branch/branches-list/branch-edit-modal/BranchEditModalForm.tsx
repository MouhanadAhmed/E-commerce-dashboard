import {FC, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {useQueryResponse} from '../core/QueryResponseProvider'
import { Branch  } from '../core/_models'
import { createBranch, updateBranch } from '../core/_requests'
import { isNotEmpty, toAbsoluteUrl } from '../../../../../../../../_metronic/helpers'

type Props = {
  isBranchLoading: boolean
  branch: Branch
}

const editBranchSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .required('Name is required'),
  workingHours: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .optional(),
  address: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .optional(),
    imgCover: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .optional(),
    phone: Yup.array().of(Yup.string())
    .min(1, 'Minimum 3 symbols')
    .optional(),
    gmap: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .optional(),
})

const BranchEditModalForm: FC<Props> = ({branch, isBranchLoading}) => {
  const {setItemIdForUpdate} = useListView()
  const {refetch} = useQueryResponse()

  const [branchForEdit] = useState<Branch>({
    ...branch
  })

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  const blankImg = toAbsoluteUrl('media/svg/avatars/blank.svg')
  const userAvatarImg = toAbsoluteUrl(`media/${branchForEdit.imgCover}`)

  const formik = useFormik({
    initialValues: branchForEdit,
    validationSchema: editBranchSchema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      try {
        if (isNotEmpty(values._id)) {
          await updateBranch(values?._id,values)
        } else {
          await createBranch(values)
        }
      } catch (ex) {
        console.error(ex)
      } finally {
        setSubmitting(true)
        cancel(true)
      }
    },
  })

  return (
    <>
      <form id='kt_modal_add_user_form' className='form ' onSubmit={formik.handleSubmit} noValidate>
        {/* begin::Scroll */}
        <div
          className='d-flex flex-column scroll-y me-n7 pe-7'
          id='kt_modal_add_user_scroll'
          data-kt-scroll='true'
          data-kt-scroll-activate='{default: false, lg: true}'
          data-kt-scroll-max-height='auto'
          data-kt-scroll-dependencies='#kt_modal_add_user_header'
          data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
          data-kt-scroll-offset='300px'
        >
          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='d-block fw-bold fs-6 ms-2 mb-5'>ImgCover</label>
            {/* end::Label */}

            {/* begin::Image input */}
            <div
              className='image-input image-input-outline ms-2'
              data-kt-image-input='true'
              style={{backgroundImage: `url('${blankImg}')`}}
            >
              {/* begin::Preview existing imgCover */}
              <div
                className='image-input-wrapper w-125px h-125px ms-2'
                style={{backgroundImage: `url('${userAvatarImg}')`}}
              ></div>

            </div>
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 ps-2 mb-2'>Name</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Branch name'
              {...formik.getFieldProps('name')}
              type='text'
              name='name'
              className={clsx(
                'form-control form-control-solid mb-3 ms-2 mb-lg-0',
                {'is-invalid': formik.touched.name && formik.errors.name},
                {
                  'is-valid': formik.touched.name && !formik.errors.name,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isBranchLoading}
            />
            {formik.touched.name && formik.errors.name && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.name}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>
          {/* end::Input group */}

          

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6  ms-2 mb-2'>Working hours</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Working hours'
              {...formik.getFieldProps('workingHours')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0 ms-2',
                {'is-invalid': formik.touched.workingHours && formik.errors.workingHours},
                {
                  'is-valid': formik.touched.workingHours && !formik.errors.workingHours,
                }
              )}
              type='text'
              name='workingHours'
              autoComplete='off'
              disabled={formik.isSubmitting || isBranchLoading}
            />
            {/* end::Input */}
            {formik.touched.workingHours && formik.errors.workingHours && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.workingHours}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2 ms-2'>Address</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Address'
              {...formik.getFieldProps('address')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0 ms-2',
                {'is-invalid': formik.touched.address && formik.errors.address},
                {
                  'is-valid': formik.touched.address && !formik.errors.address,
                }
              )}
              type='text'
              name='address'
              autoComplete='off'
              disabled={formik.isSubmitting || isBranchLoading}
            />
            {/* end::Input */}
            {formik.touched.address && formik.errors.address && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.address}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2 ms-2'>Phone</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Phone'
              {...formik.getFieldProps('phone')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0 ms-2',
                {'is-invalid': formik.touched.phone && formik.errors.phone},
                {
                  'is-valid': formik.touched.phone && !formik.errors.phone,
                }
              )}
              type='text'
              name='phone'
              autoComplete='off'
              disabled={formik.isSubmitting || isBranchLoading}
            />
            {/* end::Input */}
            {formik.touched.phone && formik.errors.phone && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.phone}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2 ms-2'>Google map link</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Google map link'
              {...formik.getFieldProps('gmap')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0 ms-2',
                {'is-invalid': formik.touched.gmap && formik.errors.gmap},
                {
                  'is-valid': formik.touched.gmap && !formik.errors.gmap,
                }
              )}
              type='text'
              name='gmap'
              autoComplete='off'
              disabled={formik.isSubmitting || isBranchLoading}
            />
            {/* end::Input */}
            {formik.touched.gmap && formik.errors.gmap && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.gmap}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}


  
        {/* end::Scroll */}

        {/* begin::Actions */}
        <div className='text-center pt-15'>
          <button
            type='reset'
            onClick={() => cancel()}
            className='btn btn-light me-3'
            data-kt-users-modal-action='cancel'
            disabled={formik.isSubmitting || isBranchLoading}
          >
            Discard
          </button>

          <button
            type='submit'
            className='btn btn-primary'
            data-kt-users-modal-action='submit'
            disabled={isBranchLoading || formik.isSubmitting || !formik.isValid || !formik.touched}
          >
            <span className='indicator-label'>Submit</span>
            {(formik.isSubmitting || isBranchLoading) && (
              <span className='indicator-progress'>
                Please wait...{' '}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
        </div>
        {/* end::Actions */}
      </form>
      {(formik.isSubmitting || isBranchLoading) && <UsersListLoading />}
    </>
  )
}

export {BranchEditModalForm}
