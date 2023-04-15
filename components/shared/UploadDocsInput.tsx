    import {  UploadIcon } from '@radix-ui/react-icons'

import React, { useRef, ChangeEvent } from 'react'

interface Props {
    onSelect: (value: any) => void
}

const UploadDocsInput: React.FC<Props> = ({ onSelect }) => {
    const input = useRef<HTMLInputElement>(null)

    const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            return
        }
        onSelect(e.target.files)
        input.current!.value = ''
    }

    return (
        <div
            className='border-2 border-dashed mb-7 text-center rounded-lg h-32 transition-all duration-300 ease-in-out
            text-gray-400 hover:text-gray-500 hover:border-gray-400 bg-white'
        >
            <div className='h-full w-full'>
                <label
                    className="
                    block h-full w-full relative opacity-100 cursor-pointer "
                    htmlFor="documents_input" >
                    <div className='h-full w-full m-auto p-5'>
                        <UploadIcon className='m-auto mb-2 h-6 w-6' />
                        <h3>Upload Documents</h3>
                    </div>
                    <input
                        ref={input}
                        id="documents_input"
                        type='file'
                        className='opacity-0 -mr-2 hidden'
                        onChange={onSelectFile}
                        multiple
                    />
                </label>
            </div>
        </div>
    )
}

export default UploadDocsInput