import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Layout from '@/components/layout'
import FormikInput from '@/components/shared/FormikInput';
import Button from '@/components/shared/Button';
import { useRouter } from 'next/router';
import { managerRepository } from '@/lib/repositries/admin'
import Response, { Status } from '@/shared/modals/Response';
import { toast } from 'react-toastify';
import Branch from '@/modals/Branch';
import { INTERNAL_MANAGERS_ROUTE } from '@/lib/constants';

import withAuth from '@/components/shared/auth';

const ManagerForm = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()

    const initialValues = {
        name: '',
        mobile: '',
        notes: '',
        email: '',

    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Required'),
        notes: Yup.string(),
        mobile: Yup.string().required('Required'),
        email: Yup.string(),
    });

    const onSubmit = async (values: any) => {
        setLoading(true);
        const response: Response<any> = await managerRepository.create_manager(values)
        setLoading(false);
        if (response.status === Status.SUCCESS) {
            router.push(`${INTERNAL_MANAGERS_ROUTE}/${response.items?.id}`)
            return
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
                            <FormikInput label="Mobile" name="mobile" />

                            <FormikInput label="Email" name="email" />
                            <FormikInput label="Notes" name="notes" />



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

export default withAuth(ManagerForm)