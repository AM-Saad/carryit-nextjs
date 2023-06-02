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
import { INTERNAL_BRANCHES_ROUTE } from '@/lib/constants';
import withAuth from '@/components/shared/auth';


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
        address: Yup.string(),
        phone: Yup.string(),
        city: Yup.string(),
        governorate: Yup.string(),
        state: Yup.string(),
        notes: Yup.string(),

    });

    const onSubmit = async (values: any) => {
        setLoading(true);
        const response: Response<any> = await branchRepository.create_branch(values)
        setLoading(false);
        if (response.status === Status.SUCCESS) {
            router.push(`${INTERNAL_BRANCHES_ROUTE}/${response.items?.id}`)
            return toast.success(response.message)
        }
        toast.error(response.message)

    };

    return (
        <Layout>
            <div className='form-body'>

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
            </div>

        </Layout>
    );
};

export default withAuth(BranchForm)