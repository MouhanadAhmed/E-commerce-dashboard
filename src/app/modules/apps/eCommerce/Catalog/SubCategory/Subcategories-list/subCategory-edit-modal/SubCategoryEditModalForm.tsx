import {FC, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {useQueryResponse} from '../core/QueryResponseProvider'
import { SubCategories as Category } from '../core/_models'
import { createSubCategory, updateSubCategory } from '../core/_requests'
import { isNotEmpty, toAbsoluteUrl } from '../../../../../../../../_metronic/helpers'

type Props = {
  isSubCategoryLoading: boolean
  subCategory: Category
}

const editSubCategorySchema = Yup.object().shape({
  order: Yup.number()
    .min(0, 'Order can\'t be negative'),
  name: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .required('Name is required'),
    description: Yup.string()
    .min(3, 'Minimum 3 symbols')
})

const SubCategoryEditModalForm: FC<Props> = ({subCategory, isSubCategoryLoading}) => {
  const {setItemIdForUpdate} = useListView()
  const {refetch} = useQueryResponse()

  const [subCategoryForEdit] = useState<Category>({
    ...subCategory,
    available: subCategory.available || true,
    name: subCategory.name || "",
  })

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  const blankImg = toAbsoluteUrl('media/svg/avatars/blank.svg')
  const userAvatarImg = toAbsoluteUrl(`media/${subCategoryForEdit.imgCover}`)

  const formik = useFormik({
    initialValues: subCategoryForEdit,
    validationSchema: editSubCategorySchema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      try {
        if (isNotEmpty(values._id)) {
          await updateSubCategory(values?._id,values)
        } else {
          await createSubCategory(values)
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
              {/* end::Preview existing imgCover */}

              {/* begin::Label */}
              {/* <label
              className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
              data-kt-image-input-action='change'
              data-bs-toggle='tooltip'
              title='Change imgCover'
            >
              <i className='bi bi-pencil-fill fs-7'></i>

              <input type='file' name='imgCover' accept='.png, .jpg, .jpeg' />
              <input type='hidden' name='avatar_remove' />
            </label> */}
              {/* end::Label */}

              {/* begin::Cancel */}
              {/* <span
              className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
              data-kt-image-input-action='cancel'
              data-bs-toggle='tooltip'
              title='Cancel imgCover'
            >
              <i className='bi bi-x fs-2'></i>
            </span> */}
              {/* end::Cancel */}

              {/* begin::Remove */}
              {/* <span
              className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
              data-kt-image-input-action='remove'
              data-bs-toggle='tooltip'
              title='Remove imgCover'
            >
              <i className='bi bi-x fs-2'></i>
            </span> */}
              {/* end::Remove */}
            </div>
            {/* end::Image input */}

            {/* begin::Hint */}
            {/* <div className='form-text'>Allowed file types: png, jpg, jpeg.</div> */}
            {/* end::Hint */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 ps-2 mb-2'>Name</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Full name'
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
              disabled={formik.isSubmitting || isSubCategoryLoading}
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
            <label className='required fw-bold fs-6  ms-2 mb-2'>Order</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='order'
              {...formik.getFieldProps('order')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0 ms-2',
                {'is-invalid': formik.touched.order && formik.errors.order},
                {
                  'is-valid': formik.touched.order && !formik.errors.order,
                }
              )}
              type='text'
              name='order'
              autoComplete='off'
              disabled={formik.isSubmitting || isSubCategoryLoading}
            />
            {/* end::Input */}
            {formik.touched.order && formik.errors.order && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.order}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2 ms-2'>Description</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='description'
              {...formik.getFieldProps('description')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0 ms-2',
                {'is-invalid': formik.touched.description && formik.errors.description},
                {
                  'is-valid': formik.touched.description && !formik.errors.description,
                }
              )}
              type='text'
              name='description'
              autoComplete='off'
              disabled={formik.isSubmitting || isSubCategoryLoading}
            />
            {/* end::Input */}
            {formik.touched.description && formik.errors.description && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.description}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}


          {/* begin::Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-bold fs-6 mb-2 ms-2'>Available</label>
            {/* end::Label */}

            {/* begin::Input */}
            <select
              {...formik.getFieldProps('available')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0 ms-2',
                {'is-invalid': formik.touched.description && formik.errors.description},
                {
                  'is-valid': formik.touched.description && !formik.errors.description,
                }
              )}
              name='available'
              autoComplete='off'
              disabled={formik.isSubmitting || isSubCategoryLoading}>
                <option value="true">Yes</option>
                <option value="false">No</option>
            </select>
            {/* end::Input */}
            {formik.touched.available && formik.errors.available && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.available}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}
        </div>
        {/* end::Scroll */}

        {/* begin::Actions */}
        <div className='text-center pt-15'>
          <button
            type='reset'
            onClick={() => cancel()}
            className='btn btn-light me-3'
            data-kt-users-modal-action='cancel'
            disabled={formik.isSubmitting || isSubCategoryLoading}
          >
            Discard
          </button>

          <button
            type='submit'
            className='btn btn-primary'
            data-kt-users-modal-action='submit'
            disabled={isSubCategoryLoading || formik.isSubmitting || !formik.isValid || !formik.touched}
          >
            <span className='indicator-label'>Submit</span>
            {(formik.isSubmitting || isSubCategoryLoading) && (
              <span className='indicator-progress'>
                Please wait...{' '}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
        {/* end::Actions */}
      </form>
      {(formik.isSubmitting || isSubCategoryLoading) && <UsersListLoading />}
    </>
  )
}

export {SubCategoryEditModalForm}
