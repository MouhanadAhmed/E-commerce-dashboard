import blankImage from '../../../../../../../../_metronic/assets/images/blank-image.svg'
import {FC, useEffect, useMemo, useRef, useState} from 'react';
import * as Yup from 'yup'
import {useFormik} from 'formik'
import clsx from 'clsx'
import {UsersListLoading} from '../components/loading/UsersListLoading'
import { Product,initialProduct  } from '../core/_models'
import { createProduct, getProductById, updateProduct } from '../core/_requests'
import ReactQuill, { Quill } from 'react-quill';
import { isNotEmpty } from '../../../../../../../../_metronic/helpers'
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
import BranchesForm from './branchesForm';
import DescTableForm from './DescTableForm'
import 'react-quill/dist/quill.snow.css';
import { useParams } from 'react-router-dom';
import { uploadToCloudinary } from '../../../../../../../../_metronic/helpers/cloudinaryUpload';
import Swal from 'sweetalert2';

type Props = {
    // isProductLoading: boolean
    product?: Product
  }
  

   const CustomToolbar = () => (
    <div id="toolbar">
      <select className="ql-header" defaultValue="" onChange={e => e.persist()}>
        <option value="1"></option>
        <option value="2"></option>
        <option value="3"></option>
        <option value="4"></option>
        <option value="5"></option>
        <option value="6"></option>
        <option value=""></option>
      </select>
      <select className="ql-font" defaultValue="" onChange={e => e.persist()}>
        <option value="serif"></option>
        <option value="monospace"></option>
        <option value=""></option>
      </select>
      <select className="ql-list" defaultValue="" onChange={e => e.persist()}>
        <option value="ordered"></option>
        <option value="bullet"></option>
      </select>
      <button className="ql-bold"></button>
      <button className="ql-italic"></button>
      <button className="ql-underline"></button>
      <select className="ql-color">
        <option value="#e60000" selected></option>
        <option value="#000000"></option>
        <option value="#e60000"></option>
        <option value="#ff9900"></option>
        <option value="#ffff00"></option>
        <option value="#008a00"></option>
        <option value="#0066cc"></option>
        <option value="#9933ff"></option>
        <option value="#ffffff"></option>
      </select>
      <select className="ql-background" onChange={e => e.persist()}>
        <option value="#000000"></option>
        <option value="#e60000"></option>
        <option value="#ff9900"></option>
        <option value="#ffff00"></option>
        <option value="#008a00"></option>
        <option value="#0066cc"></option>
        <option value="#9933ff"></option>
        <option value="#ffffff"></option>
      </select>
      <button className="ql-link"></button>
      <button className="ql-image"></button>
      <button className="ql-clean"></button>
    </div>
  );

  const customColors = [
    '#e60000', '#000000', '#ff9900', '#ffff00', '#008a00',
    '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc',
    '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb',
    '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0',
    '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200',
    '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000',
    '#663d00', '#666600', '#003700', '#002966', '#3d1466'
  ];
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }], // Add all header options
    //   [{ 'font': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['bold', 'italic', 'underline'],
      [{ 'color': customColors }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };
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
    description: Yup.string().optional(),
    shortDesc: Yup.string().optional(),
    metaTags: Yup.array().of(Yup.string()).transform((value, originalValue) => (typeof originalValue === 'string' ? [originalValue] : originalValue)).optional(),
    category: Yup.array().of(category).transform((value, originalValue) => (Array.isArray(originalValue) ? originalValue : [originalValue])).optional(),
    subCategory: Yup.array().of(subCategory).transform((value, originalValue) => (Array.isArray(originalValue) ? originalValue : [originalValue])).optional(),
    childSubCategory: Yup.array().of(childSubCategory).transform((value, originalValue) => (Array.isArray(originalValue) ? originalValue : [originalValue])).optional(),
    types: Yup.array().of(types).transform((value, originalValue) => (Array.isArray(originalValue) ? originalValue : [originalValue])).optional(),
    // stock: Yup.string().optional(),
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
    _id:Yup.string().optional(),
    images: Yup.array().of(Yup.string()).max(10).optional()
    // ratingAverage: Yup.number().min(1).optional(),
    // ratingCount: Yup.number().min(0).optional(),
  });


