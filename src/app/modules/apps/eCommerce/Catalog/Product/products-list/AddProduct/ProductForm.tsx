import blankImage from '../../../../../../../../_metronic/assets/images/blank-image.svg'
import {FC, useEffect, useMemo, useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import clsx from 'clsx'
import {useListView} from '../core/ListViewProvider'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import {useQueryResponse} from '../core/QueryResponseProvider'
import { Product  } from '../core/_models'
import { createProduct, updateProduct } from '../core/_requests'
import { isNotEmpty, toAbsoluteUrl } from '../../../../../../../../_metronic/helpers'
import { useQueryResponseData as branchesData } from '../../../Branch/branches-list/core/QueryResponseProvider';
import { useQueryResponseData as categoriesData } from '../../../Category/categories-list/core/QueryResponseProvider';
import { useQueryResponseData as subcategoriesData } from '../../../SubCategory/Subcategories-list/core/QueryResponseProvider';
import { useQueryResponseData as childSubCategoryData } from '../../../ChildSubCategory/ChildSubcategories-list/core/QueryResponseProvider';
import { useQueryResponseData as typesData } from '../../../Type/categories-list/core/QueryResponseProvider';
import { useQueryResponseData as extrasData } from '../../../Extra/categories-list/core/QueryResponseProvider';
import { getArchivedBranches,getBranches } from '../../../Branch/branches-list/core/_requests';
import { getArchivedCategories, getCategories } from '../../../Category/categories-list/core/_requests';
import { getArchivedSubCategories, getSubCategories } from '../../../SubCategory/Subcategories-list/core/_requests';
import { getArchivedChildSubCategories, getChildSubCategories } from '../../../ChildSubCategory/ChildSubcategories-list/core/_requests';
import { getArchivedExtras, getExtras } from '../../../Extra/categories-list/core/_requests';
import { getArchivedTypes, getTypes } from '../../../Type/categories-list/core/_requests';
import Select from 'react-select'

type Props = {
    isProductLoading: boolean
    product: Product
  }

// Define the nested schemas first
const category = Yup.object().shape({
    category: Yup.string().matches(/^[0-9a-fA-F]{24}$/, 'Must be a valid hex string of length 24').optional(),
    order: Yup.number().min(1).optional(),
  });
  
  const subCategory = Yup.object().shape({
    subCategory: Yup.string().matches(/^[0-9a-fA-F]{24}$/, 'Must be a valid hex string of length 24').optional(),
    order: Yup.number().min(1).optional(),
  });
  
  const childSubCategory = Yup.object().shape({
    childSubCategory: Yup.string().matches(/^[0-9a-fA-F]{24}$/, 'Must be a valid hex string of length 24').optional(),
    order: Yup.number().min(1).optional(),
  });
  
  const branch = Yup.object().shape({
    branch: Yup.string().matches(/^[0-9a-fA-F]{24}$/, 'Must be a valid hex string of length 24').optional(),
    price: Yup.number().optional(),
    available: Yup.boolean().optional(),
    stock: Yup.string().optional(),
    priceAfterDiscount: Yup.number().min(0).optional(),
    priceAfterExpiresAt: Yup.date().optional(),
    order: Yup.number().min(1).optional(),
    sold: Yup.number().min(1).optional(),
  });
  
  const extras = Yup.object().shape({
    extra: Yup.string().matches(/^[0-9a-fA-F]{24}$/, 'Must be a valid hex string of length 24').optional(),
    order: Yup.number().min(1).optional(),
  });
  
  const types = Yup.object().shape({
    type: Yup.string().matches(/^[0-9a-fA-F]{24}$/, 'Must be a valid hex string of length 24').optional(),
    order: Yup.number().min(1).optional(),
  });
  
  const groupOfOptions = Yup.object().shape({
    groupOfOptions: Yup.string().matches(/^[0-9a-fA-F]{24}$/, 'Must be a valid hex string of length 24').optional(),
    order: Yup.number().min(1).optional(),
  });
  
  const descTable = Yup.object().shape({
    name: Yup.string().optional(),
    value: Yup.boolean().optional(),
    order: Yup.number().min(1).optional(),
  });
  
  // main schema
  const editProductSchema = Yup.object().shape({
    name: Yup.string().min(2).max(100).required('Name is required'),
    description: Yup.string().min(10).optional(),
    shortDesc: Yup.string().min(10).optional(),
    metaTags: Yup.array().of(Yup.string()).transform((value, originalValue) => (typeof originalValue === 'string' ? [originalValue] : originalValue)).optional(),
    category: Yup.array().of(category).transform((value, originalValue) => (Array.isArray(originalValue) ? originalValue : [originalValue])).optional(),
    subCategory: Yup.array().of(subCategory).transform((value, originalValue) => (Array.isArray(originalValue) ? originalValue : [originalValue])).optional(),
    childSubCategory: Yup.array().of(childSubCategory).transform((value, originalValue) => (Array.isArray(originalValue) ? originalValue : [originalValue])).optional(),
    types: Yup.array().of(types).transform((value, originalValue) => (Array.isArray(originalValue) ? originalValue : [originalValue])).optional(),
    stock: Yup.string().optional(),
    available: Yup.boolean().optional(),
    price: Yup.number().min(0).optional(),
    branch: Yup.array().of(branch).transform((value, originalValue) => (Array.isArray(originalValue) ? originalValue : [originalValue])).optional(),
    priceAfterDiscount: Yup.number().min(0).optional(),
    priceAfterExpiresAt: Yup.date().optional(),
    extras: Yup.array().of(extras).transform((value, originalValue) => (Array.isArray(originalValue) ? originalValue : [originalValue])).optional(),
    descTableName: Yup.string().optional(),
    descTable: Yup.array().of(descTable).transform((value, originalValue) => (Array.isArray(originalValue) ? originalValue : [originalValue])).optional(),
    weight: Yup.string().optional(),
    showWeight: Yup.boolean().optional(),
    book: Yup.string().optional(),
    bookAt: Yup.date().optional(),
    groupOfOptions: Yup.array().of(groupOfOptions).transform((value, originalValue) => (Array.isArray(originalValue) ? originalValue : [originalValue])).optional(),
    minQty: Yup.number().min(0).optional(),
    dimensions: Yup.string().optional(),
    rewardPoint: Yup.string().optional(),
    sold: Yup.number().min(0).optional(),
    deleted: Yup.boolean().optional(),
    order: Yup.number().min(0).optional(),
    quantity: Yup.number().min(0).optional(),
    ratingAverage: Yup.number().min(1).optional(),
    ratingCount: Yup.number().min(0).optional(),
  });


const ProductForm: FC<Props>= ({product, isProductLoading}) => {

    const {active : activeBranches,archived : archivedBranches} = branchesData();
    const {active : activeCategories,archived : archivedCategories} = categoriesData();
    const {active : activeSubCategories,archived : archivedSubCategories} = subcategoriesData();
    const {active : activeChildSubCategories,archived : archivedChildSubCategories} = childSubCategoryData();
    const {active : activeExtras,archived : archivedExtras} = extrasData();
    const {active : activeTypes,archived : archivedTypes} = typesData();

    const [branches,setBranches]=useState([...activeBranches,...archivedBranches]);
    const [categories,setCategories]=useState([...activeCategories,...archivedCategories]);
    const [subcategories,setSubCategories]=useState([...activeSubCategories,...archivedSubCategories]);
    const [childSubCategories,setChildSubCategories]=useState([...activeChildSubCategories,...archivedChildSubCategories]);
    const [extras,setExtras]=useState([...activeExtras,...archivedExtras]);
    const [types,setTypes]=useState([...activeTypes,...archivedTypes]);
    const [loading, setLoading] = useState(true);
    const [editBranch, setEditBranch]=useState();
    const [editCategory, setEditCategory]=useState();
    const [editSubCategory, setEditSubCategory]=useState();
    const [editChildSubCategory, setEditChildSubCategory]=useState();
    const [editExtra, setEditExtra]=useState();
    const [editType, setEditType]=useState();
    const [book, setBook]=useState();
    const [bookAt, setBookAt]=useState();
    
    const [productForEdit] = useState<Product>({
        ...product,
        // available: category.available || true,
        // name: category.name || "",
      })
    
      useEffect(() => {
        const fetchBranches = async () => {
          try {
            const resActive = await getBranches();
            const resArchived = await getArchivedBranches();
            setBranches([...resActive.data, ...resArchived.data]);
          } catch (error) {
            console.error('Error fetching branches:', error);
          }
        };
        fetchBranches();
        const fetchCategories = async () => {
          try {
            const resActive = await getCategories();
            const resArchived = await getArchivedCategories();
            setCategories([...resActive.data, ...resArchived.data]);
          } catch (error) {
            console.error('Error fetching categories:', error);
          }
        };
        fetchCategories();
        const fetchSubCategories = async () => {
          try {
            const resActive = await getSubCategories();
            const resArchived = await getArchivedSubCategories();
            setSubCategories([...resActive.data, ...resArchived.data]);
          } catch (error) {
            console.error('Error fetching subcategories:', error);
          }
        };
        fetchSubCategories();
        const fetchChildSubCategories = async () => {
          try {
            const resActive = await getChildSubCategories();
            const resArchived = await getArchivedChildSubCategories();
            setChildSubCategories([...resActive.data, ...resArchived.data]);
          } catch (error) {
            console.error('Error fetching childsubcategories:', error);
          }
        };
        fetchChildSubCategories();
        const fetchExtras = async () => {
          try {
            const resActive = await getExtras();
            const resArchived = await getArchivedExtras();
            setExtras([...resActive.data, ...resArchived.data]);
          } catch (error) {
            console.error('Error fetching extras:', error);
          }
        };
        fetchExtras();
        const fetchTypes = async () => {
          try {
            const resActive = await getTypes();
            const resArchived = await getArchivedTypes();
            setTypes([...resActive.data, ...resArchived.data]);
          } catch (error) {
            console.error('Error fetching types:', error);
          }
        };
        fetchTypes();
    
      }, []);

      const memoizedBranches = useMemo(() => branches.map(branch => ({ value: branch._id, label: branch.name })), [branches]);
      const memoizedCategories = useMemo(() => categories.map(category => ({ value: category._id, label: category.name })), [categories]);
      const memoizedSubCategories = useMemo(() => subcategories.map(subCategory => ({ value: subCategory._id, label: subCategory.name })), [subcategories]);
      const memoizedChildSubCategories = useMemo(() => childSubCategories.map(childSubCategory => ({ value: childSubCategory._id, label: childSubCategory.name })), [childSubCategories]);
      const memoizedExtras = useMemo(() => extras.map(extra => ({ value: extra._id, label: extra.name })), [extras]);
      const memoizedTypes = useMemo(() => types.map(type => ({ value: type._id, label: type.name })), [types]);

      const formik = useFormik({
        initialValues: productForEdit,
        validationSchema: editProductSchema,
        onSubmit: async (values, {setSubmitting}) => {
          setSubmitting(true)
          try {
            if (isNotEmpty(values._id)) {
              await updateProduct(values?._id,values)
            } else {
              await createProduct(values)
            }
          } catch (ex) {
            console.error(ex)
          } finally {
            setSubmitting(true)
            // cancel(true)
          }
        },
      })

  return (
    <>
          <form id='kt_modal_add_product_form' className='form ' onSubmit={formik.handleSubmit} noValidate>
        {/* begin::Scroll */}
        <div className                = "container p-8">
        <h3 className                 = 'fw-bolder p-4'>Add Product</h3>
        <div className                = "row">
          <div className="col-md-3">

          {/* begin:: Thumbnail Input group */}
          <div className='fv-row mb-7 border  rounded-start  shadow-sm border-2 p-8'>
            {/* begin::Label */}
            <label className='d-block fw-bold fs-6 ms-2 mb-5'>Thumbnail</label>
            {/* end::Label */}

            {/* begin::Image input */}
            <div
              className='image-input image-input-outline ms-2'
              data-kt-image-input='true'
              style={{backgroundImage: `url('${blankImage}')`}}
            >
              {/* begin::Preview existing imgCover */}
              <div
                className='image-input-wrapper w-125px h-125px ms-2'
                style={{backgroundImage: `url('${blankImage}')`}}
              ></div>
              {/* end::Preview existing imgCover */}

              {/* begin::Label */}
              <label
              className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
              data-kt-image-input-action='change'
              data-bs-toggle='tooltip'
              title='Change imgCover'
            >
              <i className='bi bi-pencil-fill fs-7'></i>

              <input type='file' name='imgCover' accept='.png, .jpg, .jpeg' />
              <input type='hidden' name='avatar_remove' />
            </label>
              {/* end::Label */}

              {/* begin::Cancel */}
              <span
              className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
              data-kt-image-input-action='cancel'
              data-bs-toggle='tooltip'
              title='Cancel imgCover'
            >
              <i className='bi bi-x fs-2'></i>
            </span>
              {/* end::Cancel */}

              {/* begin::Remove */}
              <span
              className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
              data-kt-image-input-action='remove'
              data-bs-toggle='tooltip'
              title='Remove imgCover'
            >
              <i className='bi bi-x fs-2'></i>
            </span>
              {/* end::Remove */}
            </div>
            {/* end::Image input */}

            {/* begin::Hint */}
            <div className='form-text'>Allowed file types: png, jpg, jpeg.</div>
            {/* end::Hint */}
          </div>
          {/* end:: Thumbnail Input group */}

        {/* end:: order group */}
        
        
            {/* begin:: Status group */}
            <div className        = "shadow-sm rounded-end rounded p-6 mb-8">
          <h3 className         = 'fw-bold  p-4 mb-4'>Status</h3>

          {/* begin:: Available Input group */}
          <div className='fv-row mb-7 form-check form-switch form-check-custom form-check-solid'>
            {/* begin::Label */}
            {/* end::Label */}

            {/* begin::Input */}
            <input 
              {...formik.getFieldProps('available')}
              className={clsx(
                ' form-check-input mb-3 mb-lg-0 ms-2 border border-2',
                {'is-invalid': formik.touched.available && formik.errors.available},
                {
                  'is-valid': formik.touched.available && !formik.errors.available,
                }
              )}
              name='available'
              autoComplete='off'
              type="checkbox"
              defaultChecked={false}
            //   disabled={formik.isSubmitting || isProductLoading}
                // {/* <option value="true">Yes</option>
                // <option value="false">No</option> */}
            />
            {/* end::Input */}
            {formik.touched.available && formik.errors.available && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.available}</span>
              </div>
            )}
            <label className=' fw-semibold fs-6 mb-2 ms-4 pt-2'>Available</label>

          </div>
          {/* end:: Available Input group */}

          {/* begin:: Show deleted Input group */}
          <div className='fv-row mb-7 form-check form-switch form-check-custom form-check-solid'>
            {/* begin::Label */}
            {/* end::Label */}

            {/* begin::Input */}
            <input 
              {...formik.getFieldProps('deleted')}
              className={clsx(
                ' form-check-input mb-3 mb-lg-0 ms-2 border border-2',
                {'is-invalid': formik.touched.deleted && formik.errors.deleted},
                {
                  'is-valid': formik.touched.deleted && !formik.errors.deleted,
                }
              )}
              name='deleted'
              autoComplete='off'
              type="checkbox"
              defaultChecked={false}
            //   disabled={formik.isSubmitting || isProductLoading}
                // {/* <option value="true">Yes</option>
                // <option value="false">No</option> */}
            />
            {/* end::Input */}
            {formik.touched.deleted && formik.errors.deleted && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.deleted}</span>
              </div>
            )}
            <label className=' fw-semibold fs-6 mb-2 ms-4 pt-2'>Archived</label>

          </div>
          {/* end:: Show deleted Input group */}
        </div>
        {/* end:: Status group */}


        {/* begin:: order Input group */}
        <div className="shadow-sm rounded-end rounded p-6 mb-8">
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className=' fw-bolder fs-4   ms-3 mb-2'>Order</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='order'
              {...formik.getFieldProps('order')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0 ms-2 border border-2',
                {'is-invalid': formik.touched.order && formik.errors.order},
                {
                  'is-valid': formik.touched.order && !formik.errors.order,
                }
              )}
              type='text'
              name='order'
              autoComplete='off'
              disabled={formik.isSubmitting || isProductLoading}
            />
            {/* end::Input */}
            {formik.touched.order && formik.errors.order && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.order}</span>
              </div>
            )}
          </div>
        </div>
        {/* end:: order Input group */}


        {/* begin:: Category Input group */}
        <div className="shadow-sm rounded-end rounded p-6 mb-8">
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className=' fw-bolder fs-4   ms-3 mb-2'>Category</label>
            {/* end::Label */}

            {/* begin::Input */}
            <Select
            // className='react-select-styled'
            // classNamePrefix='react-select'
            isMulti
            options={memoizedCategories}
              placeholder='Category'
              {...formik.getFieldProps('category')}
              className={clsx(
                'form-control form-control-solid react-select react-select-styled mb-3 mb-lg-0 ms-2 border border-2',
              )}
              name='category'
              onChange={(selected) => {
                const updatedCategories = selected ? selected.map((option) => option.value  ) : [];
              //  console.log('updatedBranches',updatedBranches)
               setEditCategory(updatedCategories) 
               // table.setEditingCell(row.id, 'branch', updatedBranches);
              }}
            />
            {/* end::Input */}
            {formik.touched.category && formik.errors.category && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.category}</span>
              </div>
            )}
          </div>
        </div>
        {/* end:: Category Input group */}

 {/* begin:: SubCategory Input group */}
 <div className="shadow-sm rounded-end rounded p-6 mb-8">
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className=' fw-bolder fs-4   ms-3 mb-2'>SubCategory</label>
            {/* end::Label */}

            {/* begin::Input */}
            <Select
            // className='react-select-styled'
            // classNamePrefix='react-select'
            isMulti
            options={memoizedSubCategories}
              placeholder='SubCategory'
              {...formik.getFieldProps('subCategory')}
              className={clsx(
                'form-control form-control-solid react-select react-select-styled mb-3 mb-lg-0 ms-2 border border-2',
              )}
              name='subCategory'
              onChange={(selected) => {
                const updatedSubCategories = selected ? selected.map((option) => option.value  ) : [];
              //  console.log('updatedBranches',updatedBranches)
               setEditSubCategory(updatedSubCategories) 
               // table.setEditingCell(row.id, 'branch', updatedBranches);
              }}
            />
            {/* end::Input */}
            {formik.touched.subCategory && formik.errors.subCategory && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.subCategory}</span>
              </div>
            )}
          </div>
        </div>
        {/* end:: SubCategory Input group */}


         {/* begin:: ChildSubCategory Input group */}
 <div className="shadow-sm rounded-end rounded p-6 mb-8">
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className=' fw-bolder fs-4   ms-3 mb-2'>ChildSubCategory</label>
            {/* end::Label */}

            {/* begin::Input */}
            <Select
            // className='react-select-styled'
            // classNamePrefix='react-select'
            isMulti
            options={memoizedChildSubCategories}
              placeholder='ChildSubCategory'
              {...formik.getFieldProps('childSubCategory')}
              className={clsx(
                'form-control form-control-solid react-select react-select-styled mb-3 mb-lg-0 ms-2 border border-2',
              )}
              name='childSubCategory'
              onChange={(selected) => {
                const updatedChildSubCategories = selected ? selected.map((option) => option.value  ) : [];
              //  console.log('updatedBranches',updatedBranches)
               setEditChildSubCategory(updatedChildSubCategories) 
               // table.setEditingCell(row.id, 'branch', updatedBranches);
              }}
            />
            {/* end::Input */}
            {formik.touched.childSubCategory && formik.errors.childSubCategory && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.childSubCategory}</span>
              </div>
            )}
          </div>
        </div>
        {/* end:: ChildSubCategory Input group */}

          </div>
        <div className="col-md-9">

        {/* <ul className         = "nav nav-underline mb-3">
                <li className     = "nav-item ">
                    <a className  = "nav-link active" aria-current="page" href="#">General</a>
                </li>
                <li className     = "nav-item">
                    <a className  = "nav-link text-muted" href="#">Advanced</a>
                </li>
            </ul> */}

            <p className="d-inline-flex gap-1">
            <button className="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target=".multi-collapse" aria-expanded="false" aria-controls="multiCollapseGeneral multiCollapseAdvanced">General</button>
            <button className="btn btn-secondary" type="button" data-bs-toggle="collapse" data-bs-target=".multi-collapse" aria-expanded="false" aria-controls="multiCollapseGeneral multiCollapseAdvanced">Advanced</button>
            </p>

            <div className="collapse show multi-collapse" id="multiCollapseGeneral">


            {/* begin:: General group */}
          <div className        = " shadow-sm rounded-end rounded p-6 mb-8">
            <h3 className         = 'fw-bold p-4 mb-4'>General</h3>
            


          {/* begin:: Name Input group */}
          
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className='required fw-semibold fs-7 ps-4 mb-2'>Product Name</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Product Name'
              {...formik.getFieldProps('name')}
              type='text'
              name='name'
              className={clsx(
                'form-control form-control-solid mb-3 ms-2 mb-lg-0 border border-2',
                {'is-invalid': formik.touched.name && formik.errors.name},
                {
                  'is-valid': formik.touched.name && !formik.errors.name,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isProductLoading}
            />
            {formik.touched.name && formik.errors.name && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.name}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
            <div className="form-text px-4">A product name is required and recommended to be unique.</div>
          </div>
          {/* end:: Name Input group */}

            {/* begin:: Description Input group */}
            <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className=' fw-semibold fs-6 mb-2 ms-4'>Description</label>
            {/* end::Label */}

            {/* begin::Input */}
            <textarea 
              placeholder='description'
              {...formik.getFieldProps('description')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0 ms-2  border border-2',
                {'is-invalid': formik.touched.description && formik.errors.description},
                {
                  'is-valid': formik.touched.description && !formik.errors.description,
                }
              )}
            //   type='text'
              name='description'
              autoComplete='off'
              disabled={formik.isSubmitting || isProductLoading}
            />
            {/* end::Input */}
            {formik.touched.description && formik.errors.description && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.description}</span>
              </div>
            )}
            <div className="form-text px-4">Set a description to the product for better visibility.</div>

            
          </div>
          {/* end:: Description Input group */}

          {/* begin:: shortDesc Input group */}
          
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className=' fw-semibold fs-7 ps-4 mb-2'>Short Description</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Short Description'
              {...formik.getFieldProps('shortDesc')}
              type='text'
              name='shortDesc'
              className={clsx(
                'form-control form-control-solid mb-3 ms-2 mb-lg-0 border border-2',
                {'is-invalid': formik.touched.shortDesc && formik.errors.shortDesc},
                {
                  'is-valid': formik.touched.shortDesc && !formik.errors.shortDesc,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isProductLoading}
            />
            {formik.touched.shortDesc && formik.errors.shortDesc && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.shortDesc}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
            {/* <div className="form-text px-4">A product name is required and recommended to be unique.</div> */}
          </div>
          {/* end:: shortDesc Input group */}

          </div>
           {/* begin:: General group */}

            {/* begin:: Pricing group */}
          <div className        = "shadow-sm rounded-end rounded p-6 mb-8">
          <h3 className         = 'fw-bold  p-4 mb-4'>Pricing</h3>

          {/* begin:: price Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className=' fw-semibold fs-7   ms-3 mb-2'>Base Price</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Product price'
              {...formik.getFieldProps('price')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0 ms-2 border border-2',
                {'is-invalid': formik.touched.price && formik.errors.price},
                {
                  'is-valid': formik.touched.price && !formik.errors.price,
                }
              )}
              type='text'
              name='price'
              autoComplete='off'
              disabled={formik.isSubmitting || isProductLoading}
            />
            {/* end::Input */}
            {formik.touched.price && formik.errors.price && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.price}</span>
              </div>
            )}
            <div className="form-text px-4">Set the product price.</div>

          </div>
          {/* end:: price Input group */}




          
        </div>

        {/* begin:: Weight & Dimensions group */}
            {/* begin:: Pricing group */}
          <div className        = "shadow-sm rounded-end rounded p-6 mb-8">
          <h3 className         = 'fw-bold  p-4 mb-4'>Weight & Dimensions</h3>






          {/* begin:: Show weight Input group */}
          <div className='fv-row mb-7 form-check form-switch form-check-custom form-check-solid'>
            {/* begin::Label */}
            {/* end::Label */}

            {/* begin::Input */}
            <input 
              {...formik.getFieldProps('showWeight')}
              className={clsx(
                ' form-check-input mb-3 mb-lg-0 ms-2 border border-2',
                {'is-invalid': formik.touched.showWeight && formik.errors.showWeight},
                {
                  'is-valid': formik.touched.showWeight && !formik.errors.showWeight,
                }
              )}
              name='showWeight'
              autoComplete='off'
              type="checkbox"
              defaultChecked={false}
            //   disabled={formik.isSubmitting || isProductLoading}
                // {/* <option value="true">Yes</option>
                // <option value="false">No</option> */}
            />
            {/* end::Input */}
            {formik.touched.showWeight && formik.errors.showWeight && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.showWeight}</span>
              </div>
            )}
            <label className=' fw-semibold fs-6 mb-2 ms-4 pt-2'>Show Weight</label>

          </div>
          {/* end:: Show weight Input group */}

            {/* begin:: weight Input group */}
            <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className=' fw-semibold fs-7   ms-3 mb-2'>Weight</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Weight'
              {...formik.getFieldProps('weight')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0 ms-2 border border-2',
                {'is-invalid': formik.touched.weight && formik.errors.weight},
                {
                  'is-valid': formik.touched.weight && !formik.errors.weight,
                }
              )}
              type='text'
              name='weight'
              autoComplete='off'
              disabled={formik.isSubmitting || isProductLoading}
            />
            {/* end::Input */}
            {formik.touched.weight && formik.errors.weight && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.weight}</span>
              </div>
            )}
            {/* <div className="form-text px-4">Set the product price.</div> */}

          </div>
          {/* end:: weight Input group */}

            {/* begin:: dimensions Input group */}
            <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className=' fw-semibold fs-7   ms-3 mb-2'>Dimensions</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Dimensions'
              {...formik.getFieldProps('weight')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0 ms-2 border border-2',
                {'is-invalid': formik.touched.dimensions && formik.errors.dimensions},
                {
                  'is-valid': formik.touched.dimensions && !formik.errors.dimensions,
                }
              )}
              type='text'
              name='dimensions'
              autoComplete='off'
              disabled={formik.isSubmitting || isProductLoading}
            />
            {/* end::Input */}
            {formik.touched.dimensions && formik.errors.dimensions && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.dimensions}</span>
              </div>
            )}
            {/* <div className="form-text px-4">Set the product price.</div> */}

          </div>
          {/* end:: dimensions Input group */}


        </div>
        {/* end:: Weight & Dimensions group */}

        {/* begin:: Branch Input group */}
        <div className="shadow-sm rounded-end rounded p-6 mb-8">
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className=' fw-bolder fs-4   ms-3 mb-2'>Branch</label>
            {/* end::Label */}

            {/* begin::Input */}
            <Select
            // className='react-select-styled'
            // classNamePrefix='react-select'
            isMulti
            options={memoizedBranches}
              placeholder='Branch'
              {...formik.getFieldProps('branch')}
              className={clsx(
                'form-control form-control-solid react-select react-select-styled mb-3 mb-lg-0 ms-2 border border-2',
              )}
              name='branch'
              onChange={(selected) => {
                const updatedBranches = selected ? selected.map((option) => option.value  ) : [];
              //  console.log('updatedBranches',updatedBranches)
               setEditBranch(updatedBranches) 
               // table.setEditingCell(row.id, 'branch', updatedBranches);
              }}
            />
            {/* end::Input */}
            {formik.touched.branch && formik.errors.branch && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.branch}</span>
              </div>
            )}
          </div>
        </div>
        {/* end:: Branch Input group */}
            </div>

          {/* begin:: Advanced group */}
            <div className="collapse multi-collapse" id="multiCollapseAdvanced">

          {/* begin:: Inventory group */}
          <div className        = " shadow-sm rounded-end rounded p-6 mb-8">
            <h3 className         = 'fw-bold p-4 mb-4'>Inventory</h3>
            


          {/* begin:: quantity Input group */}
          
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className=' fw-semibold fs-7 ps-4 mb-2'>Quantity</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Quantity'
              {...formik.getFieldProps('quantity')}
              type='text'
              name='quantity'
              className={clsx(
                'form-control form-control-solid mb-3 ms-2 mb-lg-0 border border-2',
                {'is-invalid': formik.touched.quantity && formik.errors.quantity},
                {
                  'is-valid': formik.touched.quantity && !formik.errors.quantity,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isProductLoading}
            />
            {formik.touched.quantity && formik.errors.quantity && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.quantity}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
            {/* <div className="form-text px-4">A product name is required and recommended to be unique.</div> */}
          </div>
          {/* end:: quantity Input group */}



          {/* begin:: minQty Input group */}
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className=' fw-semibold fs-7 ps-4 mb-2'>Minimum Qty for order</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Minimum Qty for order'
              {...formik.getFieldProps('minQty')}
              type='text'
              name='minQty'
              className={clsx(
                'form-control form-control-solid mb-3 ms-2 mb-lg-0 border border-2',
                {'is-invalid': formik.touched.minQty && formik.errors.minQty},
                {
                  'is-valid': formik.touched.minQty && !formik.errors.minQty,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isProductLoading}
            />
            {formik.touched.minQty && formik.errors.minQty && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.minQty}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
            {/* <div className="form-text px-4">A product name is required and recommended to be unique.</div> */}
          </div>
          {/* end:: minQty Input group */}

          {/* begin:: stock switch group */}
          <div className='fv-row mb-7 form-check form-switch form-check-custom form-check-solid'>
            {/* begin::Label */}
            <label className=' fw-semibold fs-7 ps-4 mb-2'>Out Of Stock</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Stock'
              {...formik.getFieldProps('stock')}
              type='checkbox'
              name='stock'
              defaultChecked
              className={clsx(
                'form-check-input mb-3 ms-2 mb-lg-0 border border-2',
                {'is-invalid': formik.touched.stock && formik.errors.stock},
                {
                  'is-valid': formik.touched.stock && !formik.errors.stock,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isProductLoading}
            />
            {formik.touched.stock && formik.errors.stock && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.stock}</span>
                </div>
              </div>
            )}
            <label className=' fw-semibold fs-7 ps-4 mb-2'>In-Stock</label>

            {/* end::Input */}
            {/* <div className="form-text px-4">A product name is required and recommended to be unique.</div> */}
          </div>
          {/* end:: stock switch group */}

            {/* begin:: stock Input group */}
            <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className=' fw-semibold fs-7 ps-4 mb-2'>Stock</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Stock'
              {...formik.getFieldProps('stock')}
              type='text'
              name='stock'
              className={clsx(
                'form-control form-control-solid mb-3 ms-2 mb-lg-0 border border-2',
                {'is-invalid': formik.touched.stock && formik.errors.stock},
                {
                  'is-valid': formik.touched.stock && !formik.errors.stock,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isProductLoading}
            />
            {formik.touched.stock && formik.errors.stock && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.stock}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
            {/* <div className="form-text px-4">A product name is required and recommended to be unique.</div> */}
          </div>
          {/* end:: stock Input group */}

            {/* begin:: sold Input group */}
            <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className=' fw-semibold fs-7 ps-4 mb-2'>Sold</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Sold'
              {...formik.getFieldProps('sold')}
              type='text'
              name='sold'
              className={clsx(
                'form-control form-control-solid mb-3 ms-2 mb-lg-0 border border-2',
                {'is-invalid': formik.touched.sold && formik.errors.sold},
                {
                  'is-valid': formik.touched.sold && !formik.errors.sold,
                }
              )}
              autoComplete='off'
              readOnly
              disabled={formik.isSubmitting || isProductLoading}
            />
            {formik.touched.sold && formik.errors.sold && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.sold}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
            {/* <div className="form-text px-4">A product name is required and recommended to be unique.</div> */}
          </div>
          {/* end:: sold Input group */}

          </div>
           {/* end:: Inventory group */}
            
        {/* begin:: booking group */}
          <div className        = " shadow-sm rounded-end rounded p-6 mb-8">
            <h3 className         = 'fw-bold p-4 mb-4'>Booking</h3>
            


          {/* begin:: book Input group */}
          
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className=' fw-semibold fs-7 ps-4 mb-2'>Book</label>
            {/* end::Label */}

            {/* begin::Input */}
            <select
            //   placeholder='Book'
              {...formik.getFieldProps('book')}
            //   type='selct'
              name='book'
              className={clsx(
                'form-control form-control-solid mb-3 ms-2 mb-lg-0 border border-2',
                {'is-invalid': formik.touched.book && formik.errors.book},
                {
                  'is-valid': formik.touched.book && !formik.errors.book,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting || isProductLoading}
            > 
              <option selected value="regular">Regular</option>
            <option value="book">Book</option>
            <option value="onlyBook">Only Book</option>
            </select>
            {formik.touched.book && formik.errors.book && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.book}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
            {/* <div className="form-text px-4">A product name is required and recommended to be unique.</div> */}
          </div>
          {/* end:: book Input group */}

          </div>
        {/* end:: Booking group */}


                {/* begin:: Extras Input group */}
                <div className="shadow-sm rounded-end rounded p-6 mb-8">
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className=' fw-bolder fs-4   ms-3 mb-2'>Extras</label>
            {/* end::Label */}

            {/* begin::Input */}
            <Select
            // className='react-select-styled'
            // classNamePrefix='react-select'
            isMulti
            options={memoizedExtras}
              placeholder='Extras'
              {...formik.getFieldProps('extras')}
              className={clsx(
                'form-control form-control-solid react-select react-select-styled mb-3 mb-lg-0 ms-2 border border-2',
              )}
              name='extras'
              onChange={(selected) => {
                const updatedExtras = selected ? selected.map((option) => option.value  ) : [];
              //  console.log('updatedBranches',updatedBranches)
               setEditExtra(updatedExtras) 
               // table.setEditingCell(row.id, 'branch', updatedBranches);
              }}
            />
            {/* end::Input */}
            {formik.touched.extras && formik.errors.extras && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.extras}</span>
              </div>
            )}
          </div>
        </div>
        {/* end:: Extras Input group */}

        {/* begin:: Types Input group */}
        <div className="shadow-sm rounded-end rounded p-6 mb-8">
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className=' fw-bolder fs-4   ms-3 mb-2'>Types</label>
            {/* end::Label */}

            {/* begin::Input */}
            <Select
            // className='react-select-styled'
            // classNamePrefix='react-select'
            isMulti
            options={memoizedTypes}
              placeholder='Types'
              {...formik.getFieldProps('types')}
              className={clsx(
                'form-control form-control-solid react-select react-select-styled mb-3 mb-lg-0 ms-2 border border-2',
              )}
              name='types'
              onChange={(selected) => {
                const updatedTypes = selected ? selected.map((option) => option.value  ) : [];
              //  console.log('updatedBranches',updatedBranches)
               setEditType(updatedTypes) 
               // table.setEditingCell(row.id, 'branch', updatedBranches);
              }}
            />
            {/* end::Input */}
            {formik.touched.types && formik.errors.types && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.types}</span>
              </div>
            )}
          </div>
        </div>
        {/* end:: Types Input group */}

                {/* begin:: Meta Input group */}
                <div className="shadow-sm rounded-end rounded p-6 mb-8">
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className=' fw-bolder fs-4   ms-3 mb-2'>MetaTags</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='MetaTags'
              {...formik.getFieldProps('metaTags')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0 ms-2 border border-2',
                {'is-invalid': formik.touched.metaTags && formik.errors.metaTags},
                {
                  'is-valid': formik.touched.metaTags && !formik.errors.metaTags,
                }
              )}
              type='text'
              name='metaTags'
              autoComplete='off'
              disabled={formik.isSubmitting || isProductLoading}
            />
            {/* end::Input */}
            {formik.touched.metaTags && formik.errors.metaTags && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.metaTags}</span>
              </div>
            )}
            <div className="form-text px-4">Set a list of keywords that the product is related to. Separate the keywords by adding a comma , between each keyword.</div>

          </div>
        </div>
        {/* end:: meta Input group */}

            </div>
           {/* end:: Advanced group */}

        {/* end::Scroll */}
        </div>
        </div>
        {/* begin::Actions */}
        <div className='text-center pt-15'>
          <button
            type='reset'
            // onClick={}
            className='btn btn-light me-3'
            data-kt-users-modal-action='cancel'
            disabled={formik.isSubmitting || isProductLoading}
          >
            Discard
          </button>

          <button
            type='submit'
            className='btn btn-primary'
            data-kt-users-modal-action='submit'
            disabled={isProductLoading || formik.isSubmitting || !formik.isValid || !formik.touched}
          >
            <span className='indicator-label'>Submit</span>
            {(formik.isSubmitting || isProductLoading) && (
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
      {(formik.isSubmitting || isProductLoading) && <UsersListLoading />}

    
    </>
  )
}
export default ProductForm;