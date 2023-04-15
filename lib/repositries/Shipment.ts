import { fetcher } from "../utils";
import Response, { Status } from "shared/models/Response";
import { SHIPMENTS_ROUTE } from '@/lib/constants'

export default class ShipmentRepository {
    constructor() {

    }
    fetch_shipments: () => Promise<Response> = async () => {
        try {
            const response = await fetcher(SHIPMENTS_ROUTE);
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
            const response = await fetcher(`${SHIPMENTS_ROUTE}/${id}`);
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
                body: JSON.stringify({ values: data })
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
                body: JSON.stringify({ values: data })
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