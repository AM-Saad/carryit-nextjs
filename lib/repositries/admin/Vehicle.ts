import { fetcher } from "@/lib/utils";
import Response, { Status } from "@/shared/modals/Response";
import {VehiclePayload} from '@/modals/Vehicle' 
import { VEHICLES_ROUTE } from '@/lib/constants'

export default class ShipmentRepository {
    constructor() {

    }
    getToken = () => {
        return window.localStorage.getItem('uidjwt')
        
    }
    fetch_vehicles: () => Promise<Response> = async () => {
        try {
            const response = await fetcher(VEHICLES_ROUTE,{
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
    fetch_vehicle: (id: string) => Promise<Response> = async (id) => {
        try {
            const response = await fetcher(`${VEHICLES_ROUTE}/${id}`,{
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
    create_vehicle: (data: VehiclePayload) => Promise<Response> = async (data) => {
        try {
            const response = await fetcher(VEHICLES_ROUTE, {
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
            }

        }
    }
    delete_vehicle: (id: string) => Promise<Response> = async (id) => {
        try {
            const response = await fetcher(`${VEHICLES_ROUTE}/${id}`, {
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
            }

        }
    }
    update_partial_vehicle: (id: string, data: any) => Promise<Response> = async (id, data) => {
        try {
            const response = await fetcher(`${VEHICLES_ROUTE}/${id}`, {
                method: 'PATCH',
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



}