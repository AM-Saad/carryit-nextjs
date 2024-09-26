import { Field, ErrorMessage } from 'formik';

const FormikInput = ({ label, name, ...rest }: any) => {
    console.log({...rest})
    return (
        <div className='my-2'>
            <label htmlFor={name} className='block font-medium text-xs text-gray-700 dark:text-gray-300 mb-1'>{label}</label>
            <Field id={name} name={name} {...rest} className="p-2 rounded-lg border mt-1 outline-none w-full text-xs border-black" />
            <ErrorMessage
                name={name}
                children={(msg: string) => <div className='text-red-500 text-xs mt-px text-left'>{msg}</div> }
            />
        </div>
    );
};

export default FormikInput;