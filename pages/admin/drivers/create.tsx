import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Layout from '@/components/layout'
import FormikInput from '@/components/shared/FormikInput';
import Button from '@/components/shared/ui/Button';
import { useRouter } from 'next/router';
import { driverRepository } from '@/lib/repositries/admin'
import { Status } from '@/shared/modals/Response';
import { toast } from 'react-toastify';
import { INTERNAL_DRIVERS_ROUTE } from '@/lib/constants';
import withAuth from '@/components/shared/auth';


const DriverForm = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()

    const initialValues = {
        id: '',
        address: '',
        commission: [],
        image: '',
        mobile: '',
        name: '',
        password: '',
        salary: { base_salary: 0, commission: 0 },
        packages: [],
        vehicle: null,
        documents: []
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Required'),
        mobile: Yup.string().required('Required'),
        address: Yup.string().required('Required'),
        password: Yup.string().required('Required'),
        salary: Yup.object().shape({
            base_salary: Yup.number().required('Required'),
            commission: Yup.number().required('Required')
        })
    });

    const onSubmit = async (values: any) => {
        setLoading(true);
        const response = await driverRepository.create_driver(values)
        setLoading(false);
        if (response.status === Status.SUCCESS) {
            return router.push(`${INTERNAL_DRIVERS_ROUTE}/${response.items.id}`)
        }
        toast.error(response.message)

    };

    return (
        <Layout
            meta={{
                title: 'Create Driver | Admin',
                description: 'Create Driver',
            }}
        >
            <div className='form-body'>
                <h1 className='form-title'>Create Driver</h1>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
                    {({ errors, touched }) => (
                        <Form>
                            <FormikInput label="Name" name="name" />
                            <FormikInput label="Mobile" name="mobile" />
                            <FormikInput label="Address" name="address" />
                            <FormikInput label="Password" name="password" type="password" />
                            <FormikInput label="Base Salary" name="salary.base_salary" type="number" />
                            <FormikInput label="Commission" name="salary.commission" type="number" />

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

export default withAuth(DriverForm)