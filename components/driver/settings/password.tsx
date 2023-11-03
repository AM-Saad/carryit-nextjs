import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikInput from "@/components/shared/FormikInput";
import Button from "@/components/shared/ui/Button";
import { useRouter } from "next/router";
import { sharedRepository } from "@/lib/repositries/driver";
import Response, { Status } from "@/shared/modals/Response";
import { toast } from "react-toastify";
import withAuth from "@/components/shared/auth";
import Driver from "@/modals/Driver";

const PasswordForm: React.FC<{ driver: Driver }> = ({ driver }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const initialValues = {
    current: "",
    new: "",
    confirm: "",
  };

  const validationSchema = Yup.object({
    current: Yup.string()
      .required("Required")
      .oneOf([driver.password], "Password is incorrect"),
    new: Yup.string().required("Password is required"),
    confirm: Yup.string()
      .required("Required")
      .oneOf([Yup.ref("new")], "Passwords must match"),
  });

  const onSubmit = async (values: any) => {
    setLoading(true);
    const response: Response<any> =
      await sharedRepository.update_partial_driver({
        values: [{ password: values.new }],
      });

    setLoading(false);
    if (response.status === Status.SUCCESS) {
        router.reload()

      return toast.success(response.message);
    }
    toast.error(response.message);
  };

  return (
    <div className="form-body">
      <h2 className="text-sm font-bold"> Change Password </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, isValid }) => (
          <Form>
            <FormikInput
              label="Current Password"
              name="current"
              type="password"
              error={errors.current}
              touched={touched.current}
            />
            <FormikInput
              label="New Password"
              name="new"
              type="password"
              error={errors.new}
              touched={touched.new}
            />
            <FormikInput
              label="Confirm Password"
              name="confirm"
              type="password"
              error={errors.confirm}
              touched={touched.confirm}
            />

            <Button
              title="Save"
              style="bg-theme text-white"
              type="submit"
              onClick={() => {}}
              loading={loading}
              disabled={loading || !isValid}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default withAuth(PasswordForm);
