import { fetcher } from "@/lib/utils";
import Response, { Status } from "@/shared/modals/Response";
import { SHIPMENTS_ROUTE } from '@/lib/constants'
import { Shipment } from "@/modals/Shipment";

export default class ShipmentRepository {
    constructor() {

    }
    getToken = () => {
        return window.localStorage.getItem('uidjwt')

    }

    fetch_shipments: () => Promise<Response<Shipment[]>> = async () => {

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
    fetch_shipment: (id: string) => Promise<Response<Shipment>> = async (id) => {
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
    update_partial_shipment: (id: string, data: any) => Promise<Response<Shipment>> = async (id, data) => {
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

    create_shipment: (data: any) => Promise<Shipment> = async (data) => {
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

    delete_shipment: (id: string) => Promise<Response<any>> = async (id) => {

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

    assign_shipment: (id: string, driverId: string) => Promise<Response<Shipment>> = async (id, driverId) => {
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



    change_status: (id: string, status: number, canceled: any) => Promise<Response<Shipment>> = async (id, status, canceled) => {
        try {
            const response: Response<Shipment> = await fetcher(`${SHIPMENTS_ROUTE}/status/${id}`, {
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