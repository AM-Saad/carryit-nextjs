import { fetcher } from "../utils";
import Response, { Status } from "@/shared/modals/Response";

import { DRIVERS_ROUTE } from '@/lib/constants'

export default class DriverRepository {
    constructor() {

    }

    fetch_drivers: () => Promise<Response> = async () => {
        try {
            const response = await fetcher(DRIVERS_ROUTE);
            return response
            
        } catch (error: any) {
            return {
                message: error.message,
                status: Status.UNEXPECTED_ERROR,
                items: []
            }

        }
    }
    fetch_driver: (id: string) => Promise<Response> = async (id) => {
        try {
            const response = await fetcher(`${DRIVERS_ROUTE}/${id}`);
            return response
      
        } catch (error: any) {
            return {
                message: error.message,
                status: Status.UNEXPECTED_ERROR,
                items: []
            }

        }
    }
    update_partial_driver: (id: string, data: any) => Promise<Response> = async (id, data) => {
        try {
            const response = await fetcher(`${DRIVERS_ROUTE}/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(data)
            });

            return response
        } catch (error: any) {
            return {
                message: error.message, status: Status.UNEXPECTED_ERROR, items: []
            }

        }
    }

    delete_driver: (id: string) => Promise<Response> = async (id) => {
        try {
            const response = await fetcher(`${DRIVERS_ROUTE}/${id}`, {
                method: 'DELETE',
            });

            return response
        } catch (error: any) {
            return {
                message: error.message, status: Status.UNEXPECTED_ERROR, items: []
            }

        }
    }


    create_shipment: (data: any) => Promise<Response> = async (data) => {
        try {
            const response = await fetcher(`${DRIVERS_ROUTE}/create`, {
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




}