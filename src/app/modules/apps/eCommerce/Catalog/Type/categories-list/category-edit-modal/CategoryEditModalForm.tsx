import { FC, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { useListView } from "../core/ListViewProvider";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { useQueryResponse } from "../core/QueryResponseProvider";
import { Types as Category } from "../core/_models";
import { createType, updateType } from "../core/_requests";
import { isNotEmpty } from "../../../../../../../../_metronic/helpers";

type Props = {
  isCategoryLoading: boolean;
  category: Category;
};

const editUserSchema = Yup.object().shape({
  // order: Yup.number()
  //   .min(0, 'Order can\'t be negative'),
  name: Yup.string().min(3, "Minimum 3 symbols").required("Name is required"),
  // description: Yup.string()
  // .min(3, 'Minimum 3 symbols')
});

const CategoryEditModalForm: FC<Props> = ({ category, isCategoryLoading }) => {
  const { setItemIdForUpdate } = useListView();
  const { refetch } = useQueryResponse();

  const [categoryForEdit] = useState<Category>({
    ...category,
  });

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch();
    }
    setItemIdForUpdate(undefined);
  };

  // const blankImg = toAbsoluteUrl('media/svg/avatars/blank.svg')
  // const userAvatarImg = toAbsoluteUrl(`media/${categoryForEdit.imgCover}`)

  const formik = useFormik({
    initialValues: categoryForEdit,
    validationSchema: editUserSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        if (isNotEmpty(values._id)) {
          await updateType(values?._id, values);
        } else {
          console.log("values", values);
          delete values.available;
          await createType(values);
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
              disabled={formik.isSubmitting || isCategoryLoading}
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
        </div>
        {/* end::Scroll */}

        {/* begin::Actions */}
        <div className="text-center pt-15">
          <button
            type="reset"
            onClick={() => cancel()}
            className="btn btn-light me-3"
            data-kt-users-modal-action="cancel"
            disabled={formik.isSubmitting || isCategoryLoading}
          >
            Discard
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            data-kt-users-modal-action="submit"
            disabled={
              isCategoryLoading ||
              formik.isSubmitting ||
              !formik.isValid ||
              !formik.touched
            }
          >
            <span className="indicator-label">Submit</span>
            {(formik.isSubmitting || isCategoryLoading) && (
              <span className="indicator-progress">
                Please wait...{" "}
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            )}
          </button>
        </div>
        {/* end::Actions */}
      </form>
      {(formik.isSubmitting || isCategoryLoading) && <UsersListLoading />}
    </>
  );
};

export { CategoryEditModalForm };
