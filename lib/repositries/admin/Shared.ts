import { fetcher } from "@/lib/utils";
import Response, { Status } from "@/shared/modals/Response";
import { useState } from 'react';



export default class SharedRepository {
    constructor() {

    }
    getToken = () => {
        return window.localStorage.getItem('uidjwt')

    }

    login: (email: string) => Promise<Response<any>> = async (email) => {
        try {
            const response = await fetcher(`/api/admin/login`, {
                method: "POST",
                body: JSON.stringify({
                    values: {
                        email: email,
                    }
                }),
            })
            return response
        } catch (error: any) {
            return {
                message: error.message, state: Status.UNEXPECTED_ERROR, items: []
            }

        }
    }
    fetch_admin: () => Promise<Response<any>> = async () => {
        try {
            const response = await fetcher(`/api/admin/`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${this.getToken()}`,
                    "Content-Type": "application/json"
                }
            }
            );
            return response
        } catch (error: any) {
            return {
                message: error.message, state: Status.UNEXPECTED_ERROR, items: []
            }

        }
    }
    create_admin: (email: string, name: string) => Promise<Response<any>> = async (email, name) => {
        try {

            const response = await fetcher(`/api/admin/register`, {
                method: "POST",
                body: JSON.stringify({
                    values: {
                        email: email,
                        name: name,
                    }
                }),
            });
            return response
        } catch (error: any) {
            return {
                message: error.message, state: Status.UNEXPECTED_ERROR, items: []
            }
        }

    }

    login_admin: (email: string,) => Promise<Response<any>> = async (email) => {

        try {
            const response = await fetcher(`/api/admin/login`, {
                method: "POST",
                body: JSON.stringify({
                    values: {
                        email: email,
                    }
                }),
            });
            return response
        } catch (error: any) {
            return {
                message: error.message, state: Status.UNEXPECTED_ERROR, items: []
            }
        }

    }

    update_documents: (id: string, tag: string, type: string, files: any) => Promise<Response<any>> = async (id, tag, type, files) => {
        const form = new FormData()
        for (const img of files) {
            form.append('images', img.image)
        }
        try {
            const response = await fetcher(`/api/admin/documents/${id}?type=${type}&&tag=${tag}`, {
                method: 'POST',
                body: form,
                headers: {
                    Authorization: `Bearer ${this.getToken()}`,
                }

            });

            return response
        } catch (error: any) {
            return {
                message: error.message, status: Status.UNEXPECTED_ERROR, items: []
            }

        }
    }
    delete_document: (id: string, tag: string, type: string, imageId: string) => Promise<Response<any>> = async (id, tag, type, imageId) => {
        try {
            const response = await fetcher(`/api/admin/documents/${id}?type=${type}&&tag=${tag}&&imageId=${imageId}`, {
                method: 'POST',
                body: JSON.stringify({ imageId }),
                headers: {
                    Authorization: `Bearer ${this.getToken()}`,
                    "Content-Type": "application/json"
                }
            });

            return response
        } catch (error: any) {
            return {
                message: error.message, state: Status.UNEXPECTED_ERROR, items: []
            }

        }
    }

    fetch_company: () => Promise<Response<any>> = async () => {
        try {
            const response = await fetcher(`/api/admin/company`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${this.getToken()}`,
                    "Content-Type": "application/json"
                }
            }
            );
            return response
        } catch (error: any) {
            return {
                message: error.message, state: Status.UNEXPECTED_ERROR, items: []
            }

        }
    }
    update_partial_admin: (values: any) => Promise<Response<any>> = async (values) => {
        try {
            const response = await fetcher(`/api/admin`, {
                method: "PATCH",
                body: JSON.stringify(values),
                headers: {
                    Authorization: `Bearer ${this.getToken()}`,
                    "Content-Type": "application/json"
                }
            }
            );
            return response
        } catch (error: any) {
            return {
                message: error.message, state: Status.UNEXPECTED_ERROR, items: []
            }

        }
    }
    update_partial_company: (values: any) => Promise<Response<any>> = async (values) => {
        try {
            const response = await fetcher(`/api/admin/company`, {
                method: "PATCH",
                body: JSON.stringify(values),
                headers: {
                    Authorization: `Bearer ${this.getToken()}`,
                    "Content-Type": "application/json"
                }
            }
            );
            return response
        } catch (error: any) {
            return {
                message: error.message, state: Status.UNEXPECTED_ERROR, items: []
            }

        }
    }



}