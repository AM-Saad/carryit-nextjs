
// Description: This component is a container for the UploadDocumentInput and DocumentsAlbum components and is responsible for handling the images for the product


import { useState, useEffect, useId, useMemo } from 'react'
import UploadDocsInput from '@/components/shared/UploadDocsInput'
import DocumentsAlbum from '@/components/shared/DocumentsAlbum'
import { sharedRepository } from '@/lib/repositries'
import { Status } from '@/shared/models/Response'
import { toast } from 'react-toastify'
import Vehicle from '@/modals/Vehicle'
import Button from '@/components/shared/Button'

type PreviewDocs = {
    id: string
    image: any
    isNew?: boolean
    path?: string
    type?: string
    name?: string
}

const DocumentsContainer: React.FC<{ item: Vehicle | any, context: string }> = ({ item,context }) => {
    const id: string = useId();

    const [currentItem, setCurrentItem] = useState<Vehicle | any>(item)
    const [warning, setWarning] = useState<string | null>(null)
    const [docsToUpload, setDocsToUpload] = useState<PreviewDocs[]>([])
    const [previewDocs, setPreviewDocs] = useState<PreviewDocs[]>([])
    const [addNew, setAddNew] = useState(false)
    const [loading, setLoading] = useState(false)



    const selectFileHandler = (files: any): void => {


        let newFiles = [...files]
        const fileToUpload: PreviewDocs[] = []
        const fileToPreview: PreviewDocs[] = []
        let objectUrl;
        for (const img of newFiles) {
            objectUrl = URL.createObjectURL(img)
            const fileObj = {
                id: id + docsToUpload.length,
                path: id + docsToUpload.length,
                isNew: true,
                name: img.name,
                type: img.type
            }
            fileToUpload.push({ image: img, ...fileObj })
            fileToPreview.push({ image: objectUrl, ...fileObj })
        }
        setDocsToUpload([...docsToUpload, ...fileToUpload])
        setPreviewDocs([...previewDocs, ...fileToPreview])

        return setWarning(null)
    }

    const cancelUpload = () => {
        const docs = convertDocs(currentItem?.documents)
        setPreviewDocs(docs)
        setDocsToUpload([])
        setAddNew(false)
        return setWarning(null)
    }

    const deleteHandler = async (id: string, isNew: boolean) => {
        // if the file is not new then delete it from the server
        if (!isNew) {

            setLoading(true)
            const response = await sharedRepository.delete_document(currentItem?.id!, context, 'delete', id)
            setLoading(false)
            if (response.status !== Status.SUCCESS) {
                return toast.error(response.message)
            }
            const converted = convertDocs(response.items?.documents)
            setCurrentItem(response.items)
            return setPreviewDocs(converted)
        }
        // if the file is new then delete it from the state
        setDocsToUpload((prevState) => prevState.filter(i => i.id !== id))
        setPreviewDocs((prevState) => prevState.filter(i => i.id !== id))
    }

    const uploadDocuments = async () => {
        if (docsToUpload.length === 0) {
            return setWarning('No Files Selected! Please select a file')
        }
        setLoading(true)
        const response = await sharedRepository.update_documents(item.id, context, 'upload', docsToUpload)
        setLoading(false)
        if (response.status === Status.SUCCESS) {
            setDocsToUpload([])
            setAddNew(false)
            setCurrentItem(response.items)

        }
        if (response.status != Status.SUCCESS) {
            toast.error(response.message)
        }
    }


    // convert the files to the correct format for the preview
    const convertDocs = (files: any) => {
        let documents: PreviewDocs[] = []
        for (const item of files) {
            documents.push({ id: item.path, image: item.name, path: item.path, type: item.type, name: item.name })
        }
        return documents
    }

    useEffect(() => {
        const docs = convertDocs(currentItem.documents)
        if (currentItem?.documents.length === 0) {
            setAddNew(true)
        }
        setPreviewDocs(docs)
    }, [currentItem])

    useEffect(() => {
        console.log(previewDocs)
    }, [previewDocs])

    return (
        <div className='border p-2 rounded-xl bg-gray-100'>
            <h3 className='text-md font-semibold'>Documents</h3>
            {addNew &&
                <>
                    <UploadDocsInput onSelect={selectFileHandler} />
                    <div className="flex justify-end gap-2">
                        <Button
                            title='Cancel'
                            onClick={cancelUpload}
                            style='bg-gray-800 hover:bg-gray-700'
                        />
                        <Button
                            title='Upload'
                            onClick={uploadDocuments}
                            style='bg-green-500 hover:bg-green-400'
                        />

                    </div>
                </>

            }
            {warning && <p className='text-yellow-700'>{warning}</p>}


            <DocumentsAlbum docs={previewDocs} onDelete={deleteHandler} />

            <span
                onClick={() => setAddNew(true)}
                className='w-8 h-8 rounded-full bg-white block text-center border border-gray-800 cursor-pointer hover:shadow-md'
            >+</span>


        </div>
    )
}

export default DocumentsContainer