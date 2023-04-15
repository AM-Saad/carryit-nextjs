import { Field, ErrorMessage } from 'formik';

const FormikInput = ({ label, name, ...rest }: any) => {
    return (
        <div className='my-2'>
            <label htmlFor={name} className='block font-medium text-xs text-gray-700 mb-1'>{label}</label>
            <Field id={name} name={name} {...rest} className="p-2 rounded-lg border mt-1 outline-none w-full text-xs"/>
            <ErrorMessage name={name} className='text-red-500 text-xs mt-px text-left' />
        </div>
    );
};

export default FormikInput;