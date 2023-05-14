import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Layout from '@/components/layout'
import FormikInput from '@/components/shared/FormikInput';
import Button from '@/components/shared/Button';
import { useRouter } from 'next/router';
import { branchRepository } from '@/lib/repositries/admin'
import Response, { Status } from '@/shared/modals/Response';
import { toast } from 'react-toastify';
import { INTERNAL_DRIVERS_ROUTE } from '@/lib/constants';
import Branch from '@/modals/Branch';


const BranchForm = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()

    const initialValues = {
        name: '',
        address: '',
        phone: '',
        city: '',
        governorate: '',
        state: '',
        drivers: [],
        notes: '',
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Required'),
        address: Yup.string().required('Required'),
        phone: Yup.string().required('Required'),
        city: Yup.string().required('Required'),
        governorate: Yup.string().required('Required'),
        state: Yup.string().required('Required'),
        notes: Yup.string().required('Required'),

    });

    const onSubmit = async (values: any) => {
        setLoading(true);
        const response:Response<Branch> = await branchRepository.create_branch(values)
        setLoading(false);
        if (response.status === Status.SUCCESS) {
            // return router.push(`${INTERNAL_DRIVERS_ROUTE}/${response.items?.id}`)
        }
        toast.error(response.message)

    };

    return (
        <Layout>

            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                {({ errors, touched }) => (
                    <Form>
                        <FormikInput label="Name" name="name" />
                        <FormikInput label="Address" name="address" />
                        <FormikInput label="City" name="city" />
                        <FormikInput label="Governorate" name="governorate" />
                        <FormikInput label="State" name="state" />
                        <FormikInput label="Notes" name="notes" />
                        <FormikInput label="Phone" name="phone" />


                        <Button
                            title='Create'
                            style='bg-theme text-white'
                            type='submit'
                            onClick={() => { }}
                            loading={loading}
                            disabled={loading} />
                    </Form>
                )}
            </Formik>
        </Layout>
    );
};

export default BranchForm;