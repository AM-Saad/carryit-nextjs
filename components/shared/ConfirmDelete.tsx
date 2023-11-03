import React from 'react'
import Button from '@/components/shared/ui/Button'

interface Props {
    label: string,
    message?: string,
    onConfirmDelete: () => void,
    cancel: () => void,
    loading?: boolean

}
const confirmDeleteItem: React.FC<Props> = ({ label, message, onConfirmDelete, cancel, loading }) => {
    return (

        <div className="gap-2 grid text-center">
            <h2 className='font-bold '>Are you sure you want to delete this {label}?</h2>
            {message && <p className='mb-3 text-gray-500'>{message}</p>}
            {!message && <p className='mb-3 text-gray-500'>By deleting it you will never be able to undo it.</p>}
            <div className='flex items-center justify-around'>
                <Button onClick={cancel} title='Cancel' style='bg-gray-400 text-white' loading={loading} disabled={loading} />

                <Button onClick={onConfirmDelete} title='Delete' style='bg-red-500 text-white' loading={loading} disabled={loading} />
            </div>

        </div>
    )
}

export default confirmDeleteItem