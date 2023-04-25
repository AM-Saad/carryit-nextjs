import React from 'react'

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
                <button onClick={cancel} disabled={loading} className=' py-2 px-4 text-sm bg-gray-400 rounded hover:opacity-70 text-white' > Cancel </button>
                <button onClick={onConfirmDelete} disabled={loading} className=' py-2 px-4 text-sm bg-red-400 rounded hover:opacity-70 text-white' > {loading ? 'Delete..' : 'Delete'} </button>
            </div>

        </div>
    )
}

export default confirmDeleteItem