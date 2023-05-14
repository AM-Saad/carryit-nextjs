import { fetcher } from "@/lib/utils";
import Response, { Status } from "@/shared/modals/Response";

import { BRANCHES_ROUTE } from '@/lib/constants'
import Branch from "@/modals/Branch";
export default class DriverRepository {
    constructor() {

    }
    getToken = () => {
        return window.localStorage.getItem('uidjwt')
        
    }
    fetch_branches: () => Promise<Response<any>> = async () => {
        try {
            const response = await fetcher(BRANCHES_ROUTE, {
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
    fetch_branch: (id: string) => Promise<Response<any>> = async (id) => {
        try {
            const response = await fetcher(`${BRANCHES_ROUTE}/${id}`, {
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

        create_branch: (data: string) => Promise<Response<Branch>> = async (data: string) => {

        try {
            const response:Response<Branch> = await fetcher(`${BRANCHES_ROUTE}/create`, {
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
    update_partial_branch: (id: string, data: any) => Promise<Response<any>> = async (id, data) => {
        try {
            const response = await fetcher(`${BRANCHES_ROUTE}/${id}`, {
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

    delete_branch: (id: string) => Promise<Response<any>> = async (id) => {
        try {
            const response = await fetcher(`${BRANCHES_ROUTE}/${id}`, {
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



    update_drivers: (id: string, drivers: string[]) => Promise<Response<any>> = async (id, drivers) => {
        try {
            const response = await fetcher(`${BRANCHES_ROUTE}/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ drivers }),
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




}