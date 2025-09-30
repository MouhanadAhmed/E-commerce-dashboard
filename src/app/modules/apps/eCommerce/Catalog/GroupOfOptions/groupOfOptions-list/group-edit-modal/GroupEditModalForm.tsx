import { FC, useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { useListView } from "../core/ListViewProvider";
import { UsersListLoading } from "../components/loading/UsersListLoading";
import { useQueryResponse } from "../core/QueryResponseProvider";
import { GroupOfOptions } from "../core/_models";
import {
  createGroup,
  updateGroup,
  createOption,
  updateOption,
  deleteOption,
} from "../core/_requests";
import { isNotEmpty } from "../../../../../../../../_metronic/helpers";

interface OptionField {
  name: string;
  price: number;
  available: boolean;
  isDefault: boolean;
}

type Props = {
  isGroupLoading: boolean;
  group: GroupOfOptions | null;
};

const editGroupSchema = Yup.object().shape({
  name: Yup.string().min(1, "Minimum 1 symbol").required("Name is required"),
  min: Yup.number()
    .min(0, "Minimum value is 0")
    .required("Minimum is required"),
  stock: Yup.number().nullable().min(0, "Stock cannot be negative").optional(),
  order: Yup.number()
    .min(0, "Order cannot be negative")
    .required("Order is required"),
  available: Yup.boolean().required("Availability is required"),
  options: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string()
          .min(1, "Option name is required")
          .required("Option name is required"),
        price: Yup.number()
          .min(0, "Price cannot be negative")
          .required("Price is required"),
        available: Yup.boolean().required("Option availability is required"),
        isDefault: Yup.boolean().required("Default selection is required"),
      })
    )
    .test(
      "single-default",
      "Only one option can be set as default",
      function (options) {
        if (!options || options.length === 0) return true;
        const defaultCount = options.filter(
          (option) => option.isDefault
        ).length;
        return defaultCount <= 1;
      }
    ),
});

