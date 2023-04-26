import useLocalStorage from "../hooks/use-local-storage";
import { fetcher } from "../utils";
import Response, { Status } from "@/shared/modals/Response";
import { useState } from 'react';



export default class SharedRepository {
    constructor() {

    }
    getToken = () => {
        return window.localStorage.getItem('uidjwt')
        
    }

    login: (email: string) => Promise<Response> = async (email) => {
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
    fetch_admin: () => Promise<Response> = async () => {
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
    create_admin: (email: string, name: string) => Promise<Response> = async (email, name) => {
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

    login_admin: (email: string,) => Promise<Response> = async (email) => {

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

    update_documents: (id: string, tag: string, type: string, files: any) => Promise<Response> = async (id, tag, type, files) => {
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
    delete_document: (id: string, tag: string, type: string, imageId: string) => Promise<Response> = async (id, tag, type, imageId) => {
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



}