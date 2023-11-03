import React from 'react'
import { Formik } from "formik";
import * as Yup from "yup";
import Input from '@/components/shared/ui/Input';
import Button from '@/components/shared/ui/Button';
interface Props {
    onSubmit: (phone: string, password: string) => void;
    loading?: boolean,
    error?: null | string
}

const validationScheme = Yup.object({
    phone: Yup.string()
        .required("Phone Number is required"),
    password: Yup.string()
        .required("Password est requise"),

})
const LoginForm: React.FC<Props> = ({ onSubmit, loading, error }) => {
    const submit = (values: { phone: string; password: string }) => {
        onSubmit(values.phone, values.password)
    }
    return (
        <>
            <Formik
                validationSchema={validationScheme}

                initialValues={{ phone: '', password: '' }}
                onSubmit={(values) => submit(values)}

            >
                {({ handleChange, handleBlur, handleSubmit, submitForm, values, errors, touched }) => {

                    return (
                        <form onSubmit={handleSubmit} className='w-full'>
                            <Input
                                label="Phone Number"
                                id="phone"
                                placeholder="Enter your phone number"
                                onChange={handleChange('phone')}
                                value={values.phone}
                                handleBlur={handleBlur('phone')}
                                hasError={errors.phone && touched.phone}
                                error={errors.phone}
                                type='tel'
                            />

                            <Input
                                label="Password"
                                id="password"
                                placeholder="Enter your password"
                                onChange={handleChange('password')}
                                value={values.password}
                                handleBlur={handleBlur('password')}
                                hasError={errors.password && touched.password}
                                error={errors.password}
                                type="password"
                            />
                            {error && <p className='text-red-500 text-xs mt-2'>{error}</p>}
                            <div className='flex items-center mt-2 gap-3 w-full text-xs'>
                                <p>You dont have an account yet!</p>
                                <a href='/client/register' className='text-blue-600 underline font-bold'> Register </a>
                            </div>
                            <div className='flex justify-end w-full'>

                                <Button onClick={submitForm} title='Submit' type='submit' loading={loading} />
                            </div>

                        </form>
                    )
                }}
            </Formik>

        </>
    )
}


export default LoginForm