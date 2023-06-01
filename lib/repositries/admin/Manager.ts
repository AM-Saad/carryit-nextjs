import { fetcher } from "@/lib/utils";
import Response, { Status } from "@/shared/modals/Response";

import { MANAGERS_ROUTE } from '@/lib/constants'
import Branch from "@/modals/Branch";
export default class DriverRepository {
    constructor() {

    }
    getToken = () => {
        return window.localStorage.getItem('uidjwt')
        
    }
    fetch_managers: () => Promise<Response<any>> = async () => {
        try {
            const response = await fetcher(`${MANAGERS_ROUTE}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${this.getToken()}`,
                    "Content-Type": "application/json"
                }
            });
            return response

        } catch (error: any) {
            return {
                message: error.message,
                status: Status.UNEXPECTED_ERROR,
                items: []
            }

        }
    }
    fetch_manager: (id: string) => Promise<Response<any>> = async (id) => {
        try {
            const response = await fetcher(`${MANAGERS_ROUTE}/${id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${this.getToken()}`,
                    "Content-Type": "application/json"
                }

            }
            );
            return response

        } catch (error: any) {
            return {
                message: error.message,
                status: Status.UNEXPECTED_ERROR,
                items: []
            }

        }
    }

        create_manager: (data: string) => Promise<Response<any>> = async (data: string) => {

        try {
            const response:Response<any> = await fetcher(`${MANAGERS_ROUTE}/create`, {
                method: 'POST',
                body: JSON.stringify({ values: data }),
                headers: {
                    Authorization: `Bearer ${this.getToken()}`,
                    "Content-Type": "application/json"
                }
            });
            return response

        } catch (error: any) {
            return {
                message: error.message,
                status: Status.UNEXPECTED_ERROR,
                items: []
            }

        }
    }
    update_partial_manager: (id: string, data: any) => Promise<Response<any>> = async (id, data) => {
        try {
            const response = await fetcher(`${MANAGERS_ROUTE}/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(data),
                headers: {
                    Authorization: `Bearer ${this.getToken()}`,
                    "Content-Type": "application/json"
                }
            });

            return response
        } catch (error: any) {
            return {
                message: error.message, status: Status.UNEXPECTED_ERROR, items: []
            }

        }
    }

    delete_manager: (id: string) => Promise<Response<any>> = async (id) => {
        try {
            const response = await fetcher(`${MANAGERS_ROUTE}/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${this.getToken()}`,
                    "Content-Type": "application/json"
                }
            });

            return response
        } catch (error: any) {
            return {
                message: error.message, status: Status.UNEXPECTED_ERROR, items: []
            }

        }
    }





}