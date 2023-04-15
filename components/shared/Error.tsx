import { Status, Error, getErrorStatusColor } from 'shared/models/Response';

import { ExclamationTriangleIcon, InfoCircledIcon } from '@radix-ui/react-icons'
import Button from './Button';





interface Props {
    reload: () => void;
    error?: Error
}
const FetchError: React.FC<Props> = ({ reload, error }) => {

    const color = getErrorStatusColor(error?.code || Status.DATA_NOT_FOUND);


    return (
        <>
            <div role='alert' className='bg-gray-50 gap-2 grid justify-start p-4 rounded-lg shadow-md'>
                {error && <p
                    style={{ color: color }}
                    className='mb-2 font-bold text-center text-lg flex items-center gap-2'

                >{error?.code.replaceAll('_', ' ')} {' '}
                    {color === 'red' && <ExclamationTriangleIcon />}
                    {color === 'orange' && <InfoCircledIcon />}
                </p>}
                <p className='mb-2 text-gray-500 font-light capitalize text-sm'>{error?.message}</p>

                <Button 
                    onClick={reload}

                    title='Reload'
                    style='bg-gray-400 hover:opacity-70 text-white'
                    loading={false}
                    disabled={false}    
                />
            </div>
        </>
    )
}

export default FetchError