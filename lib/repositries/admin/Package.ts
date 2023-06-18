import { fetcher } from "@/lib/utils";
import Response, { Status } from "@/shared/modals/Response";
import { SHIPMENTS_ROUTE } from '@/lib/constants'
import { Package } from "@/modals/Package";

export default class PackageRepository {
    constructor() {

    }
    getToken = () => {
        return window.localStorage.getItem('uidjwt')

    }

    fetch_packages: () => Promise<Response<Package[]>> = async () => {

        try {
            const response = await fetcher(SHIPMENTS_ROUTE, {
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
    fetch_package: (id: string) => Promise<Response<Package>> = async (id) => {
        try {
            const response = await fetcher(`${SHIPMENTS_ROUTE}/${id}`, {
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
    update_partial_package: (id: string, data: any) => Promise<Response<Package>> = async (id, data) => {
        try {
            const response = await fetcher(`${SHIPMENTS_ROUTE}/${id}`, {
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
                message: error.message,
                status: Status.UNEXPECTED_ERROR,
                items: []
            }

        }
    }

    create_package: (data: any) => Promise<Response<Package>> = async (data) => {
        try {
            const response:Response<Package> = await fetcher(`${SHIPMENTS_ROUTE}/create`, {
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

    delete_package: (id: string) => Promise<Response<any>> = async (id) => {

        try {
            const response = await fetcher(`${SHIPMENTS_ROUTE}/${id}`, {
                method: 'DELETE',
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

    assign_package: (id: string, driverId: string) => Promise<Response<Package>> = async (id, driverId) => {
        try {
            const response = await fetcher(`${SHIPMENTS_ROUTE}/assign/${id}?driverId=${driverId}`, {
                method: 'PUT',
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



    change_status: (id: string, status: number, canceled: any) => Promise<Response<Package>> = async (id, status, canceled) => {
        try {
            const response: Response<Package> = await fetcher(`${SHIPMENTS_ROUTE}/status/${id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${this.getToken()}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status,
                    canceled
                })
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