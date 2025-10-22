import blankImage from "../../../../../../../../_metronic/assets/images/blank-image.svg";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import {
  BranchOfProduct,
  Product,
  ProductFormValues,
  initialProduct,
} from "../core/_models";
import {
  createProduct,
  getProductById,
  updateProduct,
} from "../core/_requests";
import ReactQuill from "react-quill";
import { isNotEmpty } from "../../../../../../../../_metronic/helpers";
import { useActiveBranchesData as branchesData } from "../../../Branch/branches-list/core/QueryResponseProvider";
import { useActiveCategoriesData } from "../../../Category/categories-list/core/QueryResponseProvider";
import { useActiveSubCategoriesData as subcategoriesData } from "../../../SubCategory/Subcategories-list/core/QueryResponseProvider";
import { useActiveChildSubCategoriesData as childSubCategoryData } from "../../../ChildSubCategory/ChildSubcategories-list/core/QueryResponseProvider";
import { useActiveTypesData as typesData } from "../../../Type/types-list/core/QueryResponseProvider";
import { useActiveExtrasData as extrasData } from "../../../Extra/extra-list/core/QueryResponseProvider";
import { useActiveGroupsData as groupsData } from "../../../GroupOfOptions/groupOfOptions-list/core/QueryResponseProvider";
import Select from "react-select";
import BranchesForm from "./branchesForm";
import DescTableForm from "./DescTableForm";
import "react-quill/dist/quill.snow.css";
import { useParams, useLocation } from "react-router-dom";
import { uploadToCloudinary } from "../../../../../../../../_metronic/helpers/cloudinaryUpload";
import Swal from "sweetalert2";

// react-router-dom imports above are used (useParams, useLocation)

type Props = {
  product?: Product;
};

const customColors = [
  "#e60000",
  "#000000",
  "#ff9900",
  "#ffff00",
  "#008a00",
  "#0066cc",
  "#9933ff",
  "#ffffff",
  "#facccc",
  "#ffebcc",
  "#ffffcc",
  "#cce8cc",
  "#cce0f5",
  "#ebd6ff",
  "#bbbbbb",
  "#f06666",
  "#ffc266",
  "#ffff66",
  "#66b966",
  "#66a3e0",
  "#c285ff",
  "#888888",
  "#a10000",
  "#b26b00",
  "#b2b200",
  "#006100",
  "#0047b2",
  "#6b24b2",
  "#444444",
  "#5c0000",
  "#663d00",
  "#666600",
  "#003700",
  "#002966",
  "#3d1466",
];
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }], // Add all header options
    //   [{ 'font': [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: customColors }, { background: [] }],
    ["link", "image"],
    ["clean"],
  ],
};
// Define the nested schemas first
const category = Yup.object().shape({
  category: Yup.string()
    .matches(/^[0-9a-fA-F]{24}$/, "Must be a valid hex string of length 24")
    .optional(),
  order: Yup.number().min(1).optional(),
});

const subCategory = Yup.object().shape({
  subCategory: Yup.string()
    .matches(/^[0-9a-fA-F]{24}$/, "Must be a valid hex string of length 24")
    .optional(),
  order: Yup.number().min(1).optional(),
});

const childSubCategory = Yup.object().shape({
  childSubCategory: Yup.string()
    .matches(/^[0-9a-fA-F]{24}$/, "Must be a valid hex string of length 24")
    .optional(),
  order: Yup.number().min(1).optional(),
});

const groupOfOptions = Yup.object().shape({
  groupOfOptions: Yup.string()
    .matches(/^[0-9a-fA-F]{24}$/, "Must be a valid hex string of length 24")
    .optional(),
  order: Yup.number().min(1).optional(),
});

const branch = Yup.object().shape({
  branch: Yup.string()
    .matches(/^[0-9a-fA-F]{24}$/, "Must be a valid hex string of length 24")
    .optional(),
  price: Yup.number().optional(),
  available: Yup.boolean().optional(),
  stock: Yup.string().optional(),
  priceAfterDiscount: Yup.number().min(0).optional(),
  priceAfterExpiresAt: Yup.date().optional(),
  order: Yup.number().min(1).optional(),
  sold: Yup.number().min(1).optional(),
});

const extras = Yup.object().shape({
  extra: Yup.string()
    .matches(/^[0-9a-fA-F]{24}$/, "Must be a valid hex string of length 24")
    .optional(),
  order: Yup.number().min(1).optional(),
});

const types = Yup.object().shape({
  type: Yup.string()
    .matches(/^[0-9a-fA-F]{24}$/, "Must be a valid hex string of length 24")
    .optional(),
  order: Yup.number().min(1).optional(),
});

const descTable = Yup.object().shape({
  name: Yup.string().optional(),
  value: Yup.mixed().optional(),
  order: Yup.number().min(1).optional(),
});

// main schema
const editProductSchema = Yup.object().shape({
  name: Yup.string().min(2).max(100).required("Name is required"),
  description: Yup.string().optional(),
  shortDesc: Yup.string().optional(),
  metaTags: Yup.array()
    .of(Yup.string())
    .transform((value, originalValue) =>
      typeof originalValue === "string" ? [originalValue] : originalValue
    )
    .optional(),
  category: Yup.array()
    .of(category)
    .transform((value, originalValue) =>
      Array.isArray(originalValue) ? originalValue : [originalValue]
    )
    .optional(),
  subCategory: Yup.array()
    .of(subCategory)
    .transform((value, originalValue) =>
      Array.isArray(originalValue) ? originalValue : [originalValue]
    )
    .optional(),
  childSubCategory: Yup.array()
    .of(childSubCategory)
    .transform((value, originalValue) =>
      Array.isArray(originalValue) ? originalValue : [originalValue]
    )
    .optional(),
  types: Yup.array()
    .of(types)
    .transform((value, originalValue) =>
      Array.isArray(originalValue) ? originalValue : [originalValue]
    )
    .optional(),
  // stock: Yup.string().optional(),
  available: Yup.boolean().optional(),
  price: Yup.number().min(0).optional(),
  branch: Yup.array()
    .of(branch)
    .transform((value, originalValue) =>
      Array.isArray(originalValue) ? originalValue : [originalValue]
    )
    .optional(),
  priceAfterDiscount: Yup.number().min(0).optional(),
  priceAfterExpiresAt: Yup.date().optional(),
  extras: Yup.array()
    .of(extras)
    .transform((value, originalValue) =>
      Array.isArray(originalValue) ? originalValue : [originalValue]
    )
    .optional(),
  descTableName: Yup.string().optional(),
  descTable: Yup.array()
    .of(descTable)
    .transform((value, originalValue) =>
      Array.isArray(originalValue) ? originalValue : [originalValue]
    )
    .optional(),
  weight: Yup.string().optional(),
  showWeight: Yup.boolean().optional(),
  fractionalQuantity: Yup.boolean().optional(),
  book: Yup.string().optional(),
  // bookAt is a short duration string like '1h23m' or '1d13h'
  bookAt: Yup.string()
    .matches(/^[0-9dDhHmMsS]+([0-9dDhHmMsS]+)*$/i, "Invalid format for BookAt")
    .optional(),
  groupOfOptions: Yup.array()
    .of(groupOfOptions)
    .transform((value, originalValue) =>
      Array.isArray(originalValue) ? originalValue : [originalValue]
    )
    .optional(),
  minQty: Yup.number()
    .transform((value, originalValue) => {
      // treat empty string or null/undefined as undefined so field becomes optional
      if (
        originalValue === "" ||
        originalValue === null ||
        originalValue === undefined
      ) {
        return undefined;
      }
      return Number(originalValue);
    })
    .min(0)
    .nullable()
    .optional(),
  dimensions: Yup.string().optional(),
  rewardPoint: Yup.string().optional(),
  sold: Yup.number()
    .transform((value, originalValue) => {
      if (
        originalValue === "" ||
        originalValue === null ||
        originalValue === undefined
      ) {
        return undefined;
      }
      return Number(originalValue);
    })
    .min(0)
    .nullable()
    .optional(),
  deleted: Yup.boolean().optional(),
  order: Yup.number().min(0).optional(),
  quantity: Yup.number().min(0).optional(),
  _id: Yup.string().optional(),
  images: Yup.array().of(Yup.string()).max(10).optional(),
});

