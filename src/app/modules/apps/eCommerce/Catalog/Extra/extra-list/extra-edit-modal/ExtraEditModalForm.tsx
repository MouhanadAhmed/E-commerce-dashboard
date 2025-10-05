import { FC, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { useListView } from "../core/ListViewProvider";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { useQueryResponse } from "../core/QueryResponseProvider";
import { Extras as Extra } from "../core/_models";
import { createExtra, updateExtra } from "../core/_requests";
import {
  isNotEmpty,
  toAbsoluteUrl,
} from "../../../../../../../../_metronic/helpers";
import Flatpickr from "react-flatpickr";
type Props = {
  isExtraLoading: boolean;
  category: Extra;
};

const editUserSchema = Yup.object().shape({
  order: Yup.number().min(0, "Order can't be negative"),
  name: Yup.string().min(3, "Minimum 3 symbols").required("Name is required"),
  description: Yup.string().min(3, "Minimum 3 symbols"),

  price: Yup.number().min(0).optional(),
  available: Yup.boolean().optional(),
  stock: Yup.string().optional(),
  qty: Yup.number().min(0).optional(),
  priceAfterDiscount: Yup.number().min(0).optional(),
  priceAfterExpirest: Yup.string().optional(),
  sold: Yup.number().min(0).optional(),
});

const ExtraEditModalForm: FC<Props> = ({ category, isExtraLoading }) => {
  const { setItemIdForUpdate } = useListView();
  const { refetch } = useQueryResponse();

  const [categoryForEdit] = useState<Extra>({
    ...category,
    available: category.available || true,
    name: category.name || "",
  });

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch();
    }
    setItemIdForUpdate(undefined);
  };

  const blankImg = toAbsoluteUrl("media/svg/avatars/blank.svg");
  const userAvatarImg = toAbsoluteUrl(`media/${categoryForEdit.imgCover}`);

  const formik = useFormik({
    initialValues: categoryForEdit,
    validationSchema: editUserSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        if (isNotEmpty(values._id)) {
          await updateExtra(values?._id, values);
        } else {
          await createExtra(values);
        }
      } catch (ex) {
        console.error(ex);
      } finally {
        setSubmitting(true);
        cancel(true);
      }
    },
  });

  return (
    <>
      <form
        id="kt_modal_add_user_form"
        className="form "
        onSubmit={formik.handleSubmit}
        noValidate
      >
        {/* begin::Scroll */}
        <div
          className="d-flex flex-column scroll-y me-n7 pe-7"
          id="kt_modal_add_user_scroll"
          data-kt-scroll="true"
          data-kt-scroll-activate="{default: false, lg: true}"
          data-kt-scroll-max-height="auto"
          data-kt-scroll-dependencies="#kt_modal_add_user_header"
          data-kt-scroll-wrappers="#kt_modal_add_user_scroll"
          data-kt-scroll-offset="300px"
        >
          {/* begin::Input group */}
          <div className="fv-row mb-7">
            {/* begin::Label */}
            <label className="d-block fw-bold fs-6 ms-2 mb-5">ImgCover</label>
            {/* end::Label */}

            {/* begin::Image input */}
            <div
              className="image-input image-input-outline ms-2"
              data-kt-image-input="true"
              style={{ backgroundImage: `url('${blankImg}')` }}
            >
              {/* begin::Preview existing imgCover */}
              <div
                className="image-input-wrapper w-125px h-125px ms-2"
                style={{ backgroundImage: `url('${userAvatarImg}')` }}
              ></div>
              {/* end::Preview existing imgCover */}
            </div>
            {/* end::Image input */}

          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className="fv-row mb-7">
            {/* begin::Label */}
            <label className="required fw-bold fs-6 ps-2 mb-2">Name</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder="Full name"
              {...formik.getFieldProps("name")}
              type="text"
              name="name"
              className={clsx(
                "form-control form-control-solid mb-3 ms-2 mb-lg-0",
                { "is-invalid": formik.touched.name && formik.errors.name },
                {
                  "is-valid": formik.touched.name && !formik.errors.name,
                },
              )}
              autoComplete="off"
              disabled={formik.isSubmitting || isExtraLoading}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert">{formik.errors.name}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className="fv-row mb-7">
            {/* begin::Label */}
            <label className="required fw-bold fs-6 mb-2 ms-2">
              Description
            </label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder="description"
              {...formik.getFieldProps("description")}
              className={clsx(
                "form-control form-control-solid mb-3 mb-lg-0 ms-2",
                {
                  "is-invalid":
                    formik.touched.description && formik.errors.description,
                },
                {
                  "is-valid":
                    formik.touched.description && !formik.errors.description,
                },
              )}
              type="text"
              name="description"
              autoComplete="off"
              disabled={formik.isSubmitting || isExtraLoading}
            />
            {/* end::Input */}
            {formik.touched.description && formik.errors.description && (
              <div className="fv-plugins-message-container">
                <span role="alert">{formik.errors.description}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className="fv-row mb-7">
            {/* begin::Label */}
            <label className="required fw-bold fs-6  ms-2 mb-2">Order</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder="order"
              {...formik.getFieldProps("order")}
              className={clsx(
                "form-control form-control-solid mb-3 mb-lg-0 ms-2",
                { "is-invalid": formik.touched.order && formik.errors.order },
                {
                  "is-valid": formik.touched.order && !formik.errors.order,
                },
              )}
              type="text"
              name="order"
              autoComplete="off"
              disabled={formik.isSubmitting || isExtraLoading}
            />
            {/* end::Input */}
            {formik.touched.order && formik.errors.order && (
              <div className="fv-plugins-message-container">
                <span role="alert">{formik.errors.order}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className="fv-row mb-7">
            {/* begin::Label */}
            <label className=" fw-bold fs-6 ps-2 mb-2">Stock</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder="Stock"
              {...formik.getFieldProps("stock")}
              type="text"
              name="stock"
              className={clsx(
                "form-control form-control-solid mb-3 ms-2 mb-lg-0",
                { "is-invalid": formik.touched.stock && formik.errors.stock },
                {
                  "is-valid": formik.touched.stock && !formik.errors.stock,
                },
              )}
              autoComplete="off"
              disabled={formik.isSubmitting || isExtraLoading}
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
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className="fv-row mb-7">
            {/* begin::Label */}
            <label className=" fw-bold fs-6 ps-2 mb-2">Qty</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder="Quantity"
              {...formik.getFieldProps("qty")}
              type="text"
              name="qty"
              className={clsx(
                "form-control form-control-solid mb-3 ms-2 mb-lg-0",
                { "is-invalid": formik.touched.qty && formik.errors.qty },
                {
                  "is-valid": formik.touched.qty && !formik.errors.qty,
                },
              )}
              autoComplete="off"
              disabled={formik.isSubmitting || isExtraLoading}
            />
            {formik.touched.qty && formik.errors.qty && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert">{formik.errors.qty}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className="fv-row mb-7">
            {/* begin::Label */}
            <label className=" fw-bold fs-6 ps-2 mb-2">Price</label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder="Price"
              {...formik.getFieldProps("price")}
              type="text"
              name="price"
              className={clsx(
                "form-control form-control-solid mb-3 ms-2 mb-lg-0",
                { "is-invalid": formik.touched.price && formik.errors.price },
                {
                  "is-valid": formik.touched.price && !formik.errors.price,
                },
              )}
              autoComplete="off"
              disabled={formik.isSubmitting || isExtraLoading}
            />
            {formik.touched.price && formik.errors.price && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert">{formik.errors.price}</span>
                </div>
              </div>
            )}
            {/* end::Input */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className="fv-row mb-7">
            {/* begin::Label */}
            <label className=" fw-bold fs-6 ps-2 mb-2">
              Price After Discount
            </label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder="Price After Discount"
              {...formik.getFieldProps("priceAfterDiscount")}
              type="text"
              name="priceAfterDiscount"
              className={clsx(
                "form-control form-control-solid mb-3 ms-2 mb-lg-0",
                {
                  "is-invalid":
                    formik.touched.priceAfterDiscount &&
                    formik.errors.priceAfterDiscount,
                },
                {
                  "is-valid":
                    formik.touched.priceAfterDiscount &&
                    !formik.errors.priceAfterDiscount,
                },
              )}
              autoComplete="off"
              disabled={formik.isSubmitting || isExtraLoading}
            />
            {formik.touched.priceAfterDiscount &&
              formik.errors.priceAfterDiscount && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.priceAfterDiscount}</span>
                  </div>
                </div>
              )}
            {/* end::Input */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className="fv-row mb-7">
            {/* begin::Label */}
            <label className=" fw-bold fs-6 ps-2 mb-2">
              Discount Expiry Date
            </label>
            {/* end::Label */}

            {/* begin::Input */}
            <Flatpickr
              placeholder="Discount Expiry Date"
              value={formik.values.priceAfterExpirest}
              // data-enable-time
              options={{ dateFormat: "Y-m-d" }}
              // value={formik.values.priceAfterExpirest}
              onChange={(date) =>
                formik.setFieldValue(
                  "priceAfterExpirest",
                  date[0].toISOString(),
                )
              }
              // {...formik.getFieldProps('priceAfterExpirest')}
              type="text"
              name="priceAfterExpirest"
              dateFormat="z"
              className={clsx(
                "form-control form-control-solid mb-3 ms-2 mb-lg-0",
              )}
              autoComplete="off"
              disabled={formik.isSubmitting || isExtraLoading}
            />
            {formik.touched.priceAfterExpirest &&
              formik.errors.priceAfterExpirest && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.priceAfterExpirest}</span>
                  </div>
                </div>
              )}
            {/* end::Input */}
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className="fv-row mb-7">
            {/* begin::Label */}
            <label className="required fw-bold fs-6 mb-2 ms-2">Available</label>
            {/* end::Label */}

            {/* begin::Input */}
            <select
              {...formik.getFieldProps("available")}
              className={clsx(
                "form-control form-control-solid mb-3 mb-lg-0 ms-2",
                {
                  "is-invalid":
                    formik.touched.description && formik.errors.description,
                },
                {
                  "is-valid":
                    formik.touched.description && !formik.errors.description,
                },
              )}
              name="available"
              autoComplete="off"
              disabled={formik.isSubmitting || isExtraLoading}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
            {/* end::Input */}
            {formik.touched.available && formik.errors.available && (
              <div className="fv-plugins-message-container">
                <span role="alert">{formik.errors.available}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}
        </div>
        {/* end::Scroll */}

        {/* begin::Actions */}
        <div className="text-center pt-15">
          <button
            type="reset"
            onClick={() => cancel()}
            className="btn btn-light me-3"
            data-kt-users-modal-action="cancel"
            disabled={formik.isSubmitting || isExtraLoading}
          >
            Discard
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            data-kt-users-modal-action="submit"
            disabled={
              isExtraLoading ||
              formik.isSubmitting ||
              !formik.isValid ||
              !formik.touched
            }
          >
            <span className="indicator-label">Submit</span>
            {(formik.isSubmitting || isExtraLoading) && (
              <span className="indicator-progress">
                Please wait...{" "}
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            )}
          </button>
        </div>
        {/* end::Actions */}
      </form>
      {(formik.isSubmitting || isExtraLoading) && <UsersListLoading />}
    </>
  );
};

export { ExtraEditModalForm };
