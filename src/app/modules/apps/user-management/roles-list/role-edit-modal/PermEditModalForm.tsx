import { FC, useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { isNotEmpty } from "../../../../../../_metronic/helpers";
import { initialRole, Role } from "../core/_models";
import clsx from "clsx";
import { useListView } from "../core/ListViewProvider";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { createRole, updateRole } from "../core/_requests";
import { useQueryResponse } from "../core/QueryResponseProvider";
import { getPermissions } from "../../perms-list/core/_requests";
type Props = {
  isUserLoading: boolean;
  Role?: Role;
};

const editPermSchema = Yup.object().shape({
  // email: Yup.string()
  //   .email('Wrong email format')
  //   .min(3, 'Minimum 3 symbols')
  //   .max(50, 'Maximum 50 symbols')
  //   .required('Email is required'),
  name: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Name is required"),

  permissions: Yup.array().of(
    Yup.object({
      permission: Yup.string().required(),
      access: Yup.array(),
    }),
  ),
});

const PermEditModalForm: FC<Props> = ({ Role, isUserLoading }) => {
  const { setItemIdForUpdate } = useListView();
  const { refetch } = useQueryResponse();
  const [permissions, setPermissions] = useState([]);

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch();
    }
    setItemIdForUpdate(undefined);
  };
  useEffect(() => {
    console.log("Role", Role);
    const fetchPermissions = async () => {
      try {
        const resActive = await getPermissions();
        console.log("Permissions", resActive.data);
        setPermissions(resActive.data);
        formik.initialValues.permissions = resActive.data.map((p, index) => ({
          permission: p?._id,
          access: [],
        }));
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };
    fetchPermissions();
  }, []);
  // const [userForEdit] = useState<Role>({
  //   ...Role,
  //   name: Role?.name || '',
  //   permissions:permissions.map((p,index)=>({
  //     permission:p?._id,
  //     access:[]
  //   }))
  // })
  const [userForEdit] = useState({
    ...(Role && Role.name ? { name: Role.name } : { name: "" }),
    permissions: permissions?.map((p) => ({
      permission: p?._id,
      ...(Role &&
      Role?.permissions &&
      Role?.permissions?.filter(
        (item) => item?.permission?._id == p?._id,
      )[0] !== undefined
        ? {
            access: [
              ...Array.from(
                Role?.permissions?.filter(
                  (item) => item?.permission?._id == p?._id,
                )[0]?.access,
              ),
            ],
          }
        : { access: [] }),
    })),
  });

  console.log("userForEdit", userForEdit.permissions);
  const handleCheckboxChange = (index, accessType) => {
    const perms = [...formik.values.permissions];
    // permissions.map((p,)=>({
    //   permission:p?._id,
    //   access:[]
    // }))
    console.log("handle", perms);
    const accessSet = new Set(
      perms.find((p) => p.permission === index)?.access,
    );

    if (accessSet.has(accessType)) {
      accessSet.delete(accessType);
    } else {
      accessSet.add(accessType);
    }

    perms.find((p) => p.permission === index).access = Array.from(accessSet);
    formik.setFieldValue("permissions", perms);
  };

  const formik = useFormik({
    initialValues:
      Role !== undefined
        ? {
            ...(Role && Role.name ? { name: Role.name } : { name: "" }),
            ...(Role && Role._id ? { _id: Role._id } : {}),
            permissions: permissions?.map((p) => ({
              permission: p?._id,
              ...(Role &&
              Role?.permissions &&
              Role?.permissions?.filter(
                (item) => item?.permission?._id == p?._id,
              )[0] !== undefined
                ? {
                    access: [
                      ...Array.from(
                        Role?.permissions?.filter(
                          (item) => item?.permission?._id == p?._id,
                        )[0]?.access,
                      ),
                    ],
                  }
                : { access: [] }),
            })),
          }
        : userForEdit,
    validationSchema: editPermSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        console.log("role values", values);
        if (isNotEmpty(values._id)) {
          // await updateRole(values)
        } else {
          // await createRole(values)
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
        className="form"
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
            <label htmlFor="name" className="required fw-bold fs-6 mb-2">
              Role Name
            </label>
            {/* end::Label */}

            {/* begin::Input */}
            <input
              placeholder="Role name"
              {...formik.getFieldProps("name")}
              type="text"
              name="name"
              className={clsx(
                "form-control form-control-solid mb-3 mb-lg-0",
                { "is-invalid": formik.touched.name && formik.errors.name },
                {
                  "is-valid": formik.touched.name && !formik.errors.name,
                },
              )}
              autoComplete="off"
              disabled={formik.isSubmitting || isUserLoading}
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
          <div className="fv-row mb-7 container">
            {/* begin::Label */}
            <label htmlFor="perm" className=" fw-bold fs-6 mb-4">
              Role Permissions
            </label>
            {/* end::Label */}

            {/* begin::Input */}
            {permissions.map((permission, index) => (
              <div key={index} className="mb-3 row">
                <div className="fw-semibold fs-6 mb-2 col-3">
                  {permission.name}
                </div>
                <div className="d-flex justify-content-evenly align-items-center col-9">
                  <div className="form-check me-3">
                    <input
                      // {...formik.getFieldProps(`permissions[${permission?._id}].read`)}
                      type="checkbox"
                      name={`${permission?._id}.read`}
                      checked={
                        formik.values.permissions?.find(
                          (p) => p.permission === permission._id,
                        )?.access?.length !== 0 &&
                        formik.values.permissions
                          ?.find((p) => p.permission === permission._id)
                          ?.access?.includes("read")
                        // false
                      }
                      onChange={() =>
                        handleCheckboxChange(permission?._id, "read")
                      }
                      className={clsx("form-check-input")}
                      autoComplete="off"
                      disabled={formik.isSubmitting || isUserLoading}
                    />
                    <label className="form-check-label text-muted fw-bold fs-6 ms-1">
                      Read
                    </label>
                  </div>
                  <div className="form-check me-3">
                    <input
                      // {...formik.getFieldProps(`permissions[${permission?._id}].write`)}
                      type="checkbox"
                      name={`${permission?._id}.write`}
                      checked={
                        formik.values.permissions?.find(
                          (p) => p.permission === permission._id,
                        )?.access?.length !== 0 &&
                        formik.values.permissions
                          ?.find((p) => p.permission === permission._id)
                          ?.access?.includes("write")
                        // false
                      }
                      onChange={() =>
                        handleCheckboxChange(permission?._id, "write")
                      }
                      className={clsx("form-check-input")}
                      autoComplete="off"
                      disabled={formik.isSubmitting || isUserLoading}
                    />
                    <label className="form-check-label text-muted fw-bold fs-6 ms-1">
                      Write
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      // {...formik.getFieldProps(`permissions[${permission?._id}].create`)}
                      type="checkbox"
                      name={`${permission?._id}.create`}
                      checked={
                        formik.values.permissions?.find(
                          (p) => p.permission === permission._id,
                        )?.access?.length !== 0 &&
                        formik.values.permissions
                          ?.find((p) => p.permission === permission._id)
                          ?.access?.includes("create")
                        // false
                      }
                      onChange={() =>
                        handleCheckboxChange(permission?._id, "create")
                      }
                      className={clsx("form-check-input")}
                      autoComplete="off"
                      disabled={formik.isSubmitting || isUserLoading}
                    />
                    <label className="form-check-label text-muted fw-bold fs-6 ms-1">
                      Create
                    </label>
                  </div>
                </div>
              </div>
            ))}

            {formik.touched.permissions && formik.errors.permissions && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert">{formik.errors.permissions}</span>
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
            disabled={formik.isSubmitting || isUserLoading}
          >
            Discard
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            data-kt-users-modal-action="submit"
            disabled={
              isUserLoading ||
              formik.isSubmitting ||
              !formik.isValid ||
              !formik.touched
            }
          >
            <span className="indicator-label">Submit</span>
            {(formik.isSubmitting || isUserLoading) && (
              <span className="indicator-progress">
                Please wait...{" "}
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            )}
          </button>
        </div>
        {/* end::Actions */}
      </form>
      {(formik.isSubmitting || isUserLoading) && <UsersListLoading />}
    </>
  );
};

export { PermEditModalForm };