const GroupEditModalForm: FC<Props> = ({ group, isGroupLoading }) => {
  const { setItemIdForUpdate } = useListView();
  const { refetch } = useQueryResponse();

  const [optionCount, setOptionCount] = useState<number>(0);
  const [options, setOptions] = useState<OptionField[]>([]);

  const [groupForEdit] = useState({
    min: group?.min || 0,
    name: group?.name || "",
    available: group?.available ?? true,
    stock: group?.stock || null,
    sold: group?.sold || 0,
    order: group?.order || 0,
    options: [] as OptionField[],
  });

  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch();
    }
    setItemIdForUpdate(undefined);
  };

  const generateOptions = () => {
    console.log("=== GENERATING OPTIONS ===");
    console.log("Option count:", optionCount);

    if (optionCount > 0) {
      const newOptions: OptionField[] = Array.from(
        { length: optionCount },
        (_, index) => ({
          name: "",
          price: 0,
          available: true,
          isDefault: index === 0, // First option is default by default
        })
      );

      console.log("Generated options:", newOptions);
      setOptions(newOptions);
      formik.setFieldValue("options", newOptions);
      console.log("Options set in form and state");
    } else {
      console.log("Option count is 0 or less, not generating options");
    }
  };

  const updateOption = (
    index: number,
    field: keyof OptionField,
    value: any
  ) => {
    console.log(`=== UPDATING OPTION ${index} ===`);
    console.log(`Field: ${field}, Value:`, value);

    const updatedOptions = [...options];

    // If setting as default, ensure only one option is default
    if (field === "isDefault" && value === true) {
      updatedOptions.forEach((option, idx) => {
        option.isDefault = idx === index;
      });
    } else {
      updatedOptions[index] = { ...updatedOptions[index], [field]: value };
    }

    console.log("Updated options:", updatedOptions);
    setOptions(updatedOptions);
    formik.setFieldValue("options", updatedOptions);
    console.log("Options updated in form and state");
  };

  // Helper function to create options in parallel using Promise.all
  const createOptionsInParallel = async (
    optionsData: any[],
    groupId: string
  ) => {
    console.log(
      `Starting to create ${optionsData.length} options in parallel for group ID: ${groupId}`
    );

    // Create all option promises
    const optionPromises = optionsData.map((option, index) => {
      const optionWithGroupId = {
        name: option.name,
        price: option.price,
        available: option.available,
        isDefault: option.isDefault,
        groupId: groupId,
      };

      console.log(`Preparing option ${index + 1}/${optionsData.length}:`, optionWithGroupId);
      
      return createOption(optionWithGroupId)
        .then((createdOption) => {
          console.log(`Option ${index + 1} created successfully:`, createdOption);
          return { success: true, option: createdOption, index };
        })
        .catch((optionError) => {
          console.error(`Failed to create option ${index + 1}:`, optionError);
          return { success: false, error: optionError, index };
        });
    });

    // Execute all promises in parallel
    console.log(`Executing ${optionPromises.length} option creation requests in parallel...`);
    const results = await Promise.all(optionPromises);

    console.log("All options processed in parallel. Results:", results);
    return results;
  };

  const formik = useFormik({
    initialValues: groupForEdit,
    validationSchema: editGroupSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);

      // Debug: Log all form values
      console.log("=== FORM SUBMISSION START ===");
      console.log("Complete form values:", values);
      console.log("Options from state:", options);
      console.log("Options count:", optionCount);

      try {
        // Separate group data from options
        const { options: optionsData, ...groupData } = values as any;

        console.log("Separated group data:", groupData);
        console.log("Separated options data:", optionsData);
        console.log("Options data length:", optionsData?.length || 0);
        console.log("Group data keys:", Object.keys(groupData));
        console.log("Group data _id:", groupData._id);
        console.log("isNotEmpty check:", isNotEmpty(groupData._id));

        let groupId: string;

        // First, create or update the group
        if (isNotEmpty(groupData._id)) {
          console.log("Updating existing group:", groupData._id);
          const updatedGroup = await updateGroup(groupData._id, groupData);
          console.log("Update group response:", updatedGroup);
          groupId = updatedGroup?._id || groupData._id;
          console.log("Group updated successfully, final ID:", groupId);
        } else {
          console.log("Creating new group:", groupData);
          const createdGroup = await createGroup(groupData);
          console.log("Create group response:", createdGroup);
          groupId = createdGroup?._id || "";
          console.log("Group created successfully, final ID:", groupId);
        }

        console.log("=== GROUP ID VALIDATION ===");
        console.log("Group ID value:", groupId);
        console.log("Group ID type:", typeof groupId);
        console.log("Group ID truthy:", !!groupId);
        console.log("Group ID length:", groupId?.length || 0);

        // Validate that we have a valid group ID before proceeding
        if (!groupId || groupId === "") {
          console.error("=== GROUP ID VALIDATION FAILED ===");
          console.error("Expected a valid group ID but got:", groupId);
          throw new Error(
            `Failed to get group ID after creating/updating group. Received: ${groupId}`
          );
        }

        // Then, create each option separately with the group ID - in parallel
        if (optionsData && optionsData.length > 0 && groupId) {
          console.log("=== STARTING OPTIONS CREATION IN PARALLEL ===");
          console.log("Options to create:", optionsData);
          console.log("Group ID to use:", groupId);

          const results = await createOptionsInParallel(optionsData, groupId);

          // Check if any options failed and log summary
          const successCount = results.filter((r) => r.success).length;
          const failureCount = results.filter((r) => !r.success).length;

          console.log(
            `Options creation summary: ${successCount} succeeded, ${failureCount} failed`
          );

          if (failureCount > 0) {
            console.warn("Some options failed to create, but continuing...");
          }
        } else {
          console.log("=== NO OPTIONS TO CREATE ===");
          console.log("Conditions check:");
          console.log("- optionsData exists:", !!optionsData);
          console.log("- optionsData length:", optionsData?.length || 0);
          console.log("- groupId exists:", !!groupId);
          console.log("- groupId value:", groupId);
        }

        console.log("Form submission completed successfully");
      } catch (ex) {
        console.error(ex);
      } finally {
        setSubmitting(false);
        cancel(true);
      }
    },
  });

  return (
    <>
      <style>
        {`
          input[type="number"]::-webkit-outer-spin-button,
          input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type="number"] {
            -moz-appearance: textfield;
          }
        `}
      </style>
      <form
        id="kt_modal_add_group_form"
        className="form"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <div
          className="d-flex flex-column scroll-y me-n7 pe-7"
          id="kt_modal_add_group_scroll"
          data-kt-scroll="true"
          data-kt-scroll-activate="{default: false, lg: true}"
          data-kt-scroll-max-height="auto"
          data-kt-scroll-dependencies="#kt_modal_add_group_header"
          data-kt-scroll-wrappers="#kt_modal_add_group_scroll"
          data-kt-scroll-offset="300px"
        >
          {/* begin::Input group - Name */}
          <div className="fv-row mb-7">
            <label className="required fw-bold fs-6 mb-2">Name</label>
            <input
              placeholder="Group name"
              {...formik.getFieldProps("name")}
              type="text"
              className={clsx(
                "form-control form-control-solid mb-3 mb-lg-0",
                { "is-invalid": formik.touched.name && formik.errors.name },
                { "is-valid": formik.touched.name && !formik.errors.name }
              )}
              autoComplete="off"
              disabled={formik.isSubmitting || isGroupLoading}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert">{formik.errors.name}</span>
                </div>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group - Min */}
          <div className="fv-row mb-7">
            <label className="required fw-bold fs-6 mb-2">Minimum</label>
            <input
              placeholder="Minimum quantity"
              {...formik.getFieldProps("min")}
              type="number"
              min="0"
              className={clsx(
                "form-control form-control-solid mb-3 mb-lg-0",
                { "is-invalid": formik.touched.min && formik.errors.min },
                { "is-valid": formik.touched.min && !formik.errors.min }
              )}
              disabled={formik.isSubmitting || isGroupLoading}
            />
            {formik.touched.min && formik.errors.min && (
              <div className="fv-plugins-message-container">
                <span role="alert">{formik.errors.min}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group - Stock */}
          <div className="fv-row mb-7">
            <label className="fw-bold fs-6 mb-2">Stock (optional)</label>
            <input
              placeholder="Available stock"
              {...formik.getFieldProps("stock")}
              type="number"
              min="0"
              className={clsx(
                "form-control form-control-solid mb-3 mb-lg-0",
                { "is-invalid": formik.touched.stock && formik.errors.stock },
                { "is-valid": formik.touched.stock && !formik.errors.stock }
              )}
              disabled={formik.isSubmitting || isGroupLoading}
            />
            {formik.touched.stock && formik.errors.stock && (
              <div className="fv-plugins-message-container">
                <span role="alert">{formik.errors.stock}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group - Order */}
          <div className="fv-row mb-7">
            <label className="required fw-bold fs-6 mb-2">Order</label>
            <input
              placeholder="Display order"
              {...formik.getFieldProps("order")}
              type="number"
              min="0"
              className={clsx(
                "form-control form-control-solid mb-3 mb-lg-0",
                { "is-invalid": formik.touched.order && formik.errors.order },
                { "is-valid": formik.touched.order && !formik.errors.order }
              )}
              disabled={formik.isSubmitting || isGroupLoading}
            />
            {formik.touched.order && formik.errors.order && (
              <div className="fv-plugins-message-container">
                <span role="alert">{formik.errors.order}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group - Available */}
          <div className="fv-row mb-7">
            <label className="required fw-bold fs-6 mb-2 me-3">Available</label>
            <div className="form-check form-check-custom form-check-solid">
              <input
                {...formik.getFieldProps("available")}
                className="form-check-input"
                type="checkbox"
                checked={formik.values.available}
                onChange={(e) =>
                  formik.setFieldValue("available", e.target.checked)
                }
                disabled={formik.isSubmitting || isGroupLoading}
              />
              <label className="form-check-label">
                {formik.values.available ? "Yes" : "No"}
              </label>
            </div>
            {formik.touched.available && formik.errors.available && (
              <div className="fv-plugins-message-container">
                <span role="alert">{formik.errors.available}</span>
              </div>
            )}
          </div>
          {/* end::Input group */}

          {/* begin::Input group - Option Count */}
          <div className="fv-row mb-7">
            <label className="fw-bold fs-6 mb-2">Number of Options</label>
            <div className="d-flex align-items-center">
              <input
                placeholder="Enter number of options"
                value={optionCount}
                onChange={(e) => setOptionCount(Number(e.target.value) || 0)}
                type="number"
                min="0"
                max="20"
                className="form-control form-control-solid me-3"
                style={{ maxWidth: "200px" }}
                disabled={formik.isSubmitting || isGroupLoading}
              />
              <button
                type="button"
                onClick={generateOptions}
                className="btn btn-secondary"
                disabled={
                  formik.isSubmitting || isGroupLoading || optionCount <= 0
                }
              >
                Add
              </button>
            </div>
          </div>
          {/* end::Input group */}

          {/* begin::Options Fields */}
          {options.length > 0 && (
            <div className="fv-row mb-7">
              <label className="fw-bold fs-6 mb-4">Options</label>
              {options.map((option, index) => (
                <div
                  key={index}
                  className="border border-gray-300 rounded p-4 mb-3"
                >
                  <h6 className="fw-bold mb-3">Option {index + 1}</h6>

                  {/* Option Name */}
                  <div className="fv-row mb-3">
                    <label className="required fw-bold fs-7 mb-2">Name</label>
                    <input
                      placeholder="Option name"
                      value={option.name}
                      onChange={(e) =>
                        updateOption(index, "name", e.target.value)
                      }
                      type="text"
                      className={clsx("form-control form-control-solid", {
                        "is-invalid":
                          formik.touched.options?.[index]?.name &&
                          formik.errors.options?.[index] &&
                          typeof formik.errors.options[index] === "object" &&
                          (formik.errors.options[index] as any)?.name,
                      })}
                      disabled={formik.isSubmitting || isGroupLoading}
                    />
                    {formik.touched.options?.[index]?.name &&
                      formik.errors.options?.[index] &&
                      typeof formik.errors.options[index] === "object" &&
                      (formik.errors.options[index] as any)?.name && (
                        <div className="fv-plugins-message-container">
                          <span role="alert">
                            {(formik.errors.options[index] as any).name}
                          </span>
                        </div>
                      )}
                  </div>

                  {/* Option Price */}
                  <div className="fv-row mb-3">
                    <label className="required fw-bold fs-7 mb-2">Price</label>
                    <input
                      placeholder="Option price"
                      value={option.price}
                      onChange={(e) =>
                        updateOption(
                          index,
                          "price",
                          Number(e.target.value) || 0
                        )
                      }
                      type="number"
                      min="0"
                      step="0.01"
                      className={clsx("form-control form-control-solid", {
                        "is-invalid":
                          formik.touched.options?.[index]?.price &&
                          formik.errors.options?.[index] &&
                          typeof formik.errors.options[index] === "object" &&
                          (formik.errors.options[index] as any)?.price,
                      })}
                      style={{
                        WebkitAppearance: "textfield",
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                      disabled={formik.isSubmitting || isGroupLoading}
                    />
                    {formik.touched.options?.[index]?.price &&
                      formik.errors.options?.[index] &&
                      typeof formik.errors.options[index] === "object" &&
                      (formik.errors.options[index] as any)?.price && (
                        <div className="fv-plugins-message-container">
                          <span role="alert">
                            {(formik.errors.options[index] as any).price}
                          </span>
                        </div>
                      )}
                  </div>

                  {/* Option Availability */}
                  <div className="fv-row mb-3">
                    <div className="form-check form-check-custom form-check-solid">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={option.available}
                        onChange={(e) =>
                          updateOption(index, "available", e.target.checked)
                        }
                        disabled={formik.isSubmitting || isGroupLoading}
                      />
                      <label className="form-check-label fw-bold fs-7">
                        Available
                      </label>
                    </div>
                  </div>

                  {/* Default Option */}
                  <div className="fv-row">
                    <div className="form-check form-check-custom form-check-solid">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="defaultOption"
                        checked={option.isDefault}
                        onChange={(e) =>
                          updateOption(index, "isDefault", e.target.checked)
                        }
                        disabled={formik.isSubmitting || isGroupLoading}
                      />
                      <label className="form-check-label fw-bold fs-7">
                        Set as Default
                      </label>
                    </div>
                  </div>
                </div>
              ))}
              {formik.errors.options &&
                typeof formik.errors.options === "string" && (
                  <div className="fv-plugins-message-container">
                    <span role="alert">{formik.errors.options}</span>
                  </div>
                )}
            </div>
          )}
          {/* end::Options Fields */}

          {/* begin::Actions */}
          <div className="text-center pt-15">
            <button
              type="button"
              onClick={() => cancel()}
              className="btn btn-light me-3"
              disabled={formik.isSubmitting || isGroupLoading}
            >
              Discard
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={
                isGroupLoading || formik.isSubmitting || !formik.isValid
              }
            >
              <span className="indicator-label">Submit</span>
              {(formik.isSubmitting || isGroupLoading) && (
                <span className="indicator-progress">
                  Please wait...{" "}
                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              )}
            </button>
          </div>
          {/* end::Actions */}
        </div>
      </form>
      {(formik.isSubmitting || isGroupLoading) && <UsersListLoading />}
    </>
  );
};

export { GroupEditModalForm };
