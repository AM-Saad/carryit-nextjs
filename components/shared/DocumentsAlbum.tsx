// Description: This component is responsible for displaying the images of any image and deleting them


import React from 'react'
import { TrashIcon } from '@radix-ui/react-icons'
import { FaceIcon, ImageIcon, FileIcon } from '@radix-ui/react-icons'
import { truncate } from '@/lib/utils'


interface Props {
  docs: any[],
  onDelete: (id: string, isNew: boolean) => void
}
const DocumentsAlbum: React.FC<Props> = ({ onDelete, docs }) => {
  const deleteImageHandler = (id: string, isNew: boolean) => {
    onDelete(id, isNew!)
  }

  return (
    <div className=' max-w-full overflow-scroll w-full  py-2 rounded'>
      {docs.map((doc, index) =>
        <div key={index} className="w-full flex items-center justify-between gap-2 h-10 my-2 overflow-hidden rounded-full relative shadow bg-white p-2" style={{ aspectRatio: '1' }}>
          <div className='flex items-center gap-2'>
            <div>
              {doc.type === 'image' && <ImageIcon className='text-theme h-5 w-5' aria-hidden="true" />}
              {doc.type != 'image' && <FileIcon className='text-theme h-5 w-5' aria-hidden="true" />}
            </div>
            <a href={doc.id} className='text-xs'>{truncate(doc.name, 35)}</a>
          </div>
          <div
            onClick={() => deleteImageHandler(doc.id, doc.isNew)}
            className='h-8 w-8 bg-gray-50 relative rounded-full flex items-center justify-center shadow  cursor-pointer'>
            <TrashIcon className=' text-red-500 hover:text-red-300' aria-hidden="true" />
          </div>
        </div>)}
    </div>
  )
}

export default DocumentsAlbum