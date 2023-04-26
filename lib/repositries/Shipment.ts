import { fetcher } from "../utils";
import Response, { Status } from "@/shared/modals/Response";
import { SHIPMENTS_ROUTE } from '@/lib/constants'
import useLocalStorage from "../hooks/use-local-storage";

export default class ShipmentRepository {
    constructor() {

    }
    getToken = () => {
        return window.localStorage.getItem('uidjwt')

    }

    fetch_shipments: () => Promise<Response> = async () => {

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
    fetch_shipment: (id: string) => Promise<Response> = async (id) => {
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
    update_partial_shipment: (id: string, data: any) => Promise<Response> = async (id, data) => {
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

    create_shipment: (data: any) => Promise<Response> = async (data) => {
        try {
            const response = await fetcher(`${SHIPMENTS_ROUTE}/create`, {
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

    delete_shipment: (id: string) => Promise<Response> = async (id) => {

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

    assign_shipment: (id: string, driverId: string) => Promise<Response> = async (id, driverId) => {
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
    


}