import { fetcher } from "../utils";
import Response, { Status } from "shared/models/Response";


export default class SharedRepository {
    constructor() {

    }


    update_documents: (id: string, tag: string, type: string, files: any) => Promise<Response> = async (id, tag, type, files) => {
        const form = new FormData()
        for (const img of files) {
            form.append('images', img.image)
        }
        try {
            const response = await fetcher(`/api/admin/documents/${id}?type=${type}&&tag=${tag}`, {
                method: 'POST',
                body: form,

            });

            return response
        } catch (error: any) {
            return {
                message: error.message, status: Status.UNEXPECTED_ERROR, items: []
            }

        }
    }
    delete_document: (id: string, tag: string, type: string, imageId: string) => Promise<Response> = async (id, tag, type, imageId) => {
        try {
            const response = await fetcher(`/api/admin/documents/${id}?type=${type}&&tag=${tag}&&imageId=${imageId}`, {
                method: 'POST',
                body: JSON.stringify({ imageId }),
            });

            return response
        } catch (error: any) {
            return {
                message: error.message, state: Status.UNEXPECTED_ERROR, items: []
            }

        }
    }



}