const ProductForm: FC<Props> = ({ product }) => {
  const { id } = useParams();
  const branches = branchesData();

  // Get both active and archived categories
  const activeCategories = useActiveCategoriesData();

  // Use active categories if available, otherwise combine active + archived
  const categories = activeCategories;

  const subcategories = subcategoriesData();
  const childSubCategories = childSubCategoryData();
  const extras = extrasData();
  const types = typesData();
  const groups = groupsData();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [existingGalleryUrls, setExistingGalleryUrls] = useState<string[]>([]);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [updatedBranches, setUpdatedBranches] = useState<BranchOfProduct[]>();
  const [activeTab, setActiveTab] = useState("general");
  const [items, setItems] = useState([]);

  const [productForEdit, setProductForEdit] = useState<Product>();
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const location = useLocation();
  const productFromState = location.state as { product: Product } | undefined;

  // Extract and enrich branch data by merging separate arrays from backend
  // extractedBranches removed: it was unused and created lint noise

  const extractedCategories =
    productFromState?.product?.category?.map((c: any) => {
      // If c.category is a string (ID), find the full category object
      const categoryId =
        typeof c.category === "string" ? c.category : c.category?._id;
      const fullCategory = categories.find((cat) => cat._id === categoryId);

      return {
        value: categoryId,
        label: fullCategory?.name || "Unknown",
      };
    }) || [];

  const extractedSubCategories =
    productFromState?.product?.subCategory?.map((s: any) => {
      const subCategoryId =
        typeof s.subCategory === "string" ? s.subCategory : s.subCategory?._id;
      const fullSubCategory = subcategories.find(
        (sub) => sub._id === subCategoryId
      );

      return {
        value: subCategoryId,
        label: fullSubCategory?.name || "Unknown",
      };
    }) || [];

  const extractedChildSubCategories =
    productFromState?.product?.childSubCategory?.map((cs: any) => {
      const childSubCategoryId =
        typeof cs.childSubCategory === "string"
          ? cs.childSubCategory
          : cs.childSubCategory?._id;
      const fullChildSubCategory = childSubCategories.find(
        (child) => child._id === childSubCategoryId
      );

      return {
        value: childSubCategoryId,
        label: fullChildSubCategory?.name || "Unknown",
      };
    }) || [];
  const extractedTypes =
    productFromState?.product?.types?.map((t: any) => ({
      value: t._id,
      label: t.name,
    })) || [];

  const extractedExtras =
    (productFromState?.product?.extras || [])
      .map((e: any) => {
        if (!e) return null;
        const id =
          typeof e.extra === "string" ? e.extra : e.extra?._id ?? e._id ?? e.id;
        const name = typeof e.extra === "object" ? e.extra?.name : e.name;
        if (!id) return null;
        return { value: id, label: name || "Unknown" };
      })
      .filter(Boolean) || [];

  const extractedGroupOfOptions =
    (productFromState?.product?.groupOfOptions || [])
      .map((g: any) => {
        if (!g) return null;
        const id =
          typeof g.optionGroup === "string"
            ? g.optionGroup
            : g.optionGroup?._id ?? g._id ?? g.id;
        const name =
          typeof g.optionGroup === "object"
            ? g.optionGroup?.name
            : g.name || undefined;
        if (!id) return null;
        return { value: id, label: name || "Unknown" };
      })
      .filter(Boolean) || [];

  // images/imgCover local constants removed (unused)

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  // Define initialBranches BEFORE useEffect
  const initialBranches = useMemo(() => {
    return branches.map((branch, index) => ({
      key: index,
      branch: branch._id,
      price: "",
      available: false,
      stock: "",
      priceAfterDiscount: "",
      priceAfterExpiresAt: "",
      order: "",
      sold: "",
      _id: index.toLocaleString(),
      name: branch.name,
    }));
  }, [branches]);

  // Set initialProduct.branch
  initialProduct.branch = initialBranches;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        if (data) {
          // Transform branch data to match the expected format
          const transformedData = {
            ...data,
            branch:
              data.branch?.map((b: any, index: number) => ({
                key: index,
                branch: typeof b.branch === "string" ? b.branch : b.branch._id,
                name: typeof b.branch === "string" ? "" : b.branch.name,
                price: b.price || "",
                available: b.available || false,
                stock: b.stock || "",
                priceAfterDiscount: b.priceAfterDiscount || "",
                priceAfterExpiresAt: b.priceAfterExpiresAt || "",
                order: b.order || "",
                sold: b.sold || "",
                _id: b._id || index.toString(),
              })) || initialBranches,
          };

          setProductForEdit(transformedData);
          if (data.imgCover?.[0]?.url) setPreviewUrl(data.imgCover[0].url);
          if (data.images && data.images.length > 0) {
            const imageUrls = data.images.map((img: any) =>
              typeof img === "string" ? img : img.url
            );
            setExistingGalleryUrls(imageUrls);
          }
          // form values will be set by the product->form mapper effect below
          return; // done, fetched product used
        }
      } catch (error) {
        console.error("Error fetching product", error);
      }

      // Fallback: if fetch failed or returned no data, use navigation state if available
      if (productFromState?.product) {
        const product = productFromState.product;

        const transformedProduct = {
          ...product,
          branch:
            product.branch?.map((b: any, index: number) => ({
              key: index,
              branch:
                typeof b.branch === "string"
                  ? b.branch
                  : b.branch._id ?? b.branch._id,
              name: typeof b.branch === "string" ? "" : b.branch.name,
              price: b.price || "",
              available: b.available || false,
              stock: b.stock || "",
              priceAfterDiscount: b.priceAfterDiscount || "",
              priceAfterExpiresAt: b.priceAfterExpiresAt || "",
              order: b.order || "",
              sold: b.sold || "",
              _id: b._id || index.toString(),
            })) || initialBranches,
        };

        setProductForEdit(transformedProduct);
        if (product.imgCover?.[0]?.url) setPreviewUrl(product.imgCover[0].url);
        if (product.images && product.images.length > 0) {
          const imageUrls = product.images.map((img: any) =>
            typeof img === "string" ? img : img.url
          );
          setExistingGalleryUrls(imageUrls);
        }
        // form values will be set by the product->form mapper effect below
        return;
      }

      // If new product, set defaults
      if (id === "new") {
        setProductForEdit(initialProduct);
      }
    };

    // Kick off fetch for existing products; for 'new' we set defaults or navigation state below
    if (id !== "new") {
      fetchProduct();
    } else {
      // new product: prefer fetched product (none), otherwise navigation state, otherwise defaults
      if (productFromState?.product) {
        const product = productFromState.product;
        const transformedProduct = {
          ...product,
          branch:
            product.branch?.map((b: any, index: number) => ({
              key: index,
              branch: typeof b.branch === "string" ? b.branch : b.branch._id,
              name: typeof b.branch === "string" ? "" : b.branch.name,
              price: b.price || "",
              available: b.available || false,
              stock: b.stock || "",
              priceAfterDiscount: b.priceAfterDiscount || "",
              priceAfterExpiresAt: b.priceAfterExpiresAt || "",
              order: b.order || "",
              sold: b.sold || "",
              _id: b._id || index.toString(),
            })) || initialBranches,
        };

        setProductForEdit(transformedProduct);
        if (product.imgCover?.[0]?.url) setPreviewUrl(product.imgCover[0].url);
        if (product.images && product.images.length > 0) {
          const imageUrls = product.images.map((img: any) =>
            typeof img === "string" ? img : img.url
          );
          setExistingGalleryUrls(imageUrls);
        }
        // form values will be set by the product->form mapper effect below
      } else {
        setProductForEdit(initialProduct);
      }
    }
  }, [id, setProductForEdit, productFromState, initialBranches]);

  // Map the server product shape into Formik values (especially react-select option objects)
  // This effect is moved below so it runs after memoized option arrays are available.

  const memoizedCategories = useMemo(
    () =>
      categories.map((category) => ({
        value: category._id,
        label: category.name,
      })),
    [categories]
  );
  const memoizedSubCategories = useMemo(
    () =>
      subcategories.map((subCategory) => ({
        value: subCategory._id,
        label: subCategory.name,
      })),
    [subcategories]
  );
  const memoizedChildSubCategories = useMemo(
    () =>
      childSubCategories.map((childSubCategory) => ({
        value: childSubCategory._id,
        label: childSubCategory.name,
      })),
    [childSubCategories]
  );

  const memoizedGroupsOfOptions = useMemo(
    () =>
      groups.map((group) => ({
        value: group._id,
        label: group.name,
      })),
    [groups]
  );
  const memoizedExtras = useMemo(
    () => extras.map((extra) => ({ value: extra._id, label: extra.name })),
    [extras]
  );
  const memoizedTypes = useMemo(
    () => types.map((type) => ({ value: type._id, label: type.name })),
    [types]
  );

  // Map the server product shape into Formik values (especially react-select option objects)
  useEffect(() => {
    if (!productForEdit) return;

    const mapCategory = () => {
      if (!Array.isArray(productForEdit.category)) return [];
      return productForEdit.category
        .map((option: any) => {
          const categoryId =
            typeof option.category === "string"
              ? option.category
              : option.category?._id;
          const found = memoizedCategories.find(
            (cat) => cat.value === categoryId
          );
          if (found) return found;
          const name =
            typeof option.category === "object"
              ? option.category?.name
              : undefined;
          return { value: categoryId, label: name || categoryId };
        })
        .filter(Boolean);
    };

    const mapSubCategory = () => {
      if (!Array.isArray(productForEdit.subCategory)) return [];
      return productForEdit.subCategory
        .map((option: any) => {
          const id =
            typeof option.subCategory === "string"
              ? option.subCategory
              : option.subCategory?._id;
          const found = memoizedSubCategories.find((sub) => sub.value === id);
          if (found) return found;
          const name =
            typeof option.subCategory === "object"
              ? option.subCategory?.name
              : undefined;
          return { value: id, label: name || id };
        })
        .filter(Boolean);
    };

    const mapChildSubCategory = () => {
      if (!Array.isArray(productForEdit.childSubCategory)) return [];
      return productForEdit.childSubCategory
        .map((option: any) => {
          const id =
            typeof option.childSubCategory === "string"
              ? option.childSubCategory
              : option.childSubCategory?._id;
          const found = memoizedChildSubCategories.find(
            (child) => child.value === id
          );
          if (found) return found;
          const name =
            typeof option.childSubCategory === "object"
              ? option.childSubCategory?.name
              : undefined;
          return { value: id, label: name || id };
        })
        .filter(Boolean);
    };

    const mapTypes = () => {
      if (!Array.isArray(productForEdit.types)) return [];
      return productForEdit.types
        .map((t: any) => {
          const id = t._id ?? t.id ?? (typeof t === "string" ? t : undefined);
          return memoizedTypes.find((type) => type.value === id) || null;
        })
        .filter(Boolean);
    };

    const mapExtras = () => {
      if (!Array.isArray(productForEdit.extras)) return [];
      return productForEdit.extras
        .map((e: any) => {
          const id =
            typeof e.extra === "string"
              ? e.extra
              : e.extra?._id ?? e._id ?? e.id;
          return memoizedExtras.find((ext) => ext.value === id) || null;
        })
        .filter(Boolean);
    };

    const mapGroups = () => {
      if (!Array.isArray(productForEdit.groupOfOptions)) return [];
      return productForEdit.groupOfOptions
        .map((g: any) => {
          const id =
            typeof g.optionGroup === "string"
              ? g.optionGroup
              : g.optionGroup?._id ?? g._id ?? g.id;
          return (
            memoizedGroupsOfOptions.find((grp) => grp.value === id) || null
          );
        })
        .filter(Boolean);
    };

    const mapped = {
      ...(formik.initialValues as any),
      ...productForEdit,
      category: mapCategory(),
      subCategory: mapSubCategory(),
      childSubCategory: mapChildSubCategory(),
      types: mapTypes(),
      extras: mapExtras(),
      groupOfOptions: mapGroups(),
      imgCover: (productForEdit.imgCover as any)?.[0]?.url || "",
    };

    formik.setValues(mapped as any);
  }, [
    productForEdit,
    memoizedCategories,
    memoizedSubCategories,
    memoizedChildSubCategories,
    memoizedTypes,
    memoizedExtras,
    memoizedGroupsOfOptions,
  ]);

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate total images won't exceed 10
    if (existingGalleryUrls.length + galleryFiles.length + files.length > 10) {
      setError("Maximum 10 images allowed in gallery");
      return;
    }

    // Validate each file
    const validFiles = files.filter((file) => {
      if (!file.type.match("image/jpeg|image/png|image/jpg")) {
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        return false;
      }
      return true;
    });

    setGalleryFiles((prev) => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setGalleryPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingGalleryImage = (index: number) => {
    setExistingGalleryUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: productForEdit ? productForEdit.name : initialProduct.name,
      _id: productForEdit?._id || "",
      slug: productForEdit?.slug || "",
      shortDesc: productForEdit?.shortDesc || "",
      description: productForEdit?.description || "",
      // Fix: Add type assertion for imgCover
      imgCover:
        (productForEdit?.imgCover as Array<{ url: string }>)?.[0]?.url || "",
      metaTags: productForEdit?.metaTags || [],
      price: productForEdit?.price || initialProduct.price,
      showWeight: productForEdit?.showWeight || initialProduct.showWeight,
      weight: productForEdit?.weight || initialProduct.weight,
      dimensions: productForEdit?.dimensions || initialProduct.dimensions,
  bookAt: productForEdit?.bookAt || initialProduct.bookAt,
      quantity: productForEdit?.quantity || initialProduct.quantity,
      stock: productForEdit?.stock || initialProduct.stock,
      minQty: productForEdit?.minQty ?? initialProduct.minQty,
      sold: productForEdit?.sold ?? initialProduct.sold,
      book: productForEdit?.book || initialProduct.book,
      descTableName:
        productForEdit?.descTableName || initialProduct.descTableName,
      available: productForEdit?.available ?? initialProduct.available,
      fractionalQuantity:
        productForEdit?.fractionalQuantity || initialProduct.fractionalQuantity,
      deleted: productForEdit?.deleted ?? initialProduct.deleted,
      order: productForEdit?.order || initialProduct.order,

      // React-Select arrays - match with memoized options by reference
      extras: Array.isArray(productForEdit?.extras)
        ? productForEdit.extras
            .map((option: any) =>
              memoizedExtras.find((ext) => ext.value === option.extra._id)
            )
            .filter(Boolean)
        : extractedExtras.length > 0
        ? extractedExtras
            .map((extracted) =>
              memoizedExtras.find((ext) => ext.value === extracted.value)
            )
            .filter(Boolean)
        : [],
      groupOfOptions: Array.isArray(productForEdit?.groupOfOptions)
        ? productForEdit.groupOfOptions
            .map((option: any) => {
              if (!option) return null;
              const id =
                typeof option.optionGroup === "string"
                  ? option.optionGroup
                  : option.optionGroup?._id ?? option._id ?? option.id;
              if (!id) return null;
              return memoizedGroupsOfOptions.find((grp) => grp.value === id);
            })
            .filter(Boolean)
        : extractedGroupOfOptions.length > 0
        ? extractedGroupOfOptions
            .map((extracted) =>
              memoizedGroupsOfOptions.find(
                (grp) => grp.value === extracted.value
              )
            )
            .filter(Boolean)
        : [],

      types: Array.isArray(productForEdit?.types)
        ? productForEdit.types
            .map((option: any) =>
              memoizedTypes.find((type) => type.value === option._id)
            )
            .filter(Boolean)
        : extractedTypes.length > 0
        ? extractedTypes
            .map((extracted) =>
              memoizedTypes.find((type) => type.value === extracted.value)
            )
            .filter(Boolean)
        : [],

      category: (() => {
        if (Array.isArray(productForEdit?.category)) {
          return productForEdit.category
            .map((option: any) => {
              const categoryId =
                typeof option.category === "string"
                  ? option.category
                  : option.category?._id;
              return memoizedCategories.find((cat) => cat.value === categoryId);
            })
            .filter(Boolean);
        }
        if (extractedCategories.length > 0) {
          return extractedCategories
            .map((extracted) =>
              memoizedCategories.find((cat) => cat.value === extracted.value)
            )
            .filter(Boolean);
        }
        return [];
      })(),

      subCategory: (() => {
        if (Array.isArray(productForEdit?.subCategory)) {
          return productForEdit.subCategory
            .map((option: any) => {
              const subCategoryId =
                typeof option.subCategory === "string"
                  ? option.subCategory
                  : option.subCategory?._id;
              return memoizedSubCategories.find(
                (sub) => sub.value === subCategoryId
              );
            })
            .filter(Boolean);
        }
        if (extractedSubCategories.length > 0) {
          return extractedSubCategories
            .map((extracted) =>
              memoizedSubCategories.find((sub) => sub.value === extracted.value)
            )
            .filter(Boolean);
        }
        return [];
      })(),

      childSubCategory: (() => {
        if (Array.isArray(productForEdit?.childSubCategory)) {
          return productForEdit.childSubCategory
            .map((option: any) => {
              const childSubCategoryId =
                typeof option.childSubCategory === "string"
                  ? option.childSubCategory
                  : option.childSubCategory?._id;
              return memoizedChildSubCategories.find(
                (child) => child.value === childSubCategoryId
              );
            })
            .filter(Boolean);
        }
        if (extractedChildSubCategories.length > 0) {
          return extractedChildSubCategories
            .map((extracted) =>
              memoizedChildSubCategories.find(
                (child) => child.value === extracted.value
              )
            )
            .filter(Boolean);
        }
        return [];
      })(),
    },
    validationSchema: editProductSchema,
    onSubmit: async (values: ProductFormValues, { setSubmitting }) => {
      setIsUploading(true);
      setSubmitting(true);
      setError(null);

      try {
        // Create a new submission object instead of mutating values
        const submissionData: any = { ...values };

        // Process branches - Transform into separate arrays as backend expects
        const branchesToProcess = updatedBranches || initialBranches;

        submissionData.branchStock = [];
        submissionData.branchAvailable = [];
        submissionData.branchPrice = [];
        submissionData.branchPriceAfterDiscount = [];

        branchesToProcess.forEach((obj) => {
          // Add to branchStock array
          if (
            obj.stock !== undefined &&
            obj.stock !== null &&
            obj.stock !== ""
          ) {
            submissionData.branchStock.push({
              branch: obj.branch,
              stock: obj.stock,
            });
          }

          // Add to branchAvailable array
          if (obj.available !== undefined) {
            submissionData.branchAvailable.push({
              branch: obj.branch,
              available: obj.available,
            });
          }

          // Add to branchPrice array
          if (
            obj.price !== undefined &&
            obj.price !== null &&
            obj.price !== ""
          ) {
            submissionData.branchPrice.push({
              branch: obj.branch,
              price: obj.price,
            });
          }

          // Add to branchPriceAfterDiscount array
          if (
            obj.priceAfterDiscount !== undefined &&
            obj.priceAfterDiscount !== null &&
            obj.priceAfterDiscount !== ""
          ) {
            submissionData.branchPriceAfterDiscount.push({
              branch: obj.branch,
              priceAfterDiscount: obj.priceAfterDiscount,
            });
          }
        });

        // Remove the old branch field if it exists
        delete submissionData.branch;

        // Handle image uploads
        if (imageFile) {
          submissionData.imgCover = {
            url: await uploadToCloudinary(imageFile),
          };
        } else {
          delete submissionData.imgCover;
        }

        // Upload gallery images
        if (galleryFiles.length > 0) {
          const galleryUrls = await Promise.all(
            galleryFiles.map((file) => uploadToCloudinary(file))
          );
          submissionData.images = [...existingGalleryUrls, ...galleryUrls];
        } else if (existingGalleryUrls.length > 0) {
          submissionData.images = existingGalleryUrls;
        }

        // Process other fields
        if (items.length !== 0) {
          submissionData.descTable = items;
        }

        // Transform array fields
        submissionData.types = values.types?.map((type) => type?.value) || [];

        submissionData.extras =
          values.extras?.map((extra) => ({
            extra: extra?.value,
          })) || [];

        submissionData.groupOfOptions = values.groupOfOptions?.map(
          (groupOfOption) => ({
            optionGroup: groupOfOption?.value,
          })
        );

        submissionData.category =
          values.category?.map((item) => ({
            category: item?.value,
          })) || [];

        submissionData.subCategory =
          values.subCategory?.map((subCategory) => ({
            subCategory: subCategory?.value,
          })) || [];

        submissionData.childSubCategory =
          values.childSubCategory?.map((childSubCategory) => ({
            childSubCategory: childSubCategory?.value,
          })) || [];

        delete submissionData._id;

        // Use submissionData instead of values
        if (isNotEmpty(values._id)) {
          const result = await updateProduct(values._id, submissionData);
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Product updated successfully",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          const result = await createProduct(submissionData);
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Product created successfully",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      } catch (ex) {
        console.error("🔴🔴🔴 ERROR caught in onSubmit:", ex);
        console.error("🔴🔴🔴 Error details:", ex.response?.data);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: ex.response?.data?.error || ex.message || "An error occurred",
          timer: 3000,
          showConfirmButton: false,
        });
      } finally {
        setSubmitting(false);
        setIsUploading(false);
      }
    },
  });

  // Ensure groupOfOptions are set on the form when provider data arrives
  // (handles the case where provider fetch finishes after form initialisation)
  // Only run when memoizedGroupsOfOptions changes or productForEdit changes
  // and only if the form currently has no selected groupOfOptions.
  // This avoids showing raw ids and ensures the Select has matching option objects.
  // Ensure groupOfOptions are set on the form when provider data arrives
  useEffect(() => {
    if (!memoizedGroupsOfOptions || memoizedGroupsOfOptions.length === 0)
      return;
    const current = (formik.values as any).groupOfOptions || [];
    if (Array.isArray(current) && current.length > 0) return; // already set
    const src = productForEdit?.groupOfOptions || [];
    if (!Array.isArray(src) || src.length === 0) return;
    const mapped = src
      .map((g: any) => {
        const id =
          typeof g.optionGroup === "string"
            ? g.optionGroup
            : g.optionGroup?._id;
        return memoizedGroupsOfOptions.find((grp) => grp.value === id) || null;
      })
      .filter(Boolean);
    if (mapped.length) {
      formik.setFieldValue("groupOfOptions", mapped);
    }
  }, [memoizedGroupsOfOptions, productForEdit, formik]);

  // Debug: Log formik values when they change

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match("image/jpeg|image/png|image/jpg")) {
      setError("Please select a valid image file (PNG, JPG, JPEG)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
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
    setPreviewUrl("");
    formik.setFieldValue("imgCover", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (id !== "new" && productForEdit == undefined) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <form
        id="kt_modal_add_product_form"
        className="form "
        onSubmit={formik.handleSubmit}
        noValidate
      >
        {/* begin::Scroll */}
        <div className="container p-8">
          <div className=" d-flex justify-content-between align-items-center">
            <h3 className=" fw-bolder p-4">Add Product</h3>
            {/* begin::Actions */}
            <div className="text-center ">
              <button
                type="reset"
                // onClick={}
                className="btn btn-light me-3"
                data-kt-users-modal-action="cancel"
                disabled={formik.isSubmitting}
              >
                Discard
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                data-kt-users-modal-action="submit"
              >
                <span className="indicator-label">Submit</span>
                {formik.isSubmitting && (
                  <span className="indicator-progress">
                    Please wait...{" "}
                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                  </span>
                )}
              </button>
            </div>
            {/* end::Actions */}
          </div>
          <div className="row">
            <div className="col-md-3">
              {/* begin:: Thumbnail Input group */}
              <div className="fv-row mb-7 border rounded-start shadow-sm border-2 p-8">
                <label className="d-block fw-bold fs-6 ms-2 mb-5">
                  Thumbnail
                </label>

                <div
                  className="image-input image-input-outline"
                  data-kt-image-input="true"
                  style={{ backgroundImage: `url('${blankImage}')` }}
                >
                  <div
                    className="image-input-wrapper ms-2"
                    style={{
                      backgroundImage: `url('${
                        previewUrl || productForEdit?.imgCover || blankImage
                      }')`,
                    }}
                  ></div>

                  <label
                    className="btn btn-icon btn-circle btn-active-color-primary w-25 h-25 bg-body shadow"
                    data-kt-image-input-action="change"
                    data-bs-toggle="tooltip"
                    title="Change imgCover"
                  >
                    <i className="bi bi-pencil-fill fs-7"></i>
                    <input
                      type="file"
                      name="imgCover"
                      accept=".png, .jpg, .jpeg"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                    />
                    <input type="hidden" name="avatar_remove" />
                  </label>

                  <span
                    className="btn btn-icon btn-circle btn-active-color-primary w-25 h-25 bg-body shadow"
                    data-kt-image-input-action="cancel"
                    data-bs-toggle="tooltip"
                    title="Cancel imgCover"
                    onClick={() => {
                      setImageFile(null);
                      setPreviewUrl(
                        (
                          productForEdit?.imgCover as Array<{ url: string }>
                        )?.[0]?.url || ""
                      );
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                  >
                    <i className="bi bi-x fs-2"></i>
                  </span>

                  <span
                    className="btn btn-icon btn-circle btn-active-color-primary w-25 h-25 bg-body shadow"
                    data-kt-image-input-action="remove"
                    data-bs-toggle="tooltip"
                    title="Remove imgCover"
                    onClick={handleRemoveImage}
                  >
                    <i className="bi bi-x fs-2"></i>
                  </span>
                </div>

                <div className="form-text">
                  Allowed file types: png, jpg, jpeg.
                </div>
              </div>

              {/* end:: Thumbnail Input group */}

              {/* end:: order group */}

              {/* begin:: Status group */}
              <div className="shadow-sm rounded-end rounded p-6 mb-8">
                <h3 className="fw-bold  p-4 mb-4">Status</h3>

                {/* begin:: Available Input group */}
                <div className="fv-row mb-7 form-check form-switch form-check-custom form-check-solid">
                  {/* begin::Label */}
                  {/* end::Label */}

                  {/* begin::Input */}
                  <input
                    {...formik.getFieldProps("available")}
                    className={clsx(
                      " form-check-input mb-3 mb-lg-0 ms-2 border border-2",
                      {
                        "is-invalid":
                          formik.touched.available && formik.errors.available,
                      },
                      {
                        "is-valid":
                          formik.touched.available && !formik.errors.available,
                      }
                    )}
                    name="available"
                    autoComplete="off"
                    type="checkbox"
                    defaultChecked={productForEdit?.available}
                  />
                  {/* end::Input */}
                  {formik.touched.available && formik.errors.available && (
                    <div className="fv-plugins-message-container">
                      <span role="alert">{formik.errors.available}</span>
                    </div>
                  )}
                  <label className=" fw-semibold fs-6 mb-2 ms-4 pt-2">
                    Available
                  </label>
                </div>
                {/* end:: Available Input group */}

                {/* begin:: Show deleted Input group */}
                <div className="fv-row mb-7 form-check form-switch form-check-custom form-check-solid">
                  {/* begin::Label */}
                  {/* end::Label */}

                  {/* begin::Input */}
                  <input
                    {...formik.getFieldProps("deleted")}
                    className={clsx(
                      " form-check-input mb-3 mb-lg-0 ms-2 border border-2",
                      {
                        "is-invalid":
                          formik.touched.deleted && formik.errors.deleted,
                      },
                      {
                        "is-valid":
                          formik.touched.deleted && !formik.errors.deleted,
                      }
                    )}
                    name="deleted"
                    autoComplete="off"
                    type="checkbox"
                    defaultChecked={
                      productForEdit !== undefined
                        ? productForEdit.deleted
                        : false
                    }
                  />
                  {/* end::Input */}
                  {formik.touched.deleted && formik.errors.deleted && (
                    <div className="fv-plugins-message-container">
                      <span role="alert">{formik.errors.deleted}</span>
                    </div>
                  )}
                  <label className=" fw-semibold fs-6 mb-2 ms-4 pt-2">
                    Archived
                  </label>
                </div>
                {/* end:: Show deleted Input group */}
              </div>
              {/* end:: Status group */}

              {/* begin:: order Input group */}
              <div className="shadow-sm rounded-end rounded p-6 mb-8">
                <div className="fv-row mb-7">
                  {/* begin::Label */}
                  <label className=" fw-bolder fs-4   ms-3 mb-2">Order</label>
                  {/* end::Label */}

                  {/* begin::Input */}
                  <input
                    placeholder="order"
                    {...formik.getFieldProps("order")}
                    className={clsx(
                      "form-control form-control-solid mb-3 mb-lg-0 ms-2 border border-2",
                      {
                        "is-invalid":
                          formik.touched.order && formik.errors.order,
                      },
                      {
                        "is-valid":
                          formik.touched.order && !formik.errors.order,
                      }
                    )}
                    type="text"
                    name="order"
                    autoComplete="off"
                    disabled={formik.isSubmitting}
                  />
                  {/* end::Input */}
                  {formik.touched.order && formik.errors.order && (
                    <div className="fv-plugins-message-container">
                      <span role="alert">{formik.errors.order}</span>
                    </div>
                  )}
                </div>
              </div>
              {/* end:: order Input group */}

              {/* begin:: Category Input group */}
              <div className="shadow-sm rounded-end rounded p-6 mb-8">
                <div className="fv-row mb-7">
                  <label className="fw-bolder fs-4 ms-3 mb-2">Category</label>

                  <Select
                    isMulti
                    options={memoizedCategories}
                    placeholder="Category"
                    className={clsx(
                      "form-control form-control-solid react-select react-select-styled mb-3 mb-lg-0 ms-2 border border-2",
                      {
                        "is-invalid":
                          (formik.touched as any).category &&
                          (formik.errors as any).category,
                      },
                      {
                        "is-valid":
                          (formik.touched as any).category &&
                          !(formik.errors as any).category,
                      }
                    )}
                    name="category"
                    value={(formik.values as any).category || []}
                    onChange={(selected) => {
                      // Update Formik state directly
                      formik.setFieldValue(
                        "category",
                        selected ? selected : []
                      );
                    }}
                    onBlur={formik.handleBlur} // Handle blur for validation
                  />

                  {(formik.touched as any).category &&
                    (formik.errors as any).category && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {(formik.errors as any).category}
                        </span>
                      </div>
                    )}
                </div>
              </div>
              {/* end:: Category Input group */}

              {/* begin:: SubCategory Input group */}
              <div className="shadow-sm rounded-end rounded p-6 mb-8">
                <div className="fv-row mb-7">
                  {/* begin::Label */}
                  <label className=" fw-bolder fs-4   ms-3 mb-2">
                    SubCategory
                  </label>
                  {/* end::Label */}

                  {/* begin::Input */}
                  <Select
                    isMulti
                    options={memoizedSubCategories}
                    placeholder="SubCategory"
                    className={clsx(
                      "form-control form-control-solid react-select react-select-styled mb-3 mb-lg-0 ms-2 border border-2"
                    )}
                    name="subCategory"
                    value={(formik.values as any).subCategory || []}
                    onChange={(selected) => {
                      // Update Formik state directly
                      formik.setFieldValue(
                        "subCategory",
                        selected ? selected : []
                      );
                    }}
                  />
                  {/* end::Input */}
                  {(formik.touched as any).subCategory &&
                    (formik.errors as any).subCategory && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {(formik.errors as any).subCategory}
                        </span>
                      </div>
                    )}
                </div>
              </div>
              {/* end:: SubCategory Input group */}

              {/* begin:: ChildSubCategory Input group */}
              <div className="shadow-sm rounded-end rounded p-6 mb-8">
                <div className="fv-row mb-7">
                  {/* begin::Label */}
                  <label className=" fw-bolder fs-4   ms-3 mb-2">
                    ChildSubCategory
                  </label>
                  {/* end::Label */}

                  {/* begin::Input */}
                  <Select
                    isMulti
                    options={memoizedChildSubCategories}
                    placeholder="ChildSubCategory"
                    className={clsx(
                      "form-control form-control-solid react-select react-select-styled mb-3 mb-lg-0 ms-2 border border-2"
                    )}
                    name="childSubCategory"
                    value={(formik.values as any).childSubCategory || []}
                    onChange={(selected) => {
                      // Update Formik state directly
                      formik.setFieldValue(
                        "childSubCategory",
                        selected ? selected : []
                      );
                    }}
                  />
                  {/* end::Input */}
                  {(formik.touched as any).childSubCategory &&
                    (formik.errors as any).childSubCategory && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">
                          {(formik.errors as any).childSubCategory}
                        </span>
                      </div>
                    )}
                </div>
              </div>
              {/* end:: ChildSubCategory Input group */}
            </div>
            <div className="col-md-9">
              {/* begin:: Tabs group */}
              <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    type="button"
                    className={`nav-link ${
                      activeTab === "general" ? "active" : ""
                    }`}
                    onClick={() => handleTabClick("general")}
                  >
                    General
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    type="button"
                    className={`nav-link ${
                      activeTab === "advanced" ? "active" : ""
                    }`}
                    onClick={() => handleTabClick("advanced")}
                  >
                    Advanced
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    type="button"
                    className={`nav-link ${
                      activeTab === "media" ? "active" : ""
                    }`}
                    onClick={() => handleTabClick("media")}
                  >
                    Media
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    type="button"
                    className={`nav-link ${
                      activeTab === "branches" ? "active" : ""
                    }`}
                    onClick={() => handleTabClick("branches")}
                  >
                    Branches
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    type="button"
                    className={`nav-link ${
                      activeTab === "descTable" ? "active" : ""
                    }`}
                    onClick={() => handleTabClick("descTable")}
                  >
                    Description Table
                  </button>
                </li>
              </ul>
              {/* end:: Tabs group */}

              {/* begin:: General group */}
              <div
                className={`collapse ${
                  activeTab === "general" ? "active show" : ""
                }`}
                id="general"
              >
                {/* begin:: General group */}
                <div className=" shadow-sm rounded-end rounded p-6 mb-8">
                  <h3 className="fw-bold p-4 mb-4">General</h3>

                  {/* begin:: Name Input group */}

                  <div className="fv-row mb-7">
                    {/* begin::Label */}
                    <label className="required fw-semibold fs-7 ps-4 mb-2">
                      Product Name
                    </label>
                    {/* end::Label */}

                    {/* begin::Input */}
                    <input
                      placeholder="Product Name"
                      {...formik.getFieldProps("name")}
                      // value={formik.values?.name}
                      type="text"
                      name="name"
                      className={clsx(
                        "form-control form-control-solid mb-3 ms-2 mb-lg-0 border border-2",
                        {
                          "is-invalid":
                            formik.touched.name && formik.errors.name,
                        },
                        {
                          "is-valid":
                            formik.touched.name && !formik.errors.name,
                        }
                      )}
                      autoComplete="off"
                      disabled={formik.isSubmitting}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          <span role="alert">{formik.errors.name}</span>
                        </div>
                      </div>
                    )}
                    {/* end::Input */}
                    <div className="form-text px-4">
                      A product name is required and recommended to be unique.
                    </div>
                  </div>
                  {/* end:: Name Input group */}

                  {/* begin:: Description Input group */}
                  <div className="fv-row mb-7">
                    {/* begin::Label */}
                    <label className="fw-semibold fs-6 mb-2 ms-4">
                      Description
                    </label>
                    {/* end::Label */}

                    {/* begin::ReactQuill with Formik */}
                    <ReactQuill
                      theme="snow"
                      modules={modules}
                      placeholder="Description"
                      value={formik.values.description || ""}
                      onChange={(value) => {
                        formik.setFieldValue("description", value);
                        formik.setFieldTouched("description", true, false);
                      }}
                      onBlur={() =>
                        formik.setFieldTouched("description", true, true)
                      }
                      className={clsx(
                        "mb-3 ms-2 mb-lg-0 border border-2 rounded",
                        {
                          "border-danger":
                            formik.touched.description &&
                            formik.errors.description,
                          "border-success":
                            formik.touched.description &&
                            !formik.errors.description,
                        }
                      )}
                    />
                    {/* end::ReactQuill */}

                    <div className="form-text px-4">
                      Set a description to the product for better visibility.
                    </div>

                    {formik.touched.description &&
                      formik.errors.description && (
                        <div className="fv-plugins-message-container">
                          <span role="alert" className="text-danger">
                            {formik.errors.description}
                          </span>
                        </div>
                      )}
                  </div>
                  {/* end:: Description Input group */}

                  {/* begin:: shortDesc Input group */}

                  <div className="fv-row mb-7">
                    {/* begin::Label */}
                    <label className=" fw-semibold fs-7 ps-4 mb-2">
                      Short Description
                    </label>
                    {/* end::Label */}

                    {/* begin::Input */}
                    <input
                      placeholder="Short Description"
                      {...formik.getFieldProps("shortDesc")}
                      type="text"
                      name="shortDesc"
                      className={clsx(
                        "form-control form-control-solid mb-3 ms-2 mb-lg-0 border border-2",
                        {
                          "is-invalid":
                            (formik.touched as any).shortDesc &&
                            (formik.errors as any).shortDesc,
                        },
                        {
                          "is-valid":
                            (formik.touched as any).shortDesc &&
                            !(formik.errors as any).shortDesc,
                        }
                      )}
                      autoComplete="off"
                      disabled={formik.isSubmitting}
                    />
                    {(formik.touched as any).shortDesc &&
                      (formik.errors as any).shortDesc && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            <span role="alert">
                              {(formik.errors as any).shortDesc}
                            </span>
                          </div>
                        </div>
                      )}
                    {/* end::Input */}
                  </div>
                  {/* end:: shortDesc Input group */}
                </div>
                {/* begin:: General group */}

                {/* begin:: Pricing group */}
                <div className="shadow-sm rounded-end rounded p-6 mb-8">
                  <h3 className="fw-bold  p-4 mb-4">Pricing</h3>

                  {/* begin:: price Input group */}
                  <div className="fv-row mb-7">
                    {/* begin::Label */}
                    <label className=" fw-semibold fs-7   ms-3 mb-2">
                      Base Price
                    </label>
                    {/* end::Label */}

                    {/* begin::Input */}
                    <input
                      placeholder="Product price"
                      {...formik.getFieldProps("price")}
                      className={clsx(
                        "form-control form-control-solid mb-3 mb-lg-0 ms-2 border border-2",
                        {
                          "is-invalid":
                            formik.touched.price && formik.errors.price,
                        },
                        {
                          "is-valid":
                            formik.touched.price && !formik.errors.price,
                        }
                      )}
                      type="text"
                      name="price"
                      autoComplete="off"
                      disabled={formik.isSubmitting}
                    />
                    {/* end::Input */}
                    {formik.touched.price && formik.errors.price && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">{formik.errors.price}</span>
                      </div>
                    )}
                    <div className="form-text px-4">Set the product price.</div>
                  </div>
                  {/* end:: price Input group */}
                </div>

                {/* begin:: Weight & Dimensions group */}
                {/* begin:: Pricing group */}
                <div className="shadow-sm rounded-end rounded p-6 mb-8">
                  <h3 className="fw-bold  p-4 mb-4">Weight & Dimensions</h3>

                  {/* begin:: Show weight Input group */}
                  <div className="fv-row mb-7 form-check form-switch form-check-custom form-check-solid">
                    {/* begin::Input */}
                    <input
                      {...formik.getFieldProps("showWeight")}
                      className={clsx(
                        " form-check-input mb-3 mb-lg-0 ms-2 border border-2",
                        {
                          "is-invalid":
                            formik.touched.showWeight &&
                            formik.errors.showWeight,
                        },
                        {
                          "is-valid":
                            formik.touched.showWeight &&
                            !formik.errors.showWeight,
                        }
                      )}
                      name="showWeight"
                      autoComplete="off"
                      type="checkbox"
                      defaultChecked={productForEdit?.showWeight}
                    />
                    {/* end::Input */}
                    {formik.touched.showWeight && formik.errors.showWeight && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">{formik.errors.showWeight}</span>
                      </div>
                    )}
                    <label className=" fw-semibold fs-6 mb-2 ms-4 pt-2">
                      Show Weight
                    </label>
                  </div>
                  {/* end:: Show weight Input group */}

                  {/* begin:: Show weight Input group */}
                  <div className="fv-row mb-7 form-check form-switch form-check-custom form-check-solid">
                    {/* begin::Input */}
                    <input
                      {...formik.getFieldProps("fractionalQuantity")}
                      className={clsx(
                        " form-check-input mb-3 mb-lg-0 ms-2 border border-2",
                        {
                          "is-invalid":
                            formik.touched.fractionalQuantity &&
                            formik.errors.fractionalQuantity,
                        },
                        {
                          "is-valid":
                            formik.touched.fractionalQuantity &&
                            !formik.errors.fractionalQuantity,
                        }
                      )}
                      name="fractionalQuantity"
                      autoComplete="off"
                      type="checkbox"
                      defaultChecked={productForEdit?.fractionalQuantity}
                    />
                    {/* end::Input */}
                    {formik.touched.fractionalQuantity &&
                      formik.errors.fractionalQuantity && (
                        <div className="fv-plugins-message-container">
                          <span role="alert">
                            {formik.errors.fractionalQuantity}
                          </span>
                        </div>
                      )}
                    <label className=" fw-semibold fs-6 mb-2 ms-4 pt-2">
                      Fractional Quantity
                    </label>
                  </div>
                  {/* end:: Show weight Input group */}

                  {/* begin:: weight Input group */}
                  <div className="fv-row mb-7">
                    {/* begin::Label */}
                    <label className=" fw-semibold fs-7   ms-3 mb-2">
                      Weight
                    </label>
                    {/* end::Label */}

                    {/* begin::Input */}
                    <input
                      placeholder="Weight"
                      {...formik.getFieldProps("weight")}
                      className={clsx(
                        "form-control form-control-solid mb-3 mb-lg-0 ms-2 border border-2",
                        {
                          "is-invalid":
                            formik.touched.weight && formik.errors.weight,
                        },
                        {
                          "is-valid":
                            formik.touched.weight && !formik.errors.weight,
                        }
                      )}
                      type="text"
                      name="weight"
                      autoComplete="off"
                      disabled={formik.isSubmitting}
                    />
                    {/* end::Input */}
                    {formik.touched.weight && formik.errors.weight && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">{formik.errors.weight}</span>
                      </div>
                    )}
                  </div>
                  {/* end:: weight Input group */}

                  {/* begin:: dimensions Input group */}
                  <div className="fv-row mb-7">
                    {/* begin::Label */}
                    <label className=" fw-semibold fs-7   ms-3 mb-2">
                      Dimensions
                    </label>
                    {/* end::Label */}

                    {/* begin::Input */}
                    <input
                      placeholder="Dimensions"
                      {...formik.getFieldProps("dimensions")}
                      className={clsx(
                        "form-control form-control-solid mb-3 mb-lg-0 ms-2 border border-2",
                        {
                          "is-invalid":
                            formik.touched.dimensions &&
                            formik.errors.dimensions,
                        },
                        {
                          "is-valid":
                            formik.touched.dimensions &&
                            !formik.errors.dimensions,
                        }
                      )}
                      type="text"
                      name="dimensions"
                      autoComplete="off"
                      disabled={formik.isSubmitting}
                    />
                    {/* end::Input */}
                    {formik.touched.dimensions && formik.errors.dimensions && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">{formik.errors.dimensions}</span>
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
              <div
                className={`collapse ${
                  activeTab === "advanced" ? "active show" : ""
                }`}
                id="advanced"
              >
                {/* begin:: Inventory group */}
                <div className=" shadow-sm rounded-end rounded p-6 mb-8">
                  <h3 className="fw-bold p-4 mb-4">Inventory</h3>

                  {/* begin:: quantity Input group */}

                  <div className="fv-row mb-7">
                    {/* begin::Label */}
                    <label className=" fw-semibold fs-7 ps-4 mb-2">
                      Quantity
                    </label>
                    {/* end::Label */}

                    {/* begin::Input */}
                    <input
                      placeholder="Quantity"
                      {...formik.getFieldProps("quantity")}
                      type="text"
                      name="quantity"
                      className={clsx(
                        "form-control form-control-solid mb-3 ms-2 mb-lg-0 border border-2",
                        {
                          "is-invalid":
                            formik.touched.quantity && formik.errors.quantity,
                        },
                        {
                          "is-valid":
                            formik.touched.quantity && !formik.errors.quantity,
                        }
                      )}
                      autoComplete="off"
                      disabled={formik.isSubmitting}
                    />
                    {formik.touched.quantity && formik.errors.quantity && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          <span role="alert">{formik.errors.quantity}</span>
                        </div>
                      </div>
                    )}
                    {/* end::Input */}
                  </div>
                  {/* end:: quantity Input group */}

                  {/* begin:: minQty Input group */}
                  <div className="fv-row mb-7">
                    {/* begin::Label */}
                    <label className=" fw-semibold fs-7 ps-4 mb-2">
                      Minimum Qty for order
                    </label>
                    {/* end::Label */}

                    {/* begin::Input */}
                    <input
                      placeholder="Minimum Qty for order"
                      {...formik.getFieldProps("minQty")}
                      type="text"
                      name="minQty"
                      className={clsx(
                        "form-control form-control-solid mb-3 ms-2 mb-lg-0 border border-2",
                        {
                          "is-invalid":
                            formik.touched.minQty && formik.errors.minQty,
                        },
                        {
                          "is-valid":
                            formik.touched.minQty && !formik.errors.minQty,
                        }
                      )}
                      autoComplete="off"
                      disabled={formik.isSubmitting}
                    />
                    {formik.touched.minQty && formik.errors.minQty && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          <span role="alert">{formik.errors.minQty}</span>
                        </div>
                      </div>
                    )}
                    {/* end::Input */}
                  </div>
                  {/* end:: minQty Input group */}

                  {/* begin:: stock switch group */}
                  <div className="fv-row mb-7 form-check form-switch form-check-custom form-check-solid">
                    {/* begin::Label */}
                    <label className=" fw-semibold fs-7 ps-4 mb-2">
                      Out Of Stock
                    </label>
                    {/* end::Label */}

                    {/* begin::Input */}
                    <input
                      placeholder="Stock"
                      checked={formik.values.stock === "0"}
                      onChange={(e) => {
                        if (e.target.checked) {
                          formik.setFieldValue("stock", "0");
                        } else {
                          formik.setFieldValue("stock", "");
                        }
                      }}
                      type="checkbox"
                      name="outOfStock"
                      className={clsx(
                        "form-check-input mb-3 ms-2 mb-lg-0 border border-2"
                      )}
                      autoComplete="off"
                      disabled={formik.isSubmitting}
                    />
                    {/* end::Input */}
                  </div>
                  {/* end:: stock switch group */}

                  {/* begin:: stock Input group - Only show if not out of stock */}
                  {formik.values.stock !== "0" && (
                    <div className="fv-row mb-7">
                      {/* begin::Label */}
                      <label className=" fw-semibold fs-7 ps-4 mb-2">
                        Stock
                      </label>
                      {/* end::Label */}

                      {/* begin::Input */}
                      <input
                        placeholder="Stock"
                        {...formik.getFieldProps("stock")}
                        type="text"
                        name="stock"
                        className={clsx(
                          "form-control form-control-solid mb-3 ms-2 mb-lg-0 border border-2",
                          {
                            "is-invalid":
                              formik.touched.stock && formik.errors.stock,
                          },
                          {
                            "is-valid":
                              formik.touched.stock && !formik.errors.stock,
                          }
                        )}
                        autoComplete="off"
                        disabled={formik.isSubmitting}
                      />
                      {formik.touched.stock && formik.errors.stock && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            <span role="alert">{formik.errors.stock}</span>
                          </div>
                        </div>
                      )}
                      {/* end::Input */}
                    </div>
                  )}
                  {/* end:: stock Input group */}

                  {/* begin:: sold Input group */}
                  <div className="fv-row mb-7">
                    {/* begin::Label */}
                    <label className=" fw-semibold fs-7 ps-4 mb-2">Sold</label>
                    {/* end::Label */}

                    {/* begin::Input */}
                    <input
                      placeholder="Sold"
                      {...formik.getFieldProps("sold")}
                      type="text"
                      name="sold"
                      className={clsx(
                        "form-control form-control-solid mb-3 ms-2 mb-lg-0 border border-2",
                        {
                          "is-invalid":
                            formik.touched.sold && formik.errors.sold,
                        },
                        {
                          "is-valid":
                            formik.touched.sold && !formik.errors.sold,
                        }
                      )}
                      autoComplete="off"
                      disabled={formik.isSubmitting}
                    />
                    {formik.touched.sold && formik.errors.sold && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          <span role="alert">{formik.errors.sold}</span>
                        </div>
                      </div>
                    )}
                    {/* end::Input */}
                  </div>
                  {/* end:: sold Input group */}
                </div>
                {/* end:: Inventory group */}

                {/* begin:: booking group */}
                <div className=" shadow-sm rounded-end rounded p-6 mb-8">
                  <h3 className="fw-bold p-4 mb-4">Booking</h3>

                  {/* begin:: book Input group */}

                  <div className="fv-row mb-7">
                    {/* begin::Label */}
                    <label className=" fw-semibold fs-7 ps-4 mb-2">Book</label>
                    {/* end::Label */}

                    {/* begin::Input */}
                    <select
                      {...formik.getFieldProps("book")}
                      name="book"
                      className={clsx(
                        "form-control form-control-solid mb-3 ms-2 mb-lg-0 border border-2",
                        {
                          "is-invalid":
                            formik.touched.book && formik.errors.book,
                        },
                        {
                          "is-valid":
                            formik.touched.book && !formik.errors.book,
                        }
                      )}
                      autoComplete="off"
                      disabled={formik.isSubmitting}
                      value={formik.values.book}
                    >
                      <option defaultChecked value="regular">
                        Regular
                      </option>
                      <option value="book">Book</option>
                      <option value="onlyBook">Only Book</option>
                    </select>
                    {formik.touched.book && formik.errors.book && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          <span role="alert">{formik.errors.book}</span>
                        </div>
                      </div>
                    )}
                    {/* Conditional BookAt input */}
                    {(formik.values.book === "book" ||
                      formik.values.book === "onlyBook") && (
                      <div className="fv-row mb-7 mt-3">
                        <label className="fw-semibold fs-7 ps-4 mb-2">Book At</label>
                        <input
                          {...formik.getFieldProps("bookAt")}
                          name="bookAt"
                          type="text"
                          className={clsx(
                            "form-control form-control-solid ms-2 mb-3 border border-2",
                            {
                              "is-invalid": formik.touched.bookAt && formik.errors.bookAt,
                            },
                            {
                              "is-valid": formik.touched.bookAt && !formik.errors.bookAt,
                            }
                          )}
                          placeholder="e.g. 1h23m or 1d13h"
                          disabled={formik.isSubmitting}
                          value={formik.values.bookAt || ""}
                        />
                        {formik.touched.bookAt && formik.errors.bookAt && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">{formik.errors.bookAt}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {/* end::Input */}
                  </div>
                  {/* end:: book Input group */}
                </div>
                {/* end:: Booking group */}

                {/* begin:: Groups Input group */}
                <div className="shadow-sm rounded-end rounded p-6 mb-8">
                  <div className="fv-row mb-7">
                    {/* begin::Label */}
                    <label className=" fw-bolder fs-4   ms-3 mb-2">
                      Groups Of Options
                    </label>
                    {/* end::Label */}

                    {/* begin::Input */}
                    <Select
                      isMulti
                      options={memoizedGroupsOfOptions}
                      placeholder="Group Of Options"
                      className={clsx(
                        "form-control form-control-solid react-select react-select-styled mb-3 mb-lg-0 ms-2 border border-2"
                      )}
                      name="groupOfOptions"
                      value={(formik.values as any).groupOfOptions || []}
                      onChange={(selected) => {
                        // Update Formik state directly
                        formik.setFieldValue(
                          "groupOfOptions",
                          selected ? selected : []
                        );
                      }}
                    />
                    {/* end::Input */}
                    {(formik.touched as any).groupOfOptions &&
                      (formik.errors as any).groupOfOptions && (
                        <div className="fv-plugins-message-container">
                          <span role="alert">
                            {(formik.errors as any).groupOfOptions}
                          </span>
                        </div>
                      )}
                  </div>
                </div>
                {/* end:: Groups Input group */}

                {/* begin:: Extras Input group */}
                <div className="shadow-sm rounded-end rounded p-6 mb-8">
                  <div className="fv-row mb-7">
                    {/* begin::Label */}
                    <label className=" fw-bolder fs-4   ms-3 mb-2">
                      Extras
                    </label>
                    {/* end::Label */}

                    {/* begin::Input */}
                    <Select
                      isMulti
                      options={memoizedExtras}
                      placeholder="Extras"
                      className={clsx(
                        "form-control form-control-solid react-select react-select-styled mb-3 mb-lg-0 ms-2 border border-2"
                      )}
                      name="extras"
                      value={(formik.values as any).extras || []}
                      onChange={(selected) => {
                        // Update Formik state directly
                        formik.setFieldValue(
                          "extras",
                          selected ? selected : []
                        );
                      }}
                    />
                    {/* end::Input */}
                    {(formik.touched as any).extras &&
                      (formik.errors as any).extras && (
                        <div className="fv-plugins-message-container">
                          <span role="alert">
                            {(formik.errors as any).extras}
                          </span>
                        </div>
                      )}
                  </div>
                </div>
                {/* end:: Extras Input group */}

                {/* begin:: Types Input group */}
                <div className="shadow-sm rounded-end rounded p-6 mb-8">
                  <div className="fv-row mb-7">
                    {/* begin::Label */}
                    <label className=" fw-bolder fs-4   ms-3 mb-2">Types</label>
                    {/* end::Label */}
                    {/* begin::Input */}
                    <Select
                      isMulti
                      options={memoizedTypes}
                      placeholder="Types"
                      className={clsx(
                        "form-control form-control-solid react-select react-select-styled mb-3 mb-lg-0 ms-2 border border-2"
                      )}
                      name="types"
                      value={formik.values.types || []}
                      onChange={(selected) => {
                        // Update Formik state directly
                        formik.setFieldValue("types", selected ? selected : []);
                      }}
                    />
                    {/* end::Input */}
                    {(formik.touched as any).types &&
                      (formik.errors as any).types && (
                        <div className="fv-plugins-message-container">
                          <span role="alert">
                            {(formik.errors as any).types}
                          </span>
                        </div>
                      )}
                  </div>
                </div>
                {/* end:: Types Input group */}

                {/* begin:: Meta Input group */}
                <div className="shadow-sm rounded-end rounded p-6 mb-8">
                  <div className="fv-row mb-7">
                    {/* begin::Label */}
                    <label className=" fw-bolder fs-4   ms-3 mb-2">
                      MetaTags
                    </label>
                    {/* end::Label */}

                    {/* begin::Input */}
                    <input
                      placeholder="MetaTags"
                      {...formik.getFieldProps("metaTags")}
                      className={clsx(
                        "form-control form-control-solid mb-3 mb-lg-0 ms-2 border border-2",
                        {
                          "is-invalid":
                            formik.touched.metaTags && formik.errors.metaTags,
                        },
                        {
                          "is-valid":
                            formik.touched.metaTags && !formik.errors.metaTags,
                        }
                      )}
                      type="text"
                      name="metaTags"
                      autoComplete="off"
                      disabled={formik.isSubmitting}
                    />
                    {/* end::Input */}
                    {formik.touched.metaTags && formik.errors.metaTags && (
                      <div className="fv-plugins-message-container">
                        <span role="alert">{formik.errors.metaTags}</span>
                      </div>
                    )}
                    <div className="form-text px-4">
                      Set a list of keywords that the product is related to.
                      Separate the keywords by adding a comma , between each
                      keyword.
                    </div>
                  </div>
                </div>
                {/* end:: meta Input group */}
              </div>
              {/* end:: Advanced group */}

              {/* begin:: Media group */}
              <div
                className={`collapse ${
                  activeTab === "media" ? "active show" : ""
                }`}
                id="media"
              >
                <div className="shadow-sm rounded-end rounded p-6 mb-8">
                  <h3 className="fw-bold p-4 mb-4">Media Gallery</h3>

                  {/* Gallery upload section */}
                  <div className="fv-row mb-7">
                    <label className="fw-semibold fs-6 mb-3">
                      Product Gallery Images (Max 10)
                    </label>

                    {/* Current images display */}
                    <div className="d-flex flex-wrap gap-3 mb-4 p-3 bg-light rounded">
                      {/* Display existing images from product */}
                      {existingGalleryUrls.map((url, index) => (
                        <div
                          key={`existing-${index}`}
                          className="position-relative"
                        >
                          <img
                            src={url}
                            alt={`Gallery ${index + 1}`}
                            className="rounded shadow-sm"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-danger position-absolute top-0 end-0 rounded-circle"
                            style={{
                              width: "24px",
                              height: "24px",
                              padding: 0,
                            }}
                            onClick={() =>
                              handleRemoveExistingGalleryImage(index)
                            }
                          >
                            ×
                          </button>
                        </div>
                      ))}

                      {/* Display new image previews */}
                      {galleryPreviews.map((preview, index) => (
                        <div key={`new-${index}`} className="position-relative">
                          <img
                            src={preview}
                            alt={`New Gallery ${index + 1}`}
                            className="rounded shadow-sm"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-danger position-absolute top-0 end-0 rounded-circle"
                            style={{
                              width: "24px",
                              height: "24px",
                              padding: 0,
                            }}
                            onClick={() => handleRemoveGalleryImage(index)}
                          >
                            ×
                          </button>
                        </div>
                      ))}

                      {existingGalleryUrls.length === 0 &&
                        galleryPreviews.length === 0 && (
                          <div className="text-muted text-center w-100">
                            No gallery images added yet
                          </div>
                        )}
                    </div>

                    {/* Upload controls */}
                    <div className="d-flex gap-3 align-items-center">
                      <button
                        type="button"
                        className="btn btn-light-primary"
                        onClick={() => galleryInputRef.current?.click()}
                        disabled={
                          existingGalleryUrls.length + galleryFiles.length >= 10
                        }
                      >
                        <i className="bi bi-cloud-upload me-2"></i>
                        Add Gallery Images
                      </button>

                      <span className="text-muted small">
                        {existingGalleryUrls.length + galleryFiles.length} / 10
                        images selected
                      </span>
                    </div>

                    <input
                      type="file"
                      ref={galleryInputRef}
                      multiple
                      accept=".png, .jpg, .jpeg"
                      onChange={handleGalleryChange}
                      style={{ display: "none" }}
                    />

                    <div className="form-text mt-2">
                      Upload additional product images. Supported formats: PNG,
                      JPG, JPEG. Max file size: 5MB per image.
                    </div>
                  </div>
                </div>
              </div>
              {/* end:: Media group */}

              {/* begin:: branches group */}
              <div
                className={`collapse ${
                  activeTab === "branches" ? "active show" : ""
                }`}
                id="branches"
              >
                {/* begin:: Branch Input group */}
                <div className="shadow-sm rounded-end rounded p-6 mb-8">
                  <div className="fv-row mb-7">
                    {/* begin::Label */}
                    <label className=" fw-bolder fs-4   ms-3 mb-2">
                      Branches
                    </label>
                    {/* end::Label */}

                    {(() => {
                      const branchData =
                        updatedBranches === undefined
                          ? productForEdit !== undefined
                            ? productForEdit.branch
                            : (initialBranches as BranchOfProduct[])
                          : (updatedBranches as BranchOfProduct[]);

                      return (
                        <BranchesForm
                          setUpdatedBranches={setUpdatedBranches}
                          formik={formik}
                          branchees={branchData}
                        />
                      );
                    })()}
                  </div>
                </div>

                {/* end:: Branch Input group */}
              </div>
              {/* end:: branches group */}

              {/* begin:: descTable group */}
              <div
                className={`collapse ${
                  activeTab === "descTable" ? "active show" : ""
                }`}
                id="descTable"
              >
                {/* begin:: Branch Input group */}
                <div className="shadow-sm rounded-end rounded p-6 mb-8">
                  <div className="fv-row mb-7">
                    {/* begin::Label */}
                    <label className=" fw-bolder fs-4   ms-3 mb-2">
                      Description Table
                    </label>
                    {/* end::Label */}

                    {/* begin:: Name Input group */}

                    <div className="fv-row mb-7">
                      {/* begin::Label */}
                      <label className=" fw-semibold fs-7 ps-4 mb-2">
                        Description Table Name
                      </label>
                      {/* end::Label */}

                      {/* begin::Input */}
                      <input
                        placeholder="Description Table Name"
                        type="text"
                        name="descTableName"
                        className={clsx(
                          "form-control form-control-solid mb-3 ms-2 mb-lg-0 border border-2",
                          {
                            "is-invalid":
                              formik.touched.descTableName &&
                              formik.errors.descTableName,
                          },
                          {
                            "is-valid":
                              formik.touched.descTableName &&
                              !formik.errors.descTableName,
                          }
                        )}
                        autoComplete="off"
                        disabled={formik.isSubmitting}
                        value={formik.values.descTableName || ""}
                      />
                      {formik.touched.descTableName &&
                        formik.errors.descTableName && (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              <span role="alert">
                                {formik.errors.descTableName}
                              </span>
                            </div>
                          </div>
                        )}
                      {/* end::Input */}
                    </div>

                    <DescTableForm
                      items={
                        productForEdit !== undefined
                          ? productForEdit.descTable
                          : []
                      }
                      setItems={setItems}
                    />
                    {/* end:: Name Input group */}
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
      {formik.isSubmitting && <UsersListLoading />}
    </>
  );
};
export default ProductForm;