const ProductForm: FC<Props>= ({product}) => {
    const{id}= useParams();
    const descTableRef=useRef();
    const [content, setContent] = useState('');
    const quillRef = useRef(null);
    const {active : activeBranches,archived : archivedBranches} = branchesData();
    const {active : activeCategories,archived : archivedCategories} = categoriesData();
    const {active : activeSubCategories,archived : archivedSubCategories} = subcategoriesData();
    const {active : activeChildSubCategories,archived : archivedChildSubCategories} = childSubCategoryData();
    const {active : activeExtras,archived : archivedExtras} = extrasData();
    const {active : activeTypes,archived : archivedTypes} = typesData();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [branches,setBranches]=useState([...activeBranches,...archivedBranches]);
    const [categories,setCategories]=useState([...activeCategories,...archivedCategories]);
    const [subcategories,setSubCategories]=useState([...activeSubCategories,...archivedSubCategories]);
    const [childSubCategories,setChildSubCategories]=useState([...activeChildSubCategories,...archivedChildSubCategories]);
    const [extras,setExtras]=useState([...activeExtras,...archivedExtras]);
    const [types,setTypes]=useState([...activeTypes,...archivedTypes]);
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>([]);
    const galleryInputRef = useRef<HTMLInputElement>(null);

    const [updatedBranches, setUpdatedBranches]=useState();
    // const [numberOfItems,setNumberOfItmes] =useState(0);
    const [activeTab, setActiveTab] = useState('general');
    const [items, setItems] = useState([]);
    
    const [productForEdit,setProductForEdit] = useState<Product>()
    const [previewUrl, setPreviewUrl] = useState<string>('');

      const handleTabClick = (tab:string) => {
        setActiveTab(tab);
      };
    
      useEffect(()=>{
        const fetchProduct = async()=> {

            try {
                console.log("id",id)
                const data = await getProductById(id);
                setProductForEdit(data);
                data.imgCover && data.imgCover[0] && setPreviewUrl(data?.imgCover[0].url)
                formik.setValues(data)
                // console.log(formik.initialValues)
            } catch (error) {
                console.error('Error fetching product', error);
            }
        }
        if(id !== 'new') {
            fetchProduct()
            console.log('product',productForEdit)

        }else{
            setProductForEdit(initialProduct)
        }
      },[id,setProductForEdit])

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

 
      const initialBranches = memoizedBranches.map((branch,index)=>{
        return {
            key: index,
            branch: branch.value,
            price:"",
            available: false,
            stock: "",
            priceAfterDiscount: '',
            priceAfterExpiresAt: '',
            order: '',
            sold: '',
            _id:index.toLocaleString(),
            name:branch.label,
        }
      })
      initialProduct.branch=initialBranches

      const keysToRemove = ["key", "name", "_id"];

      const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        
        // Validate total images won't exceed 10
        if (galleryFiles.length + files.length > 10) {
          setError('Maximum 10 images allowed in gallery');
          return;
        }
        
        // Validate each file
        const validFiles = files.filter(file => {
          if (!file.type.match('image/jpeg|image/png|image/jpg')) {
            return false;
          }
          if (file.size > 5 * 1024 * 1024) {
            return false;
          }
          return true;
        });
        
        setGalleryFiles(prev => [...prev, ...validFiles]);
        
        // Create previews
        validFiles.forEach(file => {
          const reader = new FileReader();
          reader.onload = () => {
            setGalleryPreviews(prev => [...prev, reader.result as string]);
          };
          reader.readAsDataURL(file);
        });
      };

      const handleRemoveGalleryImage = (index: number) => {
        setGalleryFiles(prev => prev.filter((_, i) => i !== index));
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
      };
    //   setProductForEdit()
    // const [updatedBranchees,setUpdatedBranchees] = useState(...initialBranches)
    const formik = useFormik({
      enableReinitialize:true,
        initialValues: {name: productForEdit ? productForEdit.name : initialProduct.name,
          ...(productForEdit && productForEdit._id ? { _id: productForEdit._id } : {}),
          ...(productForEdit && productForEdit.slug ? { slug: productForEdit.slug } : {}),
          ...(productForEdit && productForEdit.description ? { description: productForEdit.description } : {}),
          ...(productForEdit && productForEdit.description ? { description: productForEdit.description } : {}),
          ...(productForEdit?.imgCover?.[0]?.url ? { imgCover: productForEdit.imgCover[0].url } : {}),
          ...(productForEdit && productForEdit.metaTags ? { metaTags: productForEdit.metaTags } : {}),
          ...(productForEdit && productForEdit.price ? { price: productForEdit.price } : {}),
          ...(productForEdit && productForEdit.showWeight ? { showWeight: productForEdit.showWeight } : {}),
          ...(productForEdit && productForEdit.weight ? { weight: productForEdit.weight } : {}),
          ...(productForEdit && productForEdit.dimensions ? { dimensions: productForEdit.dimensions } : {}),
          ...(productForEdit && productForEdit.quantity ? { quantity: productForEdit.quantity } : {}),
          ...(productForEdit && productForEdit.minQty ? { minQty: productForEdit.minQty } : {}),
          ...(productForEdit && productForEdit.stock ? { stock: productForEdit.stock } : {}),
          ...(productForEdit && productForEdit.sold ? { sold: productForEdit.sold } : {}),
          ...(productForEdit && productForEdit.book ? { book: productForEdit.book } : {}),
          ...(productForEdit && productForEdit.extras ? { extras: productForEdit?.extras?.map((option)=>({ value: option.extra._id, label: option.extra.name }) ) } : []),
          ...(productForEdit && productForEdit.types ? { types: [...productForEdit?.types?.map((option)=>({ value: option._id, label: option.name }) )] } : []),
          ...(productForEdit && productForEdit.metaTags ? { metaTags: productForEdit.metaTags } : []),
          ...(productForEdit && productForEdit.descTableName ? { descTableName: productForEdit.descTableName } : {}),
          ...(productForEdit && productForEdit.available ? { available: productForEdit.available } : {}),
          ...(productForEdit && productForEdit.deleted ? { deleted: productForEdit.deleted } : {}),
          ...(productForEdit && productForEdit.order ? { order: productForEdit.order } : {}),
          ...(productForEdit && productForEdit.category ? { category: productForEdit?.category?.map((option)=>({ value: option.category._id, label: option.category.name }) ) } : []),
          ...(productForEdit && productForEdit.subCategory ? { subCategory: productForEdit?.subCategory?.map((option)=>({ value: option.subCategory._id, label: option.subCategory.name }) ) } : []),
          ...(productForEdit && productForEdit.childSubCategory ? { childSubCategory: productForEdit?.childSubCategory?.map((option)=>({ value: option.childSubCategory._id, label: option.childSubCategory.name }) ) } : []),
        },
        validationSchema: editProductSchema,
        onSubmit: async (values, {setSubmitting}) => {
          // console.log('values',values)
            // e.stopPropagation();
            // e.preventDefault();
          setIsUploading(true);
          setSubmitting(true)
          setError(null);
          try {
            if(updatedBranches !== undefined) {
              const newArray = updatedBranches
                .filter(obj => obj.available !== false) // Filter out unavailable branches
                .map(obj => {
                  const newObj = { ...obj };
                  keysToRemove.forEach(key => delete newObj[key]);
                  return newObj;
                });
                console.log(updatedBranches.filter(obj => obj.available !== false))
                console.log(updatedBranches)
                values.branch = newArray;
              } else {
                const newArray = initialBranches
                .filter(obj => obj.available !== false) // Filter out unavailable branches
                .map(obj => {
                  const newObj = { ...obj };
                  keysToRemove.forEach(key => delete newObj[key]);
                  return newObj;
                });
                console.log(initialBranches.filter(obj => obj.available !== false))
              values.branch = newArray;
            }
            if (imageFile) {
              values.imgCover = {url:await uploadToCloudinary(imageFile)}
            }
            // Upload gallery images
            if (galleryFiles.length > 0) {
              const galleryUrls = await Promise.all(
                galleryFiles.map(file => uploadToCloudinary(file))
              );
              values.images = [...existingGalleryUrls, ...galleryUrls];
            } else if (existingGalleryUrls.length > 0) {
              values.images = existingGalleryUrls;
            }
            items.length != 0 ? values.descTable=items:"";
            values.types=values?.types?.map((type)=>type.value);
            values.extras=values?.extras?.map((extra)=>({extra:extra.value}));
            values.category = values?.category?.map((item) => ({ category: item.value }));
            values.subCategory = values?.subCategory?.map((subCategory) => ({ subCategory: subCategory.value }));
            values.childSubCategory = values?.childSubCategory?.map((childSubCategory) => ({ childSubCategory: childSubCategory.value }));

        if (isNotEmpty(values._id)) {
              await updateProduct(values?._id, values);
              // Show success alert for update
              Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Product updated successfully',
                timer: 2000,
                showConfirmButton: false
              });
            } else {
              await createProduct(values);
              // Show success alert for creation
              Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Product created successfully',
                timer: 2000,
                showConfirmButton: false
              });
            }
          } catch (ex) {
            console.error(ex);
            // Show error alert
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: ex.response.data.error,
              timer: 3000,
              showConfirmButton: false
            });
          } finally {
            setSubmitting(false);
            setIsUploading(false);
          }
        },
      })

      const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image/jpeg|image/png|image/jpg')) {
      setError('Please select a valid image file (PNG, JPG, JPEG)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setImageFile(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl('');
    formik.setFieldValue('imgCover', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

      if(id !== 'new' && productForEdit == undefined){

        return <div>Loading...</div>;
        
      }

  return (
    <>
          <form id='kt_modal_add_product_form' className='form ' onSubmit={ formik.handleSubmit} noValidate>
        {/* begin::Scroll */}
        <div className                = "container p-8">
            <div className=" d-flex justify-content-between align-items-center">
        <h3 className                 = ' fw-bolder p-4'>Add Product</h3>
              {/* begin::Actions */}
              <div className='text-center '>
          <button
            type='reset'
            // onClick={}
            className='btn btn-light me-3'
            data-kt-users-modal-action='cancel'
            disabled={formik.isSubmitting }
          >
            Discard
          </button>

          <button
            type='submit'
            className='btn btn-primary'
            data-kt-users-modal-action='submit'
          >
            <span className='indicator-label'>Submit</span>
            {(formik.isSubmitting ) && (
              <span className='indicator-progress'>
                Please wait...{' '}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
        {/* end::Actions */}

            </div>
        <div className                = "row">
          <div className="col-md-3">

          {/* begin:: Thumbnail Input group */}
      <div className='fv-row mb-7 border rounded-start shadow-sm border-2 p-8'>
        <label className='d-block fw-bold fs-6 ms-2 mb-5'>Thumbnail</label>

        <div
          className='image-input image-input-outline'
          data-kt-image-input='true'
          style={{ backgroundImage: `url('${blankImage}')` }}
        >
          <div
            className='image-input-wrapper ms-2'
            style={{ 
              backgroundImage: `url('${previewUrl || productForEdit?.imgCover || blankImage}')` 
            }}
          ></div>

          <label
            className='btn btn-icon btn-circle btn-active-color-primary w-25 h-25 bg-body shadow'
            data-kt-image-input-action='change'
            data-bs-toggle='tooltip'
            title='Change imgCover'
          >
            <i className='bi bi-pencil-fill fs-7'></i>
            <input 
              type='file' 
              name='imgCover' 
              accept='.png, .jpg, .jpeg' 
              onChange={handleImageChange}
              ref={fileInputRef}
            />
            <input type='hidden' name='avatar_remove' />
          </label>

          <span
            className='btn btn-icon btn-circle btn-active-color-primary w-25 h-25 bg-body shadow'
            data-kt-image-input-action='cancel'
            data-bs-toggle='tooltip'
            title='Cancel imgCover'
            onClick={() => {
              setImageFile(null);
              setPreviewUrl(productForEdit?.imgCover || '');
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
          >
            <i className='bi bi-x fs-2'></i>
          </span>

          <span
            className='btn btn-icon btn-circle btn-active-color-primary w-25 h-25 bg-body shadow'
            data-kt-image-input-action='remove'
            data-bs-toggle='tooltip'
            title='Remove imgCover'
            onClick={handleRemoveImage}
          >
            <i className='bi bi-x fs-2'></i>
          </span>
        </div>

        <div className='form-text'>Allowed file types: png, jpg, jpeg.</div>
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
            // value={formik.initialValues?.available}
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
              defaultChecked={productForEdit?.available}
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
              defaultChecked={productForEdit !== undefined?productForEdit.deleted:false}
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
              disabled={formik.isSubmitting }
              // defaultValue={productForEdit !== undefined? productForEdit.order:""}
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
            <label className='fw-bolder fs-4 ms-3 mb-2'>Category</label>
            
            <Select
              isMulti
              options={memoizedCategories}
              placeholder='Category'
              className={clsx(
                'form-control form-control-solid react-select react-select-styled mb-3 mb-lg-0 ms-2 border border-2',
                {'is-invalid': formik.touched.category && formik.errors.category},
                {'is-valid': formik.touched.category && !formik.errors.category},
              )}
              name='category'
              value={formik.values.category} // Connect to Formik value
              onChange={(selected) => {
                // Update Formik state directly
                formik.setFieldValue(
                  'category', 
                  selected ? selected : []
                );
              }}
              onBlur={formik.handleBlur} // Handle blur for validation
              defaultValue={productForEdit !== undefined ? 
                productForEdit?.category?.map((option) => ({ 
                  value: option.category._id, 
                  label: option.category.name 
                })) : 
                []
              }
            />
            
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
              // {...formik.getFieldProps('subCategory')}
              className={clsx(
                'form-control form-control-solid react-select react-select-styled mb-3 mb-lg-0 ms-2 border border-2',
              )}
              name='subCategory'
              onChange={(selected) => {
                // Update Formik state directly
                formik.setFieldValue(
                  'subCategory', 
                  selected ? selected : []
                );
              }}
              defaultValue={productForEdit !== undefined?productForEdit?.subCategory?.map((option)=>({ value: option.subCategory._id, label: option.subCategory.name }) ): '' }

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
              // {...formik.getFieldProps('childSubCategory')}
              className={clsx(
                'form-control form-control-solid react-select react-select-styled mb-3 mb-lg-0 ms-2 border border-2',
              )}
              name='childSubCategory'
              onChange={(selected) => {
                // Update Formik state directly
                formik.setFieldValue(
                  'childSubCategory', 
                  selected ? selected : []
                );
              }}
              defaultValue={productForEdit !== undefined?productForEdit?.childSubCategory?.map((option)=>({ value: option.childSubCategory._id, label: option.childSubCategory.name }) ): '' }

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

            {/* <p className="d-inline-flex gap-1">
            <button className="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target=".multi-collapse" aria-expanded="false" aria-controls="multiCollapseGeneral multiCollapseAdvanced">General</button>
            <button className="btn btn-secondary" type="button" data-bs-toggle="collapse" data-bs-target=".multi-collapse" aria-expanded="false" aria-controls="multiCollapseGeneral multiCollapseAdvanced">Advanced</button>
            <button className="btn btn-secondary" type="button" data-bs-toggle="collapse" data-bs-target=".multi-collapse" aria-expanded="false" aria-controls="multiCollapseGeneral multiCollapseAdvanced">Branches</button>
            <button className="btn btn-secondary" type="button" data-bs-toggle="collapse" data-bs-target=".multi-collapse" aria-expanded="false" aria-controls="multiCollapseGeneral multiCollapseAdvanced">Description Table</button>
            </p> */}
         {/* begin:: Tabs group */}
        <ul className="nav nav-tabs" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
          type="button"
            className={`nav-link ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => handleTabClick('general')}
          >
            General
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
          type="button"
            className={`nav-link ${activeTab === 'advanced' ? 'active' : ''}`}
            onClick={() => handleTabClick('advanced')}
          >
            Advanced
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            type="button"
            className={`nav-link ${activeTab === 'media' ? 'active' : ''}`}
            onClick={() => handleTabClick('media')}
          >
            Media
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
          type="button"
            className={`nav-link ${activeTab === 'branches' ? 'active' : ''}`}
            onClick={() => handleTabClick('branches')}
          >
            Branches
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
          type="button"
            className={`nav-link ${activeTab === 'descTable' ? 'active' : ''}`}
            onClick={() => handleTabClick('descTable')}
          >
            Description Table
          </button>
        </li>
      </ul>
         {/* end:: Tabs group */}
            
             {/* begin:: General group */}
            <div className={`collapse ${activeTab === 'general' ? 'active show' : ''}`} id="general">


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
            // value={formik.values?.name}
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
              disabled={formik.isSubmitting }
              // defaultValue={productForEdit !== undefined?productForEdit.name: initialProduct.name }
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
            <label className='fw-semibold fs-6 mb-2 ms-4'>Description</label>
            {/* end::Label */}

            {/* begin::ReactQuill with Formik */}
            <ReactQuill 
              theme="snow" 
              modules={modules}
              placeholder='Description'
              value={formik.values.description || ''}
              onChange={(value) => {
                formik.setFieldValue('description', value);
                formik.setFieldTouched('description', true, false);
              }}
              onBlur={() => formik.setFieldTouched('description', true, true)}
              className={clsx(
                'mb-3 ms-2 mb-lg-0 border border-2 rounded',
                {
                  'border-danger': formik.touched.description && formik.errors.description,
                  'border-success': formik.touched.description && !formik.errors.description,
                }
              )}
            />
            {/* end::ReactQuill */}

            <div className="form-text px-4">Set a description to the product for better visibility.</div>

            {formik.touched.description && formik.errors.description && (
              <div className='fv-plugins-message-container'>
                <span role='alert' className='text-danger'>{formik.errors.description}</span>
              </div>
            )}
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
              disabled={formik.isSubmitting }
            // defaultValue={productForEdit !== undefined?productForEdit.shortDesc: initialProduct.shortDesc }

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
              disabled={formik.isSubmitting }
            // defaultValue={productForEdit !== undefined?productForEdit.price: initialProduct.price }

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
              defaultChecked={productForEdit?.showWeight}
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
              disabled={formik.isSubmitting }
              // defaultValue={productForEdit !== undefined?productForEdit.weight: initialProduct.weight }

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
              {...formik.getFieldProps('dimensions')}
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
              disabled={formik.isSubmitting }
              // defaultValue={productForEdit !== undefined?productForEdit.dimensions: initialProduct.dimensions }

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


            </div>
            {/* end:: General group */}

          {/* begin:: Advanced group */}
            <div className={`collapse ${activeTab === 'advanced' ? 'active show' : ''}`} id="advanced">

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
              disabled={formik.isSubmitting }
              // defaultValue={productForEdit !== undefined?productForEdit.quantity: initialProduct.quantity }

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
              disabled={formik.isSubmitting }
              // defaultValue={productForEdit !== undefined?productForEdit.minQty: initialProduct.minQty }

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
              checked={formik.values.stock === '0'}
              onChange={(e) => {
                if (e.target.checked) {
                  formik.setFieldValue('stock', '0');
                } else {
                  formik.setFieldValue('stock', '');
                }
              }}
              type='checkbox'
              name='outOfStock'
              className={clsx(
                'form-check-input mb-3 ms-2 mb-lg-0 border border-2'
              )}
              autoComplete='off'
              disabled={formik.isSubmitting}
            />
            {/* end::Input */}
          </div>
          {/* end:: stock switch group */}

          {/* begin:: stock Input group - Only show if not out of stock */}
          {formik.values.stock !== '0' && (
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
                disabled={formik.isSubmitting}
              />
              {formik.touched.stock && formik.errors.stock && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik.errors.stock}</span>
                  </div>
                </div>
              )}
              {/* end::Input */}
            </div>
          )}
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
              disabled={formik.isSubmitting }
              // defaultValue={productForEdit !== undefined?productForEdit.sold: initialProduct.sold }

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
              disabled={formik.isSubmitting }
              // defaultValue={productForEdit !== undefined?productForEdit.book: initialProduct.book }

            > 
              <option defaultChecked value="regular">Regular</option>
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
              // {...formik.getFieldProps('extras')}
              className={clsx(
                'form-control form-control-solid react-select react-select-styled mb-3 mb-lg-0 ms-2 border border-2',
              )}
              name='extras'
              onChange={(selected) => {
                // Update Formik state directly
                formik.setFieldValue(
                  'extras', 
                  selected ? selected : []
                );
              }}
              defaultValue={productForEdit !== undefined?productForEdit?.extras?.map((option)=>({ value: option.extra._id, label: option.extra.name }) ): '' }

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
              // {...formik.getFieldProps('types')}
              className={clsx(
                'form-control form-control-solid react-select react-select-styled mb-3 mb-lg-0 ms-2 border border-2',
              )}
              name='types'
              onChange={(selected) => {
                // Update Formik state directly
                formik.setFieldValue(
                  'types', 
                  selected ? selected : []
                );
              }}
              defaultValue={productForEdit !== undefined?productForEdit?.types?.map((option)=>({ value: option._id, label: option.name }) ): '' }

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
              disabled={formik.isSubmitting }
              // defaultValue={productForEdit !== undefined?productForEdit.metaTags:initialProduct.metTags}
   
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
           
          {/* begin:: Media group */}
          <div className={`collapse ${activeTab === 'media' ? 'active show' : ''}`} id="media">
            <div className="shadow-sm rounded-end rounded p-6 mb-8">
              <h3 className='fw-bold p-4 mb-4'>Media Gallery</h3>
              
              {/* Gallery upload section */}
              <div className='fv-row mb-7'>
                <label className='fw-semibold fs-6 mb-3'>Product Gallery Images (Max 10)</label>
                
                {/* Current images display */}
                <div className='d-flex flex-wrap gap-3 mb-4 p-3 bg-light rounded'>
                  {galleryPreviews.map((preview, index) => (
                    <div key={index} className='position-relative'>
                      <img 
                        src={preview} 
                        alt={`Gallery ${index + 1}`} 
                        className='rounded shadow-sm' 
                        style={{width: '100px', height: '100px', objectFit: 'cover'}} 
                      />
                      <button 
                        type='button'
                        className='btn btn-sm btn-danger position-absolute top-0 end-0 rounded-circle'
                        style={{width: '24px', height: '24px', padding: 0}}
                        onClick={() => handleRemoveGalleryImage(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  
                  {galleryPreviews.length === 0 && (
                    <div className='text-muted text-center w-100'>
                      No gallery images added yet
                    </div>
                  )}
                </div>

                {/* Upload controls */}
                <div className='d-flex gap-3 align-items-center'>
                  <button
                    type='button'
                    className='btn btn-light-primary'
                    onClick={() => galleryInputRef.current?.click()}
                    disabled={galleryFiles.length >= 10}
                  >
                    <i className='bi bi-cloud-upload me-2'></i>
                    Add Gallery Images
                  </button>
                  
                  <span className='text-muted small'>
                    {galleryFiles.length} / 10 images selected
                  </span>
                </div>
                
                <input 
                  type='file' 
                  ref={galleryInputRef}
                  multiple
                  accept='.png, .jpg, .jpeg'
                  onChange={handleGalleryChange}
                  style={{display: 'none'}}
                />
                
                <div className='form-text mt-2'>
                  Upload additional product images. Supported formats: PNG, JPG, JPEG. Max file size: 5MB per image.
                </div>
              </div>
            </div>
          </div>
          {/* end:: Media group */}

             {/* begin:: branches group */}
             <div className={`collapse ${activeTab === 'branches' ? 'active show' : ''}`} id="branches">
             
                {/* begin:: Branch Input group */}
                    <div className="shadow-sm rounded-end rounded p-6 mb-8">
                    <div className='fv-row mb-7'>
                        {/* begin::Label */}
                        <label className=' fw-bolder fs-4   ms-3 mb-2'>Branches</label>
                        {/* end::Label */}


                        <BranchesForm setUpdatedBranches={setUpdatedBranches} formik={formik} branchees={updatedBranches == undefined ?(productForEdit !== undefined?productForEdit.branch:initialBranches):updatedBranches}/>
                    </div>
                    </div>
                {/* end:: Branch Input group */}
             </div>
             {/* end:: branches group */}

             {/* begin:: descTable group */}
             <div className={`collapse ${activeTab === 'descTable' ? 'active show' : ''}`} id="descTable">
             
                {/* begin:: Branch Input group */}
                    <div className="shadow-sm rounded-end rounded p-6 mb-8">
                    <div className='fv-row mb-7'>
                        {/* begin::Label */}
                        <label className=' fw-bolder fs-4   ms-3 mb-2'>Description Table</label>
                        {/* end::Label */}

                                  {/* begin:: Name Input group */}
          
          <div className='fv-row mb-7'>
            {/* begin::Label */}
            <label className=' fw-semibold fs-7 ps-4 mb-2'>Description Table Name</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder='Description Table Name'
              // {...formik.getFieldProps('descTableName')}
              type='text'
              name='descTableName'
              className={clsx(
                'form-control form-control-solid mb-3 ms-2 mb-lg-0 border border-2',
                {'is-invalid': formik.touched.descTableName && formik.errors.descTableName},
                {
                  'is-valid': formik.touched.descTableName && !formik.errors.descTableName,
                }
              )}
              autoComplete='off'
              disabled={formik.isSubmitting }
              defaultValue={productForEdit !== undefined?productForEdit.descTableName: '' }

            />
            {formik.touched.descTableName && formik.errors.descTableName && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{formik.errors.descTableName}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
            {/* <div className="form-text px-4">A product name is required and recommended to be unique.</div> */}
          </div>


          <DescTableForm items={productForEdit !== undefined?productForEdit.descTable: []}  setItems={setItems}   />
          {/* end:: Name Input group */}
                        {/* <BranchesForm setUpdatedBranches={setUpdatedBranches} branchees={updatedBranches == undefined ?initialBranches:updatedBranches}/> */}
                    </div>
                    </div>
                {/* end:: Branch Input group */}
             </div>
             {/* end:: descTable group */}

        {/* end::Scroll */}
        </div>
        </div>
  
        </div>
      </form>
      {(formik.isSubmitting ) && <UsersListLoading />}

    
    </>
  )
}
export default ProductForm;