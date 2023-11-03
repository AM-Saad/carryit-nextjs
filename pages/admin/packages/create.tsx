import React, { use, useEffect, useState } from "react";
import { Package, PackagePayload } from "@/modals/Package";
import Layout from "@/components/layout";
import { packageRepository } from "@/lib/repositries/admin";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { INTERNAL_SHIPMENTS_ROUTE } from "@/lib/constants";
import loadable from "@loadable/component";
import PlacesAutocomplete from "@/components/shared/PlaceAutoComplete2";
import { Status } from "@/shared/modals/Response";
import withAuth from "@/components/shared/auth";
import MultiSelect from "@/components/shared/ui/MultiSelect";

const ToggleBtn = loadable(() => import("@/components/shared/ui/ToggleBtn"));
const Input = loadable(() => import("@/components/shared/ui/Input"));
const Button = loadable(() => import("@/components/shared/ui/Button"));
const FormikInput = loadable(() => import("@/components/shared/FormikInput"));

const Create: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [shippingAddress, setShippingAddress] = useState<any>(null);

  const [branches, setBranches] = useState<any>([]);
  const [branchToAssign, setBranchToAssign] = useState<any>([]);
  const router = useRouter();

  const initialValues = {
    receiver: {
      address: "",
      apartment: "",
      building: "",
      floor: "",
      name: "",
      phone: "",
      shipping_address: null,
    },
    quantity: 1,
    is_fragile: false,
    is_liquid: false,
    notes: "",
    price: 0,
    shipping_cost: 0,
    date: new Date(),
    delivery_date: new Date(),
    branchId: "",
  };

  const validationScheme = Yup.object({
    receiver: Yup.object({
      address: Yup.string(),
      apartment: Yup.string(),
      building: Yup.string().required("Building number is required"),
      floor: Yup.string().required("Floor number is required"),
      name: Yup.string().required("Name is required"),
      phone: Yup.string().required("Phone number is required"),
    }).required("All Receiver info is required"),
    quantity: Yup.number()
      .required("Quantity is required")
      .min(1, "Quantity must be at least 1"),
    is_fragile: Yup.boolean(),
    is_liquid: Yup.boolean(),
    notes: Yup.string(),
    price: Yup.number()
      .required("Price is required")
      .min(0, "Price must be positive"),
    shipping_cost: Yup.number()
      .required("Shipping cost is required")
      .min(0, "Shipping cost must be positive"),
    date: Yup.date().default(() => new Date()),
    delivery_date: Yup.date().default(() => new Date()),
    branchId: Yup.string().required("Branch is required"),
  });
  const createPackage = async (payload: PackagePayload) => {
    setLoading(true);
    const response = await packageRepository.create_package(payload);
    setLoading(false);
    if (response.status === Status.SUCCESS) {
      const item = response.items as Package;
      router.push(`${INTERNAL_SHIPMENTS_ROUTE}/${item.id}`);
      return toast.success(response.message);
    }
    toast.error(response.message);
  };

  const fetch_branches = async () => {
    const token = localStorage.getItem("uidjwt");

    const res = await fetch("/api/admin/branches", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    const branches = data.items.map((item: any) => ({
      value: item.id,
      label: item.name,
    }));

    setBranchToAssign(branches);
    setBranches(data.items);
  };

  useEffect(() => {
    fetch_branches();
  }, []);
  return (
    <Layout
      meta={{
        title: "Create Package",
        description: "Create Package",
      }}
    >
      <div className="form-body">
      <h1 className='form-title'>Create Package</h1>

        <Formik
          initialValues={initialValues}
          validationSchema={validationScheme}
          onSubmit={(values, { setSubmitting }) => {
            createPackage({
              ...values,
              receiver: {
                ...values.receiver,
                address: shippingAddress.formatted_address,
                shipping_address: shippingAddress,
              },
            });
            setSubmitting(false);
          }}
        >
          {({
            handleChange,
            handleBlur,
            submitForm,
            errors,
            touched,
            values,
          }) => {
            { console.log(errors) }
            return (
              <>
                <div className="flex items-center gap-5 lg:col-span-3">
                  <div className="flex items-center gap-2">
                    <span className=" block text-gray-600">Fragile</span>
                    <ToggleBtn
                      value={values.is_fragile}
                      onChange={(is_fragile: boolean) =>
                        handleChange({
                          target: { name: "is_fragile", value: is_fragile },
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className=" block text-gray-600">Liquid </span>
                    <ToggleBtn
                      value={values.is_liquid}
                      onChange={(is_liquid: boolean) =>
                        handleChange({
                          target: { name: "is_liquid", value: is_liquid },
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-2 mt-3 rounded-lg border px-2 pb-2">
                    <label
                      htmlFor="assigned_branch"
                      className="editable-input_label mt-2 block text-sm font-medium text-gray-600"
                    >
                      Assigned Branch{" "}
                    </label>
                    {branches.length > 0 && (
                      <MultiSelect
                        label="label"
                        multiple={false}
                        trackBy="value"
                        closeOnSelect={true}

                        input={(props: any) => {
                          touched.branchId = true;
                          handleChange({
                            target: { name: "branchId", value: props[0] ? props[0].value : '' },
                          });
                        }}
                        id="assigned_branch"
                        options={branchToAssign}
                        placeholder={"Assigned Branch"}
                        disabled={loading}
                      />
                    )}

                  </div>
                  {errors.branchId && touched.branchId && <div className='text-red-500 text-xs mt-px text-left'>{errors.branchId}</div>}
                </div>
                <div className="grid gap-3 md:grid-cols-2 items-start">

                  <div>

                    <FormikInput label="Receiver Name" name="receiver.name" />
                    <FormikInput label="Receiver Phone" name="receiver.phone" />
                    <FormikInput
                      label="Amount to be collected"
                      name="price"
                      type="number"
                    />
                    <FormikInput
                      label="Shipping Cost"
                      name="shipping_cost"
                      type="number"
                    />
                    <FormikInput label="Quantity" name="quantity" type="number" />
                  </div>

                  <div className="">
                    <div className="my-2">
                      <label
                        htmlFor={"Address"}
                        className="mb-1 block text-xs font-medium text-gray-700"
                      >
                        Address
                      </label>
                      <PlacesAutocomplete
                        setSelected={(e: any) => {
                          setShippingAddress(e);
                        }}
                      />
                    </div>
                    {/* <FormikInput label="Address" name="receiver.address" /> */}
                    <div className="grid gap-3 md:grid-cols-3">

                      <FormikInput
                        label="Building Number"
                        name="receiver.building"
                        type="number"
                      />
                      <FormikInput
                        label="Floor Number"
                        name="receiver.floor"
                        type="number"
                      />
                      <FormikInput
                        label="Apartment Number"
                        name="receiver.apartment"
                        type="number"
                      />
                    </div>

                  </div>
                </div>

                <Input
                  label="Additional Notes"
                  id="notes"
                  placeholder="Add Notes"
                  type="text"
                  onChange={handleChange("notes")}
                  value={values.notes}
                  handleBlur={handleBlur}
                  hasError={errors.notes && touched.notes}
                  error={errors.notes}
                />

                <Button
                  title="Create"
                  style="bg-theme text-white"
                  type="submit"
                  onClick={submitForm}
                  loading={loading}
                  disabled={loading}
                />
              </>
            );
          }}
        </Formik>
      </div>
    </Layout>
  );
};

export default withAuth(Create);
