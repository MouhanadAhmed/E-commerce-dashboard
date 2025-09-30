import {FC, useEffect, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {useQueryResponse} from '../core/QueryResponseProvider'
import { GroupOfOptions  } from '../core/_models'
import { createGroup, updateGroup } from '../core/_requests'
import { isNotEmpty } from '../../../../../../../../_metronic/helpers'

type Props = {
  isGroupLoading: boolean
  group: GroupOfOptions | null
}

const editGroupSchema = Yup.object().shape({
  name: Yup.string()
    .min(1, 'Minimum 1 symbol')
    .required('Name is required'),
  min: Yup.number()
    .min(0, 'Minimum value is 0')
    .required('Minimum is required'),
  stock: Yup.number()
    .nullable()
    .min(0, 'Stock cannot be negative')
    .optional(),
  order: Yup.number()
    .min(0, 'Order cannot be negative')
    .required('Order is required'),
  available: Yup.boolean()
    .required('Availability is required'),
})

const GroupEditModalForm: FC<Props> = ({group, isGroupLoading}) => {
  const {setItemIdForUpdate} = useListView()
  const {refetch} = useQueryResponse()

  const [groupForEdit] = useState({
    min: group?.min || 0,
    name: group?.name || '',
    available: group?.available ?? true,
    stock: group?.stock || null,
    sold: group?.sold || 0,
    order: group?.order || 0,
  })

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  const formik = useFormik({
    initialValues: groupForEdit,
    validationSchema: editGroupSchema,
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true)
      try {
        if (isNotEmpty((values as any)._id)) {
          await updateGroup((values as any)._id, values)
        } else {
          await createGroup(values as any)
        }
      } catch (ex) {
        console.error(ex)
      } finally {
        setSubmitting(false)
        cancel(true)
      }
    },
  })

  return (
    <>
      <form id='kt_modal_add_group_form' className='form' onSubmit={formik.handleSubmit} noValidate>
        <div
          className='d-flex flex-column scroll-y me-n7 pe-7'
          id='kt_modal_add_group_scroll'
          data-kt-scroll='true'
          data-kt-scroll-activate='{default: false, lg: true}'
          data-kt-scroll-max-height='auto'
          data-kt-scroll-dependencies='#kt_modal_add_group_header'
          data-kt-scroll-wrappers='#kt_modal_add_group_scroll'
          data-kt-scroll-offset='300px'
        >
          {/* begin::Input group - Name */}
          <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>Name</label>
            <input
              placeholder='Group name'
              {...formik.getFieldProps('name')}
              type='text'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.name && formik.errors.name},
                {'is-valid': formik.touched.name && !formik.errors.name}
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isGroupLoading}
            />
            {formik.touched.name && formik.errors.name && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.name}</span>
                </div>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group - Min */}
          <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>Minimum</label>
            <input
              placeholder='Minimum quantity'
              {...formik.getFieldProps('min')}
              type='number'
              min='0'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.min && formik.errors.min},
                {'is-valid': formik.touched.min && !formik.errors.min}
              )}
              disabled={formik.isSubmitting || isGroupLoading}
            />
            {formik.touched.min && formik.errors.min && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.min}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group - Stock */}
          <div className='fv-row mb-7'>
            <label className='fw-bold fs-6 mb-2'>Stock (optional)</label>
            <input
              placeholder='Available stock'
              {...formik.getFieldProps('stock')}
              type='number'
              min='0'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.stock && formik.errors.stock},
                {'is-valid': formik.touched.stock && !formik.errors.stock}
              )}
              disabled={formik.isSubmitting || isGroupLoading}
            />
            {formik.touched.stock && formik.errors.stock && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.stock}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group - Order */}
          <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>Order</label>
            <input
              placeholder='Display order'
              {...formik.getFieldProps('order')}
              type='number'
              min='0'
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                {'is-invalid': formik.touched.order && formik.errors.order},
                {'is-valid': formik.touched.order && !formik.errors.order}
              )}
              disabled={formik.isSubmitting || isGroupLoading}
            />
            {formik.touched.order && formik.errors.order && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.order}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group - Available */}
          <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2 me-3'>Available</label>
            <div className='form-check form-check-custom form-check-solid'>
              <input
                {...formik.getFieldProps('available')}
                className='form-check-input'
                type='checkbox'
                checked={formik.values.available}
                onChange={(e) => formik.setFieldValue('available', e.target.checked)}
                disabled={formik.isSubmitting || isGroupLoading}
              />
              <label className='form-check-label'>
                {formik.values.available ? 'Yes' : 'No'}
              </label>
            </div>
            {formik.touched.available && formik.errors.available && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.available}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Actions */}
          <div className='text-center pt-15'>
            <button
              type='button'
              onClick={() => cancel()}
              className='btn btn-light me-3'
              disabled={formik.isSubmitting || isGroupLoading}
            >
              Discard
            </button>

            <button
              type='submit'
              className='btn btn-primary'
              disabled={isGroupLoading || formik.isSubmitting || !formik.isValid}
            >
              <span className='indicator-label'>Submit</span>
              {(formik.isSubmitting || isGroupLoading) && (
                <span className='indicator-progress'>
                  Please wait...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
          </div>
          {/* end::Actions */}
        </div>
      </form>
      {(formik.isSubmitting || isGroupLoading) && <UsersListLoading />}
    </>
  )
}

export {GroupEditModalForm}